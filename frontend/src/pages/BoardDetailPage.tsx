// src/pages/BoardDetailPage.tsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import { Button } from "../components/ui/Button.tsx";
import { Input } from "../components/ui/Input.tsx";
import URL from "../constants/url.js";
import { useAuth } from "../contexts/AuthContext.tsx";
// TODO: 게시글이 없는 경우에 대한 예외 처리
const fetchPostById = async (postId) => {
  try {
    const token = localStorage.getItem("access_token");
    // console.log("토큰:", token);

    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    const res = await axios.get(`${URL.BACKEND_URL}/api/posts/${postId}`, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("게시글 조회 에러:", err);
    alert("게시글 조회에 실패했습니다. 다시 시도해주세요.");
    return null;
  }
};

const createCommentById = async (data) => {
  console.log("댓글 작성 데이터:", data);
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    const response = await axios.post(
      `${URL.BACKEND_URL}/api/posts/${data.post_id}/comments`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    console.log("댓글 작성 응답:", response.data);
    return response.data; // CommentOut 응답
  } catch (err) {
    console.error("댓글 작성 실패:", err);
    alert("댓글 작성에 실패했습니다. 다시 시도해주세요.");
    return null;
  }
};

const featchCommentByPostId = async (post_id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    const response = await axios.get(
      `${URL.BACKEND_URL}/api/posts/${post_id}/comments`
    );
    // console.log("댓글 목록 응답:", response);
    return response.data; // CommentOut 응답
  } catch (err) {
    console.error("댓글 목록 요청 실패:", err);
    alert("댓글 목록 요청에 실패했습니다. 다시 시도해주세요.");
    return null;
  }
};

