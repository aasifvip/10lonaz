import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, X, Bot, User, CornerDownLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

const initialMessages: ChatMessage[] = [
  {
    id: "welcome-1",
    sender: "assistant",
    text: "Hello! I am 10lonaz AI Assistant. How can I help you today with your software project or inquiry?",
    timestamp: "Just now",
  },
];

const suggestedPrompts = [
  "What services do you offer?",
  "How do I request a quote?",
  "Show portfolio highlights",
  "Browser Extensions & SaaS pricing",
];

interface AIChatModalProps {
  open: boolean;
  onClose: () => void;
}

export function AIChatModal({ open, onClose }: AIChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, open]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    // Placeholder simulated AI response (Architecture ready for LLM API integration)
    setTimeout(() => {
      let botResponse = "Thank you for reaching out! Our team at 10lonaz specializes in custom SaaS, AI tools, mobile apps, and browser extensions. We will get back to you shortly!";

      const lowerText = text.toLowerCase();
      if (lowerText.includes("quote") || lowerText.includes("cost") || lowerText.includes("price")) {
        botResponse = "You can request a custom quote directly from our Contact page or view pricing plans on specific SaaS & Business product pages!";
      } else if (lowerText.includes("service")) {
        botResponse = "We build Custom SaaS Platforms, Mobile Applications (iOS/Android), Browser Extensions, AI Enterprise Tools, and Headless E-Commerce solutions.";
      } else if (lowerText.includes("portfolio")) {
        botResponse = "Check out our Portfolio section! We showcase case studies across SaaS, Marketplace, Education, AI, and Browser Extensions.";
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1000);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-20 right-4 sm:right-6 z-[9999] w-[calc(100vw-2rem)] sm:w-96 h-[520px] bg-card border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b bg-secondary/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-sm">
                <span>10lonaz AI Assistant</span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-emerald-500 text-emerald-600 dark:text-emerald-400">
                  Online
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Placeholder Assistant UI</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Message Thread */}
        <ScrollArea className="flex-1 p-4 space-y-4">
          <div className="space-y-3 pb-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2.5 max-w-[85%]",
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold",
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  )}
                >
                  {msg.sender === "user" ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5 text-primary" />}
                </div>
                <div>
                  <div
                    className={cn(
                      "p-3 rounded-2xl text-sm leading-relaxed",
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-secondary/70 text-foreground rounded-tl-none border"
                    )}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-muted-foreground px-1 mt-1 block">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 mr-auto items-center text-muted-foreground text-xs p-2">
                <RefreshCw className="h-3 w-3 animate-spin text-primary" />
                AI is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Suggested Prompts */}
        {messages.length < 3 && (
          <div className="px-3 py-2 border-t bg-background/50 flex flex-wrap gap-1.5">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors border text-muted-foreground hover:text-foreground"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Footer */}
        <div className="p-3 border-t bg-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="text-sm h-10 rounded-full pl-4"
            />
            <Button type="submit" size="icon" className="h-10 w-10 rounded-full shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
