from datetime import datetime

from pydantic import BaseModel


class SendMessageResponse(BaseModel):
    content: str
    timestamp: datetime
    sender_type: str
    chatroom_id: int
