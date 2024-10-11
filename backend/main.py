from fastapi import FastAPI
from backend.api import user
from backend.utils.db_utils import create_tables

app = FastAPI()

create_tables()
@app.get("/")
def read_root():
    return {"Hello": "World"}

app.include_router(user.router, prefix="/users", tags=["users"])