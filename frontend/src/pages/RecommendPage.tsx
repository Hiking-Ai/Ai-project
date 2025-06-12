import React, { useState } from "react";
import { Button } from "../components/ui/Button.tsx";
import { Input } from "../components/ui/Input.tsx";

export function RecommendPage() {
  // Free-text condition
  const [condition, setCondition] = useState("");
  // Checkbox states
  const [groupSizes, setGroupSizes] = useState<string[]>([]);
  const [purposes, setPurposes] = useState<string[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [routeTypes, setRouteTypes] = useState<string[]>([]);
  const [parkingAvailable, setParkingAvailable] = useState(false);
  // Recommendations
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const groupOptions = ["혼자", "2인", "3인", "그 이상"];
  const purposeOptions = ["운동", "데이트", "가족 나들이", "사진 촬영"];
  const difficultyOptions = ["초급", "중급", "고급"];
  const routeTypeOptions = ["순환형", "왕복형"];

  const toggleSelection = (
    option: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(
      list.includes(option)
        ? list.filter((item) => item !== option)
        : [...list, option]
    );
  };

  const handleRecommend = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          condition,
          groupSizes,
          purposes,
          difficulties,
          routeTypes,
          parkingAvailable,
        }),
      });
      if (!response.ok) throw new Error(`응답 에러: ${response.status}`);
      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "추천 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6 tracking-tight">
        🧭 탐방로 추천
      </h1>

      {/* Free-text input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          추가 조건 입력
        </label>
        <Input
          placeholder="예: 산책로만, 강변 코스"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full border-2 border-gray-200 focus:border-green-600 rounded-md px-4 py-2"
        />
      </div>

      {/* Checkbox filters */}
      <div className="mb-6 space-y-6">
        {/* Group Size */}
        <div>
          <p className="font-medium text-gray-800 mb-2">그룹 인원</p>
          <div className="flex flex-wrap gap-4">
            {groupOptions.map((opt) => (
              <label key={opt} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={groupSizes.includes(opt)}
                  onChange={() =>
                    toggleSelection(opt, groupSizes, setGroupSizes)
                  }
                />
                <span className="text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Purpose */}
        <div>
          <p className="font-medium text-gray-800 mb-2">방문 목적</p>
          <div className="flex flex-wrap gap-4">
            {purposeOptions.map((opt) => (
              <label key={opt} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={purposes.includes(opt)}
                  onChange={() => toggleSelection(opt, purposes, setPurposes)}
                />
                <span className="text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <p className="font-medium text-gray-800 mb-2">단계</p>
          <div className="flex flex-wrap gap-4">
            {difficultyOptions.map((opt) => (
              <label key={opt} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={difficulties.includes(opt)}
                  onChange={() =>
                    toggleSelection(opt, difficulties, setDifficulties)
                  }
                />
                <span className="text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Route Type */}
        <div>
          <p className="font-medium text-gray-800 mb-2">경로 유형</p>
          <div className="flex flex-wrap gap-4">
            {routeTypeOptions.map((opt) => (
              <label key={opt} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={routeTypes.includes(opt)}
                  onChange={() =>
                    toggleSelection(opt, routeTypes, setRouteTypes)
                  }
                />
                <span className="text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Parking Available */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={parkingAvailable}
              onChange={() => setParkingAvailable(!parkingAvailable)}
            />
            <span className="font-medium text-gray-800">주차 가능</span>
          </label>
        </div>
      </div>

      {/* Recommend Button */}
      <Button
        onClick={handleRecommend}
        disabled={isLoading}
        className="w-full py-3 font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
      >
        {isLoading ? "추천 중..." : "추천 받기"}
      </Button>
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Results */}
      <div className="mt-8 space-y-4">
        {recommendations.length > 0 ? (
          recommendations.map((course, idx) => (
            <div
              key={idx}
              className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-green-600"
            >
              <span className="text-green-600 mr-3">✅</span>
              <span className="text-gray-800 font-medium">{course}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">추천 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
