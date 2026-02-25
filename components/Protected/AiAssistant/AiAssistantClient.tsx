"use client";

import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Send,
  FileSpreadsheet,
  Copy,
  Edit2,
  Share2,
  Download,
  MoreVertical,
  Mic,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type MessageRole = "user" | "assistant";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  type: "text" | "file";
  fileName?: string;
  timestamp: Date;
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      type: "text",
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      const aiContent = data.choices?.[0]?.message?.content || "";

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiContent,
        type: "text",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error: any) {
      toast.error(error.message);
      console.error("Chat Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate file message
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: "",
      type: "file",
      fileName: file.name,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    toast.success(`${file.name} uploaded successfully`);
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
                  "p-3.5 px-6 rounded-[24px] text-xs font-medium leading-relaxed shadow-sm",
                  message.role === "user"
                    ? "bg-primary text-white rounded-tr-none"
                    : "bg-white border border-gray-100 text-[#4B5563] rounded-tl-none",
                )}
              >
                {message.type === "text" ? (
                  message.content
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
                    "absolute -left-10 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-all cursor-pointer",
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
      <div className="p-4 md:p-8 bg-white border-t border-gray-50">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type your message"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isLoading}
              className="w-full bg-[#F3F4F6] border-none rounded-full py-4 px-8 pr-16 text-sm font-medium focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 transition-all disabled:opacity-50"
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
              onChange={handleFileUpload}
              accept=".csv,.xlsx,.xls,.pdf"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="w-12 h-12 rounded-full bg-white border border-border flex items-center justify-center text-primary shadow-[0px_2px_8px_rgba(0,0,0,0.05)] hover:shadow-md hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
