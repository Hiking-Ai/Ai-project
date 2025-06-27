// src/components/modals/MapModal.tsx
import React from "react";
import {
  Polyline,
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// leaflet 기본 아이콘 경로 설정 (iconUrl 누락 오류 해결)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
});

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
});

const defaultRedIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});
const defaultBlueIcon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconSize: [25, 41], // 마커 크기
  iconAnchor: [12, 41], // 마커 앵커 위치
  popupAnchor: [1, -34], // 팝업 앵커 위치
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"), // 그림자 아이콘
  shadowSize: [41, 41], // 그림자 크기
});
const getRainIcon = new L.DivIcon({
  html: `
<svg width="25" height="41" viewBox="0 0 24 39" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path 
    fill="#3498db" 
    stroke="#2980b9" 
    strokeOpacity="0.3" 
    strokeWidth="2"
    d="M12 0C8 7 0 14 0 21c0 6.075 4.925 11 11 11s11-4.925 11-11c0-7-8-14-11-21z"
  />
  <circle 
    cx="12" 
    cy="30" 
    r="3" 
    fill="#2980b9" 
    stroke="#2980b9" 
    strokeOpacity="0.3" 
    strokeWidth="1"
  />
    `,
  className: "",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const getThermometerIcon = (temp: number) => {
  // 온도 범위 0~40도라 가정
  const maxTemp = 40;
  const fillHeight = (Math.min(Math.max(temp, 0), maxTemp) / maxTemp) * 30; // 액체 채워질 높이 (30px가 최대)

  return new L.DivIcon({
    html: `
      <svg width="25" height="60" viewBox="0 0 24 60" xmlns="http://www.w3.org/2000/svg">
        <!-- 온도계 외곽 -->
        <rect x="9" y="5" width="6" height="40" rx="3" ry="3" fill="#ddd" stroke="#999" stroke-width="2"/>
        <!-- 온도계 액체 (빨간색) -->
        <rect x="11" y="${
          45 - fillHeight
        }" width="2" height="${fillHeight}" fill="red" />
        <!-- 온도계 밑둥 -->
        <circle cx="12" cy="52" r="8" fill="#ddd" stroke="#999" stroke-width="2"/>
        <circle cx="12" cy="52" r="6" fill="red" />
      </svg>
    `,
    className: "",
    iconSize: [25, 60],
    iconAnchor: [12, 60],
  });
};
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
  trailsLocations: [];
}
const getIconByWeather = (ta: number, pr: number) => {
  // if (ta >= 23) return gradientIcon; // 온도가 23도 이상이면 그라디언트 아이콘 (예: 빨간-노란 그라디언트)
  let gradient;
  if (pr > 0) {
    return getRainIcon;
  } else {
    return getThermometerIcon(ta);
  }
};
export function WeatherModal({
  isOpen,
  onClose,
  latitude,
  longitude,
  trailsLocations,
}: MapModalProps) {
  if (!isOpen) return null;

  const trailsByPark = {};

  trailsLocations.forEach((loc) => {
    if (!trailsByPark[loc.park_no_id]) {
      trailsByPark[loc.park_no_id] = [];
    }
    trailsByPark[loc.park_no_id].push([loc.latitude, loc.longitude]);
  });

  console.log("trailsLocations", trailsLocations);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-[95%] max-w-4xl min-h-[60vh] relative">
        <button
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="text-2xl font-bold mb-6">
          오늘의 날씨 기반 탐방로 추천
        </h3>
        <div style={{ height: "600px", width: "800px" }}>
          <MapContainer
            center={[latitude, longitude]}
            zoom={11}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[latitude, longitude]} icon={defaultRedIcon}>
              <Popup>
                현재 위치
                <br />
                위도: {latitude}, 경도: {longitude}
              </Popup>
            </Marker>
            {trailsLocations.map((loc) =>
              loc.LAT != null &&
              !isNaN(loc.LAT) &&
              loc.LON != null &&
              !isNaN(loc.LON) ? (
                <Marker
                  key={loc.trail_id}
                  position={[loc.LAT, loc.LON]}
                  icon={getIconByWeather(loc.TA ?? 0, loc.PR ?? 0)}
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
                    <br />
                    🌡️ 기온: {loc.TA?.toFixed(2)}℃
                    <br />
                    ☁️ 습도: {loc.HM?.toFixed(2)}%
                    <br />
                    🌬️ 풍속: {loc.WS?.toFixed(2)}m/s
                    <br />
                    🌧️ 강수량: {Math.max(0, loc.PR)?.toFixed(2)}mm
                  </Popup>
                </Marker>
              ) : null
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
