from datetime import datetime

from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.orm import Session
from starlette import status

from backend.api.auth import get_current_user_from_cookie
from backend.db.session import get_db
from backend.schema.jwt.response_model import Payload
from backend.schema.message.request_model import SendMessageRequest
from backend.schema.message.response_model import SendMessageResponse
from backend.schema.models import Message

router = APIRouter()

# @router.get("/")
@router.post("/", response_model=SendMessageResponse, status_code=status.HTTP_201_CREATED, tags=["message"])
def send_message_to_model(user_request: SendMessageRequest,
                          db: Session = Depends(get_db),
                          current_user: Payload = Depends(get_current_user_from_cookie)):
    # save user message to db
    message_content, chatroom_id = user_request.content, user_request.chatroom_id

    user_message = create_message(message_content, datetime.now(), "user", chatroom_id)
    db.add(user_message)
    db.commit()

    # send the request to the model

    # get response from the model
    fake_response = "Hi, I'm your studymate stdm! How may I help you? ^_^"

    # save the response to db
    bot_message = create_message(fake_response, datetime.now(), "bot", chatroom_id)
    db.add(bot_message)
    db.commit()
    # send back response from the model
    return bot_message
    #async

def create_message(content: str, timestamp: datetime, sender_type: str, chatroom_id: int) -> Message:
    message = Message(
        content=content,
        timestamp=timestamp,
        sender_type=sender_type,
        chatroom_id=chatroom_id
    )
    return message
