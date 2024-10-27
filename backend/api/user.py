from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from backend.db.session import get_db
from backend.schema.models import User
from backend.schema.user.request_models import UserCreateRequest, UserLoginRequest
from backend.schema.user.response_models import UserCreateResponse, UserResponse
from sqlalchemy.orm import Session
from typing import List
import bcrypt

router = APIRouter()

@router.get("/", response_model=List[UserResponse], tags=["user"])
async def find_users(db: AsyncSession = Depends(get_db)): # GET USERS
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users


@router.post("/register", response_model=UserCreateResponse, status_code=status.HTTP_201_CREATED, tags=["user"])
async def create_user(user_request: UserCreateRequest, db: AsyncSession = Depends(get_db)): # CREATE USER
    hashed_password = hash_password(user_request.password)  # Hashing
    user = User(
        first_name=user_request.first_name,
        last_name=user_request.last_name,
        email=user_request.email,
        password=hashed_password
    )
    db.add(user)
    await db.commit()
    await db.refresh(user) # refresh session to ensure the instance is updated
    return user


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')

