from fastapi import FastAPI
from fastapi import APIRouter
from fastapi.params import Depends
from pydantic import BaseModel
from sqlalchemy import String
from sqlalchemy.orm import Session
from models import User
from database import get_db, Base, engine

app = FastAPI()

Base.metadata.create_all(bind=engine) # create tables if doesn't exist

@app.get("/")
def read_root():
    return {"Hello": "World"}

class UserCreateRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str

class UserCreateResponse(BaseModel):
    id: int


@app.get("/users/", tags=["User"])
def read_users(db: Session = Depends(get_db)): # GET USERS
    users = db.query(User).all()
    return [{
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email
    } for user in users]


@app.post("/users/", response_model=UserCreateResponse, tags=["User"])
def create_user(user: UserCreateRequest, db: Session = Depends(get_db)): # CREATE USER
    user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password=user.password
    )
    db.add(user)
    db.commit()
    return user
