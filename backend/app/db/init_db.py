# app/db/init_db.py

from app.db.base import Base
from app.db.session import engine
from app.models import user, post  # 모든 모델 import

def init():
    print("📦 Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Done.")

if __name__ == "__main__":
    init()
