from fastapi import FastAPI
from backend.api import user, auth, chatroom
from backend.utils.db_utils import create_tables

app = FastAPI()

create_tables()
@app.get("/")
def read_root():
    return {"Hello": "World"}

app.include_router(user.router, prefix="/users", tags=["user"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(chatroom.router, prefix="/chatroom", tags=["chatroom"])