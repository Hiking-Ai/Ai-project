import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input.tsx";
import { Button } from "../components/ui/Button.tsx";

export function ProfileEditPage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState(user?.nickname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [level, setLevel] = useState(user?.level || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname);
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 비밀번호 확인
    if (newPassword && newPassword !== confirmPassword) {
      setError("새 비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    try {
      // TODO: 실제 API 요청 처리
      // await api.updateProfile({ nickname, email, currentPassword, newPassword });
      setUser({ ...user, nickname, email }); // 비밀번호는 저장 안함
      navigate("/profile");
    } catch (err: any) {
      setError(err.message || "프로필 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
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

      <main className="max-w-2xl mx-auto px-4 py-12">
        <form
          className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
          onSubmit={handleSubmit}
        >
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <label className="block mb-1 text-sm font-medium">닉네임</label>
            <Input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">이메일</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>

          <hr className="border-gray-200 my-4" />

          <div>
            <label className="block mb-1 text-sm font-medium">
              현재 비밀번호
            </label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="현재 비밀번호 입력"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              새 비밀번호
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새 비밀번호"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              새 비밀번호 확인
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="새 비밀번호 확인"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/profile")}
              disabled={loading}
            >
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "저장 중..." : "저장하기"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
