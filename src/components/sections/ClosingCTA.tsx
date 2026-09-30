'use client';
import { useEffect, useRef } from 'react';

const typeText = 'OI Consultant: Adwoa Mensah logged 3 decisions to the knowledge bank';

export default function ClosingCTA({ onMeetOI }: { onMeetOI?: () => void }) {
  const typeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = typeRef.current;
    if (!el) return;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const type = () => {
      if (i <= typeText.length) {
        el.textContent = typeText.slice(0, i);
        i++;
        timer = setTimeout(type, 38);
      }
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          type();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(el);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <section className="closing-cta" id="pricing">
      <div className="wrap">
        <div className="terminal reveal">
          <div className="tline">ORGANISATION LEDGER: NEW ENTRY</div>
          <div className="tentry" id="typeTarget" ref={typeRef}></div>
        </div>
        <h2 className="reveal">Your governed AI workforce is ready when you are.</h2>
        <p className="reveal">Start your OI Workforce in minutes, no beta, no waitlist.</p>
        <div className="closing-ctas reveal">
          <button type="button" className="btn btn-light" onClick={onMeetOI}>Start My OI Workforce&trade;</button>
          <a href="#" className="secondary">Talk to us &rarr;</a>
        </div>
        <p className="closing-trial-note">Try for 14 days for FREE,<br />No credit card or contract required</p>
      </div>
    </section>
  );
}
