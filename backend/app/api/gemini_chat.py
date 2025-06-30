# app/api/gemini_chat.py
from fastapi import APIRouter, Request, Depends
from app.schemas.gemini import ChatWithHistoryRequest, Message
from app.services.gemini_service import ask_gemini_with_history, save_history, load_history
from app.utils.deps import get_current_user
from app.models.user import User
from pydantic import BaseModel

router = APIRouter()

# 프론트가 히스트리 다 보내는 방식
@router.post("/chat/gemini/history")
async def chat_with_history(req: ChatWithHistoryRequest, request: Request):
    user_id = request.client.host  # 예: ip 기반 사용자 구분(로그인 유저라면 user.id 사용)
    full_history = req.history + [{"role": "user", "text": req.prompt}]

    # 응답 생성
    response = await ask_gemini_with_history(req.history, req.prompt)
    full_history.append({"role": "model", "text": response})

    # redis에 저장
    await save_history(user_id, full_history)

    return {"response": response, "history":full_history}

class PromptOnly(BaseModel):
    prompt: str

# 백엔드가 Redis에서 히스토리 관리하는 방식
@router.post("/chat/gemini/with-session")   # PromptOnly모델로 prompt만 받는다.
async def chat_session(req: PromptOnly, request: Request, current_user: User = Depends(get_current_user)):
    user_id = str(current_user.user_id) # IP -> 사용자 ID로 대체 인증된 유저만 접근 가능 JWT기반
    history = await load_history(user_id)

    # 최근 대화 10개까지만 유지 / 부담 최소화
    short_history = history[-10:]
    message_objects = [Message(**m) for m in short_history]
    # Message(**m) 딕셔너리 내용을 키워드 인자로 풀어서 Message 클래스의 인스턴스로 만듬.
    # for m in short_history 리스트 안의 딕셔너리를 하나씩 가져옴
    #[...] 이걸 다시 하나의 리스트로 만듦

    response = await ask_gemini_with_history(message_objects, req.prompt)

    # 전체 히스토리에는 새로운 대화 추가해서 저장(응답 완료 후)
    history.append({"role": "user", "text": req.prompt})
    history.append({"role": "model", "text": response})
    await save_history(user_id, history)

    return {"response": response, "history":history}