import requests
from fastapi import APIRouter, Query, HTTPException
from datetime import datetime
import os

router = APIRouter()

@router.get("/weather/asos")
def get_asos_weather(stn: int = Query(108, description="관측소 번호")):
    base_time = datetime.now().strftime("%Y%m%d%H00")
    api_key = os.getenv("KMA_API_KEY")

    url = "https://apihub.kma.go.kr/api/typ01/url/kma_sfctm2.php"
    params = {
        "t": base_time,
        "stn": stn,
        "help": 0,
        "authKey": api_key
    }

    try:
        res = requests.get(url, params=params, timeout=10)
        res.raise_for_status()

        # 응답은 HTML일 수 있으므로 텍스트로 확인
        return {"response": res.text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ASOS API 오류: {str(e)}")
