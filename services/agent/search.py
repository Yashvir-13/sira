import os
import httpx
from typing import Any, Dict, List, Optional

# 1. Base URL pointing to our Docker container (port 8080)
SEARXNG_URL = os.getenv("SEARXNG_URL", "http://localhost:8080")


def expand_queries(
    idea_title: str,
    idea_description: str,
    idea_tags: Optional[List[str]] = None,
    idea_category: Optional[str] = None
) -> List[str]:
    """
    Takes an idea and turns it into 3 targeted search queries:
    1. Competitor search
    2. Market size & trends search
    3. Customer pain points search
    """
    tags_str = " ".join(idea_tags) if idea_tags else ""
    category_str = f"in {idea_category}" if idea_category else ""
    base = f"{idea_title} {category_str} {tags_str}".strip()

    return [
        f"{base} competitors alternatives",
        f"{base} market size industry trends report",
        f"{idea_title} customer pain points complaints reddit",
    ]


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

        # Extract only the fields we actually need
        results = []
        for item in data.get("results", [])[:max_results]:
            results.append({
                "title": item.get("title", ""),
                "url": item.get("url", ""),
                "content": item.get("content", ""),  # Short snippet text
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
    1. Expands the idea into 3 queries.
    2. Searches SearXNG for each query.
    3. Deduplicates results so the same URL isn't scraped twice.
    """
    queries = expand_queries(idea_title, idea_description)
    all_results = []
    seen_urls = set()

    for q in queries:
        items = await search_searxng(q, max_results=5)
        for item in items:
            url = item.get("url")
            if url and url not in seen_urls:
                seen_urls.add(url)
                all_results.append(item)

    return all_results