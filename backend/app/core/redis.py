# app/core/redis.py
from redis.asyncio import Redis
from functools import lru_cache

@lru_cache()
def get_redis():
    return Redis(
        host="localhost",
        port=6379,
        decode_responses=True
    )
# redis 서버의 설정