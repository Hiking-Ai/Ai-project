from fastapi import APIRouter, Depends
from sqlalchemy import text
from app.db.session import get_db
from sqlalchemy.orm import Session

router = APIRouter()
@router.get("/trails")
def get_raw_trails(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT * FROM hiking_ai.view_park_with_trails;"))
    return [dict(row._mapping) for row in result]
