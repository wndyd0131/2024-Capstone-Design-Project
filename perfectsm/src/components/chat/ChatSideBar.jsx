import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ChatSidebar({
  chatRooms,
  selectedRoomId,
  onRoomSelect,
  onCreateRoom,
  setIsLoggedIn = () => {}, // Login.jsx와 동일한 prop 사용
}) {
  const [showLogout, setShowLogout] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading 상태 추가
  const navigate = useNavigate();

  //임시 유저 데이터
  const user = {
    name: "Sungkyun Kim",
    id: "Sungkyun.kim@example.com",
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      // 로그아웃 처리 전에 console.log로 확인
      console.log("Logging out...", setIsLoggedIn);

      if (typeof setIsLoggedIn === "function") {
        setIsLoggedIn(false);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate("/login");
      } else {
        console.error("setIsLoggedIn is not a function:", setIsLoggedIn);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-64 bg-white border-r flex flex-col h-full">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 mt-1 text-center">
          Studymates Hub
        </h2>
        <Button
          onClick={onCreateRoom}
          className="w-full mb-4 bg-black text-white hover:bg-gray-500" // Login.jsx와 동일한 스타일
        >
          <PlusCircle className="mr-2 h-4 w-4" /> New Chat Room
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {chatRooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onRoomSelect(room.id)}
            className={`w-full text-left p-4 rounded-none transition-transform duration-300 ease-in-out transform hover:-translate-y-1 border-none outline-none focus:outline-none ${
              selectedRoomId === room.id ? "bg-skkuGreen text-white" : ""
            }`}
          >
            {room.name}
          </button>
        ))}
      </ScrollArea>

      <div className="border-t p-4">
        <div className="relative">
          <button
            onClick={() => setShowLogout(!showLogout)}
            className="w-full flex flex-col items-start hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200"
          >
            <span className="font-medium">{user.name}</span>
            <span className="text-sm text-gray-500">{user.id}</span>
          </button>

          {showLogout && (
            <div className="absolute bottom-full left-0 mb-2 w-full bg-white shadow-lg rounded-lg border overflow-hidden">
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
