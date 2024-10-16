from fastapi import FastAPI
from backend.api import user, auth, chatroom, message

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

app.include_router(user.router, prefix="/user", tags=["user"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(chatroom.router, prefix="/chatroom", tags=["chatroom"])
app.include_router(message.router, prefix="/message", tags=["message"])