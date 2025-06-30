from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # 보안 및 데이터 베이스
    secret_key: str
    database_url: str

    # api 키
    kma_api_key: Optional[str] = None
    vite_gemini_api_key: Optional[str] = None

    # 이메일 설정 (기본 이메일 인증용)
    email_host: str
    email_port: int
    email_user: str
    email_password: str

    # FastAPI-Mail 사용 시
    mail_username: str
    mail_password: str
    mail_from: str
    mail_from_name: str
    mail_server: str
    mail_port: int
    mail_starttls: bool
    mail_ssl_tls: bool
    use_credentials: bool
    validate_certs: bool

    class Config:
        env_file = ".env"

settings = Settings()