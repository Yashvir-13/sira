import enum 
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Boolean, DateTime,Enum as SAEnum
from sqlalchemy.orm import DeclarativeBase,Mapped,mapped_column
from sqlalchemy.sql import func

class Base(DeclarativeBase):
    pass

class UserRole(str,enum.Enum):
    MEMBER="member"
    ADMIN="admin"
class User(Base):
    __tablename__="users"
    id:Mapped[uuid.UUID]=mapped_column(primary_key=True,default=uuid.uuid4)
    email:Mapped[str]=mapped_column(String(255),unique=True,index=True,nullable=False)
    password_hash:Mapped[str]=mapped_column(String(255),nullable=False)
    totp_secret:Mapped[str]=mapped_column(String(255),nullable=True)
    is_totp_verified:Mapped[bool]=mapped_column(Boolean,default=False)
    role: Mapped[UserRole] = mapped_column(
        SAEnum(UserRole, values_callable=lambda x: [e.value for e in x], name="userrole"),
        default=UserRole.MEMBER,
        nullable=False,
    )
    created_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),server_default=func.now(),nullable=False)

