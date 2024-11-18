from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from backend.api import user, auth, chatroom, message, document
from backend.db.session import engine, Base

app = FastAPI()

# @app.on_event("startup")
# async def on_startup():
#     async with engine.begin() as conn:
#         await conn.run_sync(Base.metadata.drop_all)
#         await conn.run_sync(Base.metadata.create_all)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router, prefix="/user", tags=["user"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(chatroom.router, prefix="/chatroom", tags=["chatroom"])
app.include_router(message.router, prefix="/message", tags=["message"])
app.include_router(document.router, prefix="/document", tags=["document"])