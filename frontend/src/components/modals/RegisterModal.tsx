// src/components/modals/RegisterModal.tsx
import React, { useState } from "react";
import axios from "axios";
import { Button } from "../ui/Button.tsx";
import { Input } from "../ui/Input.tsx";

export function RegisterModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);

  const [agreement, setAgreement] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  // 2단계: 인증번호 요청
  const sendOtp = async () => {
    setLoading(true);
    setError(null);
    console.log(email);
    try {
      // FastAPI가 email을 쿼리파라미터로 받도록 정의되어 있으니
      const results = await axios.post(
        `http://localhost:8000/api/request-verification`,
        {
          email: email,
        }
      );
      next();
    } catch (e: any) {
      setError(e.response?.data?.detail || "인증번호 전송 실패");
    } finally {
      setLoading(false);
    }
  };

  // 3단계: 인증번호 검증
  const verifyOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post("http://localhost:8000/api/verify-code", {
        email,
        code: otp,
      });

      setIsEmailVerified(true);
      next();
    } catch (e: any) {
      setError(e.response?.data?.detail || "인증 실패");
    } finally {
      setLoading(false);
    }
  };

  // 비밀번호 강도 계산
  const calcStrength = (pwd: string) => {
    if (pwd.length > 8 && /[A-Z]/.test(pwd) && /\d/.test(pwd)) return "강함";
    if (pwd.length >= 6) return "보통";
    return "약함";
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>

          {/* 진행 바 */}
          <div className="flex mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`flex-1 h-1 mx-1 rounded ${
                  step >= i ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-500 mb-2 text-center">{error}</p>
          )}

          {/* 1. 약관 동의 */}
          {step === 1 && (
            <>
              <h2 className="text-lg font-bold mb-2">약관 동의</h2>
              <div className="h-32 overflow-auto border p-2 mb-2">
                이용약관…
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={agreement}
                  onChange={() => setAgreement((a) => !a)}
                  className="mr-2"
                />
                모두 동의합니다.
              </label>
            </>
          )}

          {/* 2. 이메일 입력 & 전송 */}
          {step === 2 && (
            <>
              <h2 className="text-lg font-bold mb-2">이메일 입력</h2>
              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                className="mt-4"
                onClick={sendOtp}
                disabled={!email || loading}
              >
                {loading ? "전송 중…" : "인증번호 받기"}
              </Button>
            </>
          )}

          {/* 3. 인증번호 입력 & 검증 */}
          {step === 3 && (
            <>
              <h2 className="text-lg font-bold mb-2">이메일 인증</h2>
              <Input
                type="text"
                placeholder="인증번호 입력"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button
                className="mt-4"
                onClick={verifyOtp}
                disabled={!otp || loading}
              >
                {loading ? "검증 중…" : "인증하기"}
              </Button>
            </>
          )}

          {/* 4. 비밀번호 설정 */}
          {step === 4 && (
            <>
              <h2 className="text-lg font-bold mb-2">비밀번호 설정</h2>
              <Input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-sm mt-1">
                강도:{" "}
                <span className="font-bold">{calcStrength(password)}</span>
              </p>
            </>
          )}

          {/* 5. 닉네임 설정 */}
          {step === 5 && (
            <>
              <h2 className="text-lg font-bold mb-2">닉네임 설정</h2>
              <Input
                type="text"
                placeholder="닉네임을 입력하세요"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </>
          )}

          {/* 네비게이션 */}
          <div className="flex justify-between mt-6">
            <Button onClick={back} disabled={step === 1 || loading}>
              뒤로
            </Button>
            {step < 5 ? (
              <Button
                onClick={next}
                disabled={
                  loading ||
                  (step === 1 && !agreement) ||
                  (step === 2 && !email) ||
                  (step === 3 && !isEmailVerified)
                }
              >
                다음
              </Button>
            ) : (
              <Button
                onClick={() => {
                  // TODO: 가입 완료 API 호출
                }}
                disabled={!nickname || loading}
              >
                가입 완료
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
