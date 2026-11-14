import os
import httpx
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()
CRAWL4AI_URL = os.getenv("CRAWL4AI_URL", "http://localhost:11235")
CRAWL4AI_API_TOKEN = os.getenv("CRAWL4AI_API_TOKEN", "crawl4ai_secret_123")

def select_top_urls_to_scrape(classified_result: List[Dict[str, Any]], max_total: int = 6) -> List[Dict[str, Any]]:
    """
    Picks a balanced mix of URLs across different categories 
    (competitors, market_data, pain_points) rather than scraping 6 of the same kind.
    """
    selected=[]
    seen_urls=set()
    priority_categories = [
        "competitors",
        "market_data",
        "market_size",
        "pain_points",
        "product_features",
        "pricing_models"
    ]
    for cat in priority_categories:
        matching=[r for r in classified_result if r.get("category")==cat and r.get("url") not in seen_urls]
        for item in matching[:2]:
            if len(selected) >= max_total:
                break
            seen_urls.add(item["url"])
            selected.append(item)
    for item in classified_result:
        if len(selected) >= max_total:
            break
        if item.get("url") not in seen_urls and item.get("category") != "irrelevant":
            seen_urls.add(item["url"])
            selected.append(item)
    return selected

async def scrape_urls_crawl4ai(items_to_scrape:List[Dict[str,Any]],max_chars_per_page:int=4000)->List[Dict[str,Any]]:
    """
    Sends URLS to the local Craw4AI Docker container for scraping and returns the scraped content.
    """

    if not items_to_scrape:
        return []
    urls=[item.get("url") for item in items_to_scrape]
    headers={
        "Authorization":f"Bearer {CRAWL4AI_API_TOKEN}",
        "Content-Type":"application/json"
    }
    payload={
        "urls":urls
    }
    scraped_documents=[]
    try:
        async with httpx.AsyncClient(timeout=45.0) as client:
            response = await client.post(f"{CRAWL4AI_URL}/crawl", headers=headers, json=payload)
            response.raise_for_status()
            data=response.json()

        result=data.get("results",[])
        for i, res in enumerate(result):
            original = items_to_scrape[i] if i < len(items_to_scrape) else {}
            
            # Extract markdown from Crawl4AI response
            md_data = res.get("markdown", {})
            raw_text = ""
            if isinstance(md_data, dict):
                raw_text = md_data.get("raw_markdown") or md_data.get("fit_markdown") or ""
            elif isinstance(md_data, str):
                raw_text = md_data

            trimmed_text=raw_text[:max_chars_per_page] if raw_text else original.get("content","")
            scraped_documents.append({
                "title": original.get("title", ""),
                "url": res.get("url") or original.get("url", ""),
                "category": original.get("category", "market_data"),
                "content": trimmed_text,
                "success": res.get("success", False)
            })
        return scraped_documents
    except Exception as e:
        print(f"Error scraping URLs with Crawl4AI: {e}")
        return [
            {
                "title": item.get("title", ""),
                "url": item.get("url", ""),
                "category": item.get("category", "market_data"),
                "content": item.get("content", ""),
                "success": False
            }
            for item in items_to_scrape
        ] 
        
