// src/pages/BoardWritePage.tsx
import React, { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/Button.tsx";
import { Input } from "../components/ui/Input.tsx";
import { Card, CardContent } from "../components/ui/Card.tsx";
import URL from "../constants/url";
import { useAuth } from "../contexts/AuthContext.tsx";

export function BoardWritePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [region, setRegion] = useState<string>("무관");
  const [type, setType] = useState<string>("개인");
  const [difficulty, setDifficulty] = useState<string>("초급");
  const [purpose, setPurpose] = useState<string>("운동");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const regionOptions = [
    { id: 1, label: "내 주변" },
    { id: 2, label: "무관" },
    { id: 3, label: "지도 선택" },
  ];
  const typeOptions = [
    { id: 4, label: "개인" },
    { id: 5, label: "단체" },
  ];
  const difficultyOptions = [
    { id: 6, label: "초급" },
    { id: 7, label: "중급" },
    { id: 8, label: "고급" },
  ];
  const purposeOptions = [
    { id: 9, label: "운동" },
    { id: 10, label: "데이트" },
    { id: 11, label: "가족 나들이" },
    { id: 12, label: "사진" },
  ];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("로그인이 필요합니다.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    const selectedIds = [
      regionOptions.find((o) => o.label === region)?.id,
      typeOptions.find((o) => o.label === type)?.id,
      difficultyOptions.find((o) => o.label === difficulty)?.id,
      purposeOptions.find((o) => o.label === purpose)?.id,
    ].filter((id): id is number => typeof id === "number");
    selectedIds.forEach((id) => formData.append("subcategory_ids", String(id)));

    files.forEach((file) => formData.append("files", file));

    try {
      const token = localStorage.getItem("access_token");
      await axios.post(`${URL.BACKEND_URL}/api/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      navigate("/board");
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        const msgs = detail.map((item: any) => item.msg).join(", ");
        setError(msgs || "등록 실패");
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError(err.response?.data?.message || "등록 실패");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white text-gray-800">
      <section className="relative bg-white/70 backdrop-blur-sm py-12 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-700 mb-2">
            탐방로 검색 게시글 작성
          </h1>
          <p className="text-gray-600">
            원하는 카테고리를 선택하고 탐방로를 공유해보세요.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shadow-md hover:shadow-lg transition">
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  label: "지역",
                  value: region,
                  setter: setRegion,
                  options: regionOptions,
                },
                {
                  label: "유형",
                  value: type,
                  setter: setType,
                  options: typeOptions,
                },
                {
                  label: "난이도",
                  value: difficulty,
                  setter: setDifficulty,
                  options: difficultyOptions,
                },
                {
                  label: "목적",
                  value: purpose,
                  setter: setPurpose,
                  options: purposeOptions,
                },
              ].map(({ label, value, setter, options }) => (
                <div key={label}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <select
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {options.map((opt) => (
                      <option key={opt.id} value={opt.label}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition">
            <CardContent className="flex flex-col space-y-4">
              <Input
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border-gray-300 focus:border-green-500"
              />
              <textarea
                className="border border-gray-300 rounded-md p-3 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="본문을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  사진 업로드
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="focus:outline-none"
                />
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            variant="default"
            className="w-full py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "등록 중..." : "등록"}
          </Button>
        </form>
      </main>
    </div>
  );
}
