export default function CapacityReport({ onMeetOI }: { onMeetOI: () => void }) {
  return (
    <section className="cap-report" id="capacity-report">
      <div className="wrap">
        <div className="cr-intro reveal" id="crIntro">
          <h2>How much more capable could your organisation become?</h2>
          <p>Meet your Personal OI and have it build your own company Organisation Capacity Report&trade; together with you. It takes around five minutes and identifies opportunities where your OI Workforce can improve your company&apos;s efficiency &amp; execution, protect company knowledge and improve workforce capability.</p>
          <p className="cr-expect">You will receive an initial downloadable preview based on what you share.</p>
          <button className="cr-start-btn" id="crStartBtn" type="button" onClick={onMeetOI}>Meet Your Personal OI&trade;</button>
          <p className="cr-trial-note">Try for 14 days for FREE,<br />No credit card or contract required</p>
        </div>
      </div>
    </section>
  );
}