const updateCommentById = async (commentId, data) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    console.log("token", token);

    const response = await axios.put(
      `${URL.BACKEND_URL}/api/comments/${commentId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    console.log("댓글 수정 응답:", response.data);
    return response.data; // CommentOut 응답
  } catch (err) {
    console.error("댓글 수정 실패:", err);
    alert("댓글 수정에 실패했습니다. 다시 시도해주세요.");
    return null;
  }
};

const favoriteByPostId = async (post_id) => {
  console.log("댓글 작성 데이터:", post_id);
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    const response = await axios.post(
      `${URL.BACKEND_URL}/api/posts/${post_id}/favorite-toggle`,
      post_id,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    console.log("좋아요 응답:", response.data);
    // return response.data; // CommentOut 응답
  } catch (err) {
    console.error("좋아요 실패:", err);
    alert("좋아요에 실패했습니다. 다시 시도해주세요.");
    return null;
  }
};

export function BoardDetailPage() {
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");
  const location = useLocation();
  const [liked, setLiked] = useState(false);
  const { user } = useAuth(); // 로그인한 사용자 정보 가져오기

  const path = location.pathname;
  const postId =
    location.state?.postId || parseInt(path.replace("/board/", ""), 10);

  // console.log("게시글 ID:", postId);
  const [post, setPost] = useState(null);

  // 댓글 목록 생성
  useEffect(() => {
    const fetchComments = async () => {
      if (!post) {
        console.error("게시글 데이터가 없습니다.");
        return;
      }
      const res = await featchCommentByPostId(post.post_id);
      setComments(res);
    };
    fetchComments();
  }, []);

  // 게시글 가져오기
  useEffect(() => {
    const getPost = async () => {
      if (postId) {
        // console.log("게시글 ID:", postId);
        const data = await fetchPostById(postId);
        if (data) setPost(data);
      }
    };
    getPost();
  }, [postId]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!post?.post_id) {
        console.warn("post_id가 없습니다.");
        return;
      }

      try {
        const res = await featchCommentByPostId(post.post_id);
        setComments(res);
      } catch (err) {
        console.error("댓글 불러오기 실패:", err);
      }
    };

    fetchComments();
  }, [post]);
  console.log("게시글 데이터:", post);
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    await createCommentById({
      comment_text: newComment,
      post_id: post.post_id,
      user_id: user.user_id, // ✅ 로그인한 유저 ID로 수정
    });

    const res = await featchCommentByPostId(post.post_id);
    setComments(res);
    setNewComment("");
  };

  const handleDelete = async (commentId) => {
    console.log("삭제할 댓글 ID:", commentId);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }
      console.log(`${URL.BACKEND_URL}/api/comments/${commentId}`);
      await axios.delete(`${URL.BACKEND_URL}/api/comments/${commentId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      // 댓글 삭제 후 다시 댓글 목록을 가져옴
      const res = await featchCommentByPostId(post.post_id);
      setComments(res);
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
      alert("댓글 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleEdit = async (comment) => {
    const updatedText = prompt(
      "수정할 댓글을 입력하세요:",
      comment.comment_text
    );
    if (updatedText !== null && updatedText.trim() !== "") {
      try {
        const updatedComment = await updateCommentById(comment.comment_id, {
          comment_text: updatedText,
        });
        console.log("수정된 댓글:", updatedComment);
        // 수정 후 댓글 목록을 다시 가져옴
        const res = await featchCommentByPostId(post.post_id);
        setComments(res);
      } catch (err) {
        console.error("댓글 수정 실패:", err);
        alert("댓글 수정에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const toggleLike = async () => {
    if (!post) {
      console.error("게시글 데이터가 없습니다.");
      return;
    }
    try {
      console.log("좋아요 토글:", post.post_id);

      await favoriteByPostId(post.post_id);
      setLiked((prev) => !prev);
    } catch (error) {
      console.error("좋아요 처리 중 오류 발생:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* 게시글 내용 */}
      <article className="bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-2">
          {post?.title || "게시글 제목"}
          {/* 🏞️ 북한산 둘레길 후기 */}
        </h1>
        <div className="text-sm text-gray-500 mb-4">
          {/* 유저명 */}
          작성자: {post?.nickname} · {post?.create_at.split("T")[0]}
        </div>
        <p className="text-gray-700 mb-4">
          {post?.content}
          {/* 정말 가을에 가기 딱 좋아요! 단풍도 예쁘고 걷기에도 부담 없는 코스예요. */}
        </p>
        {/* {post?.files && post?.files.length > 0 && (
        <img
          src="https://source.unsplash.com/random/600x400?nature,mountain"
          alt="첨부 이미지"
          className="w-full rounded-md mt-2\"
        />      
        )} */}
        {/* // TODO:업로드 재구현 필요(백엔드 프론트 둘다) */}
        {post?.files && post.files.length > 0 && (
          <>
            {/* TODO: 업로드 재구현 필요 (백엔드 프론트 둘 다) */}
            {post.files.map((file, index) => (
              <img
                key={index}
                src={file.stored_path}
                alt={`파일 이미지 ${index + 1}`}
                className="w-20 h-20 object-cover rounded mr-2"
              />
            ))}
          </>
        )}
        <div className="flex items-center space-x-6">
          {post?.view_count && <p>조회수: {post.view_count}</p>}
          {/* 좋아요 */}
          <button
            onClick={toggleLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
              liked
                ? "bg-red-600 text-white hover:bg-red-700 shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            aria-pressed={liked}
            aria-label={liked ? "좋아요 취소" : "좋아요"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill={liked ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 9V5a3 3 0 00-6 0v4m0 0H6a2 2 0 00-2 2v7a2 2 0 002 2h6a2 2 0 002-2v-7a2 2 0 00-2-2z"
              />
            </svg>
          </button>
        </div>
      </article>

      {/* 댓글 작성 */}
      <section className="bg-gray-50 p-4 rounded-xl shadow-inner">
        <h2 className="text-lg font-semibold mb-2">💬 댓글</h2>
        <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-4">
          <Input
            placeholder="댓글을 입력하세요"
            value={newComment}
            onChange={(e) => {
              console.log("입력 값:", e.target.value); // 이게 뜨는지 확인
              setNewComment(e.target.value);
            }}
          />

          <Button type="submit">등록</Button>
        </form>

        {/* 댓글 리스트 */}
        <ul className="space-y-2">
          {comments.map((comment) => (
            <li
              key={comment.comment_id}
              className="p-3 bg-white rounded-md shadow-sm flex justify-between items-start"
            >
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  작성자: {comment.nickname}
                </div>
                <div className="text-sm text-gray-800">
                  {comment.comment_text}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                {/* 수정은 본인만 */}
                {user?.user_id === comment.user_id && (
                  <button
                    onClick={() => handleEdit(comment)}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    수정
                  </button>
                )}

                {/* 삭제는 본인 또는 관리자 */}
                {(user?.user_id === comment.user_id ||
                  user?.role === "ADMIN") && (
                  <button
                    onClick={() => handleDelete(comment.comment_id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    삭제
                  </button>
                )}
              </div>
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
