'use client';
import { useState } from 'react';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';

export default function Header() {
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState('English');
  const [mobileOpen, setMobileOpen] = useState(false);

  const langs = [
    { code: 'en', label: 'English' },
    { code: 'tw', label: 'Twi' },
    { code: 'ga', label: 'Ga' },
  ];

  return (
    <header id="siteHeader">
      <div className="wrap nav-row">
        <Image className="logo-img" src={IMAGES.logo} alt="Hyphen OI Workforce" width={120} height={30} priority />
        <nav>
          <ul>
            <li><a href="#product">Product</a></li>
            <li><a href="#usecases">Use cases</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#about">About</a></li>
          </ul>
        </nav>
        <div className="nav-actions">
          <div className="lang-switch" id="langSwitch">
            <button
              className="lang-current"
              id="langBtn"
              aria-haspopup="true"
              aria-expanded={langOpen}
              onClick={(e) => { e.stopPropagation(); setLangOpen(!langOpen); }}
            >
              {lang}{' '}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            {langOpen && (
              <div className="lang-menu open" id="langMenu">
                {langs.map(l => (
                  <button
                    key={l.code}
                    className={`lang-option${lang === l.label ? ' active' : ''}`}
                    data-lang={l.code}
                    onClick={() => { setLang(l.label); setLangOpen(false); }}
                  >
                    {l.label}
                  </button>
                ))}
                <div className="lang-soon">More languages coming soon, हिन्दी next</div>
              </div>
            )}
          </div>
          <a href="#pricing" className="link-login" title="Login is part of the in-app product, out of scope for this marketing site">Log in</a>
          <a href="#pricing" className="btn btn-primary">Start My OI Workforce&trade;</a>
          <button
            className="burger"
            id="burgerBtn"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="mobile-drawer open" id="mobileDrawer">
          <a href="#product">Product</a>
          <a href="#usecases">Use cases</a>
          <a href="#pricing">Pricing</a>
          <a href="#about">About</a>
          <a href="#pricing">Log in</a>
          <a href="#pricing" className="btn btn-primary" style={{ width: 'fit-content' }}>Start My OI Workforce&trade;</a>
        </div>
      )}
    </header>
  );
}
