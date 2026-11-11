import { useState } from "react";
import { MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIChatModal } from "./AIChatModal";
import { motion } from "framer-motion";

export function AIChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-20 z-[9997]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setOpen(!open)}
          size="icon"
          className="h-12 w-12 rounded-full shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 relative"
          aria-label="Open AI Assistant Chat"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </Button>
      </motion.div>

      <AIChatModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
