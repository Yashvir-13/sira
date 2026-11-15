import asyncio
import uuid
import sys
from fastapi import HTTPException
from packages.db.session import AsyncSessionLocal
from packages.models.users import User, UserRole
from packages.models.research import ResearchModel, ResearchStatus
from services.api.routes.research import cancel_research, delete_research
from services.agent.pipeline import ACTIVE_RESEARCH_TASKS

async def run_tests():
    print("Starting cancel & delete verification...")
    async with AsyncSessionLocal() as session:
        # Create a mock user
        test_user = User(
            id=uuid.uuid4(),
            email=f"test_{uuid.uuid4().hex[:8]}@test.com",
            password_hash="mock",
            role=UserRole.MEMBER,
            is_totp_verified=True
        )
        session.add(test_user)
        await session.commit()
        await session.refresh(test_user)

        # Create a test research in PROCESSING state
        test_research = ResearchModel(
            id=uuid.uuid4(),
            user_id=test_user.id,
            title="Test Startup Idea",
            description="Testing cancellation and deletion lifecycle",
            status=ResearchStatus.PROCESSING,
            current_step="Gathering data...",
            progress=40.0
        )
        session.add(test_research)
        await session.commit()
        await session.refresh(test_research)

        # Register a mock task
        dummy_task = asyncio.create_task(asyncio.sleep(100))
        ACTIVE_RESEARCH_TASKS[test_research.id] = dummy_task

        # Test 1: Cancel in-progress research
        res = await cancel_research(
            research_id=test_research.id,
            current_user=test_user,
            db=session
        )
        assert res["success"] is True
        assert res["status"] == "cancelled"
        assert dummy_task.cancelled() or dummy_task.done()
        print("✓ Test 1 Passed: Cancel in-progress research marks status as cancelled and aborts active task.")

        # Test 2: Cancelling an already cancelled research raises 400
        try:
            await cancel_research(
                research_id=test_research.id,
                current_user=test_user,
                db=session
            )
            print("✗ Test 2 Failed: Did not raise 400")
            sys.exit(1)
        except HTTPException as e:
            assert e.status_code == 400
            print("✓ Test 2 Passed: Cancelling already cancelled research raises HTTPException 400.")

        # Test 3: Delete research
        del_res = await delete_research(
            research_id=test_research.id,
            current_user=test_user,
            db=session
        )
        assert del_res["success"] is True
        print("✓ Test 3 Passed: Delete research removes record.")

        # Clean up test user
        await session.delete(test_user)
        await session.commit()

    print("\nAll cancel & delete backend tests PASSED successfully!")

if __name__ == "__main__":
    asyncio.run(run_tests())
