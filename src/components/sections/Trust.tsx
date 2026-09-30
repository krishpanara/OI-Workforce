'use client';
import { useEffect, useRef } from 'react';

const ledgerData = [
  {
    consultant: 'Kwame Asante, Risk Intelligence Officer',
    workstream: 'Q3 supplier risk review',
    time: '09:41 today',
    employee: 'Sarah Johnson, Finance',
  },
  {
    consultant: 'Adwoa Mensah, CEO Assistant',
    workstream: 'Q2 board pack',
    time: '08:52 today',
    employee: 'Cliff Williams, CEO',
  },
  {
    consultant: 'James Whitfield, CFO Analyst',
    workstream: 'Cashflow forecast',
    time: '07:15 today',
    employee: 'Michael Brown, Finance',
  },
  {
    consultant: 'Priya Sharma, People Intelligence Lead',
    workstream: 'Workforce report',
    time: '06:30 today',
    employee: 'Angela Davies, HR',
  },
  {
    consultant: 'Adwoa Mensah, CEO Assistant',
    workstream: 'Decision log update',
    time: '10:02 today',
    employee: 'Cliff Williams, CEO',
  },
];

export default function Trust() {
  const rowsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rows = rowsRef.current;
    if (!rows) return;
    const allRows = rows.querySelectorAll<HTMLDivElement>('.ledger-row2');
    let idx = 0;
    const showNext = () => {
      allRows.forEach(r => r.classList.remove('in'));
      allRows[idx % allRows.length].classList.add('in');
      idx++;
    };
    showNext();
    const timer = setInterval(showNext, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="trust">
      <div className="wrap">
        <div className="trust-head-grid">
          <div className="reveal">
            <div className="eyebrow">Built to be trusted</div>
            <h2 style={{fontSize:'32px', marginBottom:'14px'}}>Why you can trust OI Workforce.</h2>
            <p style={{color:'var(--grey)', fontSize:'16px'}}>Every action completed by an OI Consultant or employee is recorded automatically. See who did it, when it happened, why it happened, what information was used, and the outcome, all in one secure organisational ledger.</p>
          </div>
          <div className="trust-guarantees reveal">
            <div className="trust-guarantees-label">Every ledger entry captures</div>
            <ul>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                <span><strong>Who</strong> did it: the named OI Consultant or employee</span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                <span><strong>When</strong> it happened: down to the second</span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                <span><strong>Why</strong> it happened: the reasoning behind the action</span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                <span><strong>What information</strong> was used to decide</span>
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                <span><strong>The outcome</strong> — what actually resulted</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="ledger-demo reveal">
          <div className="ledger-demo-head">
            <span className="live-dot"></span>
            <span>ORGANISATION LEDGER &middot; SAMPLE ACTIVITY</span>
          </div>
          <p className="sr-only" id="ledgerAnnounce" aria-live="polite"></p>
          <div className="ledger-rows" id="ledgerRows" ref={rowsRef} aria-hidden="true">
            {ledgerData.map((row, i) => (
              <div key={i} className="ledger-row2">
                <div>
                  <div className="lbl">OI Consultant</div>
                  <div className="val strong">{row.consultant}</div>
                </div>
                <div>
                  <div className="lbl">Workstream</div>
                  <div className="val">{row.workstream}</div>
                </div>
                <div>
                  <div className="lbl">Time</div>
                  <div className="val">{row.time}</div>
                </div>
                <div>
                  <div className="lbl">Company Employee</div>
                  <div className="val">{row.employee}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
