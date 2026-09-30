'use client';
import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    headerRef.current = document.getElementById('siteHeader') as HTMLElement;
    let ticking = false;

    function onScroll() {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop / (doc.scrollHeight - doc.clientHeight) * 100;
      if (barRef.current) barRef.current.style.width = scrolled + '%';
      if (headerRef.current) headerRef.current.classList.toggle('scrolled', doc.scrollTop > 40);
      ticking = false;
    }

    const handler = () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } };
    window.addEventListener('scroll', handler);
    onScroll();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return <div className="scroll-progress" ref={barRef} id="scrollProgress" />;
}
