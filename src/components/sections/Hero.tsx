'use client';
import { useEffect, useRef } from 'react';
import { IMAGES } from '@/lib/images';

const tickerData = [
  { name: 'Adwoa Mensah, CEO Assistant', action: 'Prepared Q2 board pack', time: '08:52', color: '#1D5FD4', avatar: IMAGES.tickerAdwoa },
  { name: 'James Whitfield, CFO Analyst', action: 'Updated cashflow forecast', time: '07:15', color: '#2C8C8A', avatar: IMAGES.tickerJames },
  { name: 'Kwame Asante, Risk Intelligence Officer', action: 'Flagged supplier risk', time: '09:41', color: '#2A7DE1', avatar: IMAGES.tickerKwame },
  { name: 'Priya Sharma, People Intelligence Lead', action: 'Compiled workforce report', time: '06:30', color: '#267A76', avatar: IMAGES.tickerPriya },
  { name: 'Adwoa Mensah, CEO Assistant', action: 'Logged 3 new decisions', time: '10:02', color: '#1D5FD4', avatar: IMAGES.tickerAdwoa },
  { name: 'James Whitfield, CFO Analyst', action: 'Delivered variance analysis', time: '06:58', color: '#2C8C8A', avatar: IMAGES.tickerJames },
];

const uspPills = [
  'AI without internet, built for mines, villages and rural sites',
  'Knowledge that never leaves, even when people do',
  'Speaks Twi, Ga and English, with GLIF adding more soon',
  'Named AI employees, hired into real roles',
  '136+ AI models, routed to the specialist',
  'Every action logged, nothing hidden in a black box',
  'Sovereign appliance means your data never has to leave',
  'Trained on your organisation, not the internet',
];

export default function Hero({ onMeetOI }: { onMeetOI: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    const doubled = [...tickerData, ...tickerData];
    trackRef.current.innerHTML = doubled.map(d =>
      `<div class="ticker-row"><img class="t-avatar" src="${d.avatar}" alt=""><span class="t-dot" style="background:${d.color}"></span><span class="t-name">${d.name}</span><span class="t-action">${d.action}</span><span class="t-time">${d.time}</span></div>`
    ).join('');
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const glow = glowRef.current;
    if (!hero || !glow) return;
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      glow.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100) + '%');
      glow.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100) + '%');
    };
    hero.addEventListener('mousemove', onMove);
    return () => hero.removeEventListener('mousemove', onMove);
  }, []);

  const doubledPills = [...uspPills, ...uspPills];

  return (
    <section className="hero" id="mainContent" ref={heroRef}>
      <div className="hero-glow" id="heroGlow" ref={glowRef} />
      <div className="wrap">
        <div>
          <span className="hero-eyebrow">The Organisational Intelligence Platform&trade;</span>{' '}
          <span className="hero-eyebrow">Works fully offline, built for villages, mines and low-connectivity regions</span>
          <h1>
            <span className="line"><span>Increase the capacity and capability</span></span>
            <span className="line"><span>of your organisation and your people.</span></span>
          </h1>
          <p>Your meetings, projects and decisions become organisational intelligence that develops your people and continuously improves your organisation.</p>
          <div className="hero-ctas">
            <button className="btn btn-light" id="heroMeetPersonalOI" onClick={onMeetOI}>Meet Your Personal OI&trade;</button>
          </div>
          <p className="hero-trial-note">Try for 14 days for FREE,<br />No credit card or contract required</p>
        </div>
        <div className="ledger-panel">
          <div className="ledger-head">
            <span><span className="live-dot" />ORGANISATION LEDGER · SAMPLE ACTIVITY</span>
            <span>oiworkforce.com</span>
          </div>
          <div className="ticker-mask" aria-hidden="true">
            <div className="ticker-track" id="tickerTrack" ref={trackRef} />
          </div>
        </div>
      </div>
      <div className="hero-usp-wrap">
        <div className="hero-usp-marquee">
          <div className="hero-usp-track">
            {doubledPills.map((text, i) => (
              <div key={i} className="hero-usp-pill">
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
