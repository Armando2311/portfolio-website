'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  // Since our portfolio is black and white by default, we'll just toggle between high and low contrast
  const [isHighContrast, setIsHighContrast] = useState(false);
  
  // Toggle the contrast mode
  const toggleContrast = () => {
    setIsHighContrast(!isHighContrast);
    
    // Apply contrast changes to the document
    if (!isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };
  
  // Initialize contrast mode based on user preference
  useEffect(() => {
    const preferHighContrast = window.matchMedia('(prefers-contrast: more)').matches;
    setIsHighContrast(preferHighContrast);
    
    if (preferHighContrast) {
      document.documentElement.classList.add('high-contrast');
    }
  }, []);
  
  return (
    <motion.button
      onClick={toggleContrast}
      className="fixed top-24 right-8 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isHighContrast ? "Switch to standard contrast" : "Switch to high contrast"}
    >
      {isHighContrast ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </motion.button>
  );
} 