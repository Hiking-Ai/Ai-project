from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.comment import Comment
from app.models.user import User, UserRole
from app.schemas.comment import CommentCreate, CommentOut
from app.utils.deps import get_current_user, get_db

router = APIRouter()


# ✅ 댓글 작성 - 로그인 사용자만
@router.post("/posts/{post_id}/comments", response_model=CommentOut)
def create_comment(
    post_id: int,
    payload: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comment = Comment(
        comment_text=payload.comment_text,
        user_id=current_user.user_id,
        post_id=post_id
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


# ✅ 댓글 조회 - 누구나
@router.get("/posts/{post_id}/comments", response_model=list[CommentOut])
def get_comments(post_id: int, db: Session = Depends(get_db)):
    return db.query(Comment).filter(Comment.post_id == post_id)\
             .order_by(Comment.create_at.desc()).all()


# ✅ 댓글 수정 - 작성자만
@router.put("/comments/{comment_id}", response_model=CommentOut)
def update_comment(
    comment_id: int,
    payload: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comment = db.query(Comment).filter(Comment.comment_id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="댓글이 존재하지 않습니다.")
    if comment.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="수정 권한이 없습니다.")

    comment.comment_text = payload.comment_text
    db.commit()
    db.refresh(comment)
    return comment


# ✅ 댓글 삭제 - 작성자 또는 관리자
@router.delete("/comments/{comment_id}")
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comment = db.query(Comment).filter(Comment.comment_id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="댓글이 존재하지 않습니다.")

    if current_user.role != UserRole.ADMIN and comment.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="삭제 권한이 없습니다.")

    db.delete(comment)
    db.commit()
    return {"message": "댓글이 삭제되었습니다."}
