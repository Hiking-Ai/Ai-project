# app/db/init_db.py
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.models import user, post, signup_token  # 모든 모델 import
from app.utils.security import hash_password
from app.models.user import User, UserRole
import app.models

def init():
    print("📦 Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Done.")
    
    # 관리자 계정 생성
    db = SessionLocal()
    admin_email = "admin@example.com"
    existing = db.query(User).filter(User.user_email).first()
    if not existing:
        print("👤 Creating default admin account...")
        admin = User(
            user_email=admin_email,
            password=hash_password("admin1234"),  # 원하는 초기 비밀번호
            nickname="admin",
            user_name="관리자",
            role=UserRole.ADMIN
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        print(f"✅ Admin account created: {admin_email}")
    else:
        print("⚠️ Admin account already exists.")
    db.close()

if __name__ == "__main__":
    init()