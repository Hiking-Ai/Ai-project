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

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />

    <Route path="/board" element={<BoardPage />} />
    <Route path="/board/write" element={<BoardWritePage />} />
    <Route path="/board/:id" element={<BoardDetailPage />} />
    <Route path="/recommend" element={<RecommendPage />} />
    <Route path="/profile/edit" element={<ProfileEditPage />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
);

export default AppRoutes;
