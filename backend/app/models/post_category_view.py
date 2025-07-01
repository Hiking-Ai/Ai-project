from sqlalchemy import Column, Integer, String
from app.db.base import Base  # 기존 Base를 사용해야 함

class PostCategoryView(Base):
    __tablename__ = "view_post_categories"  # 뷰 이름

    post_id = Column(Integer, primary_key=True)
    category_name = Column(String(100))
