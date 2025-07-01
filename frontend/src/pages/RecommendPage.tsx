// ✅ 수정된 RecommendPage.tsx 핵심 부분
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

// Leaflet 아이콘 설정
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

export function RecommendPage() {
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<Location | null>(null);

  const distanceOptions = ["2km 이내", "5km 이내", "10km 이상"];
  const durationOptions = ["1시간 이내", "2시간 이상", "3시간 이상"];
  const difficultyOptions = ["쉬움", "보통", "어려움"];

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

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${URL.BACKEND_URL}/api/recommend`, {
        distance,
        duration,
        difficulty,
      });
      const data = res.data;
      setRecommendations(
        Array.isArray(data) ? data : data.recommendations || []
      );
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sidebar */}
        <aside className="space-y-6">
          <Card>
            <CardContent>
              <h2 className="font-semibold mb-2">거리</h2>
              {renderSingle(distanceOptions, distance, setDistance)}
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="font-semibold mb-2">소요 시간</h2>
              {renderSingle(durationOptions, duration, setDuration)}
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="font-semibold mb-2">난이도</h2>
              {renderSingle(difficultyOptions, difficulty, setDifficulty)}
            </CardContent>
          </Card>
        </aside>

        {/* Main */}
        <div className="space-y-4">
          <div className="h-[500px] rounded-lg overflow-hidden shadow-lg">
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

          {/* 추천 결과 */}
          {Array.isArray(recommendations) && recommendations.length > 0 && (
            <div className="mt-6 space-y-3">
              <h2 className="text-lg font-bold">추천된 탐방로</h2>
              {recommendations.map((rec, i) => (
                <Card key={i}>
                  <CardContent className="flex items-center gap-3">
                    <span className="text-green-600">✅</span>
                    <p className="text-gray-800 font-medium">
                      {rec.cos_kor_nm}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
