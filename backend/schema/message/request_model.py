from datetime import datetime

from pydantic import BaseModel

class GetMessageRequest(BaseModel):
    chatroom_id: int

class SendMessageRequest(BaseModel):
    content: str
    chatroom_id: int