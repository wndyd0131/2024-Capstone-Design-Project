from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette import status
from starlette.exceptions import HTTPException

from backend.api.auth import get_current_user_from_cookie
from backend.db.session import get_db
from backend.schema.chatroom.request_model import CreateChatroomRequest, ChatroomRequest
from backend.schema.chatroom.response_model import CreateChatroomResponse, ChatroomResponse
from backend.schema.jwt.response_model import Payload
from backend.schema.models import Chatroom

router = APIRouter()

@router.post("/create", response_model=CreateChatroomResponse, tags=["chatroom"])
def create_chatroom(chatroom_request: CreateChatroomRequest, db: Session = Depends(get_db), current_user: Payload = Depends(get_current_user_from_cookie)):
    chatroom = Chatroom(
        chatroom_name=chatroom_request.chatroom_name,
        instructor_name=chatroom_request.instructor_name,
        user_id=current_user.user_id
    )
    db.add(chatroom)
    db.commit()
    return chatroom

@router.get("/", response_model=List[ChatroomResponse], tags=["chatroom"])
def find_all_chatroom(db: Session = Depends(get_db), current_user: Payload = Depends(get_current_user_from_cookie)):
    chatrooms = db.query(Chatroom).filter(current_user.user_id == Chatroom.user_id).all()
    return chatrooms

@router.get("/{chatroom_id}", response_model=ChatroomResponse, tags=["chatroom"])
def find_chatroom(chatroom_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user_from_cookie)):
    chatroom = db.query(Chatroom).filter(chatroom_id == Chatroom.chatroom_id).first()
    if chatroom:
        return chatroom
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Unable to load chatroom"
        )

# send to model