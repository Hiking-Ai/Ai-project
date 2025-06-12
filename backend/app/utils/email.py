import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
EMIAL_USER = os.getenv("EMAIL_USER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

def send_verification_email(to_email: str, code: str):
    subject = "📧 이메일 인증 코드"
    body = f"인증 코드: {code}"

    msg = MIMEMultipart()
    msg["From"] = EMIAL_USER
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()
            server.login(EMIAL_USER, EMAIL_PASSWORD)
            server.send_message(msg)
            print(f"✅ 인증 코드가 {to_email}로 전송되었습니다.")
    except Exception as e:
        print("❌ 이메일 전송 실패:", e)
        raise