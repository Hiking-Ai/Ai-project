import pandas as pd
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.post_views import ViewPostCategory
# from app.schemas.post_views import PostWithCategoryOut
from sqlalchemy import text

router = APIRouter()

@router.get("/view/posts-with-category/{post_id}")
def get_posts_with_category(post_id: int, db: Session = Depends(get_db)):
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
    df_grouped = (
        df
        .groupby(group_cols)["category_name"]
        .apply(lambda names: ", ".join(names))
        .reset_index()
    ).drop_duplicates()
    # print("df_grouped",df_grouped.shape)
    if df_grouped.empty:
        raise HTTPException(status_code=404, detail="해당 게시글의 카테고리가 없습니다.")
    return df_grouped.to_dict(orient="records")



