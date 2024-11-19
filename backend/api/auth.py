from datetime import datetime, timedelta, timezone
from typing import Union
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, Request, HTTPException, status
from jose import jwt, ExpiredSignatureError, JWTError
from jwt import InvalidTokenError
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import Response

from backend.db.session import get_db
from backend.schema.jwt.response_model import TokenResponse, Payload
from backend.schema.models import User
from backend.schema.user.request_models import UserLoginRequest

import os
import bcrypt
import redis

router = APIRouter()

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
REFRESH_SECRET_KEY = os.getenv("REFRESH_SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7
ACCESS_TOKEN_COOKIE_EXPIRE_TIME = 1800
REFRESH_TOKEN_COOKIE_EXPIRE_TIME = 604800

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"}
)

expired_token_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Expired access token",
    headers={"WWW-Authenticate": "Bearer"}
)

@router.post("/login", response_model=TokenResponse, tags=["auth"])
async def login(user_request: UserLoginRequest,
                response: Response,
                db: AsyncSession = Depends(get_db)):
    # Read user from db by email
    result = await db.execute(select(User).where(user_request.email == User.email))
    user = result.scalars().first()

    # Authenticate user email & password
    if user and is_valid_password(user, user_request.password):

        # Create access token
        claim = {
            "sub": str(user.user_id)
        }
        access_token = create_access_token(
            claim,
            timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        refresh_token = create_refresh_token(
            {"sub": str(user.user_id)},
            timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        )
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token
        )
        # response.set_cookie(
        #     key="access_token",
        #     value=access_token,
        #     httponly=True,
        #     samesite=None,
        #     expires=ACCESS_TOKEN_COOKIE_EXPIRE_TIME
        # )
        # response.set_cookie(
        #     key="refresh_token",
        #     value=refresh_token,
        #     httponly=True,
        #     samesite=None,
        #     expires=REFRESH_TOKEN_COOKIE_EXPIRE_TIME
        # )
        # store_refresh_token(
        #     str(user.user_id),
        #     refresh_token
        # )
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="invalid user info")

@router.post("/logout", tags=["auth"])
async def logout(response: Response):
    response.delete_cookie(key="access_token")
    response.delete_cookie(key="refresh_token")
    return {"message": "Logged out successfully"}

@router.post("/refresh-token", tags=["auth"])
async def refresh(request: Request):
    refresh_token = request.cookies.get("refresh_token")
    try:
        payload = jwt.decode(refresh_token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        found_token = await get_refresh_token(user_id)
        if found_token != refresh_token:
            raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
        claim = {
            "sub": str(user_id)
        }
        new_access_token = create_access_token(
            claim,
            expires_delta=timedelta(
                minutes=ACCESS_TOKEN_EXPIRE_MINUTES
            ))
        return {
            "access_token": new_access_token
        }

    except ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")


def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, REFRESH_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def store_refresh_token(user_id: str, refresh_token: str):
    redis_client.setex(
        name=f"refresh_token:{user_id}",
        value=refresh_token,
        time=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    )

def get_refresh_token(user_id: str):
    refresh_token = redis_client.get(f"refresh_token:{user_id}")
    return refresh_token

def verify_refresh_token(found_token: str, refresh_token: str):
    if found_token == refresh_token:
        return True
    else:
        return False

def get_current_user_from_cookie(request: Request):
    token = request.cookies.get("access_token")
    if token is None:
        raise credentials_exception
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        user_id = payload.get("sub")
        if not user_id:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception
    except ExpiredSignatureError:
        raise expired_token_exception
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token")
    return Payload(
        user_id=int(payload.get("sub"))
    )


def is_valid_password(user: Union[User, None], password: str) -> bool:
    bytes_password = password.encode('utf-8')
    hashed_password = user.password.encode('utf-8')
    if bcrypt.checkpw(bytes_password, hashed_password):
        return True
    return False