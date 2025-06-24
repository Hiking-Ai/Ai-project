from .user import User
from .post import Post, PostFile
from .signup_token import SignupToken
from .category import Category
from .post_category import PostCategory
from .comment import Comment
from .favorite import Favorite
from .subcategory import SubCategory
from .post_views import PostWithAuthor, PostWithCategories
from .park import Park
from .park_trails import ParkTrail
from .prediction_data import Prediction_Data
from .trails import Trail

# 모델이 모두 ORM에 등록되어, 테이블 자동 생성이나 관계 탐색시 문제가 없어진다.