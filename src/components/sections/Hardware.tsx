'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';

const checkItems = [
  'Cloud deployment: live in minutes, no hardware to manage',
  'Sovereign hardware: works completely offline in villages, mines and other low-connectivity sites, data never leaves the building',
  'Start on one, move to the other later, same platform, no re-implementation',
];

export default function Hardware() {
  const listRef = useRef<HTMLUListElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const media = mediaRef.current;
    if (!list || !media) return;

    const items = list.querySelectorAll<HTMLLIElement>('li');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          items.forEach((li, i) => {
            setTimeout(() => li.classList.add('in'), i * 180);
          });
          media.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="hardware">
      <div className="wrap">
        <div className="reveal">
          <div className="eyebrow">Your choice, not ours</div>
          <h2>Your data. Your choice.</h2>
          <div className="nvidia-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v16H4z"/></svg>
            Built on NVIDIA-accelerated compute
          </div>
          <p>Whether you choose our secure cloud or keep everything inside your own organisation, you&apos;re always in control of your data.</p>
          <ul id="hwChecklist" ref={listRef}>
            {checkItems.map((item, i) => (
              <li key={i}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8FB8FF" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <div className="hw-spec" style={{marginTop:'22px'}}>
            <div className="hw-spec-head">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
              Sovereign Appliance &mdash; Specifications
            </div>
            <div className="hw-spec-row"><span>Compute</span><span>NVIDIA Jetson / A-series GPU</span></div>
            <div className="hw-spec-row"><span>Storage</span><span>2&ndash;32 TB NVMe encrypted</span></div>
            <div className="hw-spec-row"><span>Connectivity</span><span>LAN, Wi-Fi, 4G/LTE optional</span></div>
            <div className="hw-spec-row"><span>Offline capability</span><span>Full, indefinite</span></div>
          </div>
        </div>
        <div className="hw-media reveal" id="hwMedia" ref={mediaRef}>
          <div className="hw-float">
            <Image
              src={IMAGES.hardwareAppliance}
              alt="OI Workforce sovereign compute appliance, NVIDIA-accelerated"
              width={735}
              height={535}
              style={{aspectRatio:'1470/1070', width:'100%', height:'auto', display:'block'}}
              loading="lazy"
            />
            <div className="hw-glint"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
