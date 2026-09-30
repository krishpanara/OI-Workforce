'use client';
import { useState } from 'react';

const faqs = [
  {
    q: 'Where does our data actually live?',
    a: 'Depending on the deployment you choose (cloud, private enterprise cloud, or fully offline appliance), your data can stay entirely within infrastructure you control. None of it is used to train public models.',
  },
  {
    q: 'Will OI act without a human approving it?',
    a: 'Only within limits your organisation sets. Anything above your defined autonomy threshold (sending something externally, approving spend, changing a record) lands as a check-in for a named human owner, logged to the ledger either way.',
  },
  {
    q: 'Does it work if our connection drops?',
    a: "With the sovereign appliance deployment, yes. It's built to run fully offline, not just tolerate an outage. This is a core design goal, not an edge case: teams in villages, mines, and other areas with limited or no internet access can run the full platform exactly as an office in a major city would.",
  },
  {
    q: 'What languages does it actually understand?',
    a: 'English, Twi and Ga at launch, with Hindi and further languages on the roadmap. This is handled by GLIF, our language understanding layer, see above.',
  },
  {
    q: 'Do we need to buy hardware to get started?',
    a: 'No. The sovereign appliance is an option for organisations that need fully offline or air-gapped deployment. Most teams get started on standard cloud deployment, no hardware required.',
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="faq" id="faq">
      <div className="wrap" style={{maxWidth:'820px'}}>
        <div className="section-head reveal" style={{maxWidth:'100%', textAlign:'left', marginBottom:'36px'}}>
          <div className="eyebrow">Before you ask</div>
          <h2 style={{fontSize:'30px'}}>Questions, answered plainly.</h2>
        </div>
        <div id="faqList">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item reveal${openIdx === i ? ' open' : ''}`}>
              <button
                className="faq-q"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                aria-expanded={openIdx === i}
              >
                {faq.q}
                <span className="faq-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </span>
              </button>
              <div className="faq-a">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
