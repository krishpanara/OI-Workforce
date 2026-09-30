export default function GLIF() {
  return (
    <section className="glif">
      <div className="wrap">
        <div className="reveal">
          <div className="eyebrow">GLIF: Global Language Intelligence Framework</div>
          <h2 style={{fontSize:'30px', marginBottom:'16px'}}>Speaks the languages your teams and customers actually use.</h2>
          <p style={{color:'var(--grey)', fontSize:'16px', marginBottom:'0'}}>GLIF is the layer that reads, translates and understands meaning across languages, not just words. A meeting in Twi, a WhatsApp thread in Ga, a report in English — all become one connected understanding, not three separate silos. Every OI Consultant, not a translation add-on but the consultants themselves, speaks and understands each of these languages directly.</p>
          <div className="glif-langs">
            <span className="glif-lang">English</span>
            <span className="glif-lang">Twi</span>
            <span className="glif-lang">Ga</span>
            <span className="glif-lang soon">&#2361;&#2367;&#2344;&#2381;&#2342;&#2368;, Coming Next</span>
            <span className="glif-lang soon">More languages, coming soon</span>
          </div>
        </div>
        <div className="glif-visual reveal">
          <div className="glif-row">
            <span className="from">WhatsApp &middot; Ga</span>
            <span className="arrow">&#8594;</span>
            <span className="to">Understood &amp; actioned</span>
          </div>
          <div className="glif-row">
            <span className="from">Meeting &middot; Twi</span>
            <span className="arrow">&#8594;</span>
            <span className="to">Minutes in English</span>
          </div>
          <div className="glif-row">
            <span className="from">Report &middot; English</span>
            <span className="arrow">&#8594;</span>
            <span className="to">Summary in Twi</span>
          </div>
          <div className="glif-row">
            <span className="from">Voice note &middot; Ga</span>
            <span className="arrow">&#8594;</span>
            <span className="to">Logged to the ledger</span>
          </div>
        </div>
      </div>
    </section>
  );
}
