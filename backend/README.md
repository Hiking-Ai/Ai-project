# 🛠️ Backend - FastAPI

본 디렉토리는 탐방로 추천 서비스의 백엔드(API 서버)입니다.  
FastAPI를 기반으로 RESTful API를 제공하며, 프론트엔드/AI 모듈과 연동됩니다.

---

## 📁 디렉토리 구조

```
app/
├── main.py                # FastAPI 앱 실행 엔트리포인트
├── api/                   # API 라우터 (엔드포인트)
│   ├── users.py           # 회원가입/로그인
│   ├── recommend.py       # 추천 API
│   ├── courses.py         # 탐방로 정보
│   └── alerts.py          # 실시간 기상 알림
├── models/                # SQLAlchemy ORM 모델 정의
├── schemas/               # Pydantic 요청/응답 데이터 정의
├── services/              # 비즈니스 로직 (알림 처리 등)
├── utils/                 # 유틸 함수, 설정, 인증 등
└── db/                    # DB 연결 및 세션 관리
```

---

## 📦 주요 모듈 및 라이브러리

| 라이브러리        | 역할                        |
| ----------------- | --------------------------- |
| `fastapi`         | 웹 프레임워크 (API 서버)    |
| `uvicorn`         | FastAPI 실행 서버           |
| `pydantic`        | 데이터 검증 및 직렬화       |
| `sqlalchemy`      | ORM (데이터베이스 연동)     |
| `python-jose`     | JWT 인증 토큰 생성          |
| `passlib[bcrypt]` | 비밀번호 암호화             |
| `requests`        | 외부 API (기상청 등) 호출용 |
| `dotenv`          | 환경변수 관리 (`.env` 파일) |

---

## 🚀 실행 방법

```bash
# 가상환경 생성
python -m venv venv
source venv/bin/activate  # (Windows: venv\Scripts\activate)

# 패키지 설치
pip install -r requirements.txt

# 서버 실행
uvicorn app.main:app --reload
```

---

## 📮 주요 API 목록 (예시)

| 메서드 | 경로             | 설명                      |
| ------ | ---------------- | ------------------------- |
| GET    | `/ping`          | 서버 상태 확인용 헬스체크 |
| POST   | `/api/signup`    | 회원가입                  |
| POST   | `/api/login`     | 로그인 및 JWT 발급        |
| POST   | `/api/recommend` | 탐방로 추천 요청          |
| GET    | `/api/alerts`    | 사용자 알림 확인          |

---

## 🗃️ 환경변수 예시 (`.env`)

```
SECRET_KEY=your_jwt_secret
DATABASE_URL=sqlite:///./test.db
KMA_API_KEY=기상청_발급_키
```

---

## 👤 작성자 / 담당자

- 백엔드 담당: 홍길동 (@hongdev)
