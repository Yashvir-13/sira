from fastapi import FastAPI
from pydantic import BaseModel,ConfigDict, Field, EmailStr, model_validator
from packages.models.users import UserRole
import uuid
from datetime import datetime


class SignupStep1Request(BaseModel):
    model_config=ConfigDict(extra="forbid")
    email:EmailStr
    password:str=Field(...,min_length=8,max_length=255,description="Password must be at least 8 characters long",example="StrongPassword123!")
    confirm_password:str
    @model_validator(mode="after")
    def check_passwords_match(self)->"SignupStep1Request":
        if self.password!=self.confirm_password:
            raise ValueError("Passwords do not match")
        return self


class SignupStep1Response(BaseModel):
    email:EmailStr
    qrCode:str
    totp_secret:str
    message: str = "Scan this QR code with your authenticator app and enter the 6-digit code to complete registration."
    
class SignupStep2Request(BaseModel):
    email:EmailStr
    code:str=Field(...,min_length=6, max_length=6,description="6-digit authenticator code")

class UserResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    role: UserRole
    is_totp_verified: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True, extra="forbid")
    

class SigninRequest(BaseModel):
    email:EmailStr
    password:str=Field(...,min_length=8,max_length=255)
    code:str = Field(..., min_length=6, max_length=6, description="6-digit authenticator code")

class SigninResponse(BaseModel):
    access_token:str
    token_type:str="bearer"
    user:UserResponse



from typing import Optional, Dict, Any, List

class ResearchStartRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=255, description="Startup idea title")
    description: str = Field(..., min_length=10, max_length=2000, description="Startup idea details and concept")

class ResearchStartResponse(BaseModel):
    research_id: uuid.UUID
    status: str
    message: str = "Research pipeline scheduled successfully."

class ResearchItemResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    description: str
    status: str
    current_step: Optional[str] = None
    progress: float
    error_message: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)