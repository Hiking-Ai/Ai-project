import pandas as pd
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.post_views import ViewPostCategory
from app.models.user import User
from app.models.post import Post
from sqlalchemy import or_, func
from app.models.favorite import Favorite
# from app.schemas.post_views import PostWithCategoryOut
from sqlalchemy import text
router = APIRouter()

@router.get("/view/posts-with-category/{post_id}")
def get_posts_with_category(post_id: int, db: Session = Depends(get_db)):
    # View Counts 업데이트
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


    # sql = text("""
    #     SELECT *
    #     FROM hiking_ai.view_post_categories
    #     WHERE post_id = :post_id
    #     """)
    # print(sql)
    # result = db.execute(sql, {"post_id": post_id})
    # rows = [dict(row._mapping) for row in result]
    # if not rows:
    #     raise HTTPException(status_code=404, detail="수정 없습니다.")
    # return rows
    sql = """
        SELECT *
          FROM hiking_ai.view_post_categories
         WHERE post_id = %(post_id)s
    """
    # pandas로 직접 읽기 (db.bind에 engine이 바인딩되어 있어야 합니다)
    df = pd.read_sql(sql, con=db.bind, params={"post_id": post_id})
    df = df.drop("category_id",axis=1)
    group_cols = [col for col in df.columns if col != "category_name"]
    # df_grouped = (
    #     df
    #     .groupby(group_cols)["category_name"]
    #     .apply(lambda names: ", ".join(names))
    #     .reset_index()
    # ).drop_duplicates()
    df["category_name"]=", ".join(df["category_name"].values)
    df_grouped = df.reset_index(drop=True).drop_duplicates()
    
    # print("df_groupeddf_groupeddf_groupeddf_grouped",df)
    sql = "SELECT post_id, COUNT(*) FROM hiking_ai.favorite WHERE post_id =  %(post_id)s"
    liked_df = pd.read_sql(sql, con=db.bind, params={"post_id": post_id})
    liked_df.columns = ["post_id","like_count"]
    if liked_df.like_count[0]==0:
        df_grouped["like_count"]=0
    else:
        df_grouped = pd.merge(df_grouped, liked_df, on="post_id")
    # likes_count = result.scalar() 
    print("likes_count",df_grouped)
    # print("df_grouped",df_grouped.columns)
    if df_grouped.empty:
        raise HTTPException(status_code=404, detail="해당 게시글의 카테고리가 없습니다.")
    return df_grouped.to_dict(orient="records")



