export default function KnowledgeBank() {
  return (
    <section id="knowledgebank">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">The knowledge bank</div>
          <h2 style={{fontSize:'32px', maxWidth:'720px'}}>If people leave, their knowledge shouldn&apos;t.</h2>
          <p style={{color:'var(--grey)', fontSize:'16px', maxWidth:'680px', marginTop:'14px'}}>Every meeting, decision and project OI has ever touched becomes part of a permanent record: not a document nobody opens again, but something the next team can actually build on, years later.</p>
        </div>

        <div className="kb-compare">
          <div className="kb-card kb-card--old reveal">
            <div className="kb-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <path d="M16 17l5-5-5-5"/>
                <path d="M21 12H9"/>
              </svg>
            </div>
            <h3>The old way</h3>
            <p>An employee leaves. Whatever they knew, the context, the reasoning, the lessons from what worked and what didn&apos;t, leaves with them. The next person starts from zero.</p>
          </div>
          <div className="kb-card kb-card--new reveal">
            <div className="kb-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="4" rx="1"/>
                <path d="M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8"/>
                <path d="M10 12h4"/>
              </svg>
            </div>
            <h3>With OI Workforce</h3>
            <p>Nothing leaves. What OI saw, decided, and learned becomes part of the organisation&apos;s permanent memory: available to whoever needs it, whenever they need it, no matter who&apos;s still there to ask.</p>
          </div>
        </div>

        <div className="kb-example reveal">
          <div className="kb-example-label">What this looks like two years on</div>
          <p>A new procurement manager joins. On day one, they ask the OI Consultant: &ldquo;What supplier issues have we had and how did we resolve them?&rdquo; OI surfaces every negotiation, every dispute, every resolution logged across two years, structured into a briefing that would have taken a week to compile manually.</p>
          <p>The previous manager who knew all of this left eight months ago. But their knowledge didn&apos;t.</p>
          <div className="kb-example-row">
            <span className="kb-dot"></span>
            <span><span className="kb-example-strong">Knowledge retained</span> <span className="kb-example-desc">— available to the whole team, even after people move on</span></span>
          </div>
        </div>
      </div>
    </section>
  );
}
