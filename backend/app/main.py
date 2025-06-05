from fastapi import FastAPI
from app.api import users, posts
from dotenv import load_dotenv
import os

dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path)
app = FastAPI()

# 라우터 등록
app.include_router(users.router, prefix="/api", tags=["Users"])
app.include_router(posts.router, prefix="/api", tags=["Posts"])

@app.get("/")
def root():
    return {"message":"FastAPI 벡엔드가 실행 중"}