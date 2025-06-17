import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input.tsx";
import { Button } from "../components/ui/Button.tsx";

export function BoardWritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: FastAPI API 연결
    console.log("제목:", title);
    console.log("내용:", content);
    console.log("이미지:", image);
    navigate("/board");
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
