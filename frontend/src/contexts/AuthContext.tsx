// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  nickname: string;
  user_id: number;
  email: string;
  role: string;
  level: string;
}
interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // ①: 컴포넌트 마운트 시 로컬 스토리지에서 유저 정보 읽어오기
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {}
    }
  }, []);

  // ②: 로그인 시 로컬 스토리지에 저장
  const login = (u: User) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };

  // ③: 로그아웃 시 로컬 스토리지에서 제거
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuth는 AuthProvider 안에서만 사용할 수 있습니다");
  return ctx;
}

export function decodeToken(token: string): {
  user_id: number;
  nickname: string;
  email: string;
  level: string;
} {
  const payloadBase64 = token.split(".")[1];
  const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  const decoded = JSON.parse(json);
  console.log(decoded);
  return {
    user_id: decoded.user_id,
    nickname: decoded.nickname,
    email: decoded.sub,
    role: decoded.role,
    level: decoded.level,
  };
}
