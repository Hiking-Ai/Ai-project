// import React from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.tsx";
import { Button } from "../components/ui/Button.tsx";
// import { Card, CardContent } from "../components/ui/Card.tsx";
import { useNavigate } from "react-router-dom";
import URL from "../constants/url.js";
import { useEffect, useState } from "react";

// const fetchPosts = async () => {
//   try {
//     const res = await axios.get(`${URL.BACKEND_URL}/api/posts/view/categories`);
//     const sorted = res.data.sort((a, b) => b.post_id - a.post_id); // 최신순 정렬
//     return sorted;
//   } catch (error) {
//     console.error("게시글 불러오기 실패:", error);
//     return [];
//   }
// };

const fetchPosts = async (skip = 0) => {
  try {
    const response = await axios.get(`${URL.BACKEND_URL}/api/posts`, {
      params: {
        skip: skip,
        limit: 30,
      },
    });
    const data = response.data;

    return data;
  } catch (error) {
    console.error("게시글 목록 조회 실패:", error);
    alert("게시글 목록 조회에 실패했습니다. 다시 시도해주세요.");
    return null;
  }
};

const deletePostById = async (post_id) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }
    const response = await axios.delete(
      `${URL.BACKEND_URL}/api/posts/${post_id}`,
      {
        params: {
          post_id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("게시글 삭제 실패:", error);
    alert("게시글 삭제에 실패했습니다. 다시 시도해주세요.");
    return null;
  }
};

export function Profile() {
  const [reviews, setReviews] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 유저 아이디 없어서 조회 불가
  // 로그인 토큰에 같이 넣어줄 것
  const token = localStorage.getItem("access_token");
  if (token) {
    try {
      const payloadBase64 = token.split(".")[1];
      const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const decoded = JSON.parse(jsonPayload);
      console.log("디코드된 토큰:", decoded);
      if (user && decoded) {
        user.email = decoded.sub;
      }
    } catch (err) {
      console.error("토큰 디코딩 실패:", err);
    }
  } else {
    console.warn("토큰이 없습니다.");
  }

  const fetchData = async () => {
    const data = await fetchPosts();
    console.log("게시글 데이터:", data);
    const filteredData = data.items.filter((item) => item.user_id === 4);
    setReviews(filteredData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    await deletePostById(postId);
    alert("삭제되었습니다.");
    fetchData();
  };
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
              <div>
                <p className="text-sm text-gray-500">유저 레벨</p>
                <p className="text-lg font-medium">{user?.level}</p>
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
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.post_id}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-transform transform hover:scale-105"
                >
                  <h3 className="text-lg font-semibold mb-2">
                    {review.title || "후기 제목"}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    작성자: {review.user_nickname || "익명"} ·{" "}
                    {new Date(review.create_at).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 mb-4">
                    {review.content || "후기 내용이 없습니다."}
                  </p>{" "}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/board/${review.post_id}`)}
                    >
                      자세히 보기
                    </Button>
                    <Button
                      variant="destructive"
                      className="border border-red-500 text-red-500 hover:bg-red-50 focus:ring-2 focus:ring-red-300 px-4 py-2 rounded-md transition-colors duration-200"
                      onClick={() => handleDelete(review.post_id)} // 삭제 핸들러 연결 필요
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">
                작성한 후기가 없습니다.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
