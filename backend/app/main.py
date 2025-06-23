from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.api import users, posts, user_profile, category
from dotenv import load_dotenv
import os, uvicorn
from fastapi.middleware.cors import CORSMiddleware
from app.api import comment
from app.api import post_views
from app.api import favorite

dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path)
app = FastAPI()

# 라우터 등록
app.include_router(users.router, prefix="/api", tags=["Users"])
app.include_router(posts.router, prefix="/api", tags=["Posts"])
app.include_router(user_profile.router, prefix="/api", tags=["profile"])
app.include_router(comment.router, prefix="/api", tags=["Comment"])
app.include_router(category.router, prefix="/api", tags=["Categories"])
app.include_router(post_views.router, prefix="/api", tags=["View"] )
app.include_router(favorite.router, prefix="/api", tags=["Favorite"])

# "/static" 경로로 "uploads" 폴더 내부 파일 제공
app.mount("/static", StaticFiles(directory="uploads"), name="static")

@app.get("/")
def root():
    return {"message":"FastAPI 벡엔드가 실행 중"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://192.168.0.198:3000","http://192.168.0.09:3000","http://192.168.0.14:3000"],  # 프론트엔드 개발 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 파이썬 파일로 실행할때 작동 아니면 uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 설정해야 함!
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
