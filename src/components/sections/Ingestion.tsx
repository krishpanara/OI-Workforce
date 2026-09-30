export default function Ingestion() {
  return (
    <section className="integrations alt-bg">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">What OI actually reads</div>
          <h2 style={{fontSize:'30px'}}>Trained on your organisation, not the internet.</h2>
          <p style={{color:'var(--grey)', fontSize:'16px', maxWidth:'640px', marginTop:'14px'}}>Generic AI knows the internet. OI Workforce knows your organisation: every meeting, message and document, ingested continuously, so answers come from what actually happened here, not a general guess.</p>
        </div>
        <div className="int-group reveal">
          <div className="int-group-label">Continuously ingested</div>
          <div className="int-grid">
            <div className="int-pill"><span className="dot" style={{background:'var(--blue)'}}></span>Meeting minutes &amp; recordings</div>
            <div className="int-pill"><span className="dot" style={{background:'#25D366'}}></span>WhatsApp messages</div>
            <div className="int-pill"><span className="dot" style={{background:'var(--midblue)'}}></span>Email</div>
            <div className="int-pill"><span className="dot" style={{background:'var(--grey)'}}></span>SMS &amp; text messages</div>
            <div className="int-pill"><span className="dot" style={{background:'var(--deepteal)'}}></span>Call transcripts</div>
            <div className="int-pill"><span className="dot" style={{background:'var(--darkteal)'}}></span>Documents &amp; spreadsheets</div>
            <div className="int-pill"><span className="dot" style={{background:'#0052CC'}}></span>Connected system data</div>
            <div className="int-pill"><span className="dot" style={{background:'#8E44AD'}}></span>Images &amp; scanned files</div>
            <div className="int-pill"><span className="dot" style={{background:'#059669'}}></span>Financial reports</div>
            <div className="int-pill"><span className="dot" style={{background:'#B45309'}}></span>Company policy documents</div>
            <div className="int-pill"><span className="dot" style={{background:'#DC2626'}}></span>Risk analysis</div>
            <div className="int-pill"><span className="dot" style={{background:'#0EA5E9'}}></span>Contracts &amp; legal documents</div>
            <div className="int-pill"><span className="dot" style={{background:'#F59E0B'}}></span>Customer support tickets</div>
            <div className="int-pill"><span className="dot" style={{background:'#6366F1'}}></span>Calendar &amp; scheduling data</div>
            <div className="int-pill"><span className="dot" style={{background:'#EC4899'}}></span>Presentations &amp; slide decks</div>
            <div className="int-pill"><span className="dot" style={{background:'#14B8A6'}}></span>Survey &amp; feedback data</div>
            <div className="int-pill"><span className="dot" style={{background:'#84CC16'}}></span>HR &amp; personnel records</div>
            <div className="int-pill" style={{color:'var(--grey)', fontWeight:500}}>+ much more</div>
          </div>
        </div>
        <div className="hr-proof reveal" style={{marginTop:'32px', maxWidth:'640px'}}>
          <p style={{fontStyle:'normal', color:'#31394A'}}>Every database, report, meeting, email, message, task and project ever completed by an AI or a human employee is available for recall by your OI Consultant in seconds, not what was true on the internet whenever a model was last trained.</p>
        </div>
      </div>
    </section>
  );
}
