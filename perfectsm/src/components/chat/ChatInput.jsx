import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";
import { useRef, useEffect } from "react";

export function ChatInput({
  inputMessage,
  onInputChange,
  onSendMessage,
  onFileSelect,
  selectedFile,
}) {
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // 줄 높이 계산 (기본 폰트 크기 16px * 1.5 line-height = 24px)
      const lineHeight = 24;
      const minHeight = 70; // 기본 높이
      const maxHeight = lineHeight * 10; // 10줄까지 표시

      // 높이를 초기화하고 스크롤 높이 계산
      textarea.style.height = `${minHeight}px`;
      const scrollHeight = textarea.scrollHeight;

      // 높이 설정 (최소, 최대 높이 제한 적용)
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [inputMessage]);

  return (
    <div className="p-4 bg-white border-t">
      <div className="flex flex-col space-y-2">
        <Textarea
          value={inputMessage}
          onChange={(e) => onInputChange(e.target.value)}
          ref={textareaRef}
          placeholder="Type your message..."
          className="flex-grow min-h-[70px] max-h-[150px] resize-none"
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSendMessage();
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
              onClick={() => document.getElementById("file-upload")?.click()}
              variant="outline"
              className="hover:bg-gray-200 transition-colors duration-200 ease-in-out"
            >
              <Paperclip className="h-4 w-4 mr-2" />
              Attach File
            </Button>
          </div>
          <Button
            onClick={onSendMessage}
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
  );
}
