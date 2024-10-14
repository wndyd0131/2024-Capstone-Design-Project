from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.api.auth import get_current_user_from_cookie
from backend.db.session import get_db
from backend.schema.chatroom.request_model import CreateChatroomRequest
from backend.schema.chatroom.response_model import CreateChatroomResponse
from backend.schema.models import Chatroom

router = APIRouter()

@router.post("/create", response_model=CreateChatroomResponse, tags=["chatroom"])
def create_chatroom(chatroom_request: CreateChatroomRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user_from_cookie)):
    chatroom = Chatroom(
        chatroom_name=chatroom_request.chatroom_name,
        instructor_name=chatroom_request.instructor_name,
        user_id=int(current_user.get("sub"))
    )
    db.add(chatroom)
    db.commit()
    return CreateChatroomResponse(
        chatroom_id=chatroom.chatroom_id,
    )