"use client";

import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Send,
  FileSpreadsheet,
  Copy,
  Share2,
  Download,
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

type MessageRole = "user" | "assistant";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  type: "text" | "file";
  fileName?: string;
  timestamp: Date;
  isTyping?: boolean; // For typing effect on new AI messages
}

interface PendingFile {
  id: string;
  file: File;
  name: string;
  status: "uploading" | "ready";
  progress: number;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "user",
    content: "How to cook chicken fry?",
    type: "text",
    timestamp: new Date(Date.now() - 100000),
  },
  {
    id: "2",
    role: "assistant",
    content:
      "Lorem ipsum dolor sit amet consectetur. Sed hendrerit ullamcorper elit adipiscing urna. Ut ipsum orci libero, consectetur at.",
    type: "text",
    timestamp: new Date(Date.now() - 90000),
  },
  //   {
  //     id: "3",
  //     role: "user",
  //     content: "Give me the ingredient List for this recipe",
  //     type: "text",
  //     timestamp: new Date(Date.now() - 80000),
  //   },
  //   {
  //     id: "4",
  //     role: "assistant",
  //     content: "",
  //     type: "file",
  //     fileName: "ingredient.xlsx",
  //     timestamp: new Date(Date.now() - 70000),
  //   },
];

export default function AiAssistantClient() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);

  // For typing effect
  const [typingText, setTypingText] = useState("");
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, typingText, pendingFiles]);

  const handleSendMessage = async () => {
    const isFileOnly = pendingFiles.length > 0 && !inputValue.trim();
    const hasReadyFiles = pendingFiles.every((pf) => pf.status === "ready");

    if (
      (!inputValue.trim() && pendingFiles.length === 0) ||
      isLoading ||
      !hasReadyFiles
    ) {
      if (!hasReadyFiles && pendingFiles.length > 0) {
        toast.error("Please wait for files to finish uploading.");
      }
      return;
    }

    const newMessages = [...messages];

    // Add files as user messages
    pendingFiles.forEach((pendingFile) => {
      newMessages.push({
        id: Date.now().toString() + "-" + pendingFile.id,
        role: "user",
        content: `I attached a file: ${pendingFile.name}`,
        type: "file",
        fileName: pendingFile.name,
        timestamp: new Date(),
      });
    });

    // Add text as user message if present
    if (inputValue.trim()) {
      newMessages.push({
        id: Date.now().toString(),
        role: "user",
        content: inputValue,
        type: "text",
        timestamp: new Date(),
      });
    }

    setMessages(newMessages);
    setInputValue("");
    setPendingFiles([]);
    setIsLoading(true);

    try {
      // Create a prompt that includes file names if applicable
      const apiMessages = newMessages.map((msg) => ({
        role: msg.role,
        content:
          msg.type === "file"
            ? `[Attached file: ${msg.fileName}]`
            : msg.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      const aiContent = data.choices?.[0]?.message?.content || "";

      // Add actual assistant message but mark it as typing
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiContent,
        type: "text",
        timestamp: new Date(),
        isTyping: true,
      };

      setMessages((prev) => [...prev, aiResponse]);
      startTypingEffect(aiContent, aiResponse.id);
    } catch (error: any) {
      toast.error(error.message);
      console.error("Chat Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startTypingEffect = (fullText: string, messageId: string) => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    setTypingText("");
    let currentIndex = 0;

    typingIntervalRef.current = setInterval(() => {
      currentIndex += 1; // You can do a slightly random step here or fixed step.
      setTypingText(fullText.slice(0, currentIndex));

      if (currentIndex >= fullText.length) {
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, isTyping: false } : m)),
        );
      }
    }, 15); // Adjust typing speed here
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (pendingFiles.length + files.length > 4) {
      toast.error("You can only upload up to 4 files at once.");
    }

    const availableSlots = 4 - pendingFiles.length;
    if (availableSlots <= 0) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const allowedFiles = files.slice(0, availableSlots);

    // Create new pending files with "uploading" state
    const newPendingFiles: PendingFile[] = allowedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      name: file.name,
      status: "uploading",
      progress: 0,
    }));

    setPendingFiles((prev) => [...prev, ...newPendingFiles]);

    // Simulate upload progress for each file
    newPendingFiles.forEach((pf) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setPendingFiles((prev) =>
          prev.map((f) =>
            f.id === pf.id
              ? {
                  ...f,
                  progress: Math.min(progress, 100),
                  status: progress >= 100 ? "ready" : "uploading",
                }
              : f,
          ),
        );

        if (progress >= 100) {
          clearInterval(interval);
          toast.success(`${pf.name} uploaded successfully`);
        }
      }, 300); // Simulated delay
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemovePendingFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const toggleActionMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-white rounded-3xl overflow-hidden w-2/3 mx-auto">
      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 md:px-16 py-8 space-y-6 scroll-smooth"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex flex-col w-full",
              message.role === "user" ? "items-end" : "items-start",
            )}
          >
            <div className="relative group max-w-[85%] md:max-w-[70%] mb-2">
              {/* Message Bubble */}
              <div
                className={cn(
                  "p-3.5 px-6 rounded-3xl font-medium leading-relaxed shadow-sm",
                  message.role === "user"
                    ? "bg-primary text-white rounded-tr-none"
                    : "bg-white border border-gray-100 text-[#4B5563] rounded-tl-none",
                )}
              >
                {message.type === "text" ? (
                  message.role === "assistant" && message.isTyping ? (
                    <div className="prose prose-sm prose-p:leading-relaxed prose-pre:bg-gray-800 prose-pre:text-white max-w-none break-words">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {typingText + " ▋"}
                      </ReactMarkdown>
                    </div>
                  ) : message.role === "assistant" ? (
                    <div className="prose prose-sm prose-p:leading-relaxed prose-pre:bg-gray-800 prose-pre:text-white max-w-none break-words">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    message.content
                  )
                ) : (
                  <div className="flex items-center gap-3 py-1">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-gray-100">
                      <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-current font-bold text-xs">
                      {message.fileName}
                    </span>
                  </div>
                )}
              </div>
              {/* Context Menu */}
              {activeMenuId === message.id && message.role === "assistant" && (
                <div
                  className="absolute left-[-10px] top-full mt-2 w-[140px] bg-[#E8F4FF] rounded-2xl shadow-[0px_4px_24px_rgba(0,0,0,0.08)] border border-white/50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col p-1.5 gap-0.5">
                    {[
                      { icon: Copy, label: "Copy" },
                      //   { icon: Edit2, label: "Edit" },
                      { icon: Share2, label: "Share" },
                      { icon: Download, label: "Download" },
                    ].map((item) => (
                      <button
                        key={item.label}
                        className="flex items-center gap-3 px-3 py-2 text-[11px] font-black text-secondary hover:bg-white/80 rounded-xl transition-all active:scale-95 cursor-pointer"
                      >
                        <item.icon className="w-3.5 h-3.5 text-secondary" />{" "}
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Menu Trigger */}
              {message.role === "assistant" && (
                <button
                  onClick={(e) => toggleActionMenu(message.id, e)}
                  className={cn(
                    "absolute -left-10 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-all cursor-pointer hidden",
                    activeMenuId === message.id
                      ? "bg-gray-100 opacity-100"
                      : "opacity-0 group-hover:opacity-100",
                  )}
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col items-start w-full">
            <div className="bg-gray-50 border border-gray-100 p-3.5 px-6 rounded-[24px] rounded-tl-none animate-pulse">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-8 bg-white border-t border-gray-50 flex flex-col gap-3">
        {/* Pending Files Preview */}
        {pendingFiles.length > 0 && (
          <div className="max-w-4xl mx-auto w-full flex flex-wrap gap-2 mb-2 px-2">
            {pendingFiles.map((file) => (
              <div
                key={file.id}
                className="relative flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 animate-in slide-in-from-bottom-2 fade-in"
              >
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-gray-100 shrink-0">
                  <FileSpreadsheet className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex flex-col min-w-0 pr-6">
                  <span className="text-xs font-semibold text-gray-700 truncate max-w-[120px]">
                    {file.name}
                  </span>
                  {file.status === "uploading" ? (
                    <div className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                      Uploading {file.progress}%
                    </div>
                  ) : (
                    <span className="text-[10px] text-green-600 font-medium">
                      Ready
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => handleRemovePendingFile(file.id, e)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                  title="Remove file"
                >
                  <Plus className="w-3 h-3 rotate-45" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="max-w-4xl mx-auto w-full flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type your message or attach a file..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isLoading}
              className="w-full bg-[#F3F4F6] border-none rounded-full py-4 px-8 pr-16 font-medium focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 transition-all disabled:opacity-50"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                title="Upload file"
              >
                <Plus className="w-5 h-5" />
              </button>
              {/* <button
                className="p-2 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                title="Voice input"
              >
                <Mic className="w-5 h-5" />
              </button> */}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={handleFileUpload}
              accept=".csv,.xlsx,.xls,.pdf,.doc,.docx"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={
              isLoading ||
              (!inputValue.trim() && pendingFiles.length === 0) ||
              pendingFiles.some((f) => f.status === "uploading")
            }
            className="w-14 h-14 rounded-full bg-white border border-border flex items-center justify-center text-primary shadow-[0px_2px_8px_rgba(0,0,0,0.05)] hover:shadow-md hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
