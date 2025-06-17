from fastapi import APIRouter

router = APIRouter()

# 아직 미구현
@router.get("/recommend")
def get_recommendation():
    return 