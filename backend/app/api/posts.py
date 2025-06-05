from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, security
from sqlalchemy.orm import Session
from typing import List, Optional
import os, shutil, uuid

from app.models.post import Post, PostFile
from app.db.session import get_db
from app.utils.deps import get_current_user
from app.models.user import User
from app.schemas.post import PostOut  # PostOut은 실제 schema에 맞게 조정해주세요

router = APIRouter()

UPLOAD_DIR = "uploads/"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/")
def create_post(
    title: str = Form(...),
    content: str = Form(...),
    files: Optional[List[UploadFile]] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # ✅ 여기에 꼭 포함!
):
    new_post = Post(
        title=title,
        content=content,
        user_email=current_user.user_email
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    uploaded_files = []

    if files:
        for file in files:
            ext = file.filename.split(".")[-1]
            new_name = f"{uuid.uuid4()}.{ext}"
            file_path = os.path.join(UPLOAD_DIR, new_name)

            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            post_file = PostFile(
                post_id=new_post.post_id,
                original_file_name=file.filename,
                stored_path=file_path,
                file_type=file.content_type,
            )
            db.add(post_file)
            uploaded_files.append({
                "original_file_name": file.filename,
                "stored_path": file_path,
                "file_type": file.content_type,
            })

    db.commit()

    return {
        "post_id": new_post.post_id,
        "title": new_post.title,
        "content": new_post.content,
        "user_email": new_post.user_email,
        "view_count": new_post.view_count,
        "created_at": str(new_post.created_at),
        "files": uploaded_files,
    }



@router.get("/posts")
def list_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).all()
    return posts


@router.get("/posts/{post_id}")
def read_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.post_id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시글이 존재하지 않습니다")
    post.view_count += 1
    db.commit()
    return post


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
    if post.user_email != current_user.user_email:
        raise HTTPException(status_code=403, detail="수정 권한이 없습니다.")
    post.title = title
    post.content = content
    db.commit()
    return {"message": "게시글이 수정되었습니다."}


@router.delete("/posts/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(Post).filter(Post.post_id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시글이 없습니다.")
    if post.user_email != current_user.user_email:
        raise HTTPException(status_code=403, detail="삭제 권한이 없습니다.")

    for f in post.files:
        if os.path.exists(f.stored_path):
            os.remove(f.stored_path)
        db.delete(f)

    db.delete(post)
    db.commit()
    return {"message": "게시글이 삭제되었습니다."}
