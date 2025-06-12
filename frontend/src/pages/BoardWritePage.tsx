// src/pages/BoardWritePage.tsx
import React, { useState } from "react";
import { Input } from "../components/ui/Input.tsx";
import { Button } from "../components/ui/Button.tsx";

export function BoardWritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 나중에 FastAPI로 API 연결
    console.log("제목:", title);
    console.log("내용:", content);
    console.log("이미지:", image);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">✍️ 게시글 작성</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 text-sm font-medium">제목</label>
          <Input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">내용</label>
          <textarea
            className="w-full border rounded-lg p-3 min-h-[150px]"
            placeholder="내용을 작성하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">사진 첨부</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-gray-500"
          />
        </div>

        <Button type="submit" className="w-full">
          작성 완료
        </Button>
      </form>
    </div>
  );
}
