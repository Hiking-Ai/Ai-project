from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import os, shutil, uuid
from sqlalchemy import or_, func

from app.models.post import Post, PostFile
from app.models.post_category import PostCategory
from app.db.session import get_db
from app.utils.deps import get_current_user
from app.models.user import User
from app.schemas.post import PostOut, PostResponse, PostListResponse
from app.models.favorite import Favorite

router = APIRouter()

UPLOAD_DIR = "uploads/"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 게시글 생성
@router.post("/posts")
def create_post(
    title: str = Form(...),
    content: str = Form(...),
    subcategory_ids: List[int] = Form(...),  # ✅ 카테고리 선택
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
        db.flush()  # <- insert는 되지만 commit은 안됨.
        db.refresh(post)

        # ✅ 하위 카테고리 연결
        for sub_id in subcategory_ids:
            db.add(PostCategory(post_id=post.post_id, subcategory_id=sub_id))

        # ✅ 파일 저장
        if files:
            for i, file in enumerate(files):
                ext = file.filename.split(".")[-1]
                filename = f"{uuid.uuid4()}.{ext}"
                file_path = os.path.join(UPLOAD_DIR, filename)

                with open(file_path, "wb") as buffer:
                    shutil.copyfileobj(file.file, buffer)

                # 첫 번째 파일을 썸네일로 사용
                if i == 0:
                    post.thumbnail_path = f"/{file_path}"

                post_file = PostFile(
                    post_id=post.post_id,
                    original_file_name=file.filename,
                    stored_path=f"/{file_path}",
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
        db.rollback()   # 예외사항 발생 시 롤백
        raise HTTPException(status_code=500, detail=f"게시글 등록 중 오류 발생: {str(e)}")

# 게시글 리스트 + 페이징
@router.get("/posts", response_model=PostListResponse)
def list_posts(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    results = (
        db.query(Post, User.nickname)
        .join(User, Post.user_id == User.user_id)
        .order_by(Post.create_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    items = []
    for post, nickname in results:
        items.append({
            "post_id": post.post_id,
            "title": post.title,
            "content": post.content,
            "user_id": post.user_id,
            "nickname": nickname,  # ✅ 반드시 포함
            "create_at": post.create_at,
            "view_count": post.view_count,
        })

    return {"total": db.query(Post).count(), "items": items}

# 검색 API + 페이징 처리
@router.get("/posts/search", response_model=PostListResponse)
def search_posts(
    keyword: str = Query(..., description="검색할 키워드"),
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    if not keyword.strip():
        raise HTTPException(status_code=400, detail="검색어를 입력해주세요.")
    
    query = db.query(Post).filter(
        or_(
            Post.title.contains(keyword),
            Post.content.contains(keyword)
        )
    )
    total = query.count()

    results = (
        query
        .order_by(Post.create_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return PostListResponse(total=total, items=results)

# like 자동완성 기능
@router.get("/posts/autocomplete" , response_model=List[str])
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
    return [r[0] for r in results if r[0]] # None 방지

# 카테고리별 게시글 조회
@router.get("/posts/by-subcategories", response_model=PostListResponse)
def posts_by_subcategories(
    subcategory_ids: List[int] = Query(...),
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    query = (
        db.query(Post)
        .join(PostCategory)
        .filter(PostCategory.category_id.in_(subcategory_ids))
        .order_by(Post.create_at.desc())
    )

    total = query.count()
    posts = query.offset(skip).limit(limit).all()

    return PostListResponse(total=total, items=posts)



# 좋아요 순으로 정렬
@router.get("/posts/by-likes", response_model=PostListResponse)
def list_posts(
    skip: int = 0,
    limit: int = 10,
    sort_by: str = "latest",  # or "likes"
    db: Session = Depends(get_db)
):
    query = db.query(Post)

    if sort_by == "likes":
        query = (
            query.outerjoin(Favorite)
            .group_by(Post.post_id)
            .order_by(func.count(Favorite.post_id).desc())
        )
    else:
        query = query.order_by(Post.create_at.desc())

    total = query.count()
    posts = query.offset(skip).limit(limit).all()
    return {"total": total, "items": posts}


# 게시글 단건 조회
@router.get("/posts/{post_id}", response_model=PostOut)
def read_post(post_id: int, db: Session = Depends(get_db)):
    # 👇 User와 JOIN해서 nickname 가져오기
    result = (
        db.query(Post, User.nickname)
        .join(User, Post.user_id == User.user_id)
        .filter(Post.post_id == post_id)
        .first()
    )

    if not result:
        raise HTTPException(status_code=404, detail="게시글이 존재하지 않습니다")

    post, nickname = result

    # 조회수 증가
    post.view_count += 1
    db.commit()
    db.refresh(post)

    # ✅ Pydantic PostOut에 맞춰 수동으로 딕셔너리 구성
    return {
        "post_id": post.post_id,
        "title": post.title,
        "content": post.content,
        "user_id": post.user_id,
        "nickname": nickname,  # ✅ 포함
        "create_at": post.create_at,
        "view_count": post.view_count,
        "thumbnail_path": post.thumbnail_path,
        "files": post.files,
        "subcategories": post.subcategories,
    }



# 게시글 수정
@router.put("/posts/{post_id}")
def update_post(
    post_id: int,
    title: str = Form(...),
    content: str = Form(...),
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

