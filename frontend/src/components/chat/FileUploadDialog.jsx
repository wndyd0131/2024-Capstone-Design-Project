import { useRef, useState } from "react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function FileUploadDialog({
  isOpen = false,
  onOpenChange = () => {},
  onConfirm = () => {},
  selectedFiles = [],
  onFileRemove = () => {},
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [newFiles, setNewFiles] = useState([]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setNewFiles((prevFiles) => [...prevFiles, ...files]);
  };

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
    setNewFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleConfirm = () => {
    onConfirm(newFiles);
    setNewFiles([]);
  };

  const handleRemoveNewFile = (fileToRemove) => {
    setNewFiles((prevFiles) =>
      prevFiles.filter((file) => file !== fileToRemove)
    );
  };

  const truncateFileName = (fileName, maxLength = 22) => {
    if (fileName.length <= maxLength) return fileName;
    const extension = fileName.split(".").pop();
    const nameWithoutExtension = fileName.slice(0, -(extension.length + 1));
    const truncatedName =
      nameWithoutExtension.slice(0, maxLength - 3 - extension.length) + "...";
    return `${truncatedName}.${extension}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white max-h-[100vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Attach Files</DialogTitle>
          <p className="text-xs text-gray-500 mt-1">
            Please share all documents
            <br /> you would like to send to Perfect Studymate.
          </p>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-4 my-4">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept=".pdf,application/pdf" //accepts only pdf files
            onChange={handleFileSelect}
          />

          <div
            className={`
              relative rounded-lg border-2 border-dashed p-4 transition-colors duration-200 ease-in-out
              flex flex-col justify-center items-center md:w-1/3
              ${isDragging ? "border-gray-400 bg-gray-50" : "border-gray-200"}
            `}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <p className="text-sm text-center text-gray-500 mb-4">
              Drag & Drop files HERE <br /> or
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full bg-black text-white hover:bg-gray-800 transition-colors duration-200 ease-in-out"
            >
              <Paperclip className="h-4 w-4 mr-2" />
              Browse Files
            </Button>
          </div>

          <div className="flex-grow md:w-2/3 h-[200px] md:h-[300px] rounded-md border overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                <h3 className="font-semibold mb-2">New Files:</h3>
                {newFiles.length === 0 ? (
                  <div className="text-center text-sm text-gray-500">
                    No new files selected
                  </div>
                ) : (
                  <div className="space-y-2">
                    {newFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-skkuOrange p-2"
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="truncate text-sm pr-2 max-w-[calc(100%-2rem)]">
                                {truncateFileName(file.name)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{file.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 flex-shrink-0"
                          onClick={() => handleRemoveNewFile(file)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <h3 className="font-semibold mt-4 mb-2">Existing Files:</h3>
                {selectedFiles.length === 0 ? (
                  <div className="text-center text-sm text-gray-500">
                    No existing files
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border p-2"
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="truncate text-sm pr-2 max-w-[calc(100%-2rem)]">
                                {truncateFileName(file.name)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{file.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 flex-shrink-0"
                          onClick={() => onFileRemove(file)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleConfirm}
            className="hover:bg-gray-200 transition-colors duration-200 ease-in-out border border-gray-200"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
