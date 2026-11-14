import os
import httpx
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
load_dotenv()

TYPESAFE_API_KEY=os.getenv("TYPESAFE_API_KEY", "")
TYPESAFE_URL="https://api.typesafe.ai/v1/systemone"



CLASSIFICATION_CRITERIA = {
    "market_size": "Market Size: Information about the overall size and potential of the market, including Total Addressable Market (TAM), Serviceable Addressable Market (SAM), Serviceable Obtainable Market (SOM), market valuation, and potential revenue opportunities.",

    "market_trends": "Market Trends: Emerging and evolving trends in the industry, including changes in customer behavior, technology adoption, industry shifts, emerging opportunities, and future market directions.",

    "competitors": "Competitors: An existing product, startup, or company offering similar capabilities, solving the same problem, targeting the same audience, or competing directly or indirectly with the idea.",

    "market_data": "Market Data: Quantitative research and industry insights, including market reports, statistics, TAM/SAM/SOM estimates, market size, growth rates (CAGR), revenue figures, adoption rates, and industry analysis.",

    "pain_points": "Pain Points: Customer complaints, frustrations, unmet needs, and recurring problems related to existing products, services, or workflows. Includes Reddit discussions, forum threads, reviews, and user feedback that reveal problems the idea aims to solve.",

    "irrelevant": "Irrelevant: Content that provides no meaningful information or actionable insights related to the business idea, including unrelated articles, generic tutorials, spam, promotional content, and landing pages without useful information.",

    "product_features": "Product Features: Information about the functionalities, capabilities, tools, and features offered by existing or proposed products. Includes core features, advanced features, integrations, technical capabilities, and feature comparisons.",

    "pricing_models": "Pricing Models: Information about how products or services are priced and monetized, including subscription plans, freemium models, one-time payments, usage-based pricing, tiered pricing, enterprise pricing, and competitor pricing strategies.",

    "target_audience": "Target Audience: Information identifying the potential customers or user segments for the idea, including demographics, professional roles, industries, business sizes, customer personas, use cases, and specific market niches.",

    "regulatory_environment": "Regulatory Environment: Laws, regulations, compliance requirements, industry standards, government policies, licensing requirements, and legal restrictions that may affect the development, operation, distribution, or adoption of the product.",

    "distribution_channels": "Distribution Channels: Information about the platforms, networks, partnerships, and methods through which a product reaches its target customers, including app stores, marketplaces, websites, resellers, direct sales, partnerships, and online platforms.",

    "marketing_strategies": "Marketing Strategies: Information about customer acquisition, brand positioning, promotion, and growth tactics used by competitors or relevant businesses, including SEO, content marketing, social media, paid advertising, influencer marketing, referral programs, and community-led growth."
}

async def classify_search_results(item: Dict[str, Any],
    idea_context: str = ""
) -> Dict[str, Any]:
    """
    Classifies a search result item into one of the predefined categories
    using the Typesafe API.
    """
    if not TYPESAFE_API_KEY:
        raise ValueError("TYPESAFE_API_KEY is not set in the environment variables.")
    header={
        "Authorization": f"Bearer {TYPESAFE_API_KEY}",
        "Content-Type": "application/json"
    }
    state_text = f"Startup Context: {idea_context}\nTitle: {item.get('title')}\nSnippet: {item.get('content')}\nURL: {item.get('url')}"
    payload = {
        "model": "jev-latest",
        "state": state_text,
        "questions": {
            "category": {
                "type": "choice",
                "choices": ["market_size", "market_trends", "competitors", "market_data", "pain_points", "irrelevant", "product_features", "pricing_models", "target_audience", "regulatory_environment", "distribution_channels", "marketing_strategies"],
                "criteria": CLASSIFICATION_CRITERIA
            }
        }
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response=await client.post(TYPESAFE_URL, headers=header, json=payload)
            response.raise_for_status()
            data=response.json()
        answer=data.get("answers",{}).get("category", {})
        category=answer.get("choice","market_data")
        confidence=answer.get("confidence",0.0)

        return {
            **item,
            "category": category,
            "confidence": confidence
        }
    except Exception as e:
        print(f"Error classifying search result: {e}")
        return {
            **item,
            "category": "error",
            "confidence": 0.0
        }


async def classify_and_filter_results(results: List[Dict[str, Any]],idea_title: str) -> List[Dict[str, Any]]:
    """
    Classifies all search results and discards 'irrelevant' links.
    """
    classified = []
    for item in results:
        res = await classify_search_results(item, idea_context=idea_title)
        if res.get("category") != "irrelevant":
            classified.append(res)
    return classified