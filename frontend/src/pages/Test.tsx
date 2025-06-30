import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/Card.tsx";
import { Button } from "../components/ui/Button.tsx";

interface Option {
  label: string;
  score: number;
}
interface Question {
  text: string;
  options: Option[];
}

const likertOptions: Option[] = [
  { label: "매우 아니다", score: 1 },
  { label: "아니다", score: 2 },
  { label: "모르겠다", score: 3 },
  { label: "그렇다", score: 4 },
  { label: "매우 그렇다", score: 5 },
];

const questions: Question[] = [
  {
    text: "1. 등산을 떠날 때 항상 철저하게 계획을 세운다.",
    options: likertOptions,
  },
  {
    text: "2. 날씨가 변덕스러울 때도 계획된 코스를 그대로 따른다.",
    options: likertOptions,
  },
  {
    text: "3. 비상 상황에서도 침착하게 대처할 자신이 있다.",
    options: likertOptions,
  },
  { text: "4. 지도나 나침반을 사용하는 데 익숙하다.", options: likertOptions },
  {
    text: "5. 긴 트레킹 날에도 체력을 유지하기 위해 운동 루틴을 갖고 있다.",
    options: likertOptions,
  },
  {
    text: "6. 무거운 배낭을 메고도 불편함 없이 걷는다.",
    options: likertOptions,
  },
  {
    text: "7. 야생동물을 마주쳤을 때 효과적으로 대응하는 방법을 알고 있다.",
    options: likertOptions,
  },
  {
    text: "8. 응급 상황에서 기본 응급처치를 할 수 있다.",
    options: likertOptions,
  },
  {
    text: "9. 휴대폰 외에도 위성 메신저나 PLB 같은 보조 장비를 준비한다.",
    options: likertOptions,
  },
  {
    text: "10. 백패킹 경험이 풍부하며, 1박 이상도 자신 있다.",
    options: likertOptions,
  },
  {
    text: "11. 등산 중 마주칠 수 있는 위험 요인을 사전에 파악한다.",
    options: likertOptions,
  },
  {
    text: "12. 자연 훼손을 최소화하는 방법을 철저히 실천한다.",
    options: likertOptions,
  },
  {
    text: "13. 고도 1500m 이상의 고산에도 도전해 본 경험이 있다.",
    options: likertOptions,
  },
  {
    text: "14. 산행 중에는 주변 사람들과 원활하게 소통하며 돕는다.",
    options: likertOptions,
  },
  {
    text: "15. 장시간 산행 후에도 체력 회복이 빠른 편이다.",
    options: likertOptions,
  },
];

export default function Quiz() {
  const [answers, setAnswers] = useState<number[]>(
    Array(questions.length).fill(0)
  );
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (qIdx: number, score: number) => {
    const updated = [...answers];
    updated[qIdx] = score;
    setAnswers(updated);
  };

  const totalScore = answers.reduce((a, b) => a + b, 0);
  let grade = "";
  if (totalScore <= 30) grade = "🥉 초급 하이커";
  else if (totalScore <= 55) grade = "🥈 중급 하이커";
  else grade = "🥇 고급 하이커";

  return (
    <div className="max-w-3xl mx-auto p-4">
      {!showResult ? (
        <Card className="mb-6">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-6">하이커 등급 테스트</h2>
            <div className="space-y-8">
              {questions.map((q, qIdx) => (
                <div key={qIdx}>
                  <p className="mb-4 font-medium">{q.text}</p>
                  <div className="flex justify-between">
                    {q.options.map((opt, idx) => (
                      <label
                        key={idx}
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <input
                          type="radio"
                          name={`question-${qIdx}`}
                          value={opt.score}
                          checked={answers[qIdx] === opt.score}
                          onChange={() => handleSelect(qIdx, opt.score)}
                          className="sr-only"
                        />
                        <span
                          className={`block w-8 h-8 border-2 rounded-full mb-2 transition-colors ${
                            {
                              1: "border-red-400",
                              2: "border-orange-400",
                              3: "border-gray-300",
                              4: "border-blue-400",
                              5: "border-teal-500",
                            }[opt.score]
                          } ${
                            answers[qIdx] === opt.score
                              ? {
                                  1: "bg-red-400",
                                  2: "bg-orange-400",
                                  3: "bg-gray-300",
                                  4: "bg-blue-400",
                                  5: "bg-teal-500",
                                }[opt.score]
                              : ""
                          }`}
                        />
                        <span className="text-xs text-center text-gray-700">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button
                onClick={() => setShowResult(true)}
                disabled={answers.some((a) => a === 0)}
              >
                결과 보기
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center">
            <h2 className="text-2xl font-bold mb-2">결과</h2>
            <p className="text-lg mb-4">총점: {totalScore}점</p>
            <p className="text-xl font-semibold mb-4">{grade}</p>
            <Button variant="secondary" onClick={() => setShowResult(false)}>
              다시 풀기
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
