from pydantic import BaseModel

class CreateChatroomRequest(BaseModel):
    chatroom_name: str
    instructor_name: str