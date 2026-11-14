"""
Database session and connection engine management.
Configures async SQLAlchemy with asyncpg for Neon PostgreSQL.
"""
from sqlalchemy.ext.asyncio import create_async_engine,AsyncSession,async_sessionmaker
from sqlalchemy.orm import sessionmaker,Session
from sqlalchemy.exc import SQLAlchemyError
import dotenv
from sqlalchemy import text
import os
from typing import AsyncGenerator
import asyncio

dotenv.load_dotenv()


DATABASE_URL=os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set.")
try:
    engine=create_async_engine(DATABASE_URL,echo=True,pool_pre_ping=True,pool_recycle=300)# pool_pre_ping: vital for Neon serverless to transparently reconnect when compute resumes
    # pool_recycle: recycles connection every 5 minutes to prevent stale sockets

    AsyncSessionLocal=async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)# expire_on_commit=False: in async programming, accessing attributes on a committed
    # object would trigger a synchronous lazy-load error if expired.

except SQLAlchemyError as e:
    raise ValueError(f"Error creating database engine: {e}")


async def get_db()->AsyncGenerator[AsyncSession,None]:
    """
    FastAPI dependency that provides an isolated async database session per request.
    Automatically rolls back on errors and closes the session upon request completion.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            await session.rollback()
            raise
        finally:
            await session.close()

async def test_connection():
    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT 1"))
        print("\n Successfully connected to Neon Postgres! Test query returned:", result.scalar())
if __name__ == "__main__":
    asyncio.run(test_connection())