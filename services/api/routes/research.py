import uuid
import json
import asyncio
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sse_starlette.sse import EventSourceResponse
from packages.db.session import get_db, AsyncSessionLocal
from packages.models.users import User, UserRole
from packages.models.research import ResearchModel, ResearchStatus
from packages.models.schemas import ResearchStartRequest, ResearchStartResponse, ResearchItemResponse
from services.api.deps import get_current_user, require_admin
from packages.lib.security import decode_access_token
from services.agent.pipeline import run_research_pipeline, ACTIVE_RESEARCH_TASKS

router=APIRouter(prefix="/research",tags=["Research"])

@router.post('/start',response_model=ResearchStartResponse)
async def start_research(payload:ResearchStartRequest,background_tasks:BackgroundTasks,db:AsyncSession=Depends(get_db),current_user:User=Depends(get_current_user)):
    new_research=ResearchModel(user_id=current_user.id,
        title=payload.title,
        description=payload.description,
        status=ResearchStatus.PENDING,
        current_step="Queued for analysis...",
        progress=0.0)
    db.add(new_research)
    await db.commit()
    await db.refresh(new_research)

    background_tasks.add_task(run_research_pipeline,research_id=new_research.id,
        idea_title=new_research.title,
        idea_description=new_research.description)
    return ResearchStartResponse(research_id=new_research.id,status=new_research.status,message="Research pipeline started in background.")

@router.get('/{research_id}/stream')
async def stream_research_progress(research_id:uuid.UUID,token:Optional[str]=Query(None)):
    if token:
        try:
            decode_access_token(token)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Invalid token")
    async def event_generator():
        while True:
            async with AsyncSessionLocal() as session:
                stmt = select(ResearchModel).where(ResearchModel.id == research_id)
                res = await session.execute(stmt)
                record = res.scalar_one_or_none()
            if not record:
                yield {
                    "event": "error",
                    "data": json.dumps({"error": "Research record not found."})
                }
                break
            yield {
                "event": "progress",
                "data": json.dumps({
                    "id": str(record.id),
                    "status": record.status.value,
                    "current_step": record.current_step,
                    "progress": record.progress,
                    "error_message": record.error_message
                })
            }
            if record.status in [ResearchStatus.COMPLETED, ResearchStatus.FAILED, ResearchStatus.CANCELLED]:
                break
            await asyncio.sleep(1.0)
    return EventSourceResponse(event_generator())

@router.get('/list', response_model=List[ResearchItemResponse])
@router.get('/history', response_model=List[ResearchItemResponse])
async def get_user_research_history(current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)):
    stmt = (
        select(ResearchModel)
        .where(ResearchModel.user_id == current_user.id)
        .order_by(desc(ResearchModel.created_at))
    )
    result = await db.execute(stmt)
    records = result.scalars().all()
    return records

@router.get("/admin/all", response_model=List[ResearchItemResponse])
async def get_all_research_admin(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Admin-only endpoint: Returns all research reports across all users.
    """
    stmt = select(ResearchModel).order_by(desc(ResearchModel.created_at))
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/{research_id}", response_model=ResearchItemResponse)
async def get_research_detail(
    research_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Fetches the full report and JSON data for a specific research project.
    Members can only view their own; Admins can view any.
    """
    stmt = select(ResearchModel).where(ResearchModel.id == research_id)
    result = await db.execute(stmt)
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Research not found")
    # Authorization check
    if current_user.role != UserRole.ADMIN and record.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this research report.")
    return record


@router.post("/{research_id}/cancel")
async def cancel_research(
    research_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Cancels an active or pending research analysis.
    Aborts active background tasks and marks status as CANCELLED.
    """
    stmt = select(ResearchModel).where(ResearchModel.id == research_id)
    result = await db.execute(stmt)
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Research not found")
    if current_user.role != UserRole.ADMIN and record.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to cancel this research.")
    if record.status in [ResearchStatus.COMPLETED, ResearchStatus.FAILED, ResearchStatus.CANCELLED]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel research in terminal state: {record.status.value}"
        )

    # Cancel active asyncio background task if present
    task = ACTIVE_RESEARCH_TASKS.get(research_id)
    if task and not task.done():
        task.cancel()

    record.status = ResearchStatus.CANCELLED
    record.current_step = "Research cancelled by user."
    await db.commit()
    await db.refresh(record)
    return {
        "success": True,
        "message": "Research pipeline cancelled successfully.",
        "research_id": str(research_id),
        "status": record.status.value
    }


@router.delete("/{research_id}")
async def delete_research(
    research_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Permanently deletes a research dossier record.
    If the task is actively running, it cancels the task first.
    """
    stmt = select(ResearchModel).where(ResearchModel.id == research_id)
    result = await db.execute(stmt)
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Research not found")
    if current_user.role != UserRole.ADMIN and record.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this research report.")

    # Abort running task if active
    task = ACTIVE_RESEARCH_TASKS.get(research_id)
    if task and not task.done():
        task.cancel()

    await db.delete(record)
    await db.commit()
    return {
        "success": True,
        "message": "Research dossier deleted successfully.",
        "research_id": str(research_id)
    }

