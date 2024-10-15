from pydantic import BaseModel


class SendMessageRequest(BaseModel):
    content: str
    chatroom_id: int