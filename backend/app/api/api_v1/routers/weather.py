import requests
from fastapi import APIRouter, Query, HTTPException
from datetime import datetime
import os
from bs4 import BeautifulSoup

router = APIRouter()

# 기상청 ASOS 관측소의 실시간 날씨 데이터 조회 (관측소 번호 기준) 
@router.get("/weather/asos")
def get_asos_weather(stn: int = Query(108)):
    from datetime import timedelta

    # 1시간 전 시간 기준으로 요청
    base_time = (datetime.now() - timedelta(hours=1)).strftime("%Y%m%d%H00")
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
        lines = res.text.splitlines()

        # 데이터 줄 추출 (주석 제외)
        data_line = next((line for line in lines if not line.startswith("#") and line.strip()), None)
        if not data_line:
            raise ValueError("데이터 줄이 없습니다")

        tokens = data_line.split()

        result = {
            "datetime": tokens[0],     # 날짜와 시간 (형식: YYYYMMDDHHMM) → 예: '202506251300' → 2025년 6월 25일 13시
            "station_id": tokens[1],   # 관측소 번호 (예: 108은 서울 지점)
            "wind_dir": tokens[2],     # 풍향 (16방위값, 0~15 사이의 숫자, 0은 북쪽)
            "wind_speed": tokens[3],   # 평균 풍속 (단위: m/s)
            "pressure": tokens[7],     # 현지기압 (단위: hPa)
            "temperature": tokens[11], # 기온 (단위: °C)
            "dew_point": tokens[12],   # 이슬점 온도 (단위: °C) → 습도 계산의 기초가 되는 온도
            "humidity": tokens[13],    # 상대 습도 (단위: %) → 공기 중 수증기 비율
            "rainfall": tokens[15],    # 강수량 (단위: mm) → 직전 1시간 동안 내린 비의 양
        }

        return {"result": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ASOS API 오류: {str(e)}")


# 관측소 정보와 해당 지역명의 정보를 매핑
STATION_MAP = {
    90: "속초",
    93: "북춘천",
    95: "철원",
    98: "동두천",
    99: "문산",
    100: "대관령",
    101: "춘천",
    102: "백령도",
    104: "북강릉",
    105: "강릉",
    106: "동해",
    108: "서울",
    112: "인천",
    114: "원주",
    115: "울릉도",
    116: "관악산",
    119: "수원",
    121: "영월",
    127: "충주",
    129: "서산",
    130: "울진",
    131: "청주",
    133: "대전",
    135: "추풍령",
    136: "안동",
    137: "상주",
    138: "포항",
    140: "군산",
    143: "대구",
    146: "전주",
    152: "울산",
    155: "마산",
    156: "광주",
    159: "부산",
    162: "통영",
    164: "무안",
    165: "목포",
    168: "여수",
    169: "흑산도",
    170: "완도",
    172: "고창",
    174: "순천",
    175: "진도(첨찰산)",
    176: "대구(기)",
    177: "홍성(예)",
    181: "서청주(예)",
    184: "제주",
    185: "고산",
    187: "성산",
    188: "성산",
    189: "서귀포",
    192: "진주",
    201: "강화",
    202: "양평",
    203: "이천",
}

# 지역명을 매핑해서 지역명으로 날씨 조회 API
@router.get("/weather/by-location")
def get_weather_by_location(name: str = Query(..., description="지역 이름")):
    from datetime import timedelta

    # 지역 이름 → 관측소 번호 찾기
    station_id = next((k for k, v in STATION_MAP.items() if v == name), None)
    if not station_id:
        raise HTTPException(status_code=404, detail="해당 지역을 찾을 수 없습니다.")

    # 1시간 전 시간 기준
    base_time = (datetime.now() - timedelta(hours=1)).strftime("%Y%m%d%H00")
    api_key = os.getenv("KMA_API_KEY")

    url = "https://apihub.kma.go.kr/api/typ01/url/kma_sfctm2.php"
    params = {
        "t": base_time,
        "stn": station_id,
        "help": 0,
        "authKey": api_key
    }

    try:
        res = requests.get(url, params=params, timeout=10)
        res.raise_for_status()
        lines = res.text.splitlines()

        # 데이터 줄 추출
        data_line = next((line for line in lines if not line.startswith("#") and line.strip()), None)
        if not data_line:
            raise HTTPException(status_code=404, detail="데이터가 없습니다.")

        tokens = data_line.split()

        result = {
            "location": name,
            "station_id": tokens[1],
            "datetime": tokens[0],
            "temperature": tokens[11],
            "humidity": tokens[13],
            "pressure": tokens[7],
            "wind_speed": tokens[3],
            "rainfall": tokens[15]
        }

        return {"result": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"날씨 조회 중 오류 발생: {str(e)}")
