export default function Legal() {
  return (
    <section className="legal">
      <div className="wrap">
        <div className="section-head reveal" style={{textAlign:'left', marginBottom:'56px'}}>
          <div className="eyebrow">Legal</div>
          <h2 style={{fontSize:'30px'}}>Plain language, before the formal language.</h2>
          <p style={{color:'var(--grey)', fontSize:'16px', maxWidth:'640px'}}>Since sovereignty and data handling are central to what OI Workforce does, here&apos;s a direct summary of each policy, not just a link to a document nobody reads.</p>
        </div>

        <div className="legal-grid">
          <div className="legal-block reveal" id="privacy">
            <span className="legal-draft-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Draft, pending legal review
            </span>
            <h3>Privacy</h3>
            <p>We collect the minimum data needed to run your account and the platform itself, never anything beyond that, and never sold to third parties.</p>
            <ul>
              <li>Signup and contact details, kept only for as long as your account is active</li>
              <li>Usage data used to improve the product, never to profile individual employees</li>
              <li>Full deletion on request, honoured within a stated timeframe</li>
            </ul>
          </div>

          <div className="legal-block reveal" id="terms">
            <span className="legal-draft-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Draft, pending legal review
            </span>
            <h3>Terms</h3>
            <p>Straightforward terms of use, no auto-renewal traps, no hidden lock-in.</p>
            <ul>
              <li>Your organisation owns everything OI Consultants produce on your behalf</li>
              <li>Clear cancellation terms, stated plainly in the plan you sign up for</li>
              <li>Service levels appropriate to your deployment tier, published not buried</li>
            </ul>
          </div>

          <div className="legal-block reveal" id="data-handling">
            <span className="legal-draft-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Draft, pending legal review
            </span>
            <h3>Data handling</h3>
            <p>This is the one that matters most given what OI Workforce does, so here it is without qualification.</p>
            <ul>
              <li>Your data is never used to train public AI models</li>
              <li>With the sovereign appliance, data can stay entirely within your own infrastructure</li>
              <li>Every autonomous action is logged to your organisation&apos;s ledger, see the audit-trail section above</li>
              <li>Compliance alignment (UK GDPR, and regional equivalents in Ghana and India) confirmed per deployment, ask your account team for specifics</li>
            </ul>
          </div>

          <div className="legal-block reveal" id="security">
            <span className="legal-draft-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Draft, pending legal review
            </span>
            <h3>Security</h3>
            <p>Sovereignty means nothing without security to back it up. Here&apos;s how OI Workforce is actually protected.</p>
            <ul>
              <li>End-to-end encryption for data in transit and at rest</li>
              <li>Role-based access control down to individual document and system level</li>
              <li>Every autonomous action logged and attributable, see the audit-trail ledger above</li>
              <li>Independent security review planned ahead of general availability, details to follow</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
