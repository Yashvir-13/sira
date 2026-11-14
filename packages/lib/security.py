import pyotp
import bcrypt
import io
import base64
from datetime import timedelta, datetime, timezone
import qrcode
import os
import jwt

def generate_totp_secret():
    return pyotp.random_base32()
def generate_totp_uri(secret:str,email:str,issuer_name:str="StartUpIdeaResearch"):
    totp=pyotp.TOTP(secret)
    return totp.provisioning_uri(name=email,issuer_name=issuer_name)
def verify_totp(token: str, secret: str) -> bool:
    clean_token = str(token).strip().replace(" ", "")
    totp = pyotp.TOTP(secret)
    # valid_window=1 allows a 30s clock drift buffer before/after (industry standard)
    return bool(totp.verify(clean_token, valid_window=1))

def hash_password(password: str) -> str:
    # bcrypt operates on bytes, so we encode to utf-8 and decode back to string
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8"),
    )
def generate_qrCode_base64(totp_uri:str)->str:
    qr=qrcode.QRCode(version=1,error_correction=qrcode.constants.ERROR_CORRECT_L,box_size=10,border=4)
    qr.add_data(totp_uri)
    qr.make(fit=True)
    img=qr.make_image(fill_color="black",back_color="white")
    buffered=io.BytesIO()
    img.save(buffered,format="PNG")
    img_base64=base64.b64encode(buffered.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{img_base64}"




def print_qr_terminal(totp_uri: str) -> None:
    qr = qrcode.QRCode()
    qr.add_data(totp_uri)
    # invert=True matches the dark background of modern terminals
    qr.print_ascii(invert=True)





JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY","fallback_dev_secret_key_change_in_production")
JWT_ALGORITHM=os.getenv("JWT_ALGORITHM","HS256")
ACCESS_TOKEN_EXPIRE_MINUTES=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES","60"))
def create_access_token(data:dict,expires_delta:timedelta|None=None):
    to_encode=data.copy()
    if expires_delta:
        expire=datetime.now(timezone.utc)+expires_delta
    else:
        expire=datetime.now(timezone.utc)+timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp":expire})
    encoded_jwt=jwt.encode(to_encode,JWT_SECRET_KEY,algorithm=JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token:str):
    return jwt.decode(token,JWT_SECRET_KEY,algorithms=[JWT_ALGORITHM])



