
from fastapi import FastAPI
from app.api import ping

app = FastAPI()

# 라우터 등록
app.include_router(ping.router)

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI"}
