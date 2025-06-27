// src/components/layout/Navbar.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  BookOpen,
  AlignJustify,
  X,
  User,
  LogOut,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { LoginModal } from "../modals/LoginModal.tsx";
import { RegisterModal } from "../modals/RegisterModal.tsx";

// ✅ 로고 이미지들
import logo from "../../assets/logo.png";
import logo2 from "../../assets/logo2.png";

export function Navbar() {
  const [collapsed, setCollapsed] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const switchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const menuItems = [
    { icon: <Home />, label: "홈", path: "/" },
    { icon: <Search />, label: "탐방로 찾기", path: "/recommend" },
    { icon: <BookOpen />, label: "게시판", path: "/board" },
  ];

  const btnClass = `flex items-center p-3 hover:bg-gray-100 cursor-pointer transition ${
    collapsed ? "justify-center" : "gap-4 pl-4"
  }`;
  const loginClass = `flex items-center p-3 hover:bg-gray-100 cursor-pointer transition ${
    collapsed ? "justify-center" : "gap-2 pl-4"
  }`;

  return (
    <>
      <div className="flex min-h-screen">
        <motion.aside
          initial={{ width: collapsed ? 80 : 240 }}
          animate={{ width: collapsed ? 80 : 240 }}
          transition={{ duration: 0.3 }}
          className="top-0 left-0 h-full bg-white shadow-lg flex flex-col justify-between z-50"
          style={{ minHeight: "100%" }}
        >
          {/* ✅ 상단: 로고 + 토글 + 메뉴 */}
          <div className="flex flex-col flex-none">
            {/* 로고 + 토글 */}
            <div className="flex items-center justify-between p-4">
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="로고"
                  className={`transition-all ${
                    collapsed ? "h-8 mx-auto" : "h-10"
                  }`}
                />
              </Link>
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="flex items-center justify-center p-3 hover:bg-gray-100 transition"
              >
                {collapsed ? (
                  <AlignJustify
                    size={24}
                    strokeWidth={2}
                    className="text-gray-700"
                  />
                ) : (
                  <X size={24} strokeWidth={2} className="text-gray-700" />
                )}
              </button>
            </div>

            {/* 메뉴 */}
            <nav className="flex flex-col">
              {menuItems.map(({ icon, label, path }) => (
                <div
                  key={path}
                  onClick={() => navigate(path)}
                  className={btnClass}
                >
                  <div className="flex-shrink-0">
                    {React.cloneElement(icon, {
                      size: 24,
                      strokeWidth: 2,
                      className: "text-gray-700",
                    })}
                  </div>
                  {!collapsed && (
                    <span className="text-gray-800 flex-grow">{label}</span>
                  )}
                </div>
              ))}

              {/* 관리자 메뉴 */}
              {user?.role === "ADMIN" && (
                <div onClick={() => navigate("/admin")} className={btnClass}>
                  <Shield
                    size={24}
                    strokeWidth={2}
                    className="text-gray-700 flex-shrink-0"
                  />
                  {!collapsed && (
                    <span className="text-gray-800 flex-grow">관리자</span>
                  )}
                </div>
              )}
            </nav>
          </div>

          {/* ✅ 하단: 로그인/로그아웃 + 하단 로고 */}
          <div className="mt-auto border-t">
            {/* 로그인/로그아웃 */}
            {user ? (
              <>
                <div onClick={() => navigate("/profile")} className={btnClass}>
                  <User
                    size={24}
                    strokeWidth={2}
                    className="text-gray-700 flex-shrink-0"
                  />
                  {!collapsed && (
                    <span className="text-gray-800 flex-grow">마이페이지</span>
                  )}
                </div>
                <div
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className={btnClass}
                >
                  <LogOut
                    size={24}
                    strokeWidth={2}
                    className="text-gray-700 flex-shrink-0"
                  />
                  {!collapsed && (
                    <span className="text-gray-800 flex-grow">로그아웃</span>
                  )}
                </div>
              </>
            ) : (
              <div onClick={() => setIsLoginOpen(true)} className={loginClass}>
                <User
                  size={24}
                  strokeWidth={2}
                  className="text-gray-700 flex-shrink-0"
                />
                {!collapsed && (
                  <span className="text-gray-800 flex-grow">로그인</span>
                )}
              </div>
            )}

            {/* 하단 로고 */}
            <div className="p-4">
              <img
                src={logo2}
                alt="하단 로고"
                className={`transition-all opacity-80 ${
                  collapsed ? "h-8 mx-auto" : "h-10"
                }`}
              />
            </div>
          </div>
        </motion.aside>

        {/* 로그인/회원가입 모달 */}
        {isLoginOpen && (
          <LoginModal
            onClose={() => setIsLoginOpen(false)}
            onRegisterClick={switchToRegister}
          />
        )}
        {isRegisterOpen && (
          <RegisterModal onClose={() => setIsRegisterOpen(false)} />
        )}
      </div>
    </>
  );
}
