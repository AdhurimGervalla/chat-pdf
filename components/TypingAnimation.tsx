'use client';
import React, { useState, useEffect } from 'react';

type TypingAnimationProps = {
  text: string;
  typingInterval?: number; // The speed of typing, in milliseconds
  className?: string;
};

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  text,
  typingInterval = 100, // Default typing speed is 150ms
  className
}) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (text.length > displayedText.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, typingInterval);

      return () => clearTimeout(timeoutId);
    }
  }, [text, displayedText, typingInterval]);

  return <div className={className}>{displayedText}</div>;
};

export default TypingAnimation;
