from typing import Union

from pydantic import BaseModel


class TokenResponse(BaseModel):
    access_token: str