# app/db/init_db.py
from app.db.base import Base
from app.db.session import engine

from app.models import user, user_profile, comment, category, post_category, post, signup_token, favorite

def init_db():
    print("Creating tables in MySQL...")
    Base.metadata.create_all(bind=engine)
    print("✅ Done")

if __name__ == "__main__":
    init_db()
