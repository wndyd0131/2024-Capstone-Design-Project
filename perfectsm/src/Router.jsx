import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import LoginScreen from "./login"; // login page
import ChatInterface from "./chat-interface"; // chat interface page

export default function AppRouter() {
  // 로그인 상태를 관리하는 state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 상태에 따라 라우팅 결정 */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <ChatInterface /> // 로그인이 성공하면 ChatInterface로 이동
            ) : (
              <LoginScreen setIsLoggedIn={setIsLoggedIn} /> // 로그인 상태가 아니면 로그인 페이지
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
