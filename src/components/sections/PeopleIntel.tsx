export default function PeopleIntel() {
  return (
    <section className="people-intel" id="people-intelligence">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">People intelligence</div>
          <div className="employee-q">What if your organisation knew its own people as well as it knows its numbers?</div>
          <p className="body">OI Workforce builds a live picture of your workforce: who&apos;s stretched, who&apos;s at risk, where skills are missing, and what&apos;s needed before it becomes a problem.</p>
        </div>
        <div className="pi-grid">
          <div className="pi-card reveal">
            <div className="pi-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <h4>Workforce capacity</h4>
            <p>Know which teams are stretched and which have capacity, without waiting for a quarterly review or a manager to flag it.</p>
          </div>
          <div className="pi-card reveal">
            <div className="pi-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <h4>Retention signals</h4>
            <p>OI tracks engagement patterns and surfaces retention risk weeks before it shows up in an exit interview or resignation letter.</p>
          </div>
          <div className="pi-card reveal">
            <div className="pi-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h4>Skills &amp; knowledge gaps</h4>
            <p>As OI observes what&apos;s being asked, escalated and missed, it builds a real picture of where capability needs to grow, not just what the org chart says.</p>
          </div>
        </div>
        <p className="pi-future">People Intelligence deepens as OI learns your organisation. The longer it works with you, the more it sees.</p>
        <div className="pi-cta">
          <a href="#pricing">Start building your people intelligence &rarr;</a>
        </div>
      </div>
    </section>
  );
}
