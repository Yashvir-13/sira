"""add_cancelled_status_to_researchstatus

Revision ID: b314a51e6c88
Revises: a212f22d878f
Create Date: 2026-11-15 15:42:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b314a51e6c88'
down_revision: Union[str, Sequence[str], None] = 'a212f22d878f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # PostgreSQL allows adding enum values using ALTER TYPE
    op.execute("ALTER TYPE researchstatus ADD VALUE IF NOT EXISTS 'cancelled';")


def downgrade() -> None:
    """Downgrade schema."""
    # PostgreSQL enums cannot have values removed without re-creating the type.
    pass
