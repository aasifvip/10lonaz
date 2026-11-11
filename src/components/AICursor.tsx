import { useEffect, useState, useRef } from "react";
import { motion, animate } from "framer-motion";
import { useTheme } from "next-themes";

interface AICursorProps {
  id: number;
  enabled: boolean;
  reducedMotion: boolean;
}

export function AICursor({ id, enabled, reducedMotion }: AICursorProps) {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const positionRef = useRef(position);
  const [isHovering, setIsHovering] = useState(false);
  const { theme, systemTheme } = useTheme();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const isMovingRef = useRef(false);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const cursorColor = currentTheme === "dark" ? "#ffffff" : "#000000";

  useEffect(() => {
    if (!enabled || reducedMotion) {
      const hiddenPosition = { x: -100, y: -100 };
      positionRef.current = hiddenPosition;
      setPosition(hiddenPosition);
      return;
    }

    const scheduleMove = () => {
      timerRef.current = setTimeout(() => {
        if (isMovingRef.current) {
          scheduleMove();
          return;
        }

        const floatingIcons = document.querySelectorAll('[data-floating-icon]');
        if (floatingIcons.length > 0) {
          const randomIcon = floatingIcons[Math.floor(Math.random() * floatingIcons.length)];
          const rect = randomIcon.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          isMovingRef.current = true;

          // Smoothly animate to icon
          animate(positionRef.current.x, centerX, {
            duration: 2,
            ease: "easeInOut",
            onUpdate: (latest) => {
              const nextPosition = { ...positionRef.current, x: latest };
              positionRef.current = nextPosition;
              setPosition(nextPosition);
            },
          });

          animate(positionRef.current.y, centerY, {
            duration: 2,
            ease: "easeInOut",
            onUpdate: (latest) => {
              const nextPosition = { ...positionRef.current, y: latest };
              positionRef.current = nextPosition;
              setPosition(nextPosition);
            },
            onComplete: () => {
              setIsHovering(true);

              // Simulate hover effect
              setTimeout(() => {
                setIsHovering(false);
                isMovingRef.current = false;
                scheduleMove();
              }, 800);
            },
          });
        } else {
          scheduleMove();
        }
      }, Math.random() * 4000 + 3000 + id * 1000); // Stagger timing by id
    };

    // Initialize position
    const initialPosition = {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    };
    positionRef.current = initialPosition;
    setPosition(initialPosition);

    scheduleMove();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [enabled, reducedMotion, id]);

  if (!enabled || reducedMotion) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-[9998]"
      style={{
        left: position.x,
        top: position.y,
      }}
      animate={{
        scale: isHovering ? 1.3 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2 opacity-60">
        {/* AI Cursor Arrow */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
            fill={cursorColor}
            fillOpacity="0.6"
            stroke={cursorColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        
        {/* AI Badge */}
        <div className="absolute -top-6 left-6 whitespace-nowrap text-xs px-2 py-1 rounded bg-primary/80 text-primary-foreground">
          AI {id}
        </div>

        {/* Hover ring */}
        {isHovering && (
          <motion.div
            className="absolute inset-0 -m-2 rounded-full border-2 border-primary"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </div>
    </motion.div>
  );
}
