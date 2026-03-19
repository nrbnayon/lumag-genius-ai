"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  FileSpreadsheet,
  Copy,
  Share2,
  Download,
  MoreVertical,
  Utensils,
  TrendingUp,
  Users,
  Sparkles,
  MessageSquareOff,
  Bot
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { getCookie } from "@/redux/features/apiSlice";
import { ConfirmationModal } from "@/components/Shared/ConfirmationModal";

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

const SUGGESTED_QUESTIONS = [
  { icon: Utensils, label: "Menu Planning", text: "Suggest a profitable 3-course menu for a fine dining restaurant" },
  { icon: TrendingUp, label: "Cost Optimization", text: "How can I reduce food waste and optimize ingredient costs?" },
  { icon: Users, label: "Staff Management", text: "Create an efficient weekly shift schedule for 5 bar chefs" },
  { icon: Sparkles, label: "Recipe Ideas", text: "Give me an innovative recipe for a signature cocktail" },
];

export default function AiAssistantClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);

  // For typing effect
  const [typingText, setTypingText] = useState("");
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const confirmClearChat = () => {
    setMessages([]);
    localStorage.removeItem("ai_chat_history");
    setIsClearModalOpen(false);
    toast.success("Chat history cleared. Starting fresh!");
  };

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("ai_chat_history");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        const mapped = parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        setMessages(mapped);
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    }
    setIsInitialized(true);
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("ai_chat_history", JSON.stringify(messages));
    }
  }, [messages, isInitialized]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, typingText, pendingFiles]);

  const clearChat = () => {
    setIsClearModalOpen(true);
  };

  const executeWaitAndSend = async (question: string) => {
    setInputValue(question);
    // Allow React state to update before sending
    setTimeout(() => {
      handleSendMessage(question);
    }, 50);
  };

  const handleSendMessage = async (overrideValue?: string) => {
    const valueToSend = overrideValue || inputValue;
    const isFileOnly = pendingFiles.length > 0 && !valueToSend.trim();
    const hasReadyFiles = pendingFiles.every((pf) => pf.status === "ready");

    if (
      (!valueToSend.trim() && pendingFiles.length === 0) ||
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
    if (valueToSend.trim()) {
      newMessages.push({
        id: Date.now().toString(),
        role: "user",
        content: valueToSend,
        type: "text",
        timestamp: new Date(),
      });
    }

    setMessages(newMessages);
    setInputValue("");
    setPendingFiles([]);
    setIsLoading(true);

    try {
      let aiContent = "";
      let success = false;
      const token = getCookie("accessToken");
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://10.10.12.11:6005/";

      // Try new AI chat API first
      try {
        // Construct the question string including info about attached files if any
        let fullQuestion = valueToSend;
        if (pendingFiles.length > 0) {
          const fileNames = pendingFiles.map((f) => f.name).join(", ");
          fullQuestion = `${valueToSend} [Attached files: ${fileNames}]`.trim();
        }

        const response = await fetch(`${baseUrl}api/ai/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ question: fullQuestion }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.data?.ai_response?.success || result.data?.answer) {
            aiContent = result.data.ai_response ? result.data.ai_response.data.answer : result.data.answer;
            success = true;
          } else if (result.answer) {
             aiContent = result.answer; 
             success = true;
          }
        }
      } catch (err) {
        console.warn("New AI Chat API failed, falling back to legacy API", err);
      }

      // Fallback if the first one failed or didn't return a success response
      if (!success) {
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

        aiContent = data.choices?.[0]?.message?.content || "I couldn't process your request.";
      }

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
      currentIndex += 1;
      setTypingText(fullText.slice(0, currentIndex));

      if (currentIndex >= fullText.length) {
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, isTyping: false } : m)),
        );
      }
    }, 15);
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

    const newPendingFiles: PendingFile[] = allowedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      name: file.name,
      status: "uploading",
      progress: 0,
    }));

    setPendingFiles((prev) => [...prev, ...newPendingFiles]);

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
      }, 300);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

  // Avoid rendering anything until initialized to prevent hydration mismatch with localStorage
  if (!isInitialized) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-white rounded-3xl overflow-hidden w-full lg:w-3/4 mx-auto border border-gray-100 shadow-sm relative">
      
      {/* Header with Clear Chat */}
      {messages.length > 0 && (
         <div className="absolute top-4 right-6 z-10 flex items-center justify-end">
          <button 
            onClick={clearChat}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-full font-bold text-xs transition-colors shadow-sm"
          >
            <MessageSquareOff className="w-3.5 h-3.5" /> Clear Chat
          </button>
        </div>
      )}

      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 md:px-16 py-8 space-y-6 scroll-smooth custom-scrollbar"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full animate-in fade-in zoom-in duration-500">
             <div className="w-20 h-20 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-100">
               <Bot className="w-10 h-10" />
             </div>
             <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Hello! How can I assist you today?</h2>
             <p className="text-secondary text-base mb-10 text-center max-w-md font-medium">I'm your intelligent F&B assistant. Ask me anything to help streamline your operations.</p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4">
                {SUGGESTED_QUESTIONS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => executeWaitAndSend(suggestion.text)}
                    className="flex flex-col items-start gap-2 p-4 text-left border border-gray-100 bg-white rounded-2xl hover:bg-blue-50/50 hover:border-blue-100 transition-all cursor-pointer group shadow-sm hover:shadow"
                  >
                    <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                      <suggestion.icon className="w-4 h-4 text-primary" /> {suggestion.label}
                    </div>
                    <p className="text-xs text-secondary font-medium leading-relaxed group-hover:text-foreground transition-colors">
                      "{suggestion.text}"
                    </p>
                  </button>
                ))}
             </div>
          </div>
        ) : (
          messages.map((message) => (
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
                    "p-4 px-6 rounded-3xl font-medium leading-relaxed shadow-sm",
                    message.role === "user"
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-gray-50 border border-gray-100 text-[#4B5563] rounded-tl-none",
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
                        { icon: Copy, label: "Copy", onClick: () => {
                            navigator.clipboard.writeText(message.content);
                            toast.success("Copied to clipboard");
                            setActiveMenuId(null);
                        } },
                        { icon: Share2, label: "Share", onClick: () => {} },
                        { icon: Download, label: "Download", onClick: () => {} },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={item.onClick}
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
                      "absolute -right-10 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-all cursor-pointer hidden",
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
          ))
        )}
        
        {isLoading && (
          <div className="flex flex-col items-start w-full">
            <div className="bg-gray-50 border border-gray-100 p-4 px-6 rounded-[24px] rounded-tl-none animate-pulse">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-white border-t border-gray-100 flex flex-col gap-3 rounded-b-3xl shrink-0">
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
              </div>
            ))}
          </div>
        )}

        <div className="max-w-4xl mx-auto w-full flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isLoading}
              className="w-full bg-[#f8fafc] border border-gray-200 rounded-full py-4 px-6 pr-16 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none placeholder:text-gray-400 transition-all disabled:opacity-50"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
               {/* Place input tools here if needed */}
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
            onClick={() => handleSendMessage()}
            disabled={
              isLoading ||
              (!inputValue.trim() && pendingFiles.length === 0) ||
              pendingFiles.some((f) => f.status === "uploading")
            }
            className="w-[54px] h-[54px] rounded-full bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50 disabled:bg-gray-300 disabled:shadow-none cursor-pointer shrink-0"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={confirmClearChat}
        title="Clear Chat History"
        message="Are you sure you want to clear your chat history? This action cannot be undone."
        confirmText="Yes, Clear"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
