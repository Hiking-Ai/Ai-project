
# app/services/gemini_service.py
from typing import List, Union
from app.schemas.gemini import Message
from app.core.config import settings
from app.core.redis import get_redis
import httpx, json, logging
import google.generativeai as genai
genai.configure(api_key=settings.vite_gemini_api_key)

# Gemini API 호출(요청 생성 -> 결과 파싱)
# radis에 대화 히스토리 저장/불러오기

logger = logging.getLogger(__name__)

# gemini-1.5-pro는 강력하지만 요청이 많아 부담이 크다. / gemini-1.5-flash or lite 등 상대적 가벼운 모델
# GEMINI_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent"
GEMINI_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent"

# async def ask_gemini_with_history(history: List[Message], prompt: str) -> str:
#     payload = {
#         "contents": [
#             {"role": msg.role, "parts": [{"text": msg.text}]} for msg in history
#         ] + [
#             {"role": "user", "parts": [{"text": prompt}]}
#         ]
#     }
    
#     async with httpx.AsyncClient(timeout=20.0) as client:
#         response = await client.post(
#             f"{GEMINI_URL}?key={settings.vite_gemini_api_key}",
#             json=payload
#         )
#         print("response",response)
#         data = response.json()
#     print("data", data)
#     try:
#         return data["candidates"][0]["content"]["parts"][0]["text"]
#     except Exception as e:
#         logger.warning(f"[Gemini 오류] {e}")
#         return "죄송합니다. 답변을 생성하지 못했습니다."
model = genai.GenerativeModel("gemini-1.5-flash") 
async def ask_gemini_with_history(history: List[Message], prompt: str) -> str:
    if len(history):
        history = [
            {
                "role": msg.role,
                "parts": [{"text": msg.text}]
            }
            for msg in history
        ]

    try:
        # ChatSession 시작 + 이전 히스토리 적용
        chat = model.start_chat(history=history)
        # 메시지 보내기
        response = await chat.send_message_async(prompt)
        return response.text

    except Exception as e:
        logger.warning(f"[Gemini 오류] {e}")
        return "죄송합니다. 답변을 생성하지 못했습니다."

async def save_history(user_id: str, history: list[Union[dict, Message]]):
    redis = get_redis()

    # Message 객체는 dict로 변환 필요 / pydantic 객체라서 변환을 해야 직렬화가 된다
    serializable = [
        msg.dict() if isinstance(msg, Message) else msg for msg in history
    ]

    # user_id 기반으로 redis에 key-value 형태 저장. TTL(time to live, 세션의 유효시간)은 1시간
    await redis.set(f"chat_history:{user_id}", json.dumps(serializable), ex=3600)


async def load_history(user_id: str) -> list:
    redis = get_redis()
    data = await redis.get(f"chat_history:{user_id}")
    return json.loads(data) if data else []