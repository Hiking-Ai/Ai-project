// src/pages/BoardDetailPage.tsx
import React, { useState } from "react";
import { Button } from "../components/ui/Button.tsx";
import { Input } from "../components/ui/Input.tsx";

export function BoardDetailPage() {
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* 게시글 내용 */}
      <article className="bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-2">🏞️ 북한산 둘레길 후기</h1>
        <div className="text-sm text-gray-500 mb-4">
          작성자: 유저123 · 2025.06.09
        </div>
        <p className="text-gray-700 mb-4">
          정말 가을에 가기 딱 좋아요! 단풍도 예쁘고 걷기에도 부담 없는 코스예요.
        </p>
        <img
          src="https://source.unsplash.com/random/600x400?nature,mountain"
          alt="첨부 이미지"
          className="w-full rounded-md mt-2\"
        />
      </article>

      {/* 댓글 작성 */}
      <section className="bg-gray-50 p-4 rounded-xl shadow-inner">
        <h2 className="text-lg font-semibold mb-2">💬 댓글</h2>
        <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-4">
          <Input
            placeholder="댓글을 입력하세요"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button type="submit">등록</Button>
        </form>

        {/* 댓글 리스트 */}
        <ul className="space-y-2">
          {comments.map((comment, idx) => (
            <li key={idx} className="p-3 bg-white rounded-md shadow-sm">
              {comment}
            </li>
          ))}
          {comments.length === 0 && (
            <li className="text-gray-400 text-sm">아직 댓글이 없습니다.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
