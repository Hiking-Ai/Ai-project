import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage.tsx";
import { LoginPage } from "../pages/LoginPage.tsx";
import { RegisterPage } from "../pages/RegisterPage.tsx";
import { BoardPage } from "../pages/BoardPage.tsx";
import { BoardWritePage } from "../pages/BoardWritePage.tsx";
import { BoardDetailPage } from "../pages/BoardDetailPage.tsx";
import { RecommendPage } from "../pages/RecommendPage.tsx";

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/board" element={<BoardPage />} />
    <Route path="/board/write" element={<BoardWritePage />} />
    <Route path="/board/:id" element={<BoardDetailPage />} />
    <Route path="/recommend" element={<RecommendPage />} />
  </Routes>
);

export default AppRoutes;
