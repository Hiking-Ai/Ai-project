// src/components/modals/LoginModal.tsx
import React, { useState } from "react";
import axios from "axios";
import qs from "qs";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { Input } from "../ui/Input.tsx";
import { Button } from "../ui/Button.tsx";
import URL from "../../constants/url.js";
import { decodeToken } from "../../contexts/AuthContext.tsx"; // ✅ 토큰 디코더 임포트

interface LoginModalProps {
  onClose: () => void;
  onRegisterClick: () => void;
}

export function LoginModal({ onClose, onRegisterClick }: LoginModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${URL.BACKEND_URL}/api/login`,
        qs.stringify({
          username: email,
          password: password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { access_token } = response.data;

      // ✅ 1. 토큰 저장
      localStorage.setItem("access_token", access_token);

      // ✅ 2. 토큰 디코딩
      const user = decodeToken(access_token); // { user_id, nickname, email }

      // ✅ 3. AuthContext에 저장
      login(user);

      // ✅ 4. 닫기
      onClose();
    } catch (e: any) {
      setError(e.response?.data?.detail || "로그인 실패");
    } finally {
      setLoading(false);
    }
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
