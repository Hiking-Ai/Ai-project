from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os, uvicorn
from fastapi.middleware.cors import CORSMiddleware

# ✅ 필요한 라우터만 불러오기
from app.api import (
    users,
    posts,
    user_profile,
    comment,
    post_views,
    favorite,
    category,
    prediction,
    park_view,
    park,
    trails,
    gemini_chat,
    recommend,
)
from app.api.api_v1.routers import weather


# ✅ 환경 변수 불러오기
dotenv_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path)

app = FastAPI()

# ✅ 라우터 등록
app.include_router(users.router, prefix="/api", tags=["Users"])
app.include_router(posts.router, prefix="/api", tags=["Posts"])
app.include_router(user_profile.router, prefix="/api", tags=["Profile"])
app.include_router(comment.router, prefix="/api", tags=["Comment"])
app.include_router(category.router, prefix="/api", tags=["Categories"])
app.include_router(post_views.router, prefix="/api", tags=["View"])
app.include_router(favorite.router, prefix="/api", tags=["Favorite"])
app.include_router(prediction.router, prefix="/api", tags=["Prediction"])
app.include_router(park_view.router, prefix="/api", tags=["ParkView"])
app.include_router(weather.router, prefix="/api/v1", tags=["Weather"])
app.include_router(park.router, prefix="/api", tags=["Park"])
app.include_router(trails.router, prefix="/api", tags=["Trails"])
app.include_router(gemini_chat.router, prefix="/api", tags=["Gemini"])
app.include_router(recommend.router, prefix="/api")

# ✅ 정적 파일 서빙
app.mount("/static", StaticFiles(directory="uploads"), name="static")

# ✅ 기본 라우터
@app.get("/")
def root():
    return {"message":"FastAPI 백엔드가 실행 중"}

# ✅ CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://192.168.0.198:3000",
        "http://192.168.0.09:3000",
        "http://192.168.0.14:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 직접 실행 시
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)


# 파이썬 파일로 실행할때 작동 아니면 uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 로 실행.
# nginx 키는 방법 : cmd창에 nginx 치면 실행.