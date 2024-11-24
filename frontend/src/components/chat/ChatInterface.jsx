import React, { useState, useEffect } from "react";
import { ChatSidebar } from "./ChatSideBar";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { NewRoomDialog } from "./NewRoomDialog";
import FileUploadDialog from "./FileUploadDialog";
import { useNavigate } from "react-router-dom";
import { getUser } from "@/api/userAPI";
import Cookies from "js-cookie";

export default function ChatInterface({ setIsLoggedIn }) {
  // 채팅방 관련 상태
  const [chatRooms, setChatRooms] = useState([
    {
      chatroom_id: 1,
      chatroom_name: "e.g., Introduction to AI",
      messages: [],
      files: [],
    },
    {
      chatroom_id: 2,
      chatroom_name: "e.g., Machine Learning",
      messages: [],
      files: [],
    },
  ]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  // 메시지 입력 관련 상태
  const [inputMessage, setInputMessage] = useState("");

  // 새 채팅방 생성 관련 상태
  const [isNewRoomDialogOpen, setIsNewRoomDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomInstructor, setNewRoomInstructor] = useState("");
  const [newRoomCourseCode, setNewRoomCourseCode] = useState("");

  // 파일 업로드 관련 상태
  const [isFileUploadDialogOpen, setIsFileUploadDialogOpen] = useState(false);

  // 유저 정보 상태
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 현재 선택된 채팅방 찾기
  const selectedRoom = chatRooms.find(
    (room) => room.chatroom_id === selectedRoomId
  );

  // 유저 정보 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = Cookies.get("access_token");

      if (!accessToken) {
        console.log("토큰이 없습니다:", {
          accessToken: !!accessToken,
        });
        return;
      }

      try {
        const response = await getUser();
        setUser(response.data); // response.data로 접근
      } catch (error) {
        if (error.response?.status === 401) {
          console.error("401 Error:", error);
          window.location.reload();
        } else {
          console.error("Error fetching user data:", error);
          navigate("/login");
        }
      }
    };

    fetchUserData();
  }, []);

  // 메시지 전송 처리
  const handleSendMessage = () => {
    if (inputMessage.trim() && selectedRoomId) {
      const newMessage = {
        id: Date.now(),
        sender: "user",
        content: inputMessage.trim(),
      };
      setChatRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.chatroom_id === selectedRoomId
            ? { ...room, messages: [...room.messages, newMessage] }
            : room
        )
      );
      setInputMessage("");
    }
  };

  // 새 채팅방 생성 처리
  const handleNewRoomSubmit = () => {
    if (newRoomName) {
      const newRoom = {
        chatroom_id: Date.now(),
        chatroom_name: newRoomName,
        instructor_name: newRoomInstructor || undefined,
        course_code: newRoomCourseCode || undefined,
        messages: [],
        files: [],
      };
      setChatRooms((prevRooms) => [...prevRooms, newRoom]);
      setIsNewRoomDialogOpen(false);
      setNewRoomName("");
      setNewRoomInstructor("");
      setNewRoomCourseCode("");
      setSelectedRoomId(newRoom.chatroom_id);
    }
  };

  // 파일 업로드 처리
  const handleFileUpload = (files) => {
    if (selectedRoomId) {
      setChatRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.chatroom_id === selectedRoomId
            ? { ...room, files: [...room.files, ...files] }
            : room
        )
      );
    }
    setIsFileUploadDialogOpen(false);
  };

  // 파일 제거 처리
  const handleFileRemove = (fileToRemove) => {
    if (selectedRoomId) {
      setChatRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.chatroom_id === selectedRoomId
            ? {
                ...room,
                files: room.files.filter((file) => file !== fileToRemove),
              }
            : room
        )
      );
    }
  };

  // 채팅방 삭제 처리
  const handleDeleteRoom = (roomId) => {
    setChatRooms((prevRooms) =>
      prevRooms.filter((room) => room.chatroom_id !== roomId)
    );
    if (selectedRoomId === roomId) {
      setSelectedRoomId(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar
        chatRooms={chatRooms}
        selectedRoomId={selectedRoomId}
        onRoomSelect={setSelectedRoomId}
        onCreateRoom={() => setIsNewRoomDialogOpen(true)}
        onDeleteRoom={handleDeleteRoom}
        setIsLoggedIn={setIsLoggedIn}
        user={user}
      />

      {/* 채팅방 헤더 */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            <div className="bg-white p-4 border-b">
              <h2 className="text-xl font-bold">
                {selectedRoom.chatroom_name}
              </h2>
              {selectedRoom.instructor_name && (
                <p className="text-sm text-gray-500">
                  Instructor: {selectedRoom.instructor_name}
                </p>
              )}
              {selectedRoom.course_code && (
                <p className="text-sm text-gray-500">
                  Course Code: {selectedRoom.course_code}
                </p>
              )}
            </div>

            <ChatMessages messages={selectedRoom.messages} />

            <ChatInput
              inputMessage={inputMessage}
              onInputChange={setInputMessage}
              onSendMessage={handleSendMessage}
              onOpenFileUploadDialog={() => setIsFileUploadDialogOpen(true)}
              selectedFiles={selectedRoom.files}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">
              Select a chat room to start messaging
            </p>
          </div>
        )}
      </div>

      <NewRoomDialog
        isOpen={isNewRoomDialogOpen}
        onOpenChange={setIsNewRoomDialogOpen}
        onSubmit={handleNewRoomSubmit}
        newRoomName={newRoomName}
        newRoomInstructor={newRoomInstructor}
        newRoomCourseCode={newRoomCourseCode}
        onNameChange={setNewRoomName}
        onInstructorChange={setNewRoomInstructor}
        onCourseCodeChange={setNewRoomCourseCode}
      />

      <FileUploadDialog
        isOpen={isFileUploadDialogOpen}
        onOpenChange={setIsFileUploadDialogOpen}
        onConfirm={handleFileUpload}
        selectedFiles={selectedRoom?.files || []}
        onFileRemove={handleFileRemove}
      />
    </div>
  );
}
