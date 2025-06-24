// src/components/modals/MapModal.tsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// leaflet 기본 아이콘 경로 설정 (iconUrl 누락 오류 해결)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

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
}

export function MapModal({
  isOpen,
  onClose,
  latitude,
  longitude,
}: MapModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-[95%] max-w-4xl min-h-[60vh] relative">
        <button
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="text-2xl font-bold mb-6">탐방로 추천</h3>
        <div style={{ height: "600px", width: "800px" }}>
          <MapContainer
            center={[latitude, longitude]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[latitude, longitude]}>
              {" "}
              {/* 기본 아이콘 사용 */}
              <Popup>
                현재 위치
                <br />
                위도: {latitude}, 경도: {longitude}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
