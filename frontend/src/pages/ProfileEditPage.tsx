import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input.tsx";
import { Button } from "../components/ui/Button.tsx";
import URL from "../constants/url.js";

// 에러 메시지 추출 헬퍼
const extractErrorMessage = (detail: any): string =>
  Array.isArray(detail)
    ? detail.map((d) => d.msg).join(", ")
    : typeof detail === "string"
    ? detail
    : JSON.stringify(detail);

export function ProfileEditPage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // 이메일
  const [email, setEmail] = useState(user?.email || "");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);

  // 레벨
  const [level, setLevel] = useState(user?.level || "초급");
  const [levelLoading, setLevelLoading] = useState(false);
  const [levelError, setLevelError] = useState<string | null>(null);
  const [levelSuccess, setLevelSuccess] = useState<string | null>(null);

  // 비밀번호 변경
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setLevel(user.level || "초급");
    }
  }, [user]);

  // 공통 요청 설정
  const requestConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };

  // 이메일 업데이트
  const handleEmailUpdate = async () => {
    setEmailLoading(true);
    setEmailError(null);
    setEmailSuccess(null);

    if (email === user?.email) {
      setEmailError("변경된 이메일을 입력하세요.");
    } else {
      try {
        await axios.patch(
          `${URL.BACKEND_URL}/api/profile`,
          { user_email: email },
          requestConfig
        );
        setUser({ ...user, email });
        setEmailSuccess("이메일이 업데이트되었습니다.");
      } catch (e: any) {
        const detail = e.response?.data?.detail;
        setEmailError(extractErrorMessage(detail));
      }
    }

    setEmailLoading(false);
  };

  // 레벨 업데이트
  const handleLevelUpdate = async () => {
    setLevelLoading(true);
    setLevelError(null);
    setLevelSuccess(null);

    if (level === user?.level) {
      setLevelError("변경할 레벨을 선택하세요.");
    } else {
      try {
        await axios.patch(
          `${URL.BACKEND_URL}/api/profile`,
          { level },
          requestConfig
        );
        setUser({ ...user, level });
        setLevelSuccess("레벨이 업데이트되었습니다.");
      } catch (e: any) {
        const detail = e.response?.data?.detail;
        setLevelError(extractErrorMessage(detail));
      }
    }

    setLevelLoading(false);
  };

  // 비밀번호 업데이트
  const handlePasswordUpdate = async () => {
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword || !newPassword) {
      setPasswordError("모든 비밀번호 필드를 입력하세요.");
    } else if (newPassword !== confirmPassword) {
      setPasswordError("새 비밀번호가 일치하지 않습니다.");
    } else {
      try {
        await axios.patch(
          `${URL.BACKEND_URL}/api/profile`,
          {
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirm: confirmPassword,
            level: level,
          },
          requestConfig
        );

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordSuccess("비밀번호가 변경되었습니다.");
      } catch (e: any) {
        const detail = e.response?.data?.detail;
        setPasswordError(extractErrorMessage(detail));
      }
    }

    setPasswordLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-white bg-opacity-70 backdrop-blur-sm py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-extrabold text-green-700 mb-2">
            프로필 수정
          </h1>
          <p className="text-gray-600">계정 정보를 업데이트하세요</p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 이메일 변경 섹션 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-bold">이메일 변경</h2>
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            {emailSuccess && (
              <p className="text-green-500 text-sm">{emailSuccess}</p>
            )}
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
            <Button
              className="w-full"
              onClick={handleEmailUpdate}
              disabled={emailLoading}
            >
              {emailLoading ? "업데이트 중..." : "이메일 업데이트"}
            </Button>
          </div>

          {/* 레벨 변경 섹션 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-bold">레벨 변경</h2>
            {levelError && <p className="text-red-500 text-sm">{levelError}</p>}
            {levelSuccess && (
              <p className="text-green-500 text-sm">{levelSuccess}</p>
            )}
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="초급">초급</option>
              <option value="중급">중급</option>
              <option value="고급">고급</option>
            </select>
            <Button
              className="w-full"
              onClick={handleLevelUpdate}
              disabled={levelLoading}
            >
              {levelLoading ? "업데이트 중..." : "레벨 업데이트"}
            </Button>
          </div>

          {/* 비밀번호 변경 섹션 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-bold">비밀번호 변경</h2>
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
            {passwordSuccess && (
              <p className="text-green-500 text-sm">{passwordSuccess}</p>
            )}
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="현재 비밀번호 입력"
            />
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새 비밀번호"
            />
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="새 비밀번호 확인"
            />
            <Button
              className="w-full"
              onClick={handlePasswordUpdate}
              disabled={passwordLoading}
            >
              {passwordLoading ? "업데이트 중..." : "비밀번호 변경"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
