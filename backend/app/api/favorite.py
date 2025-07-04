from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.favorite import Favorite
from app.models.user import User
from app.utils.deps import get_current_user
from sqlalchemy import text
import pandas as pd
router = APIRouter()

# 좋아요 기능 토글
@router.post("/posts/{post_id}/favorite-toggle")
def toggle_favorite(
    post_id: int,
    # user_id:int=Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # user_id = current_user.user_id
    # sql = """
    # SELECT *
    #     FROM hiking_ai.favorite
    #     WHERE post_id = %(post_id)s and user_id = %(user_id)s
    # """
    # print("sql",sql)
    # df = pd.read_sql(sql, con=db.bind, params={"post_id": post_id,"user_id":user_id})
    # print("df",df.shape[0])
    # like_status = df.shape[0]==1
    favorite = db.query(Favorite).filter_by(post_id=post_id, user_id=current_user.user_id).first()
    print(1)
    if favorite:
        db.delete(favorite)
        db.commit()
        print(2)
        sql = "SELECT post_id, COUNT(*) FROM hiking_ai.favorite WHERE post_id =  %(post_id)s"
        liked_df = pd.read_sql(sql, con=db.bind, params={"post_id": post_id})
        liked_df.columns = ["post_id","like_count"]
        print("liked_df",int(liked_df.like_count))
        return {"message": "좋아요 취소됨", "status": "unliked","like_count":int(liked_df.like_count)}
    else:
        new_fav = Favorite(post_id=post_id, user_id=current_user.user_id)
        db.add(new_fav)
        db.commit()
        print(2)

        sql = "SELECT post_id, COUNT(*) FROM hiking_ai.favorite WHERE post_id =  %(post_id)s"
        liked_df = pd.read_sql(sql, con=db.bind, params={"post_id": post_id})
        liked_df.columns = ["post_id","like_count"]
        print("liked_df",int(liked_df.like_count))
        return {"message": "좋아요 완료", "status": "liked","like_count":int(liked_df.like_count)}
    # 카운트 수

@router.post("/posts/{post_id}/load-favorite-toggle")
def load_favorite(
    post_id: int,
    # user_id:int=Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    favorite = db.query(Favorite).filter_by(post_id=post_id, user_id=current_user.user_id).first()
    if favorite:
        return {"message": "좋아요 비활성화", "status": "liked"}
    else:
        new_fav = Favorite(post_id=post_id, user_id=current_user.user_id)
        return {"message": "좋아요 활성화", "status": "unliked"}