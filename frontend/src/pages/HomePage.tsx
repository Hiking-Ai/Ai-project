import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button.tsx";
import { Card, CardContent } from "../components/ui/Card.tsx";
import { Input } from "../components/ui/Input.tsx";
import { Search, MapPin, CloudSun, Bus } from "lucide-react";

interface Post {
  id: number;
  preview: string;
}

const samplePosts: Post[] = [
  { id: 1, preview: "📍 북한산 둘레길 다녀왔어요! 가을 단풍 미쳤습니다 🍁" },
  { id: 2, preview: "📸 오대산 사진 후기 올려봅니다~ 경치 미쳤음" },
  { id: 3, preview: "🚶‍♀️ 초보자도 가능한 코스 찾았어요!" },
];

export function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-white bg-opacity-70 backdrop-blur-sm py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-4">
            나에게 딱 맞는 탐방로를 찾아보세요
          </h1>
          <p className="text-gray-600 mb-8">
            거리, 난이도, 풍경까지 원하는 조건으로 쉽고 빠르게 추천받으세요.
          </p>
          <div className="flex justify-center gap-3 max-w-lg mx-auto">
            <Input
              placeholder="예: 초보자용, 평지, 5km 이하"
              className="flex-1 shadow-md"
            />
            <Button
              variant="default"
              className="shadow-md hover:shadow-lg"
              onClick={() => {
                const query =
                  (document.querySelector("input") as HTMLInputElement)
                    ?.value || "";
                navigate(`/recommend?query=${encodeURIComponent(query)}`);
              }}
            >
              <Search className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        {/* 추천 카드 */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="group hover:shadow-xl transition transform hover:scale-105">
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

          <Card className="group hover:shadow-xl transition transform hover:scale-105">
            <CardContent className="flex flex-col items-center py-8">
              <Bus className="w-12 h-12 text-blue-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">교통 편의 추천</h2>
              <p className="text-gray-500 text-sm text-center">
                대중교통으로 쉽게 접근 가능한 탐방로를 알려드립니다.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition transform hover:scale-105">
            <CardContent className="flex flex-col items-center py-8">
              <MapPin className="w-12 h-12 text-green-600 mb-4" />
              <h2 className="text-xl font-semibold mb-2">내 주변 탐방로</h2>
              <p className="text-gray-500 text-sm text-center">
                현재 위치를 기반으로 한 맞춤형 탐방로를 추천해 드립니다.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 게시판 미리보기 */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {samplePosts.map((post) => (
              <Card
                key={post.id}
                className="hover:shadow-lg transition transform hover:scale-105"
              >
                <CardContent className="p-4">
                  <p className="text-sm text-gray-700">{post.preview}</p>
                  <Button
                    variant="ghost"
                    className="mt-4 text-xs"
                    onClick={() => navigate(`/board/${post.id}`)}
                  >
                    자세히 보기
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
