// src/pages/BoardPage.tsx
import React from "react";
import { Button } from "../components/ui/Button.tsx";

export function BoardPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📋 탐방로 후기 게시판</h1>
        <button>글쓰기</button>
      </div>

      <ul className="space-y-4">
        {/* 게시글 목록 예시 */}
        {[1, 2, 3].map((id) => (
          <li
            key={id}
            className="p-4 border rounded-xl shadow-sm bg-white hover:bg-gray-50 transition"
          >
            <a href={`/board/${id}`}>
              <h2 className="text-lg font-semibold mb-1">
                🏞️ 북한산 둘레길 후기 공유해요!
              </h2>
              <p className="text-sm text-gray-600">
                가을 풍경 너무 좋았어요~ 사진도 몇 장 첨부했어요. 초보자도
                가능한 코스!
              </p>
              <div className="text-xs text-gray-400 mt-2">
                2025.06.09 · 유저123
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
