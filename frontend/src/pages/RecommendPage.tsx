import React, { useState } from "react";
import { Input } from "../components/ui/Input.tsx";
import { Button } from "../components/ui/Button.tsx";
import { Card, CardContent } from "../components/ui/Card.tsx";

export function RecommendPage() {
  const [condition, setCondition] = useState("");
  const [region, setRegion] = useState<string>("무관");
  const [groupSizes, setGroupSizes] = useState<string[]>([]);
  const [groupTypes, setGroupTypes] = useState<string[]>([]);
  const [purposes, setPurposes] = useState<string[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [routeTypes, setRouteTypes] = useState<string[]>([]);
  const [parkingAvailable, setParkingAvailable] = useState(false);
  const [specialNeeds, setSpecialNeeds] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const regionOptions = ["내 주변", "무관", "지도 선택"];
  const groupOptions = ["혼자", "2인", "3인", "그 이상"];
  const groupTypeOptions = ["개인", "단체"];
  const purposeOptions = ["운동", "데이트", "가족 나들이", "사진 촬영"];
  const difficultyOptions = ["초보", "중급", "전문"];
  const routeTypeOptions = ["순환형", "왕복형"];
  const specialOptions = ["체험", "어린자녀동반", "배리어프리"];

  const toggleMulti = (
    option: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(list.includes(option) ? list.filter((o) => o !== option) : [option]);
  };

  const handleRecommend = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          condition,
          region,
          groupSizes,
          groupTypes,
          purposes,
          difficulties,
          routeTypes,
          parkingAvailable,
          specialNeeds,
        }),
      });
      if (!res.ok) throw new Error("추천 요청 중 오류가 발생했습니다.");
      const data = await res.json();
      setRecommendations(data.recommendations);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderChips = (
    options: string[],
    selected: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggleMulti(opt, selected, setter)}
            className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
              isSelected
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );

  const renderSingle = (
    options: string[],
    selected: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => setter(opt)}
          className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
            selected === opt
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-100 text-gray-800 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-green-700">
          🌿 탐방로 추천
        </h1>

        {/* Keyword */}
        <Card>
          <CardContent className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              추가 키워드
            </label>
            <Input
              placeholder="예: 강변, 벚꽃길"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full border-gray-300 shadow-sm focus:ring-green-300"
            />
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent>
              <h2 className="font-semibold mb-2">지역</h2>
              {renderSingle(regionOptions, region, setRegion)}
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="font-semibold mb-2">인원 수</h2>
              {renderChips(groupOptions, groupSizes, setGroupSizes)}
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="font-semibold mb-2">유형</h2>
              {renderChips(groupTypeOptions, groupTypes, setGroupTypes)}
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="font-semibold mb-2">목적</h2>
              {renderChips(purposeOptions, purposes, setPurposes)}
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="font-semibold mb-2">난이도</h2>
              {renderChips(difficultyOptions, difficulties, setDifficulties)}
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="font-semibold mb-2">경로 유형</h2>
              {renderChips(routeTypeOptions, routeTypes, setRouteTypes)}
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="font-semibold mb-2">특이 사항</h2>
              {renderChips(specialOptions, specialNeeds, setSpecialNeeds)}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={parkingAvailable}
                onChange={() => setParkingAvailable(!parkingAvailable)}
                className="h-5 w-5 text-green-600"
              />
              <label className="text-sm text-gray-700">주차 가능</label>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div>
          <Button
            onClick={handleRecommend}
            disabled={isLoading}
            className="w-full py-3 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 transition"
          >
            {isLoading ? "추천 중..." : "추천 받기"}
          </Button>
          {error && (
            <p className="text-sm text-red-500 text-center mt-2">{error}</p>
          )}
        </div>

        {/* 결과 */}
        {recommendations.length > 0 && (
          <div className="space-y-4 mt-6">
            <h2 className="text-xl font-semibold text-gray-800">
              추천된 탐방로
            </h2>
            {recommendations.map((res, i) => (
              <Card key={i}>
                <CardContent className="flex items-center space-x-3">
                  <span className="text-green-600">✅</span>
                  <p className="text-gray-800 font-medium">{res}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
