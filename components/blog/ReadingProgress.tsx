"use client";

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate reading progress
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const windowScrollTop = window.scrollY || document.documentElement.scrollTop;
      
      if (totalHeight === 0) return;
      
      const currentProgress = (windowScrollTop / totalHeight) * 100;
      setProgress(currentProgress);

      // Show scroll-to-top button if scrolled past 300px
      setIsVisible(windowScrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-transparent z-[100]">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
          style={{ width: `${progress}%`, transition: 'width 0.1s ease-out' }}
        />
      </div>

      {/* Scroll To Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300 z-50 focus:outline-none focus:ring-4 focus:ring-blue-500/50 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </>
  );
}
