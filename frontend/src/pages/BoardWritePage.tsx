// src/pages/BoardWritePage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Input } from "../components/ui/Input.tsx";
import { Button } from "../components/ui/Button.tsx";
import URL from "../constants/url.js";
import { useAuth } from "../contexts/AuthContext.tsx";

export function BoardWritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [difficulty, setDifficulty] = useState("");
  const [purpose, setPurpose] = useState("");
  const [routeType, setRouteType] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();

  const categoryMap: { [key: string]: number } = {
    easy: 1,
    medium: 2,
    hard: 3,
    exercise: 4,
    relax: 5,
    sightseeing: 6,
    loop: 7,
    pointToPoint: 8,
    outAndBack: 9,
  };

  const getSubcategoryIds = (): number[] => {
    const ids: number[] = [];
    if (difficulty) ids.push(categoryMap[difficulty]);
    if (purpose) ids.push(categoryMap[purpose]);
    if (routeType) ids.push(categoryMap[routeType]);
    return ids;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 카테고리 최소 한 개 선택 확인
    const subIds = getSubcategoryIds();
    if (subIds.length === 0) {
      alert("최소 한 개의 카테고리를 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    subIds.forEach((id) => formData.append("subcategory_ids", id.toString()));

    if (image) {
      formData.append("files", image);
    }

    const token = localStorage.getItem("access_token");
    try {
      await axios.post(`${URL.BACKEND_URL}/api/posts`, formData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      navigate("/board");
    } catch (err) {
      console.error("게시글 작성 오류:", (err as any).response?.data || err);
      alert("게시글 작성에 실패했습니다. 입력값을 확인해주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-100 text-gray-800">
      <section className="bg-white/70 backdrop-blur-sm border-b border-green-200 shadow-inner py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-extrabold text-green-700 mb-2">
            게시글 작성
          </h1>
          <p className="text-gray-600">새로운 탐방로 후기를 공유해 보세요</p>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-green-50/90 backdrop-blur-sm border border-green-200 rounded-2xl shadow-xl p-8 space-y-6"
        >
          {/* 제목 */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              제목
            </label>
            <Input
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded-lg p-2 w-full"
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              내용
            </label>
            <textarea
              className="w-full border rounded-lg p-3 min-h-[200px]"
              placeholder="내용을 작성하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* 카테고리 선택 */}
          <div className="flex flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-md shadow-sm">
            <div className="flex items-center space-x-2">
              <label htmlFor="difficulty" className="text-gray-600">
                난이도:
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="border rounded p-2 bg-white"
              >
                <option value="">전체</option>
                <option value="easy">쉬움</option>
                <option value="medium">보통</option>
                <option value="hard">어려움</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="purpose" className="text-gray-600">
                목적:
              </label>
              <select
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="border rounded p-2 bg-white"
              >
                <option value="">전체</option>
                <option value="exercise">운동</option>
                <option value="relax">휴식</option>
                <option value="sightseeing">관광</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="routeType" className="text-gray-600">
                경로유형:
              </label>
              <select
                id="routeType"
                value={routeType}
                onChange={(e) => setRouteType(e.target.value)}
                className="border rounded p-2 bg-white"
              >
                <option value="">전체</option>
                <option value="loop">순환형</option>
                <option value="pointToPoint">지점간</option>
                <option value="outAndBack">왕복형</option>
              </select>
            </div>
          </div>

          {/* 사진 첨부 */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              사진 첨부 (선택)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-gray-500"
            />
            {image && (
              <p className="mt-2 text-sm text-gray-600">
                첨부된 파일: {image.name}
              </p>
            )}
          </div>

          {/* 버튼 그룹 */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/board")}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="bg-green-600 text-white hover:bg-green-700"
            >
              작성 완료
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
