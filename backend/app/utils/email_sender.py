import smtplib
from email.mime.text import MIMEText
import os

SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_POST = int(os.getenv("SMTP_POST", 587))

def send_verification_email(to_email: str, code: str):
    msg = MIMEText(f"인증코드: {code}")
    msg["Subject"] = "이메일 인증 코드"
    msg["From"] = SMTP_USER
    msg["To"] = to_email

    with smtplib.SMTP(SMTP_HOST, SMTP_POST) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(SMTP_USER, [to_email], msg.as_string())