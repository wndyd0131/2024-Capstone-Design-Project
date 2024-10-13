from pydantic import BaseModel


class CreateChatroomResponse(BaseModel):
    chatroom_id: int