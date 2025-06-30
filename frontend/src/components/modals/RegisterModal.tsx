import React, { useState } from "react";
import axios from "axios";
import { Button } from "../ui/Button.tsx";
import { Input } from "../ui/Input.tsx";
import URL from "../../constants/url.js";

// 비밀번호 유효성 검사 함수
const validateLength = (pwd: string) => pwd.length >= 8;
const validateUpper = (pwd: string) => /[A-Z]/.test(pwd);
const validateLower = (pwd: string) => /[a-z]/.test(pwd);
const validateDigit = (pwd: string) => /\d/.test(pwd);
const validateSpecial = (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

export function RegisterModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [agreement, setAgreement] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [checkingNickname, setCheckingNickname] = useState(false);
  const [userName, setUserName] = useState(""); // 실명
  const [level, setLevel] = useState<"초급" | "중급" | "고급">("초급");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  // 2단계: 인증번호 요청
  const sendOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${URL.BACKEND_URL}/api/request-verification`, {
        email,
      });
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
      await axios.post(`${URL.BACKEND_URL}/api/verify-email`, {
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

  // 닉네임 중복 검사
  const checkNickname = async () => {
    setCheckingNickname(true);
    setNicknameError(null);
    try {
      const { data } = await axios.post(
        `${URL.BACKEND_URL}/api/check-nickname`,
        { nickname }
      );
      if (data.available) setNicknameChecked(true);
      else {
        setNicknameChecked(false);
        setNicknameError("이미 사용 중인 닉네임입니다.");
      }
    } catch {
      setNicknameChecked(false);
      setNicknameError("닉네임 확인 중 오류가 발생했습니다.");
    } finally {
      setCheckingNickname(false);
    }
  };

  // 5단계: 가입 완료
  const handleSignup = async () => {
    setLoading(true);
    setError(null);
    console.log("회원가입 정보:", {
      email,
      password,
      nickname,
      userName,
      level,
    });
    try {
      await axios.post(`${URL.BACKEND_URL}/api/signup`, {
        user_email: email,
        password,
        password_confirm: password,
        nickname,
        user_name: userName,
        user_level: level,
      });
      alert("회원가입이 완료되었습니다!");
      onClose();
    } catch (e: any) {
      setError(e.response?.data?.detail || "회원가입 실패");
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
              <Input
                type="password"
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-2"
              />
              <div className="mt-3">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={validateLength(password)}
                    readOnly
                    className="mr-2"
                  />
                  8자 이상
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={validateUpper(password)}
                    readOnly
                    className="mr-2"
                  />
                  대문자 포함
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={validateLower(password)}
                    readOnly
                    className="mr-2"
                  />
                  소문자 포함
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={validateDigit(password)}
                    readOnly
                    className="mr-2"
                  />
                  숫자 포함
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={validateSpecial(password)}
                    readOnly
                    className="mr-2"
                  />
                  특수문자 포함
                </label>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-sm text-red-500 mt-2">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </>
          )}

          {/* 5. 닉네임 & 실명 & 레벨 설정 */}
          {step === 5 && (
            <>
              <h2 className="text-lg font-bold mb-2">프로필 정보</h2>
              <div className="flex items-center mb-2">
                <Input
                  type="text"
                  placeholder="닉네임을 입력하세요"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setNicknameChecked(false);
                    setNicknameError(null);
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={checkNickname}
                  disabled={!nickname || checkingNickname}
                  className="ml-2"
                >
                  {checkingNickname ? "확인 중…" : "중복 확인"}
                </Button>
              </div>
              {nicknameError && (
                <p className="text-sm text-red-500 mb-2">{nicknameError}</p>
              )}
              {nicknameChecked && (
                <p className="text-sm text-green-500 mb-2">
                  사용 가능한 닉네임입니다.
                </p>
              )}
              <Input
                type="text"
                placeholder="실명을 입력하세요"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="mb-2"
              />
              <label className="block mb-1 text-sm font-medium text-gray-700">
                나의 레벨 (마이페이지에서 언제든 변경 가능)
              </label>
              <select
                value={level}
                onChange={(e) =>
                  setLevel(e.target.value as "초급" | "중급" | "고급")
                }
                className="w-full border rounded-lg p-2 mb-1"
              >
                <option value="초급">초급</option>
                <option value="중급">중급</option>
                <option value="고급">고급</option>
              </select>
              <p className="text-xs text-gray-500">
                ※ 레벨 테스트도 제공됩니다.
              </p>
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
                  (step === 3 && !isEmailVerified) ||
                  (step === 4 &&
                    (!validateLength(password) ||
                      !validateUpper(password) ||
                      !validateLower(password) ||
                      !validateDigit(password) ||
                      !validateSpecial(password) ||
                      password !== confirmPassword))
                }
              >
                다음
              </Button>
            ) : (
              <Button
                onClick={handleSignup}
                disabled={loading || !nickname || !nicknameChecked || !userName}
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
