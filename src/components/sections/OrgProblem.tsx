'use client';
import { useEffect, useRef } from 'react';

export default function OrgProblem() {
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const pieces = ['odW1','odW2','odW3','odW4','odW5','odW6','odW7','odW8','odW9','odW10'];
    type PieceOffset = { x: number; y: number; r: number; vx: number; vy: number; vr: number };
    const offsets: Record<string, PieceOffset> = {};
    pieces.forEach(id => {
      offsets[id] = {
        x: (Math.random() - 0.5) * 6,
        y: (Math.random() - 0.5) * 6,
        r: (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 0.04,
        vy: (Math.random() - 0.5) * 0.04,
        vr: (Math.random() - 0.5) * 0.06,
      };
    });
    let raf: number;
    const tick = () => {
      pieces.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const o = offsets[id];
        o.x += o.vx; o.y += o.vy; o.r += o.vr;
        if (Math.abs(o.x) > 7) o.vx *= -1;
        if (Math.abs(o.y) > 7) o.vy *= -1;
        if (Math.abs(o.r) > 9) o.vr *= -1;
        el.style.transform = `translate(${o.x}px,${o.y}px) rotate(${o.r}deg)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const visual = visualRef.current;
    if (!visual) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visual.classList.add('in');
          const hub = document.getElementById('odHub');
          const connectors = document.getElementById('odConnectors');
          if (hub) hub.classList.add('show');
          if (connectors) connectors.classList.add('show');
          observer.unobserve(visual);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(visual);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="org-problem" id="problem">
      <div className="wrap">
        <div className="reveal">
          <div className="sub">Not missing information. Missing the connections.</div>
          <h2>Your organisation isn&apos;t missing information. It&apos;s missing the connections between it.</h2>
          <p>Knowledge is spread across meetings, documents, projects, people and business systems. Decisions are repeated. Work is duplicated. Valuable experience disappears when people leave. OI Workforce connects what your organisation already knows and turns it into a capability that improves every day.</p>
          <a href="#product" className="link-cta">See what your organisation could become &rarr;</a>
        </div>
        <div className="org-problem-visual reveal" ref={visualRef}>
          <svg viewBox="0 0 700 392" className="org-diagram" id="orgDiagram" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram showing many kinds of scattered business information restlessly failing to fit together, becoming one connected, continuously improving capability">
            <defs>
              <linearGradient id="arrowGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1D5FD4"/>
                <stop offset="100%" stopColor="#2C8C8A"/>
              </linearGradient>
              <linearGradient id="pieceAfterGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF"/>
                <stop offset="100%" stopColor="#EAF1FE"/>
              </linearGradient>
              <radialGradient id="chainGlowGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2C8C8A" stopOpacity=".28"/>
                <stop offset="100%" stopColor="#2C8C8A" stopOpacity="0"/>
              </radialGradient>
              <symbol id="ic-meet" viewBox="0 0 14 14"><rect x="1" y="2.2" width="12" height="10.8" rx="1.5"/><line x1="1" y1="5.4" x2="13" y2="5.4"/><line x1="4.2" y1=".6" x2="4.2" y2="2.6"/><line x1="9.8" y1=".6" x2="9.8" y2="2.6"/></symbol>
              <symbol id="ic-email" viewBox="0 0 14 14"><rect x="1" y="2.5" width="12" height="9" rx="1"/><path d="M1.3 3 7 8 12.7 3"/></symbol>
              <symbol id="ic-doc" viewBox="0 0 14 14"><path d="M3.2 1H9l2 2v10H3.2Z"/><path d="M9 1v2h2"/><line x1="5" y1="7.2" x2="9.2" y2="7.2"/><line x1="5" y1="10" x2="9.2" y2="10"/></symbol>
              <symbol id="ic-people" viewBox="0 0 14 14"><circle cx="7" cy="4.3" r="2.3"/><path d="M2.2 13c0-3.3 2.3-4.9 4.8-4.9s4.8 1.6 4.8 4.9"/></symbol>
              <symbol id="ic-finance" viewBox="0 0 14 14"><rect x="1.4" y="8.4" width="2.6" height="4.6" rx=".4"/><rect x="5.7" y="5.4" width="2.6" height="7.6" rx=".4"/><rect x="10" y="2.2" width="2.6" height="10.8" rx=".4"/></symbol>
              <symbol id="ic-manufacturing" viewBox="0 0 14 14"><path d="M1 13V6l3 2V6l3 2V6l3 2V6l3 2v7Z"/><rect x="2" y="1" width="1.6" height="3"/></symbol>
              <symbol id="ic-procurement" viewBox="0 0 14 14"><path d="M1 2h2l1.6 7.4h7.8L13.4 4.2H4"/><circle cx="5" cy="11.6" r="1.05"/><circle cx="11" cy="11.6" r="1.05"/></symbol>
              <symbol id="ic-crm" viewBox="0 0 14 14"><path d="M1.2 2h11.6v6.6H5.2L2.6 11.4V8.6H1.2Z"/></symbol>
              <symbol id="ic-systems" viewBox="0 0 14 14"><circle cx="3" cy="3.2" r="1.6"/><circle cx="11" cy="3.2" r="1.6"/><circle cx="7" cy="11" r="1.6"/><line x1="3.9" y1="4.4" x2="6.2" y2="9.6"/><line x1="10.1" y1="4.4" x2="7.8" y2="9.6"/><line x1="4.6" y1="3.2" x2="9.4" y2="3.2"/></symbol>
              <symbol id="ic-plus" viewBox="0 0 14 14"><line x1="7" y1="2" x2="7" y2="12"/><line x1="2" y1="7" x2="12" y2="7"/></symbol>
              <symbol id="ic-piece" viewBox="0 0 44 44"><path d="M8,8 H36 V15 A7,7 0 0 1 36,29 V36 H8 V29 A7,7 0 0 0 8,15 Z"/></symbol>
              <filter id="chipShadow" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#001B5C" floodOpacity=".14"/>
              </filter>
            </defs>

            <text x="20" y="20" className="od-label-before" style={{fontFamily:"'Manrope',sans-serif", fontSize:"14px", fontWeight:800, letterSpacing:".02em"}}>MANY BUSINESSES, TODAY</text>
            <text x="482" y="20" className="od-label-after" textAnchor="middle" style={{fontFamily:"'Manrope',sans-serif", fontSize:"14px", fontWeight:800, letterSpacing:".02em"}}>WITH OI WORKFORCE</text>

            <g transform="translate(14,37)"><g id="odW1" className="od-piece-wobble od-piece od-piece-before"><use href="#ic-piece" className="od-piece-shape" width="40" height="40"/><use href="#ic-meet" className="od-icon" x="13" y="13" width="14" height="14"/></g></g>
            <g transform="translate(115,30)"><g id="odW2" className="od-piece-wobble od-piece od-piece-before"><use href="#ic-piece" className="od-piece-shape" width="40" height="40"/><use href="#ic-email" className="od-icon" x="13" y="13" width="14" height="14"/></g></g>
            <g transform="translate(195,57)"><g id="odW3" className="od-piece-wobble od-piece od-piece-before"><use href="#ic-piece" className="od-piece-shape" width="40" height="40"/><use href="#ic-doc" className="od-icon" x="13" y="13" width="14" height="14"/></g></g>
            <g transform="translate(35,117)"><g id="odW4" className="od-piece-wobble od-piece od-piece-before"><use href="#ic-piece" className="od-piece-shape" width="40" height="40"/><use href="#ic-people" className="od-icon" x="13" y="13" width="14" height="14"/></g></g>
            <g transform="translate(150,112)"><g id="odW5" className="od-piece-wobble od-piece od-piece-before"><use href="#ic-piece" className="od-piece-shape" width="40" height="40"/><use href="#ic-finance" className="od-icon" x="13" y="13" width="14" height="14"/></g></g>
            <g transform="translate(210,152)"><g id="odW6" className="od-piece-wobble od-piece od-piece-before"><use href="#ic-piece" className="od-piece-shape" width="40" height="40"/><use href="#ic-manufacturing" className="od-icon" x="13" y="13" width="14" height="14"/></g></g>
            <g transform="translate(20,187)"><g id="odW7" className="od-piece-wobble od-piece od-piece-before"><use href="#ic-piece" className="od-piece-shape" width="40" height="40"/><use href="#ic-procurement" className="od-icon" x="13" y="13" width="14" height="14"/></g></g>
            <g transform="translate(110,197)"><g id="odW8" className="od-piece-wobble od-piece od-piece-before"><use href="#ic-piece" className="od-piece-shape" width="40" height="40"/><use href="#ic-crm" className="od-icon" x="13" y="13" width="14" height="14"/></g></g>
            <g transform="translate(185,237)"><g id="odW9" className="od-piece-wobble od-piece od-piece-before"><use href="#ic-piece" className="od-piece-shape" width="40" height="40"/><use href="#ic-systems" className="od-icon" x="13" y="13" width="14" height="14"/></g></g>
            <g transform="translate(60,277)"><g id="odW10" className="od-piece-wobble od-piece od-piece-before od-piece-more od-ghost"><use href="#ic-piece" className="od-piece-shape" width="40" height="40"/><use href="#ic-plus" className="od-icon" x="13" y="13" width="14" height="14"/></g></g>

            <text x="34" y="88" className="od-caption od-label-before" textAnchor="middle">Meetings</text>
            <text x="135" y="83" className="od-caption od-label-before" textAnchor="middle">Emails</text>
            <text x="215" y="108" className="od-caption od-label-before" textAnchor="middle">Documents</text>
            <text x="55" y="168" className="od-caption od-label-before" textAnchor="middle">People</text>
            <text x="170" y="163" className="od-caption od-label-before" textAnchor="middle">Finance</text>
            <text x="230" y="203" className="od-caption od-label-before" textAnchor="middle">Manufacturing</text>
            <text x="40" y="238" className="od-caption od-label-before" textAnchor="middle">Procurement</text>
            <text x="130" y="248" className="od-caption od-label-before" textAnchor="middle">CRM</text>
            <text x="205" y="288" className="od-caption od-label-before" textAnchor="middle">Systems</text>
            <text x="80" y="328" className="od-caption od-label-before" textAnchor="middle">...and more</text>

            <text x="132" y="352" textAnchor="middle" style={{fontFamily:"'Manrope',sans-serif", fontSize:"13px", fontWeight:700, letterSpacing:".02em", fill:"#9AA3B2"}}>STRUGGLE TO CONNECT</text>
            <text x="132" y="368" textAnchor="middle" style={{fontFamily:"'Manrope',sans-serif", fontSize:"13px", fontWeight:700, letterSpacing:".02em", fill:"#9AA3B2"}}>SYSTEMS TOGETHER</text>

            <line x1="256" y1="150" x2="336" y2="150" className="od-arrow-track"/>
            <line x1="256" y1="150" x2="336" y2="150" className="od-arrow" id="od-arrow"/>
            <path d="M320 136 L336 150 L320 164 Z" className="od-arrowhead"/>

            <g className="od-hub" id="odHub">
              <circle className="od-chain-glow" cx="482" cy="139" r="148"/>
              <g transform="translate(482,44) scale(1.4) translate(-482,-44)">
                <g className="od-piece od-piece-after" transform="translate(438,44)"><g className="od-slot s1"><use href="#ic-piece" className="od-piece-shape" width="40" height="40"/><use href="#ic-people" className="od-icon" x="13" y="13" width="14" height="14"/></g></g>
                <g className="od-piece od-piece-after" transform="translate(462,44)"><g className="od-slot s2"><use href="#ic-piece" className="od-piece-shape" width="40" height="40"/><use href="#ic-meet" className="od-icon" x="13" y="13" width="14" height="14"/></g></g>
                <g className="od-piece od-piece-after" transform="translate(486,44)"><g className="od-slot s3"><use href="#ic-piece" className="od-piece-shape" width="40" height="40"/><use href="#ic-doc" className="od-icon" x="13" y="13" width="14" height="14"/></g></g>
                <g className="od-piece od-piece-after" transform="translate(438,92)"><g className="od-slot s4"><use href="#ic-piece" className="od-piece-shape" width="40" height="40"/><use href="#ic-finance" className="od-icon" x="13" y="13" width="14" height="14"/></g></g>
                <g className="od-piece od-piece-after" transform="translate(462,92)"><g className="od-slot s5"><use href="#ic-piece" className="od-piece-shape" width="40" height="40"/><use href="#ic-manufacturing" className="od-icon" x="13" y="13" width="14" height="14"/></g></g>
                <g className="od-piece od-piece-after" transform="translate(486,92)"><g className="od-slot s6"><use href="#ic-piece" className="od-piece-shape" width="40" height="40"/><use href="#ic-procurement" className="od-icon" x="13" y="13" width="14" height="14"/></g></g>
                <g className="od-piece od-piece-after" transform="translate(438,140)"><g className="od-slot s7"><use href="#ic-piece" className="od-piece-shape" width="40" height="40"/><use href="#ic-crm" className="od-icon" x="13" y="13" width="14" height="14"/></g></g>
                <g className="od-piece od-piece-after" transform="translate(462,140)"><g className="od-slot s8"><use href="#ic-piece" className="od-piece-shape" width="40" height="40"/><use href="#ic-systems" className="od-icon" x="13" y="13" width="14" height="14"/></g></g>
                <g className="od-piece od-piece-after" transform="translate(486,140)"><g className="od-slot s9"><use href="#ic-piece" className="od-piece-shape" width="40" height="40"/><use href="#ic-email" className="od-icon" x="13" y="13" width="14" height="14"/></g></g>
              </g>
              <path d="M419.6,276 L450.8,262 L482,268 L515.6,244" className="od-growth-line"/>
              <path d="M506,243 L518,243 L518,253" className="od-growth-line"/>
              <circle className="od-growth-dot" cx="419.6" cy="276" r="2.8"/>
              <circle className="od-growth-dot" cx="450.8" cy="262" r="2.8"/>
              <circle className="od-growth-dot" cx="482" cy="268" r="2.8"/>
              <text x="482" y="352" textAnchor="middle" style={{fontFamily:"'Manrope',sans-serif", fontSize:"13px", fontWeight:700, letterSpacing:".02em", fill:"var(--deepteal)"}}>YOUR SYSTEMS CONNECT</text>
              <text x="482" y="368" textAnchor="middle" style={{fontFamily:"'Manrope',sans-serif", fontSize:"13px", fontWeight:700, letterSpacing:".02em", fill:"var(--deepteal)"}}>WITH EASE</text>
            </g>
            <g className="od-connectors" id="odConnectors">
              <circle cx="465.2" cy="72" r="2.8"/><circle cx="498.8" cy="72" r="2.8"/>
              <circle cx="465.2" cy="139.2" r="2.8"/><circle cx="498.8" cy="139.2" r="2.8"/>
              <circle cx="465.2" cy="206.4" r="2.8"/><circle cx="498.8" cy="206.4" r="2.8"/>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
