// // src/pages/RegisterPage.tsx
// import React from "react";
// import { Input } from "../components/ui/Input.tsx";
// import { Button } from "../components/ui/Button.tsx";

// export function RegisterPage() {
//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-50">
//       <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
//         <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>
//         <form className="space-y-4">
//           <div>
//             <label className="block mb-1 text-sm font-medium">이름</label>
//             <Input type="text" placeholder="이름을 입력하세요" />
//           </div>
//           <div>
//             <label className="block mb-1 text-sm font-medium">이메일</label>
//             <Input type="email" placeholder="email@example.com" />
//           </div>
//           <div>
//             <label className="block mb-1 text-sm font-medium">비밀번호</label>
//             <Input type="password" placeholder="비밀번호를 입력하세요" />
//           </div>
//           <Button className="w-full mt-4">회원가입</Button>
//         </form>
//         <p className="text-center text-sm text-gray-500 mt-4">
//           이미 계정이 있으신가요?{" "}
//           <a href="/login" className="text-blue-500 hover:underline">
//             로그인
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }
