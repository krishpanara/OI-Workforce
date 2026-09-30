'use client';
import { useState } from 'react';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';

type ConsultantCard = {
  ring: string;
  avatar?: string;
  avatarAlt?: string;
  iconAvatar?: boolean;
  name: string;
  consultName: string;
  role: string;
  desc: string;
  langs: string[];
  proof: string;
  proofLink: string;
};

const consultants: ConsultantCard[] = [
  {
    ring: '#1D5FD4',
    avatar: IMAGES.avatarConsult1,
    avatarAlt: 'CEO Assistant headshot',
    name: 'CEO Assistant',
    consultName: 'Adwoa Mensah',
    role: 'Executive',
    desc: 'Prepares board packs, summarises decisions and keeps the executive agenda moving.',
    langs: ['EN','TW','GA'],
    proof: '"Prepared our Q2 board pack overnight. It was the best one we\'ve ever submitted."',
    proofLink: '#pricing',
  },
  {
    ring: '#2C8C8A',
    avatar: IMAGES.avatarConsult2,
    avatarAlt: 'CFO Analyst headshot',
    name: 'CFO Analyst',
    consultName: 'James Whitfield',
    role: 'Finance',
    desc: 'Builds and updates financial models, cashflow forecasts and variance reports without being asked.',
    langs: ['EN','TW','GA'],
    proof: '"Caught a cashflow gap three weeks before it would have hit payroll."',
    proofLink: '#pricing',
  },
  {
    ring: '#2A7DE1',
    avatar: IMAGES.avatarConsult3,
    avatarAlt: 'Risk Intelligence Officer headshot',
    name: 'Risk Intelligence Officer',
    consultName: 'Kwame Asante',
    role: 'Risk & compliance',
    desc: 'Monitors operational risk continuously and flags what needs a human call.',
    langs: ['EN','TW','GA'],
    proof: '"Flagged a supplier risk during renewal negotiations, before the contract was signed."',
    proofLink: '#pricing',
  },
  {
    ring: '#267A76',
    avatar: IMAGES.avatarConsult4,
    avatarAlt: 'People Intelligence Lead headshot',
    name: 'People Intelligence Lead',
    consultName: 'Priya Sharma',
    role: 'HR',
    desc: 'Tracks workforce health and prepares people decisions with full context.',
    langs: ['EN','TW','GA'],
    proof: '"Flagged a retention risk in the Kumasi team two weeks before it would have shown up in an exit interview."',
    proofLink: '#pricing',
  },
  {
    ring: '#1D5FD4',
    avatar: IMAGES.avatarConsult5,
    avatarAlt: 'OI Finance headshot',
    name: 'OI Finance',
    consultName: 'Kofi Boateng',
    role: 'Finance',
    desc: 'Tracks spend against budget in real time and flags variances before month-end close.',
    langs: ['EN','TW','GA'],
    proof: '"Caught an unbudgeted spend spike three days into the month, not thirty."',
    proofLink: '#pricing',
  },
  {
    ring: '#2A7DE1',
    avatar: IMAGES.avatarConsult6,
    avatarAlt: 'OI Risk Analyst headshot',
    name: 'OI Risk Analyst',
    consultName: 'Funmilayo Adeyemi',
    role: 'Risk & compliance',
    desc: 'Flags contract and compliance risk the moment it appears, not at quarter-end review.',
    langs: ['EN','TW','GA'],
    proof: '"Flagged a compliance gap in a supplier contract before procurement signed it."',
    proofLink: '#pricing',
  },
  {
    ring: '#267A76',
    avatar: IMAGES.avatarConsult7,
    avatarAlt: 'OI HR Manager headshot',
    name: 'OI HR Manager',
    consultName: 'Sarah Mitchell',
    role: 'HR',
    desc: 'Tracks workforce sentiment and retention risk across every team, not just exit interviews.',
    langs: ['EN','TW','GA'],
    proof: '"Spotted a team\'s rising overtime pattern two weeks before anyone else noticed."',
    proofLink: '#pricing',
  },
  {
    ring: '#2C8C8A',
    avatar: IMAGES.avatarConsult8,
    avatarAlt: 'OI Operations Manager headshot',
    name: 'OI Operations Manager',
    consultName: 'Ravi Kumar',
    role: 'Operations',
    desc: 'Keeps daily operations on schedule and flags bottlenecks before they cost you a day.',
    langs: ['EN','TW','GA'],
    proof: '"Rerouted a bottleneck around a stalled shipment before it hit the production line."',
    proofLink: '#pricing',
  },
  {
    ring: '#1D5FD4',
    avatar: IMAGES.avatarConsult9,
    avatarAlt: 'OI Sales Manager headshot',
    name: 'OI Sales Manager',
    consultName: 'Chidinma Okafor',
    role: 'Sales',
    desc: 'Tracks pipeline health and flags deals losing momentum before they\'re lost.',
    langs: ['EN','TW','GA'],
    proof: '"Flagged a stalling deal in week two, not at quarter close."',
    proofLink: '#pricing',
  },
  {
    ring: '#001B5C',
    avatar: IMAGES.avatarConsult10,
    avatarAlt: 'OI CFO headshot',
    name: 'OI CFO',
    consultName: 'Michael Osei',
    role: 'Finance',
    desc: 'Owns the financial narrative end to end, from forecast to board-ready story.',
    langs: ['EN','TW','GA'],
    proof: '"Rebuilt the board\'s financial story from three conflicting spreadsheets in an afternoon."',
    proofLink: '#pricing',
  },
  {
    ring: '#2A7DE1',
    avatar: IMAGES.avatarConsult11,
    avatarAlt: 'OI Warehouse Manager headshot',
    name: 'OI Warehouse Manager',
    consultName: 'Abena Owusu',
    role: 'Operations',
    desc: 'Tracks inventory levels and flags stock-outs before they hit the warehouse floor.',
    langs: ['EN','TW','GA'],
    proof: '"Flagged a stock-out risk on a fast-moving line five days before it happened."',
    proofLink: '#pricing',
  },
  {
    ring: '#267A76',
    iconAvatar: true,
    name: 'OI Procurement Manager',
    consultName: 'Emeka Nwosu',
    role: 'Procurement',
    desc: 'Tracks supplier performance and flags contract renewals before they lapse.',
    langs: ['EN','TW','GA'],
    proof: '"Caught a supplier contract auto-renewing on old pricing before it locked in."',
    proofLink: '#pricing',
  },
  {
    ring: '#2C8C8A',
    iconAvatar: true,
    name: 'OI Legal Analyst',
    consultName: 'Taiwo Balogun',
    role: 'Legal',
    desc: 'Tracks contract obligations and flags clause risks before they become disputes.',
    langs: ['EN','TW','GA'],
    proof: '"Caught a liability clause buried in a 60-page vendor agreement before signing."',
    proofLink: '#pricing',
  },
  {
    ring: '#1D5FD4',
    avatar: IMAGES.avatarConsult12,
    avatarAlt: 'OI Marketing Manager headshot',
    name: 'OI Marketing Manager',
    consultName: 'Amara Diallo',
    role: 'Marketing',
    desc: 'Tracks campaign performance and flags what\'s working before the budget runs dry.',
    langs: ['EN','TW','GA'],
    proof: '"Flagged a failing campaign spend four days in, not at month-end report."',
    proofLink: '#pricing',
  },
  {
    ring: '#2A7DE1',
    avatar: IMAGES.avatarConsult13,
    avatarAlt: 'OI Customer Success headshot',
    name: 'OI Customer Success',
    consultName: 'Yaw Darko',
    role: 'Customer success',
    desc: 'Tracks customer health scores and flags churn signals before accounts go cold.',
    langs: ['EN','TW','GA'],
    proof: '"Flagged an at-risk account six weeks before renewal, in time to act."',
    proofLink: '#pricing',
  },
  {
    ring: '#267A76',
    avatar: IMAGES.avatarConsult14,
    avatarAlt: 'OI IT Manager headshot',
    name: 'OI IT Manager',
    consultName: 'Nneka Obi',
    role: 'IT',
    desc: 'Monitors system uptime and flags incidents before they escalate to outages.',
    langs: ['EN','TW','GA'],
    proof: '"Flagged a database performance issue 48 hours before it would have caused downtime."',
    proofLink: '#pricing',
  },
  {
    ring: '#2C8C8A',
    iconAvatar: true,
    name: 'OI Project Manager',
    consultName: 'Seun Adeyemi',
    role: 'Project management',
    desc: 'Tracks every active project and flags scope creep before it becomes a delay.',
    langs: ['EN','TW','GA'],
    proof: '"Caught a scope creep risk at week three of a twelve-week project."',
    proofLink: '#pricing',
  },
  {
    ring: '#1D5FD4',
    iconAvatar: true,
    name: 'OI Strategy Analyst',
    consultName: 'Kobby Mensah',
    role: 'Strategy',
    desc: 'Turns quarterly data into strategic narratives the board can act on.',
    langs: ['EN','TW','GA'],
    proof: '"Delivered a competitor landscape brief that normally takes three days, in four hours."',
    proofLink: '#pricing',
  },
  {
    ring: '#267A76',
    iconAvatar: true,
    name: 'OI Supply Chain Manager',
    consultName: 'Fatima Al-Rashidi',
    role: 'Supply chain',
    desc: 'Monitors the entire supply chain and flags disruptions before they hit production.',
    langs: ['EN','TW','GA'],
    proof: '"Flagged a port delay two weeks out and rerouted before it stalled the production line."',
    proofLink: '#pricing',
  },
];

function CardIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
    </svg>
  );
}

function ConsultantCardItem({ c }: { c: ConsultantCard }) {
  return (
    <div className="consult-card reveal">
      <div className={`avatar-wrap${c.iconAvatar ? ' icon-avatar' : ''}`} style={{'--ring': c.ring} as React.CSSProperties}>
        {c.iconAvatar ? (
          <>
            <CardIcon />
            <span className="status"></span>
          </>
        ) : (
          <>
            <Image src={c.avatar!} alt={c.avatarAlt || c.name} width={68} height={68} style={{borderRadius:'50%', objectFit:'cover', display:'block', width:'68px', height:'68px'}}/>
            <span className="status"></span>
          </>
        )}
      </div>
      <h3>{c.name}</h3>
      <div className="consult-name">{c.consultName}</div>
      <div className="consult-role">{c.role}</div>
      <p>{c.desc}</p>
      <div className="consult-langs">
        {c.langs.map(l => <span key={l} className="consult-lang">{l}</span>)}
      </div>
      <div className="hr-proof">
        <p>{c.proof}</p>
        <a href={c.proofLink}>See how {c.role} teams use OI &rarr;</a>
      </div>
    </div>
  );
}

export default function Consultants() {
  const [paused, setPaused] = useState(false);
  const doubled = [...consultants, ...consultants];

  return (
    <section className="consultants" id="team">
      <div className="wrap">
        <div className="reveal" style={{maxWidth:'620px', marginBottom:'56px'}}>
          <div className="eyebrow">Your specialist team</div>
          <h2 style={{fontSize:'32px', marginBottom:'14px'}}>Meet your OI Consultants</h2>
          <p style={{color:'var(--grey)', fontSize:'16px'}}>Every OI Consultant has a defined role, responsibility and access boundary, configured to your organisation from day one. Each one speaks and understands English, Twi and Ga, with more languages on the way.</p>
        </div>
        <div className="consult-controls">
          <button
            className="consult-pause-btn"
            id="consultPauseBtn"
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused(p => !p)}
          >
            {paused ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            ) : (
              <svg id="consultPauseIcon" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
              </svg>
            )}
            <span id="consultPauseLabel">{paused ? 'Play' : 'Pause'}</span>
          </button>
        </div>
        <div className={`consult-marquee${paused ? ' paused' : ''}`} id="consultMarquee">
          <div className="consult-track" id="consultTrack">
            {doubled.map((c, i) => (
              <ConsultantCardItem key={i} c={c} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
