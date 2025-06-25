from .user import User
from .user_profile import UserProfile
from .signup_token import SignupToken
from .post import Post, PostFile
from .comment import Comment
from .favorite import Favorite
from .post_views import PostWithAuthor, PostWithCategories

from .park import Park
from .trails import Trail
from .park_trails import ParkTrail
from .prediction_data import Prediction_Data

from .categories import Category  # ✅ 새로운 카테고리 정의
from .category_post import CategoryPost
from .category_park_trails import CategoryParkTrails
from .view_park_with_trails import ViewParkWithTrails


# 모델이 모두 ORM에 등록되어, 테이블 자동 생성이나 관계 탐색시 문제가 없어진다.