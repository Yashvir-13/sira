from sqlalchemy import JSON, Column, DateTime, Integer, String, ForeignKey, Enum as SAEnum
import uuid
import enum
from sqlalchemy.orm import Mapped,mapped_column
from sqlalchemy.sql import func
from datetime import datetime, timezone
from packages.models.users import Base



class ResearchStatus(str,enum.Enum):
    PENDING="pending"
    PROCESSING="processing"
    COMPLETED="completed"
    FAILED="failed"
class ResearchModel(Base):
    __tablename__="research"
    id:Mapped[uuid.UUID]=mapped_column(primary_key=True,default=uuid.uuid4)
    user_id:Mapped[uuid.UUID]=mapped_column(ForeignKey("users.id",ondelete="CASCADE"),index=True,nullable=False)
    title:Mapped[str]=mapped_column(String(255),nullable=False)
    description:Mapped[str]=mapped_column(String(1000),nullable=False)
    status:Mapped[ResearchStatus]=mapped_column(
        SAEnum(ResearchStatus, values_callable=lambda x: [e.value for e in x], name="researchstatus"),
        default=ResearchStatus.PENDING,
        nullable=False)
    current_step:Mapped[str|None]=mapped_column(String(1000),nullable=True)
    created_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),server_default=func.now(),nullable=False)
    error_message:Mapped[str|None]=mapped_column(String(1000),nullable=True)
    progress:Mapped[float]=mapped_column(nullable=False,default=0.0)
    data: Mapped[dict | None] = mapped_column(JSON, nullable=True)
