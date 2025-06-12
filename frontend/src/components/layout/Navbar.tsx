// src/components/layout/Navbar.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LoginModal } from "../modals/LoginModal.tsx";
import { RegisterModal } from "../modals/RegisterModal.tsx";

export function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const switchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white shadow-lg backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Trail Finder Logo"
              className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-full"
            />
          </Link>
          <Link
            to="/"
            className="text-3xl md:text-4xl font-extrabold text-green-600 hover:text-green-700 transition-colors"
          >
            탐방로 추천
          </Link>
          <nav className="flex space-x-8 text-lg font-medium text-gray-700">
            <Link to="/recommend" className="hover:text-green-600">
              탐방로 추천
            </Link>
            <Link to="/board" className="hover:text-green-600">
              게시판
            </Link>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="hover:text-green-600"
            >
              로그인
            </button>
          </nav>
        </div>
      </header>

      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
          onRegisterClick={switchToRegister}
        />
      )}

      {isRegisterOpen && (
        <RegisterModal onClose={() => setIsRegisterOpen(false)} />
      )}
    </>
  );
}
