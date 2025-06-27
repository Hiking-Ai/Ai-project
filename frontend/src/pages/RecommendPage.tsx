// src/pages/RecommendPage.tsx
import axios from "axios";
import React, { useState, useEffect } from "react";

import { Button } from "../components/ui/Button.tsx";
import { Card, CardContent } from "../components/ui/Card.tsx";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import URL from "../constants/url.js";

// Leaflet 기본 아이콘 경로 설정
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Location {
  latitude: number;
  longitude: number;
}

const defaultRedIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});
const fetchTrails = async () => {
  try {
    const response = await axios.get(`${URL.BACKEND_URL}/api/trails`);
    console.log("탐방로 목록 응답:", response);
    return response.data;
  } catch (error) {
    console.error("댓글 목록 조회 실패:", error);
    alert("댓글 목록 조회에 실패했습니다. 다시 시도해주세요.");
    return null;
  }
};
export function RecommendPage() {
  const [region, setRegion] = useState<string>("무관");
  const [groupTypes, setGroupTypes] = useState<string[]>([]);
  const [purposes, setPurposes] = useState<string[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [trailsLocations, setTrailsLocations] = useState([]);
  const [selectedTrailsLocations, setSelectedTrailsLocations] = useState([]);

  const regionOptions = ["내 주변", "무관", "지도 선택"];
  const groupTypeOptions = ["개인", "단체"];
  const purposeOptions = ["운동", "데이트", "가족 나들이", "사진 촬영"];
  const difficultyOptions = ["초보", "중급", "전문"];

  // 사용자 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        (err) => console.warn(err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // 다중 선택 토글
  const toggleMulti = (
    option: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(list.includes(option) ? list.filter((o) => o !== option) : [option]);
  };

  // 검색 요청
  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);

    // 선택 조건 추가 해서 trailsLocations 필터링 한 다음
    // setSelectedTrailsLocations 에 저장해주면 시각화 됨

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region, groupTypes, purposes, difficulties }),
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

  // 다중 선택 칩 렌더러
  const renderChips = (
    options: string[],
    selected: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => (
    <div className="flex flex-col gap-2">
      {options.map((opt) => {
        const isSelected = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggleMulti(opt, selected, setter)}
            className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
              {
                true: "bg-green-600 text-white",
                false: "bg-gray-100 text-gray-700 hover:bg-gray-200",
              }[isSelected]
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );

  // 단일 선택 렌더러
  const renderSingle = (
    options: string[],
    selected: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => setter(opt)}
          className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
            {
              true: "bg-green-600 text-white",
              false: "bg-gray-100 text-gray-700 hover:bg-gray-200",
            }[selected === opt]
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTrails();
        setTrailsLocations(data);
        console.log("탐방로 위치:", data);
      } catch (error) {
        console.error("탐방로 불러오기 실패:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-100 text-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Sidebar filters */}
        <aside className="space-y-6">
          <Card>
            <CardContent>
              <h2 className="font-semibold mb-2">지역</h2>
              {renderSingle(regionOptions, region, setRegion)}
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
        </aside>

        {/* Content area: list & map */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
            {/* Recommendations list */}
            <div className="space-y-4">
              {recommendations.length > 0 && (
                <>
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
                </>
              )}
            </div>

            {/* Map + Search */}
            <div className="flex flex-col gap-4">
              <div className="h-[600px] rounded-lg overflow-hidden shadow-lg">
                {location ? (
                  <MapContainer
                    center={[location.latitude, location.longitude]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    <Marker
                      position={[location.latitude, location.longitude]}
                      icon={defaultRedIcon}
                    >
                      <Popup>현재 위치</Popup>
                    </Marker>

                    {selectedTrailsLocations.map((loc) => (
                      <Marker
                        key={loc.trail_id}
                        position={[loc.latitude, loc.longitude]}
                      >
                        <Popup>
                          🗺️ <strong>{loc.cos_kor_nm}</strong>
                          <br />
                          🏞️ 공원: {loc.park_name}
                          <br />
                          🔹 난이도: {loc.difficulty}
                          <br />
                          ⏱️ 소요 시간: {loc.forward_tm}
                          <br />
                          ☎️ 연락처: {loc.mng_tel}
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                ) : (
                  <p className="text-center mt-4">
                    위치 정보를 불러오는 중입니다...
                  </p>
                )}
              </div>
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition"
              >
                {isLoading ? "검색 중..." : "검색하기"}
              </Button>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
