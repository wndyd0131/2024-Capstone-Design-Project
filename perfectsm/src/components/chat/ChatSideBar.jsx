import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle } from "lucide-react";

export function ChatSidebar({
  chatRooms,
  selectedRoomId,
  onRoomSelect,
  onCreateRoom,
}) {
  return (
    <div className="w-64 bg-white border-r">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 mt-1 text-center">
          Studymates Hub
        </h2>
        <Button
          onClick={onCreateRoom}
          className="w-full mb-4 bg-black text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> New Chat Room
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-160px)]">
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
    </div>
  );
}
