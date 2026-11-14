import asyncio
import os
import sys

# Ensure repository root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy import select
from packages.db.session import AsyncSessionLocal
from packages.models.users import User, UserRole
from packages.lib.security import hash_password

KNOWN_TEST_SECRET = "JBSWY3DPEHPK3PXP"  # Standard test TOTP secret

USERS_TO_SEED = [
    {
        "email": "admin@startup.com",
        "password": "AdminPassword123!",
        "role": UserRole.ADMIN,
        "totp_secret": KNOWN_TEST_SECRET,
        "is_totp_verified": True
    },
    {
        "email": "member@startup.com",
        "password": "MemberPassword123!",
        "role": UserRole.MEMBER,
        "totp_secret": KNOWN_TEST_SECRET,
        "is_totp_verified": True
    }
]

async def seed():
    print("🌱 Seeding dummy users into Neon Postgres...")
    async with AsyncSessionLocal() as session:
        for u in USERS_TO_SEED:
            stmt = select(User).where(User.email == u["email"])
            res = await session.execute(stmt)
            existing = res.scalar_one_or_none()

            if existing:
                print(f"ℹ️ User {u['email']} already exists. Updating password & role...")
                existing.password_hash = hash_password(u["password"])
                existing.role = u["role"]
                existing.totp_secret = u["totp_secret"]
                existing.is_totp_verified = True
            else:
                print(f"➕ Creating {u['role'].value} user: {u['email']}")
                user = User(
                    email=u["email"],
                    password_hash=hash_password(u["password"]),
                    totp_secret=u["totp_secret"],
                    is_totp_verified=True,
                    role=u["role"]
                )
                session.add(user)

        await session.commit()
    print("✅ Seeding complete!")

if __name__ == "__main__":
    asyncio.run(seed())