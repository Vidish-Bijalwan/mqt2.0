'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', toggle, { passive: true });
    return () => window.removeEventListener('scroll', toggle);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className="fixed bottom-24 right-6 z-50 w-10 h-10 rounded-full bg-legacy-nav-blue text-white shadow-lg hover:bg-legacy-nav-blue-hover transition-all duration-300 flex items-center justify-center hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-legacy-orange"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
