import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef, useEffect } from "react";

export function ChatMessages({ messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4 h-[calc(100vh-250px)]">
      {messages.map((message) => (
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
              <div className="mt-1 text-xs">Attached: {message.file}</div>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
}
