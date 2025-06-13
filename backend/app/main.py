from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.api import users, posts, user_profile
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware
from app.api import comment

dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path)
app = FastAPI()

# 라우터 등록
app.include_router(users.router, prefix="/api", tags=["Users"])
app.include_router(posts.router, prefix="/api", tags=["Posts"])
app.include_router(user_profile.router, prefix="/api", tags=["profile"])
app.include_router(posts.router)
app.include_router(comment.router, prefix="/api", tags=["Comment"])

# "/static" 경로로 "uploads" 폴더 내부 파일 제공
app.mount("/static", StaticFiles(directory="uploads"), name="static")

@app.get("/")
def root():
    return {"message":"FastAPI 벡엔드가 실행 중"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://192.168.0.9:3000"],  # 프론트엔드 개발 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)