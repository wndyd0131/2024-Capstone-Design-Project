import { useRef, useState } from "react"; // useState 추가
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, X } from "lucide-react";

export default function FileUploadDialog({
  isOpen = false,
  onOpenChange = () => {},
  onConfirm = () => {},
  selectedFiles = [],
  onFileSelect = () => {},
  onFileRemove = () => {},
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false); // 드래그 상태 추가

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    onFileSelect(files);
  };

  // 드래그 앤 드롭 핸들러 추가
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    onFileSelect(files);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Attach Files</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={handleFileSelect}
          />

          {/* 드래그 앤 드롭 영역 추가 */}
          <div
            className={`
              relative rounded-lg border-2 border-dashed p-4 transition-colors duration-200 ease-in-out
              ${isDragging ? "border-gray-400 bg-gray-50" : "border-gray-200"}
            `}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full bg-black text-white hover:bg-gray-800 transition-colors duration-200 ease-in-out"
            >
              <Paperclip className="h-4 w-4 mr-2" />
              Select Files
            </Button>
            <p className="mt-2 text-sm text-center text-gray-500">
              or drag and drop files here
            </p>
          </div>

          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            {selectedFiles.length === 0 ? (
              <div className="text-center text-sm text-gray-500">
                No files selected
              </div>
            ) : (
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-2"
                  >
                    <div className="truncate text-sm">{file.name}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onFileRemove(file)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button
            onClick={onConfirm}
            className="hover:bg-gray-200 transition-colors duration-200 ease-in-out border border-gray-200"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
