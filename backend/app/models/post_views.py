from sqlalchemy import Column, Integer, String, DateTime
from app.db.base import Base

class PostWithCategories(Base):
    __tablename__ = "post_with_all_categories_view"
    __table_args__ = {'extend_existing': True}  # 기존 테이블과 충돌 방지

    post_id = Column(Integer, primary_key=True)
    title = Column(String)
    content = Column(String)
    level = Column(String)
    purpose = Column(String)
    path_type = Column(String)

class PostWithAuthor(Base):
    __tablename__ = "view_board_with_author"
    __table_args__ = {'extend_existing': True}

    post_id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    title = Column(String)
    content = Column(String)
    create_at = Column(DateTime)
    update_at = Column(DateTime)
    nickname = Column(String)

class ViewPostCategory(Base):
    __tablename__ = "view_post_categories"
    __table_args__ = {'extend_existing': True}

    post_id = Column(Integer, primary_key=True)
    title = Column(String(50))
    post_created = Column(DateTime)
    category_id = Column(Integer)  # BigInteger 사용
    category_name = Column(String(100))
