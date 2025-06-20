import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Input } from "../components/ui/Input.tsx";
import { Button } from "../components/ui/Button.tsx";
import URL from "../constants/url.js";
import { useAuth } from "../contexts/AuthContext.tsx";

const createPost = async (
  title: string,
  content: string,
  subcategory_ids: number[],
  files: File[] // input[type=file]로부터
) => {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("content", content);
  console.log("subcategory_ids", subcategory_ids);
  // ✅ 리스트는 하나씩 append해야 FastAPI에서 List[int]로 인식함
  subcategory_ids.forEach((id) => {
    formData.append("subcategory_ids", id.toString());
  });

  // ✅ 파일도 여러 개 있을 수 있음
  files.forEach((file) => {
    formData.append("files", file); // name은 FastAPI 쪽 변수명
  });

  try {
    const token = localStorage.getItem("access_token");
    console.log("토큰:", token);
    // 토큰이 없으면 에러 처리
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }
    const res = await axios.post(`${URL.BACKEND_URL}/api/posts`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // 만약 토큰 기반 인증을 사용한다면
      },
      withCredentials: true, // 로그인 쿠키 사용할 경우 필요
    });

    return res;
  } catch (err) {
    alert("게시글 생성에 실패했습니다. 다시 시도해주세요.");
  }
};

export function BoardWritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("user_id", user.user_id.toString()); // ✅ 백엔드에서 get_current_user 안 쓰는 경우
    formData.append("nickname", user.nickname); // 필요 시 백엔드 모델에 맞게 사용

    [3].forEach((id) => formData.append("subcategory_ids", id.toString()));
    if (image) formData.append("files", image);

    const token = localStorage.getItem("access_token");
    const res = await axios.post(`${URL.BACKEND_URL}/api/posts`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    if (res?.status === 200) navigate("/board");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-100 text-gray-800">
      {/* Hero Section */}
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
              className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              내용
            </label>
            <textarea
              className="w-full border rounded-lg p-3 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="내용을 작성하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
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

          {/* 액션 버튼 */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => navigate("/board")}>
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
