// src/pages/InfoPage.tsx
import React, { useState, useEffect } from "react";

import logo from "../assets/logo.png";
//
import { useLocation } from "react-router-dom";
import { Card, CardContent } from "../components/ui/Card.tsx";
import { Button } from "../components/ui/Button.tsx";
import { ChevronDown, ChevronUp } from "lucide-react";

export function InfoPage() {
  const location = useLocation();
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) {
      setOpenSection(hash);
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash]);

  const sections = [
    {
      id: "intro",
      title: "회사 소개",
      content: `저희 탐방로 추천 서비스는 사용자에게 최적의 탐방 경험을 제공하기 위해 설립된 회사입니다. 최신 AI 기술과 날씨, 위치 데이터를 결합하여 개인화된 코스를 추천해 드립니다.`,
    },
    {
      id: "terms",
      title: "이용 약관",
      content: `1. 서비스 이용에 대한 일반 사항
2. 회원 가입 및 탈퇴 절차
3. 개인정보 보호 정책 준수
4. 서비스 제공의 변경 및 중단`,
    },
    {
      id: "privacy",
      title: "개인정보처리방침",
      content: `사용자의 개인정보는 철저히 보호되며, 수집된 정보는 서비스 제공을 위한 목적에만 사용됩니다. 관련 법령에 따라 안전하게 처리되고, 사용자의 동의 없이는 제3자에게 제공되지 않습니다.`,
    },
  ];

  // 해시에서 들어온 경우 해당 섹션만 표시
  // 해시에서 들어온 경우에도 모든 섹션을 표시, 단 해당 섹션만 열림
  // const visibleSections = sections;

  return (
    <div className="relative min-h-screen bg-green-50 text-gray-800 pt-20 overflow-hidden">
      {/* 배경 로고: 우측에 1/3만 노출 */}
      <img
        src={logo}
        alt="배경 로고"
        className="absolute top-0 left-[50%] h-[150%] w-auto opacity-10 pointer-events-none select-none"
      />
      <main className="max-w-5xl mx-auto px-6 py-16 space-y-8">
        {sections.map((sec) => (
          <Card key={sec.id} className="bg-white">
            <CardContent className="p-6">
              <div id={sec.id} className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-green-700">
                  {sec.title}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setOpenSection(openSection === sec.id ? null : sec.id)
                  }
                >
                  {openSection === sec.id ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </Button>
              </div>
              {openSection === sec.id && (
                <div className="mt-4 whitespace-pre-line leading-relaxed text-gray-600">
                  {sec.content}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
}
