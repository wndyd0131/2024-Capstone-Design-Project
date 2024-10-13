from datetime import datetime, timedelta, timezone
from typing import Union, Annotated
from dotenv import load_dotenv
from fastapi import APIRouter, Depends
from jose import jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.schema.jwt.response_model import TokenResponse
from backend.schema.models import User
from backend.schema.user.request_models import UserLoginRequest

import os
import bcrypt

router = APIRouter()

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/login", response_model=TokenResponse, tags=["auth"])
def login(user_request: UserLoginRequest, db: Session = Depends(get_db)):

    # Read user from db by email
    user = db.query(User).filter(User.email == user_request.email).first()

    # Authenticate user email & password
    if user and is_valid_password(user, user_request.password):

        # Create access token
        claim = {
            "sub": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        }
        access_token = create_access_token(claim, timedelta(minutes=30))
        return TokenResponse(
            access_token=access_token
        )
    return False

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def is_valid_password(user: Union[User, None], password: str) -> bool:
    bytes_password = password.encode('utf-8')
    hashed_password = user.password.encode('utf-8')
    if bcrypt.checkpw(bytes_password, hashed_password):
        return True
    return False