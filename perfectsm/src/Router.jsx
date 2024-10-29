import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import LoginScreen from "./login"; // login page
import ChatInterface from "./components/chat/ChatInterface.jsx"; // chat interface page

export default function AppRouter() {
  // 로그인 상태를 관리하는 state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        {/* 로그인 상태에 따라 라우팅 결정 */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/chatinterface" /> // 로그인이 성공하면 ChatInterface로 이동
            ) : (
              <LoginScreen setIsLoggedIn={setIsLoggedIn} /> // 로그인 상태가 아니면 로그인 페이지
            )
          }
        />
        {/* /chatinterface 경로 추가 - 로그인 상태일 때만 ChatInterface 렌더링 */}
        <Route
          path="/chatinterface"
          element={
            isLoggedIn ? (
              <ChatInterface setIsLoggedIn={setIsLoggedIn} /> // setIsLoggedIn을 명시적으로 전달
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
