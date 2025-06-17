// src/components/modals/LoginModal.tsx
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { Input } from "../ui/Input.tsx";
import { Button } from "../ui/Button.tsx";

interface LoginModalProps {
  onClose: () => void;
  onRegisterClick: () => void;
}

// 테스트용 임시 크리덴셜
const TEMP_CREDENTIALS = {
  email: "test@example.com",
  password: "test1234",
  nickname: "테스트유저",
};

export function LoginModal({ onClose, onRegisterClick }: LoginModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setError(null);

    // ─────────────────────────────────────────────────────────
    // 아래 axios 호출은 임시 로그인 테스트용으로 주석 처리했습니다.
    // 실제 백엔드 연동 전까지는 TEMP_CREDENTIALS 로만 로그인 처리합니다.
    // ─────────────────────────────────────────────────────────

    /*
    // axios.post 호출 예시 ↓
    axios
      .post(
        "http://localhost:8000/api/login",
        new URLSearchParams({
          username: email,
          password: password,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      )
      .then((response) => {
        const { access_token, role } = response.data;
        localStorage.setItem("access_token", access_token);
        login({ nickname: email, role });
        alert("로그인 성공");
        onClose();
      })
      .catch((e) => {
        setError(e.response?.data?.detail || "로그인 실패");
      })
      .finally(() => setLoading(false));
    */

    // ─────────────────────────────────────────────────────────
    // 임시 크리덴셜 매칭 로직
    // ─────────────────────────────────────────────────────────
    setTimeout(() => {
      if (
        email === TEMP_CREDENTIALS.email &&
        password === TEMP_CREDENTIALS.password
      ) {
        // 로그인 성공 처리
        login({ nickname: TEMP_CREDENTIALS.nickname });
        alert("로그인 성공");
        onClose();
      } else {
        // 실패 시 에러 메시지
        setError("아이디 또는 비밀번호가 일치하지 않습니다.");
      }
      setLoading(false);
    }, 500); // 로딩 상태 체감을 위한 딜레이
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>

          <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>

          {error && (
            <p className="text-sm text-red-500 mb-4 text-center">{error}</p>
          )}

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div>
              <label className="block mb-1 text-sm font-medium">이메일</label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">비밀번호</label>
              <Input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            계정이 없으신가요?{" "}
            <button
              type="button"
              onClick={onRegisterClick}
              className="text-blue-500 hover:underline"
            >
              회원가입
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
