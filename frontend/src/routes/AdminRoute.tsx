// src/routes/AdminRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.tsx";

interface AdminRouteProps {
  children: JSX.Element;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user } = useAuth();

  // user가 없거나 role이 admin이 아니면 홈으로 돌려보냄
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
