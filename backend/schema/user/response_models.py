from pydantic import BaseModel


class UserCreateResponse(BaseModel):
    user_id: int