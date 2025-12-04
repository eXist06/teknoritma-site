"use client";

import { useState, useEffect } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number; // milliseconds per character
  delay?: number; // delay before starting (milliseconds)
  onComplete?: () => void;
  className?: string;
}

export default function TypewriterText({
  text,
  speed = 30,
  delay = 0,
  onComplete,
  className = "",
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);

    const timeoutId = setTimeout(() => {
      let currentIndex = 0;
      const intervalId = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(intervalId);
          setIsComplete(true);
          if (onComplete) {
            onComplete();
          }
        }
      }, speed);

      return () => clearInterval(intervalId);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [text, speed, delay, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && (
        <span className="inline-block w-0.5 h-4 md:h-5 bg-current ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  );
}

