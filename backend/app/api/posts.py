from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import os, shutil, uuid
from sqlalchemy import or_, func

from app.models.post import Post, PostFile
from app.db.session import get_db
from app.utils.deps import get_current_user
from app.models.user import User
from app.schemas.post import PostOut, PostResponse, PostListResponse
from app.models.favorite import Favorite
from app.models.category_post import CategoryPost

router = APIRouter()

UPLOAD_DIR = "uploads/"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 게시글 생성
@router.post("/posts")
def create_post(
    title: str = Form(...),
    content: str = Form(...),
    category_ids: List[int] = Form(...),
    files: Optional[List[UploadFile]] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        post = Post(
            title=title,
            content=content,
            user_id=current_user.user_id 
        )
        db.add(post)
        db.flush()
        db.refresh(post)

        # 카테고리 다대다 연결 저장
        for category_id in category_ids:
            db.add(CategoryPost(post_id=post.post_id, category_id=category_id))

        # 파일 저장
        if files:
            for i, file in enumerate(files):
                ext = file.filename.split(".")[-1]
                filename = f"{uuid.uuid4()}.{ext}"
                file_path = os.path.join(UPLOAD_DIR, filename)

                with open(file_path, "wb") as buffer:
                    shutil.copyfileobj(file.file, buffer)

                if i == 0:
                    post.thumbnail_path = f"/uploads/{filename}"

                post_file = PostFile(
                    post_id=post.post_id,
                    original_file_name=file.filename,
                    stored_path=f"/uploads/{filename}",
                    file_type=file.content_type
                )
                db.add(post_file)

        db.commit()

        return {
            "post_id": post.post_id,
            "title": post.title,
            "content": post.content,
            "user_id": post.user_id,
            "create_at": post.create_at,
            "thumbnail_path": post.thumbnail_path
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"게시글 등록 중 오류 발생: {str(e)}")


# 게시글 목록 조회
@router.get("/posts", response_model=PostListResponse)
def list_posts(
    skip: int = 0,
    limit: int = 10,
    sort_by: str = "latest",
    db: Session = Depends(get_db)
):
    # 🔸 좋아요 수 서브쿼리 (post_id 기준 count)
    like_subquery = (
        db.query(
            Favorite.post_id.label("post_id"),
            func.count(Favorite.post_id).label("likes")
        )
        .group_by(Favorite.post_id)
        .subquery()
    )

    # 🔸 Post + User + 좋아요 수 join
    query = (
        db.query(
            Post,
            User.nickname,
            like_subquery.c.likes
        )
        .join(User, Post.user_id == User.user_id)
        .outerjoin(like_subquery, Post.post_id == like_subquery.c.post_id)
    )

    # 🔸 정렬
    if sort_by == "likes":
        query = query.order_by(like_subquery.c.likes.desc().nullslast())
    else:
        query = query.order_by(Post.create_at.desc())

    total = query.count()
    results = query.offset(skip).limit(limit).all()

    # 🔸 category_ids 포함 결과 가공
    items = []
    for post, nickname, likes in results:
        category_ids = [
            cp.category_id for cp in db.query(CategoryPost).filter(CategoryPost.post_id == post.post_id).all()
        ]
        items.append({
            "post_id": post.post_id,
            "title": post.title,
            "content": post.content,
            "user_id": post.user_id,
            "nickname": nickname,
            "create_at": post.create_at,
            "view_count": post.view_count,
            "thumbnail_path": post.thumbnail_path,
            "files": post.files,
            "likes": likes or 0,
            "category_ids": category_ids,
            
        })

    return {"total": total, "items": items}


# 게시글 검색
@router.get("/posts/search", response_model=PostListResponse)
def search_posts(
    keyword: str = Query(..., description="검색할 키워드"),
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    if not keyword.strip():
        raise HTTPException(status_code=400, detail="검색어를 입력해주세요.")
    
    query = (
        db.query(Post, User.nickname, func.count(Favorite.post_id).label("likes"))
        .join(User, Post.user_id == User.user_id)
        .outerjoin(Favorite, Post.post_id == Favorite.post_id)
        .filter(
            or_(
                Post.title.contains(keyword),
                Post.content.contains(keyword)
            )
        )
        .group_by(Post.post_id, User.nickname)
        .order_by(Post.create_at.desc())
    )

    total = query.count()
    results = query.offset(skip).limit(limit).all()

    items = []
    for post, nickname, likes in results:
        category_ids = [
        cp.category_id for cp in db.query(CategoryPost).filter(CategoryPost.post_id == post.post_id).all()
        ]
        items.append({
            "post_id": post.post_id,
            "title": post.title,
            "content": post.content,
            "user_id": post.user_id,
            "nickname": nickname,
            "create_at": post.create_at,
            "view_count": post.view_count,
            "thumbnail_path": post.thumbnail_path,
            "files": post.files,
            "likes": likes or 0,
            "category_ids": category_ids
        })

    return {"total": total, "items": items}


# 자동완성
@router.get("/posts/autocomplete", response_model=List[str])
def autocomplete_posts(
    keyword: str = Query(..., min_length=1),
    limit: int = 10,
    db: Session = Depends(get_db)
):
    results = (
        db.query(Post.title)
        .filter(
            or_(
                Post.title.ilike(f"%{keyword}%"),
                Post.content.ilike(f"%{keyword}%")
            )
        )
        .distinct()
        .limit(limit)
        .all()
    )
    return [r[0] for r in results if r[0]]


# 게시글 단건 조회
@router.get("/posts/{post_id}", response_model=PostOut)
def read_post(post_id: int, db: Session = Depends(get_db)):
    result = (
        db.query(Post, User.nickname)
        .join(User, Post.user_id == User.user_id)
        .filter(Post.post_id == post_id)
        .first()
    )

    if not result:
        raise HTTPException(status_code=404, detail="게시글이 존재하지 않습니다")

    post, nickname = result

    likes = db.query(func.count(Favorite.post_id)).filter(Favorite.post_id == post_id).scalar()
    post.view_count += 1
    db.commit()
    db.refresh(post)

    # ✅ 연결된 카테고리 ID들 추출
    category_ids = [
        cp.category_id for cp in db.query(CategoryPost).filter(CategoryPost.post_id == post_id).all()
    ]

    return {
        "post_id": post.post_id,
        "title": post.title,
        "content": post.content,
        "user_id": post.user_id,
        "nickname": nickname,
        "create_at": post.create_at,
        "view_count": post.view_count,
        "thumbnail_path": post.thumbnail_path,
        "files": post.files,
        "likes": likes or 0,
        "category_ids": category_ids  # ✅ 여기서 리스트로 전달
    }


# 게시글 수정
@router.put("/posts/{post_id}")
def update_post(
    post_id: int,
    title: str = Form(...),
    content: str = Form(...),
    category_ids: List[int] = Form(...),  # ✅ 리스트로 수정
    files: Optional[List[UploadFile]] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.post_id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시글이 없습니다.")
    if post.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="수정 권한이 없습니다.")

    post.title = title
    post.content = content

    # ✅ 기존 카테고리 연결 삭제
    db.query(CategoryPost).filter(CategoryPost.post_id == post_id).delete()

    # ✅ 새 카테고리 연결 추가
    for category_id in category_ids:
        db.add(CategoryPost(post_id=post_id, category_id=category_id))

    # 파일 삭제
    for f in post.files:
        file_abs_path = f".{f.stored_path}"
        if os.path.exists(file_abs_path):
            os.remove(file_abs_path)
        db.delete(f)

    # 새 파일 저장
    if files:
        for i, file in enumerate(files):
            ext = file.filename.split(".")[-1]
            filename = f"{uuid.uuid4()}.{ext}"
            file_path = os.path.join("uploads", filename)

            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            if i == 0:
                post.thumbnail_path = f"/uploads/{filename}"

            db.add(PostFile(
                post_id=post.post_id,
                original_file_name=file.filename,
                stored_path=f"/uploads/{filename}",
                file_type=file.content_type
            ))

    db.commit()
    return {"message": "게시글이 수정되었습니다."}

# 게시글 삭제
@router.delete("/posts/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.post_id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시글이 없습니다.")
    if post.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="삭제 권한이 없습니다.")

    for f in post.files:
        file_abs_path = f".{f.stored_path}"
        if os.path.exists(file_abs_path):
            os.remove(file_abs_path)
        db.delete(f)

    db.delete(post)
    db.commit()
    return {"message": "게시글이 삭제되었습니다."}
