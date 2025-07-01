import axios from "axios";
import { useState } from "react";
import URL from "../constants/url";

async function chatWithGeminiHistory(prompt, history = []) {
  try {
    const res = await axios.post(`${URL.BACKEND_URL}/api/chat/gemini/history`, {
      prompt,
      history,
    });
    return res.data;
  } catch (error) {
    console.error("Gemini API 호출 에러:", error);
    throw error;
  }
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSend = async () => {
    const model_input = input;
    setInput("");

    if (!input.trim()) return;
    setLoading(true);
    try {
      const result = await chatWithGeminiHistory(model_input, history);
      setHistory(result.history);
      console.log("result", result);
    } catch (err) {
      alert("에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {isOpen && (
        <div
          className="fixed right-8 w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col z-50 animate-fade-in-up"
          style={{ bottom: "120px" }}
        >
          <div className="bg-green-600 text-white px-4 py-2 rounded-t-lg font-semibold z-60">
            쳇봇
          </div>
          <div className="flex-1 p-4 overflow-y-auto text-sm">
            {history.length === 0 ? (
              <p className="text-gray-500">안녕하세요! 무엇을 도와드릴까요?</p>
            ) : (
              history.map((item, index) => (
                <div key={index}>
                  {item.role === "user" ? (
                    <div className="text-right mb-1">
                      <div className="inline-block bg-green-100 text-green-900 px-3 py-2 rounded-lg max-w-[70%]">
                        {item.text}
                      </div>
                    </div>
                  ) : (
                    <div className="text-left mb-2">
                      <div className="inline-block bg-gray-100 text-gray-900 px-3 py-2 rounded-lg max-w-[70%]">
                        {item.text}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          <div className="border-t px-3 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="메시지를 입력하세요..."
              className="w-full px-3 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className={`mt-2 w-full py-2 px-4 rounded-full text-sm font-medium text-white transition-all 
  ${
    loading
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-green-600 hover:bg-green-700"
  }`}
            >
              {loading ? "전송 중..." : "전송"}
            </button>
          </div>
        </div>
      )}

      {/* 챗봇 버튼 */}
      <button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 bg-white p-3 rounded-full shadow-lg hover:scale-105 transition-transform z-50"
      >
        <img
          src="/chatbot_icon.png"
          className="w-14 h-14 hover:scale-105 transition-transform"
        />
      </button>
    </>
  );
};

export default Chatbot;
