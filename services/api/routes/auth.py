from datetime import timedelta
from operator import sub

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from packages.db.session import get_db
from packages.models.users import User
from packages.models.schemas import (
    SignupStep1Request,
    SignupStep1Response,
    SignupStep2Request,
    SigninRequest,
    SigninResponse,
    UserResponse)
from packages.lib.security import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_access_token,
    hash_password,
    generate_totp_secret,
    generate_totp_uri,
    generate_qrCode_base64,
    verify_password,
    verify_totp,
)
from services.api.deps import get_current_user, require_admin


router=APIRouter(prefix="/auth",tags=["Authenticatino"])
@router.post("/signup/step1",response_model=SignupStep1Response)
async def signup_step1(payload:SignupStep1Request,db:AsyncSession=Depends(get_db)):
    stmt=select(User).where(User.email==payload.email)
    result=await db.execute(stmt)
    existing_user=result.scalar_one_or_none()
    if existing_user and existing_user.is_totp_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )
    hashed_password = hash_password(payload.password)
    if existing_user and not existing_user.is_totp_verified:
        existing_user.password_hash = hashed_password
        totp_secret = existing_user.totp_secret or generate_totp_secret()
        existing_user.totp_secret = totp_secret
    else:
        totp_secret = generate_totp_secret()
        new_user = User(
            email=payload.email,
            password_hash=hashed_password,
            totp_secret=totp_secret,
            is_totp_verified=False,
        )
        db.add(new_user)
    await db.commit()

    totp_uri=generate_totp_uri(totp_secret,payload.email)
    qr_code_base64=generate_qrCode_base64(totp_uri)
    return SignupStep1Response(email=payload.email,qrCode=qr_code_base64,totp_secret=totp_secret)


@router.post("/signup/step2")
async def signup_step2(payload:SignupStep2Request,db:AsyncSession=Depends(get_db)):
    stmt=select(User).where(User.email==payload.email)
    result=await db.execute(stmt)
    user=result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No registration found for this email.",
        )
    if user.is_totp_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="TOTP verification has already been completed for this email.",
        )
    if not verify_totp(token=payload.code, secret=user.totp_secret):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid TOTP code."
        )
    user.is_totp_verified=True
    await db.commit()
    return {"message":"TOTP verification successful. Your account is now fully registered. You can now log in using your email and password."}


@router.post("/signin",response_model=SigninResponse)
async def signin(payload:SigninRequest,db:AsyncSession=Depends(get_db)):
    stmt=select(User).where(User.email==payload.email)
    result=await db.execute(stmt)
    user=result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    verify_password_result = verify_password(payload.password, user.password_hash)
    if not verify_password_result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    if not user.is_totp_verified or not user.totp_secret:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Two-factor authentication is not verified. Please complete signup.",
        )
    if not verify_totp(token=payload.code,secret=user.totp_secret):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid TOTP code.",
        )
    access_token=create_access_token(data={"sub":str(user.id),"email":user.email,"role":user.role.value})
    return SigninResponse(access_token=access_token,user=UserResponse.model_validate(user),token_type="bearer")

@router.get("/me",response_model=UserResponse)
async def get_my_profile(current_user:User=Depends(get_current_user)):
    return current_user

@router.get("/admin/test")
async def test_admin_only(admin: User = Depends(require_admin)):
    """Protected: Only users with role='admin' can access this."""
    return {"message": f"Hello Admin {admin.email}! You have access."}
    