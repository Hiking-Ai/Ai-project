import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import URL from "../constants/url.js";
import { Card, CardContent } from "../components/ui/Card.tsx";
import { Button } from "../components/ui/Button.tsx";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface Post {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  views: number;
  likes: number;
  nickname: string;
}
type SortKey = "date" | "views";

const fetchPosts = async (skip = 0) => {
  try {
    const response = await axios.get(`${URL.BACKEND_URL}/api/posts`, {
      params: {
        skip: skip,
        // limit:30
      },
    });
    const data = response.data;
    console.log("data", data);
    return data;
  } catch (error) {
    console.error("게시글 목록 조회 실패:", error);
    alert("게시글 목록 조회에 실패했습니다. 다시 시도해주세요.");
    return null;
  }
};

export function BoardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [totalPages, setTotalPages] = useState(1);
  const [difficulty, setDifficulty] = useState("");
  const [purpose, setPurpose] = useState("");
  const [routeType, setRouteType] = useState("");
  const [page, setPage] = useState(1);

  const [filteredPosts, setFilteredPosts] = useState([]);
  const pageSize = 10;

  useEffect(() => {
    const fetchTotalPage = async () => {
      const data = await fetchPosts();
      setTotalPages(data.total / pageSize);
    };
    fetchTotalPage();
  }, []);
  console.log("총 페이지 수:", totalPages);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchPosts((page - 1) * pageSize);
      console.log("게시글 데이터:", data);
      setPosts(data.items);
    };
    loadData();
  }, [page]);

  useEffect(() => {
    const sorted = [...posts].sort((a, b) => {
      if (sortKey === "date") {
        return new Date(b.create_at) - new Date(a.create_at);
      } else if (sortKey === "views") {
        return b.view_count - a.view_count;
      } else if (sortKey === "likes") {
        return b.likes - a.likes;
      } else {
        return b.post_id - a.post_id;
      }
    });
    setPosts(sorted);
  }, [sortKey, page]);
  useEffect(() => {
    const filtered = posts.filter((post) => {
      const matchDifficulty = difficulty
        ? post.category_ids?.includes(Number(difficulty))
        : true;
      const matchPurpose = purpose ? post.purpose === purpose : true;
      const matchRouteType = routeType ? post.routeType === routeType : true;
      return matchDifficulty && matchPurpose && matchRouteType;
    });

    setFilteredPosts(filtered);
  }, [posts, difficulty, purpose, routeType]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-white bg-opacity-70 backdrop-blur-sm py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-extrabold text-green-700 mb-2">
            게시판
          </h1>
          <p className="text-gray-600">탐방로 후기를 공유하고 소통해 보세요</p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <Link to="/board/write">
            <Button className="shadow-md hover:shadow-lg">글쓰기</Button>
          </Link>

          <div className="flex flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-md shadow-sm">
            {/* 난이도 */}
            <div className="flex items-center space-x-2">
              <label className="text-gray-600" htmlFor="difficulty">
                난이도:
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="border rounded p-2 bg-white"
              >
                <option value="">전체</option>
                <option value="17">초급 코스</option>
                <option value="18">중급 코스</option>
                <option value="19">고급 코스</option>
              </select>
            </div>

            {/* 목적 */}
            <div className="flex items-center space-x-2">
              <label className="text-gray-600" htmlFor="purpose">
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
            {/* 경로유형 */}
            <div className="flex items-center space-x-2">
              <label className="text-gray-600" htmlFor="routeType">
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

          <div className="flex items-center space-x-2">
            <span className="text-gray-600">정렬:</span>
            <select
              value={sortKey}
              onChange={(e) => {
                setSortKey(e.target.value as SortKey);
                setPage(1);
              }}
              className="border rounded p-2 bg-white"
            >
              <option value="date">최신순</option>
              <option value="views">조회수</option>
              {<option value="likes">좋아요</option>}
            </select>
          </div>
        </div>

        {/* Posts List */}
        <ul className="space-y-6">
          {filteredPosts.map((post) => (
            <li key={post.id}>
              <Card className="shadow-lg hover:shadow-2xl transition transform hover:scale-105">
                <CardContent className="grid grid-cols-1 md:grid-cols-8 gap-4 p-6">
                  <div className="md:col-span-6 space-y-2">
                    <Link
                      to={`/board/${post.post_id}`}
                      state={{ postId: post.post_id }}
                      className="hover:underline"
                    >
                      <h2 className="text-xl font-semibold text-gray-800">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-sm text-gray-600">{post.excerpt}</p>
                  </div>
                  <div className="md:col-span-2 flex flex-col justify-between text-xs text-gray-500">
                    <div>{post.date}</div>
                    <div>작성자: {post.nickname}</div>
                    <div>👁️ {post.view_count}</div>
                    {<div>❤️ {post.likes}</div>}
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>

        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className={`p-2 rounded ${
              page === 1
                ? "bg-gray-200 text-gray-500"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ChevronsLeft size={20} />
          </button>
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`p-2 rounded ${
              page === 1
                ? "bg-gray-200 text-gray-500"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded ${
                page === i + 1
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className={`p-2 rounded ${
              page === totalPages
                ? "bg-gray-200 text-gray-500"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className={`p-2 rounded ${
              page === totalPages
                ? "bg-gray-200 text-gray-500"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ChevronsRight size={20} />
          </button>
        </div>
      </main>
    </div>
  );
}
