// src/pages/AdminPage.tsx
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/Card.tsx";
import { Button } from "../components/ui/Button.tsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface WeeklyData {
  day: string;
  visitors: number;
}
interface User {
  id: number;
  nickname: string;
  email: string;
  joined: string;
}

export function AdminPage() {
  const [dailyVisitors, setDailyVisitors] = useState(0);
  const [subscribers, setSubscribers] = useState(0);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // TODO: API 연동 데이터
    setDailyVisitors(1500);
    setSubscribers(300);
    setWeeklyData([
      { day: "월", visitors: 200 },
      { day: "화", visitors: 250 },
      { day: "수", visitors: 180 },
      { day: "목", visitors: 300 },
      { day: "금", visitors: 280 },
      { day: "토", visitors: 400 },
      { day: "일", visitors: 350 },
    ]);
    setUsers([
      {
        id: 1,
        nickname: "user1",
        email: "u1@example.com",
        joined: "2025-06-01",
      },
      {
        id: 2,
        nickname: "user2",
        email: "u2@example.com",
        joined: "2025-06-03",
      },
    ]);
  }, []);

  const handleDelete = (id: number) => {
    // TODO: 회원 삭제 API 호출
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white text-gray-800 pl-80">
      <div className="max-w-5xl mx-auto py-8">
        {/* Hero */}
        <section className="bg-white/70 backdrop-blur-sm py-8 rounded-md mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-green-700">관리자 페이지</h1>
            <p className="text-gray-600 mt-1">
              일별 방문자, 가입자 통계와 회원 관리를 할 수 있습니다.
            </p>
          </div>
        </section>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="text-center">
              <p className="text-sm text-gray-500">오늘 방문자 수</p>
              <p className="text-2xl font-semibold">{dailyVisitors}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center">
              <p className="text-sm text-gray-500">가입자 수</p>
              <p className="text-2xl font-semibold">{subscribers}</p>
            </CardContent>
          </Card>
        </div>

        {/* 주간 방문자 차트 */}
        <Card className="mb-8">
          <CardContent>
            <h2 className="text-lg font-medium mb-4">주간 방문자 추이</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visitors" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 회원 관리 */}
        <section>
          <h2 className="text-lg font-medium mb-4">회원 목록</h2>
          <div className="overflow-hidden rounded-md border">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600">ID</th>
                  <th className="px-4 py-2 text-left text-gray-600">닉네임</th>
                  <th className="px-4 py-2 text-left text-gray-600">이메일</th>
                  <th className="px-4 py-2 text-left text-gray-600">가입일</th>
                  <th className="px-4 py-2 text-left text-gray-600">삭제</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{u.id}</td>
                    <td className="px-4 py-2">{u.nickname}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">{u.joined}</td>
                    <td className="px-4 py-2">
                      <Button
                        className="px-3 py-1 bg-red-600 text-white hover:bg-red-700 rounded"
                        onClick={() => handleDelete(u.id)}
                      >
                        삭제
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
