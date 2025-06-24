// src/pages/BoardDetailPage.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart, Trash2 } from "lucide-react";

import { Button } from "../components/ui/Button.tsx";
import URL from "../constants/url";
import { useAuth } from "../contexts/AuthContext.tsx";

// 게시글 조회 함수
async function fetchPostById(postId: number) {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("로그인이 필요합니다.");
  const { data } = await axios.get(`${URL.BACKEND_URL}/api/posts/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return data;
}

export function BoardDetailPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const postId = state?.postId || +pathname.replace("/board/", "");

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPostById(postId);
        setPost(data);
        setLiked(false);
        setLikesCount(data.likes);
      } catch (e: any) {
        alert(e.message);
      }
    })();
  }, [postId]);

  useEffect(() => {
    if (!post) return;
    (async () => {
      const { data } = await axios.get(
        `${URL.BACKEND_URL}/api/posts/${post.post_id}/comments`,
        { withCredentials: true }
      );
      setComments(data);
    })();
  }, [post]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("로그인이 필요합니다.");
    await axios.post(
      `${URL.BACKEND_URL}/api/posts/${post.post_id}/comments`,
      { comment_text: newComment },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );
    setNewComment("");
    const { data } = await axios.get(
      `${URL.BACKEND_URL}/api/posts/${post.post_id}/comments`,
      { withCredentials: true }
    );
    setComments(data);
  };

  const toggleLike = async () => {
    if (!post) return;
    const token = localStorage.getItem("access_token");
    if (!token) return alert("로그인이 필요합니다.");
    try {
      await axios.post(
        `${URL.BACKEND_URL}/api/posts/${post.post_id}/favorite-toggle`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
      setLiked((prev) => !prev);
    } catch (err) {
      console.error(err);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  const handleDeletePost = async () => {
    if (!post) return;
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;
    const token = localStorage.getItem("access_token");
    if (!token) return alert("로그인이 필요합니다.");
    try {
      await axios.delete(`${URL.BACKEND_URL}/api/posts/${post.post_id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      navigate("/board");
    } catch (err) {
      console.error(err);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  if (!post) return <p className="text-center py-20">불러오는 중...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <article className="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{post.title}</h1>
          {user?.user_id === post.user_id && (
            <button
              onClick={handleDeletePost}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 space-x-2">
          <span>작성자: {post.nickname}</span>
          <span>|</span>
          <span>{post.create_at.split("T")[0]}</span>
        </div>

        <p className="text-gray-800 whitespace-pre-line mb-6">{post.content}</p>

        {/* 이미지 렌더링 */}
        {post.files && post.files.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {post.files.map((file: any) => (
              <img
                key={file.file_id}
                src={URL.BACKEND_URL + file.stored_path}
                alt={file.original_file_name}
                className="w-full h-auto rounded-md border"
              />
            ))}
          </div>
        )}

        <div className="flex items-center space-x-6">
          <div className="flex items-center text-sm text-gray-500">
            👁️ <span className="ml-1">{post.view_count}</span>
          </div>
          <button
            onClick={toggleLike}
            className="flex items-center space-x-1 text-sm"
          >
            <Heart
              className={`${liked ? "text-red-500" : "text-gray-400"} w-5 h-5`}
              fill={liked ? "currentColor" : "none"}
            />
            <span>{likesCount}</span>
          </button>
        </div>
      </article>

      <section className="mt-6 bg-white border border-gray-200 rounded-md p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          댓글 ({comments.length})
        </h2>

        <form onSubmit={handleCommentSubmit} className="flex mb-4">
          <input
            type="text"
            placeholder="댓글을 입력하세요"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Button type="submit" className="px-4">
            등록
          </Button>
        </form>

        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.comment_id} className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {c.nickname}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(c.create_at).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-800 mb-2">{c.comment_text}</p>
              <div className="flex space-x-2 text-xs">
                {user?.user_id === c.user_id && (
                  <button
                    onClick={() => {
                      /* handleEdit */
                    }}
                    className="text-blue-500 hover:underline"
                  >
                    수정
                  </button>
                )}
                {(user?.user_id === c.user_id || user?.role === "ADMIN") && (
                  <button
                    onClick={() => {
                      /* handleDelete */
                    }}
                    className="text-red-500 hover:underline"
                  >
                    삭제
                  </button>
                )}
              </div>
            </li>
          ))}
          {comments.length === 0 && (
            <li className="text-center text-gray-400">
              등록된 댓글이 없습니다.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
