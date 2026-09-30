'use client';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '#mainContent', target: 'mainContent', label: 'Home' },
  { href: '#product', target: 'product', label: 'Product' },
  { href: '#team', target: 'team', label: 'Team' },
  { href: '#trust', target: 'trust', label: 'Trust' },
  { href: '#proof', target: 'proof', label: 'Proof' },
  { href: '#faq', target: 'faq', label: 'FAQ' },
  { href: '#pricing', target: 'pricing', label: 'Get started' },
];

export default function DotNav() {
  const [active, setActive] = useState('mainContent');

  useEffect(() => {
    const sections = navItems.map(n => document.getElementById(n.target)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <nav className="dotnav" aria-label="Page sections">
      {navItems.map(n => (
        <a key={n.target} href={n.href} className={`dotnav-item${active === n.target ? ' active' : ''}`} data-target={n.target}>
          <span className="dot" />
          <span className="dotnav-label">{n.label}</span>
        </a>
      ))}
    </nav>
  );
}
