import React from "react";
import { useAuth } from "../contexts/AuthContext.tsx";
import { Button } from "../components/ui/Button.tsx";
import { Card, CardContent } from "../components/ui/Card.tsx";
import { useNavigate } from "react-router-dom";

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-white bg-opacity-70 backdrop-blur-sm py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-extrabold text-green-700 mb-2">
            마이페이지
          </h1>
          <p className="text-gray-600">내 정보와 활동을 한눈에 확인해 보세요</p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        {/* 프로필 섹션 */}
        <section>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">내 프로필</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-500">닉네임</p>
                <p className="text-lg font-medium">{user?.nickname}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">이메일</p>
                <p className="text-lg font-medium">
                  {user?.email || "등록된 이메일 없음"}
                </p>
              </div>
            </div>
            <div className="flex mt-6 space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate("/profile/edit")}
              >
                프로필 수정
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                로그아웃
              </Button>
            </div>
          </div>
        </section>

        {/* 내가 작성한 후기 섹션 (예시) */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            내가 작성한 탐방로 후기
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 후기 카드 예시 - 실제 데이터로 대체하세요 */}
            {/*
            samplePosts.map(post => (
              <Card key={post.id} className="hover:shadow-xl transition transform hover:scale-105">
                <CardContent className="p-6">
                  <p className="text-sm text-gray-700">{post.preview}</p>
                  <Button variant="ghost" className="mt-4 text-xs" onClick={() => navigate(`/board/${post.id}`)}>
                    자세히 보기
                  </Button>
                </CardContent>
              </Card>
            ))
            */}
            <p className="text-gray-500 col-span-full text-center">
              작성한 후기가 없습니다.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
