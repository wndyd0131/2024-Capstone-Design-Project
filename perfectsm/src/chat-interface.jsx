import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Send, Paperclip } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function ChatInterface() {
  const [chatRooms, setChatRooms] = useState([
    { id: 1, name: "e.g., Introduction to AI", messages: [] },
    { id: 2, name: "e.g., Machine Learning", messages: [] },
  ]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isNewRoomDialogOpen, setIsNewRoomDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomInstructor, setNewRoomInstructor] = useState("");
  const [newRoomCourseCode, setNewRoomCourseCode] = useState("");

  const selectedRoom =
    chatRooms.find((room) => room.id === selectedRoomId) || null;

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedRoom?.messages]);

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

  const handleCreateRoom = () => {
    setIsNewRoomDialogOpen(true);
  };

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

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        {/* Sidebar title */}
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4 mt-1">Studymates Hub</h2>
          <Button
            onClick={handleCreateRoom}
            className="w-full mb-4 bg-black text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> New Chat Room
          </Button>
        </div>
        {/* Sidebar room scrollarea */}
        <ScrollArea className="h-[calc(100vh-160px)]">
          {chatRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoomId(room.id)}
              className={`w-full text-left p-4 rounded-none transition-transform duration-300 ease-in-out transform hover:-translate-y-1 ${
                selectedRoomId === room.id ? "bg-skkuGreen text-white" : ""
              }`}
            >
              {room.name}
            </button>
          ))}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
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
            <ScrollArea className="flex-1 p-4 h-[calc(100vh-250px)]">
              {selectedRoom.messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 ${
                    message.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-skkuGreen text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {message.content}
                    {message.file && (
                      <div className="mt-1 text-xs">
                        Attached: {message.file}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
            <div className="p-4 bg-white border-t">
              <div className="flex flex-col space-y-2">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow min-h-[70px] max-h-[150px] resize-none"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <div className="flex justify-between">
                  <div>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <Button
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                      variant="outline"
                      className="hover:bg-gray-200 transition-colors duration-200 ease-in-out"
                    >
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach File
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    className="hover:bg-gray-200 transition-colors duration-200 ease-in-out"
                  >
                    <Send className="h-4 w-4 mr-2" /> Send
                  </Button>
                </div>
              </div>
              {selectedFile && (
                <div className="mt-2 text-sm text-gray-500">
                  Selected file: {selectedFile.name}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">
              Select a chat room to start messaging
            </p>
          </div>
        )}
      </div>

      {/* New Room Dialog */}
      <Dialog open={isNewRoomDialogOpen} onOpenChange={setIsNewRoomDialogOpen}>
        <DialogContent className="bg-white text-black">
          <DialogHeader>
            <DialogTitle>Create New Chat Room</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Course Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="col-span-3"
                placeholder="Enter new Course Name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="instructor" className="text-right">
                Instructor
              </Label>
              <Input
                id="instructor"
                value={newRoomInstructor}
                onChange={(e) => setNewRoomInstructor(e.target.value)}
                className="col-span-3"
                placeholder="optional"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="courseCode" className="text-right">
                Course Code
              </Label>
              <Input
                id="courseCode"
                value={newRoomCourseCode}
                onChange={(e) => setNewRoomCourseCode(e.target.value)}
                className="col-span-3"
                placeholder="optional"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleNewRoomSubmit}
              className={`w-full ${
                !newRoomName
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white"
              }`}
              disabled={!newRoomName}
            >
              Create Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
