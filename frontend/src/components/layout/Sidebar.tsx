// import React from "react";
// import { Link } from "react-router-dom";
// import { Compass, Map, Sparkles, CloudSun } from "lucide-react";

// /**
//  * Responsive sidebar that matches the current green / nature theme.
//  * Hidden on small screens, fixed on lg+.
//  */
// export function Sidebar(): JSX.Element {
//   return (
//     <aside className="hidden lg:flex lg:flex-col w-64 h-screen fixed top-16 left-0 bg-gradient-to-b from-green-50 to-white border-r border-gray-200 shadow-sm z-40">
//       {/* Header Illustration */}
//       <div className="flex flex-col items-center py-6 px-4">
//         <img
//           src="/sidebar-forest.svg"
//           alt="Forest Illustration"
//           className="w-24 h-24 mb-4"
//         />
//         <h2 className="text-xl font-bold text-green-700">오늘의 탐방</h2>
//       </div>

//       {/* Quick Navigation */}
//       <nav className="flex-1 px-6 space-y-6">
//         <div className="space-y-2">
//           <p className="text-sm font-semibold text-gray-600">바로가기</p>
//           <Link
//             to="/recommend"
//             className="flex items-center gap-3 text-gray-700 hover:text-green-700 transition-colors"
//           >
//             <Compass size={18} /> 추천 받기
//           </Link>
//           <Link
//             to="/board"
//             className="flex items-center gap-3 text-gray-700 hover:text-green-700 transition-colors"
//           >
//             <Sparkles size={18} /> 게시판
//           </Link>
//         </div>

//         <div className="space-y-2 pt-4 border-t border-gray-200">
//           <p className="text-sm font-semibold text-gray-600">탐방 도구</p>
//           <button className="flex items-center gap-3 text-gray-700 hover:text-green-700 transition-colors">
//             <Map size={18} /> 지도 보기
//           </button>
//           <button className="flex items-center gap-3 text-gray-700 hover:text-green-700 transition-colors">
//             <CloudSun size={18} /> 오늘 날씨
//           </button>
//         </div>
//       </nav>

//       {/* Footer */}
//       <div className="p-4 text-xs text-gray-400 border-t border-gray-200">
//         &copy; {new Date().getFullYear()} Trail Finder
//       </div>
//     </aside>
//   );
// }
