import { useState, useRef, useEffect } from "react";
import { chatbotService } from "@/services/chatbot";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "bot";
  content: string;
}

const SUGGESTIONS = [
  "When should I plant wheat?",
  "My tomato leaves are turning yellow",
  "Best fertilizer for rice?",
  "How to improve soil health?",
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hi! I'm AgriBot 🌱 — your AI farming assistant. Ask me anything about crops, diseases, soil, or weather!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setIsLoading(true);
    
    try {
      const { reply } = await chatbotService.ask(msg);
      setMessages(prev => [...prev, { role: "bot", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", content: "Sorry, I'm having trouble connecting. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center transition-all duration-300 hover:scale-105"
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] h-[520px] rounded-2xl border border-black/10 dark:border-white/10 bg-background/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">AgriBot</h3>
                  <p className="text-xs text-emerald-500 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    AI Farming Assistant
                  </p>
                </div>
                <Sparkles className="h-4 w-4 text-emerald-400 ml-auto" />
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "bot" && (
                    <div className="h-7 w-7 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                  )}
                  <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-md"
                      : "bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-bl-md"
                  }`}>
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="h-7 w-7 rounded-lg bg-indigo-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="h-3.5 w-3.5 text-indigo-400" />
                    </div>
                  )}
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-2">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                    <Bot className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-bl-md">
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                  </div>
                </div>
              )}
              {/* Suggestions (only show when fresh) */}
              {messages.length <= 1 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Try asking:</p>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="block w-full text-left text-xs px-3 py-2 rounded-xl border border-black/5 dark:border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-black/10 dark:border-white/10">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about farming..."
                  disabled={isLoading}
                  className="flex-1 h-10 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="h-10 w-10 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
