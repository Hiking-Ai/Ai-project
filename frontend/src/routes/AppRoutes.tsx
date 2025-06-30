// src/routes/AppRoutes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import { HomePage } from "../pages/HomePage.tsx";
import { BoardPage } from "../pages/BoardPage.tsx";
import { BoardWritePage } from "../pages/BoardWritePage.tsx";
import { BoardDetailPage } from "../pages/BoardDetailPage.tsx";
import { RecommendPage } from "../pages/RecommendPage.tsx";
import { ProfileEditPage } from "../pages/ProfileEditPage.tsx";
import { Profile } from "../pages/Profile.tsx";
import { InfoPage } from "../pages/InfoPage.tsx";
import Test from "../pages/Test.tsx";

// 관리자 페이지 및 가드
import { AdminPage } from "../pages/AdminPage.tsx";
import { AdminRoute } from "./AdminRoute.tsx";

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />

    <Route path="/board" element={<BoardPage />} />
    <Route path="/board/write" element={<BoardWritePage />} />
    <Route path="/board/:id" element={<BoardDetailPage />} />
    <Route path="/recommend" element={<RecommendPage />} />
    <Route path="/profile/edit" element={<ProfileEditPage />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/info" element={<InfoPage />} />
    <Route path="/Test" element={<Test />} />

    {/* 관리자 전용 경로 */}
    <Route
      path="/admin"
      element={
        <AdminRoute>
          <AdminPage />
        </AdminRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
