import os
import re
import json
import httpx
from typing import Any, Dict, List, Optional
from urllib.parse import urlparse
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()

# Base URL pointing to our Docker container (port 8080)
SEARXNG_URL = os.getenv("SEARXNG_URL", "http://localhost:8080")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")


def clean_json_list(raw_text: str) -> List[str]:
    """
    Strips accidental markdown code fences (```json ... ```) 
    and parses a JSON list of strings safely.
    """
    text = raw_text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    try:
        data = json.loads(text.strip())
        if isinstance(data, list):
            return [str(q).strip() for q in data if str(q).strip()]
    except Exception:
        pass
    return []


def fallback_expand_queries(idea_title: str, idea_description: str) -> List[str]:
    """
    Algorithmic fallback that extracts domain keywords from the description
    to avoid querying ambiguous brand names in isolation.
    """
    stop_words = {
        "a", "an", "the", "and", "or", "but", "if", "in", "on", "at", "to", "for",
        "of", "with", "by", "from", "up", "about", "into", "over", "after", "is",
        "are", "was", "were", "be", "been", "being", "have", "has", "had", "do",
        "does", "did", "this", "that", "these", "those", "my", "your", "his", "her",
        "its", "our", "their", "form", "all", "every", "etc", "like", "will", "can",
        "such", "some", "any", "not", "out", "so", "than", "too", "very", "just"
    }
    words = re.findall(r'[a-zA-Z]{3,}', idea_description.lower())
    keywords = [w for w in words if w not in stop_words]
    
    seen = set()
    top_kw = []
    for k in keywords:
        if k not in seen:
            seen.add(k)
            top_kw.append(k)
        if len(top_kw) >= 6:
            break
            
    domain_phrase = " ".join(top_kw[:3]) if top_kw else idea_title
    broader_domain = " ".join(top_kw[3:]) if len(top_kw) > 3 else domain_phrase

    return [
        f"{domain_phrase} competitors alternatives platform",
        f"{domain_phrase} market size industry trends report",
        f"{domain_phrase} customer complaints limitations reddit",
        f"{broader_domain} emerging software tools"
    ]


async def expand_queries_semantic(
    idea_title: str,
    idea_description: str
) -> List[str]:
    """
    Uses fast Claude Haiku to extract the true problem domain and formulate
    4 high-yield, specific search queries that bypass brand name ambiguity.
    """
    if not ANTHROPIC_API_KEY:
        return fallback_expand_queries(idea_title, idea_description)

    prompt = f"""You are an autonomous market intelligence agent. Given this pre-launch startup idea:
Title: {idea_title}
Description: {idea_description}

Generate 4 high-yield web search queries to gather real-world intelligence:
1. Competitor Query: Find existing platforms, startups, or apps offering similar features or solving this problem.
2. Market Sizing Query: Find industry reports, TAM/SAM/SOM statistics, or market trends in this specific vertical.
3. Customer Pain Points Query: Find real discussions, complaints, or frustrations on Reddit/forums regarding existing tools in this domain.
4. Niche / Emerging Solutions Query: Find emerging AI or community tools in this problem space.

CRITICAL RULES:
- Do NOT include the startup's name ('{idea_title}') in competitor, market, or pain point queries because the startup does not exist yet and brand names cause keyword collisions with unrelated companies (e.g. aerospace, mattresses).
- Return ONLY a valid JSON list of 4 query strings, with no explanation or markdown code fences."""

    try:
        client = Anthropic(api_key=ANTHROPIC_API_KEY)
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=300,
            messages=[{"role": "user", "content": prompt}]
        )
        raw_text = response.content[0].text
        queries = clean_json_list(raw_text)
        if len(queries) >= 3:
            return queries[:4]
    except Exception as e:
        print(f"LLM query expansion failed, falling back to heuristic: {e}")

    return fallback_expand_queries(idea_title, idea_description)


async def search_searxng(
    query: str,
    max_results: int = 10,
    language: str = "en"
) -> List[Dict[str, Any]]:
    """
    Sends an async GET request to the local SearXNG Docker container
    and returns a clean list of search results.
    """
    params = {
        "q": query,
        "format": "json",
        "language": language,
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{SEARXNG_URL}/search", params=params)
            response.raise_for_status()
            data = response.json()

        results = []
        for item in data.get("results", [])[:max_results]:
            results.append({
                "title": item.get("title", ""),
                "url": item.get("url", ""),
                "content": item.get("content", ""),
                "engine": item.get("engine", "")
            })
        return results

    except httpx.RequestError as e:
        print(f"Network error querying SearXNG: {e}")
        return []
    except httpx.HTTPStatusError as e:
        print(f"SearXNG returned HTTP {e.response.status_code}: {e.response.text}")
        return []


async def gather_all_search_results(
    idea_title: str,
    idea_description: str
) -> List[Dict[str, Any]]:
    """
    Orchestrator function:
    1. Semantically expands the idea into 4 targeted domain queries.
    2. Searches SearXNG for each query.
    3. Deduplicates results by URL and caps per domain to ensure diversity.
    """
    queries = await expand_queries_semantic(idea_title, idea_description)
    all_results = []
    seen_urls = set()
    domain_counts: Dict[str, int] = {}

    for q in queries:
        items = await search_searxng(q, max_results=6)
        for item in items:
            url = item.get("url")
            if not url or url in seen_urls:
                continue

            try:
                domain = urlparse(url).netloc.lower()
                if domain_counts.get(domain, 0) >= 2:
                    continue
                domain_counts[domain] = domain_counts.get(domain, 0) + 1
            except Exception:
                pass

            seen_urls.add(url)
            all_results.append(item)

    return all_results
