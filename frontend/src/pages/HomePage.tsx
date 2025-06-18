// src/pages/HomePage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button.tsx";
import { Card, CardContent } from "../components/ui/Card.tsx";
import { MapPin, CloudSun } from "lucide-react";

// ✅ 로고 이미지 import
import logo from "../assets/logo.png";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-white/70 backdrop-blur-sm py-16 overflow-hidden">
        <img
          src={logo}
          alt="배경 로고"
          className="absolute top-8 left-1/2 -translate-x-1/2 w-[300px] opacity-10 pointer-events-none select-none"
        />
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-4">
            오늘의 추천 탐방로 보기
          </h1>
          <p className="text-gray-600 mb-8">
            날씨와 위치를 기반으로 최적의 코스를 제공합니다.
          </p>
          <div className="flex justify-center">
            <Button
              variant="default"
              className="shadow-md hover:shadow-lg"
              onClick={() => navigate("/recommend")}
            >
              추천 시작하기
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content: Left Cards & Right Posts */}
      <main className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Two vertical cards */}
        <div className="flex flex-col gap-8">
          <Card className="hover:shadow-xl transition transform hover:scale-105">
            <CardContent className="flex flex-col items-center py-8">
              <CloudSun className="w-12 h-12 text-yellow-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                오늘의 날씨 기반 추천
              </h2>
              <p className="text-gray-500 text-sm text-center">
                맑은 날씨에 맞춘 걷기 좋은 코스를 제안해 드려요.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition transform hover:scale-105">
            <CardContent className="flex flex-col items-center py-8">
              <MapPin className="w-12 h-12 text-green-600 mb-4" />
              <h2 className="text-xl font-semibold mb-2">내 주변 탐방로</h2>
              <p className="text-gray-500 text-sm text-center">
                현재 위치를 기반으로 한 맞춤형 탐방로를 추천해 드립니다.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right: Long vertical posts section */}
        <section className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">탐방로 후기</h2>
            <Button
              variant="outline"
              className="text-sm"
              onClick={() => navigate("/board")}
            >
              전체 보기
            </Button>
          </div>
          <div className="space-y-4">
            {[
              "📍 북한산 둘레길 다녀왔어요! 가을 단풍 미쳤습니다 🍁",
              "📸 오대산 사진 후기 올려봅니다~ 경치 미쳤음",
              "🚶‍♀️ 초보자도 가능한 코스 찾았어요!",
            ].map((preview, idx) => (
              <Card
                key={idx}
                className="hover:shadow-lg transition transform hover:scale-105"
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <p className="text-sm text-gray-700 flex-1">{preview}</p>
                  <Button
                    variant="ghost"
                    className="ml-4 text-xs"
                    onClick={() => navigate(`/board/${idx + 1}`)}
                  >
                    자세히
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-gray-600">
          <p className="text-sm">© 2025 탐방로 추천 서비스</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Button
              variant="link"
              className="text-sm p-0 hover:underline"
              onClick={() => navigate("/info")}
            >
              회사 소개
            </Button>
            <Button
              variant="link"
              className="text-sm p-0 hover:underline"
              onClick={() => navigate("/info")}
            >
              이용 약관
            </Button>
            <Button
              variant="link"
              className="text-sm p-0 hover:underline"
              onClick={() => navigate("/info")}
            >
              개인정보처리방침
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
