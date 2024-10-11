from pydantic import BaseModel


class UserCreateResponse(BaseModel):
    id: int