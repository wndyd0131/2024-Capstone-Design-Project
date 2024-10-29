import React, { useState, useEffect } from "react";
import { ChatSidebar } from "./ChatSideBar";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { NewRoomDialog } from "./NewRoomDialog";

export default function ChatInterface({ setIsLoggedIn }) {
  // 채팅방 관련 상태
  const [chatRooms, setChatRooms] = useState([
    { id: 1, name: "e.g., Introduction to AI", messages: [] },
    { id: 2, name: "e.g., Machine Learning", messages: [] },
  ]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  // 메시지 입력 관련 상태
  const [inputMessage, setInputMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // 새 채팅방 생성 관련 상태
  const [isNewRoomDialogOpen, setIsNewRoomDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomInstructor, setNewRoomInstructor] = useState("");
  const [newRoomCourseCode, setNewRoomCourseCode] = useState("");

  // 현재 선택된 채팅방 찾기
  const selectedRoom = chatRooms.find((room) => room.id === selectedRoomId);

  // 메시지 전송 처리
  const handleSendMessage = () => {
    if ((inputMessage.trim() || selectedFile) && selectedRoomId) {
      const newMessage = {
        id: Date.now(),
        sender: "user",
        content: inputMessage.trim(),
        file: selectedFile ? selectedFile.name : undefined,
      };
      setChatRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === selectedRoomId
            ? { ...room, messages: [...room.messages, newMessage] }
            : room
        )
      );
      setInputMessage("");
      setSelectedFile(null);
    }
  };

  // 새 채팅방 생성 처리
  const handleNewRoomSubmit = () => {
    if (newRoomName) {
      const newRoom = {
        id: Date.now(),
        name: newRoomName,
        instructor: newRoomInstructor || undefined,
        courseCode: newRoomCourseCode || undefined,
        messages: [],
      };
      setChatRooms((prevRooms) => [...prevRooms, newRoom]);
      setIsNewRoomDialogOpen(false);
      setNewRoomName("");
      setNewRoomInstructor("");
      setNewRoomCourseCode("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 사이드바 */}
      <ChatSidebar
        chatRooms={chatRooms}
        selectedRoomId={selectedRoomId}
        onRoomSelect={setSelectedRoomId}
        onCreateRoom={() => setIsNewRoomDialogOpen(true)}
        setIsLoggedIn={setIsLoggedIn}
      />

      {/* 메인 채팅 영역 */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* 채팅방 헤더 */}
            <div className="bg-white p-4 border-b">
              <h2 className="text-xl font-bold">{selectedRoom.name}</h2>
              {selectedRoom.instructor && (
                <p className="text-sm text-gray-500">
                  Instructor: {selectedRoom.instructor}
                </p>
              )}
              {selectedRoom.courseCode && (
                <p className="text-sm text-gray-500">
                  Course Code: {selectedRoom.courseCode}
                </p>
              )}
            </div>

            {/* 메시지 목록 */}
            <ChatMessages messages={selectedRoom.messages} />

            {/* 메시지 입력 */}
            <ChatInput
              inputMessage={inputMessage}
              onInputChange={setInputMessage}
              onSendMessage={handleSendMessage}
              onFileSelect={setSelectedFile}
              selectedFile={selectedFile}
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

      {/* 새 채팅방 생성 다이얼로그 */}
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
    </div>
  );
}
