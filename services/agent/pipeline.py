import uuid
from typing import Any, Dict, Optional
from sqlalchemy import select

from packages.db.session import AsyncSessionLocal
from packages.models.research import ResearchModel, ResearchStatus
from services.agent.search import gather_all_search_results
from services.agent.classifier import classify_and_filter_results
from services.agent.scraper import select_top_urls_to_scrape, scrape_urls_crawl4ai
from services.agent.validator import validate_idea_with_claude


async def update_research_progress(
    research_id: uuid.UUID,
    status: ResearchStatus,
    current_step: str,
    progress: float,
    data: Optional[Dict[str, Any]] = None,
    error_message: Optional[str] = None
):
    """
    Helper function to update status, progress %, and current step in Neon Postgres.
    """
    async with AsyncSessionLocal() as session:
        async with session.begin():
            stmt = select(ResearchModel).where(ResearchModel.id == research_id)
            res = await session.execute(stmt)
            record = res.scalar_one_or_none()
            if record:
                record.status = status
                record.current_step = current_step
                record.progress = progress
                if data is not None:
                    record.data = data
                if error_message is not None:
                    record.error_message = error_message


async def run_research_pipeline(
    research_id: uuid.UUID,
    idea_title: str,
    idea_description: str
):
    """
    The master background worker function:
    Chains SearXNG -> Jev -> Crawl4AI -> Claude.
    """
    try:
        # Step 1: Search the web (15%)
        await update_research_progress(
            research_id=research_id,
            status=ResearchStatus.PROCESSING,
            current_step="Expanding query and searching the web...",
            progress=15.0
        )
        search_results = await gather_all_search_results(idea_title, idea_description)

        # Step 2: Classify with Jev (40%)
        await update_research_progress(
            research_id=research_id,
            status=ResearchStatus.PROCESSING,
            current_step=f"Classifying {len(search_results)} search results with Jev...",
            progress=40.0
        )
        classified_results = await classify_and_filter_results(search_results, idea_title)

        # Step 3: Scrape with Crawl4AI (65%)
        top_items = select_top_urls_to_scrape(classified_results, max_total=6)
        await update_research_progress(
            research_id=research_id,
            status=ResearchStatus.PROCESSING,
            current_step=f"Scraping top {len(top_items)} competitor & market pages with Crawl4AI...",
            progress=65.0
        )
        scraped_docs = await scrape_urls_crawl4ai(top_items)

        # Step 4: Validate with Claude (85%)
        await update_research_progress(
            research_id=research_id,
            status=ResearchStatus.PROCESSING,
            current_step="Synthesizing venture report and financial metrics with Claude...",
            progress=85.0
        )
        report_data = await validate_idea_with_claude(
            idea_title=idea_title,
            idea_description=idea_description,
            scraped_documents=scraped_docs
        )

        # Step 5: Mark Completed (100%)
        await update_research_progress(
            research_id=research_id,
            status=ResearchStatus.COMPLETED,
            current_step="Research completed successfully.",
            progress=100.0,
            data=report_data
        )

    except Exception as e:
        print(f"Research pipeline failed for {research_id}: {e}")
        await update_research_progress(
            research_id=research_id,
            status=ResearchStatus.FAILED,
            current_step="Research pipeline failed.",
            progress=100.0,
            error_message=str(e)
        )