import os
import json
import re
from typing import Any, Dict, List
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")

SYSTEM_PROMPT = """You are an elite Silicon Valley venture capitalist and startup strategist.
Analyze the user's startup idea against the provided real-world market research, competitor data, and customer discussions.

You MUST respond ONLY with a single valid JSON object (no markdown code blocks, no introductory text, no trailing text).
The JSON must adhere to this exact structure:
{
  "verdict": "A decisive 1-sentence verdict on whether to build, pivot, or avoid",
  "viability_score": 78,
  "summary": "2-3 paragraph executive summary of the opportunity, market dynamics, and critical challenges",
  "market_size": {
    "tam": {"value": "$50B", "numeric": 50, "description": "Total Addressable Market"},
    "sam": {"value": "$12B", "numeric": 12, "description": "Serviceable Addressable Market"},
    "som": {"value": "$1.5B", "numeric": 1.5, "description": "Serviceable Obtainable Market (Years 1-3)"},
    "cagr": "18.5%",
    "unit": "USD Billions"
  },
  "competitors": [
    {
      "name": "Competitor Name",
      "url": "https://competitor.com",
      "threat_level": "High | Medium | Low",
      "strengths": ["...", "..."],
      "weaknesses": ["...", "..."],
      "pricing": "e.g. $29/mo freemium",
      "differentiation": "How the user's idea beats or differs from them"
    }
  ],
  "swot": {
    "strengths": ["...", "..."],
    "weaknesses": ["...", "..."],
    "opportunities": ["...", "..."],
    "threats": ["...", "..."]
  },
  "customer_pain_points": [
    {
      "pain": "Description of the problem customers face",
      "severity": "High | Medium | Low",
      "current_workaround": "How they deal with it today"
    }
  ],
  "key_risks": [
    {
      "risk": "Description of risk",
      "mitigation": "Strategic action to neutralize this risk"
    }
  ],
  "citations": [
    {
      "title": "Source Page Title",
      "url": "https://source.url",
      "relevant_claim": "Specific insight derived from this source"
    }
  ]
}
"""


def clean_json_response(raw_text: str) -> Dict[str, Any]:
    """
    Strips accidental markdown code fences (```json ... ```) 
    and parses the JSON string safely.
    """
    text = raw_text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    
    return json.loads(text.strip())


async def validate_idea_with_claude(
    idea_title: str,
    idea_description: str,
    scraped_documents: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Sends the startup idea and scraped research to Claude 
    and returns a structured validation report.
    """
    if not ANTHROPIC_API_KEY:
        raise ValueError("ANTHROPIC_API_KEY is not set.")

    client = Anthropic(api_key=ANTHROPIC_API_KEY)

    # Format the scraped research for Claude's context
    context_sections = []
    for doc in scraped_documents:
        section = (
            f"--- SOURCE: {doc.get('title')} ({doc.get('category')}) ---\n"
            f"URL: {doc.get('url')}\n"
            f"CONTENT:\n{doc.get('content')}\n"
        )
        context_sections.append(section)

    research_context = "\n".join(context_sections)

    user_message = f"""STARTUP IDEA TO VALIDATE:
Title: {idea_title}
Description: {idea_description}

MARKET RESEARCH & SCRAPED WEB DATA:
{research_context if research_context else "No external web data available. Provide strategic analysis based on general market knowledge."}

Produce the structured JSON validation report now.
"""

    try:
        response = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=3500,
            temperature=0.2,
            system=SYSTEM_PROMPT,
            messages=[
                {"role": "user", "content": user_message}
            ]
        )

        raw_output = response.content[0].text
        report_data = clean_json_response(raw_output)
        return report_data

    except Exception as e:
        print(f"Error during Claude idea validation: {e}")
        # Return fallback structure so the UI doesn't crash
        return {
            "verdict": "Validation encountered an error during generation.",
            "viability_score": 50,
            "summary": f"Could not complete validation analysis: {str(e)}",
            "market_size": {"tam": {"numeric": 10}, "sam": {"numeric": 5}, "som": {"numeric": 1}, "unit": "USD Billions"},
            "competitors": [],
            "swot": {"strengths": [], "weaknesses": [], "opportunities": [], "threats": []},
            "customer_pain_points": [],
            "key_risks": [],
            "citations": []
        }