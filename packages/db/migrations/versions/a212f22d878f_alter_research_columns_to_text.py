"""alter_research_columns_to_text

Revision ID: a212f22d878f
Revises: 016038ee4f4d
Create Date: 2026-11-14 23:25:39.554856

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a212f22d878f'
down_revision: Union[str, Sequence[str], None] = '016038ee4f4d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column('research', 'description',
               existing_type=sa.String(length=1000),
               type_=sa.Text(),
               existing_nullable=False)
    op.alter_column('research', 'current_step',
               existing_type=sa.String(length=1000),
               type_=sa.Text(),
               existing_nullable=True)
    op.alter_column('research', 'error_message',
               existing_type=sa.String(length=1000),
               type_=sa.Text(),
               existing_nullable=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('research', 'error_message',
               existing_type=sa.Text(),
               type_=sa.String(length=1000),
               existing_nullable=True)
    op.alter_column('research', 'current_step',
               existing_type=sa.Text(),
               type_=sa.String(length=1000),
               existing_nullable=True)
    op.alter_column('research', 'description',
               existing_type=sa.Text(),
               type_=sa.String(length=1000),
               existing_nullable=False)
