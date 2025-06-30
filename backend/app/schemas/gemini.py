# app/schemas/gemini.py
from pydantic import BaseModel
from typing import Literal, List

class Message(BaseModel):
    role: Literal["user", "model"]
    text: str

class ChatWithHistoryRequest(BaseModel):
    history: List[Message]
    prompt: str
