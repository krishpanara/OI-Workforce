const CheckArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
);

const flowSteps = [
  {
    num: '1',
    title: 'Query arrives',
    desc: 'Typed or spoken, from any consultant\'s My OI.',
  },
  {
    num: '2',
    title: 'Searches the knowledge bank',
    desc: 'Not the internet. The organisation\'s own ingested meetings, messages, documents and past projects.',
  },
  {
    num: '3',
    title: 'Routes to the right specialist',
    desc: 'LLM Logic picks from 136+ models: the one built for this exact task, not a generalist forced to do it all.',
  },
  {
    num: '4',
    title: 'Specialists get to work',
    desc: 'Each chosen model works its part (video, translation, financial reasoning) in parallel.',
  },
  {
    num: '5',
    title: 'Compiles and asks',
    desc: 'Results become one answer. You choose how you want it: read aloud, summary, full report, slide deck.',
  },
  {
    num: '6',
    title: 'Learns and stores',
    desc: 'Which models worked best gets remembered. The finished output joins the knowledge bank, ready for the next question.',
  },
];

export default function Flow() {
  return (
    <section id="flow">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">The loop behind every answer</div>
          <h2 style={{fontSize:'30px'}}>Ask once. Watch it get smarter every time.</h2>
          <p style={{color:'var(--grey)', fontSize:'16px', maxWidth:'680px', marginTop:'14px'}}>Every query doesn&apos;t just get answered. It makes the next one better. Here&apos;s what actually happens between asking and delivering.</p>
        </div>
        <div className="flow-grid">
          {flowSteps.flatMap((step, i) => {
            const items = [
              <div key={step.num} className="flow-step reveal">
                <div className="flow-num">{step.num}</div>
                <div className="flow-title">{step.title}</div>
                <div className="flow-desc">{step.desc}</div>
              </div>
            ];
            if (i < flowSteps.length - 1) {
              items.push(
                <div key={`arrow-${i}`} className="flow-arrow"><CheckArrow /></div>
              );
            }
            return items;
          })}
        </div>
        <div className="flow-loop reveal">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 2.1l4 4-4 4"/>
            <path d="M3 12.7V12a9 9 0 019-9c2.4 0 4.7.9 6.4 2.6M7 21.9l-4-4 4-4"/>
            <path d="M21 11.3v.6a9 9 0 01-9 9c-2.4 0-4.7-.9-6.4-2.6"/>
          </svg>
          <p>This closes the loop. The finished output and the model choices that worked feed straight back into step 1, so the organisation&apos;s next question starts smarter than this one did.</p>
        </div>
      </div>
    </section>
  );
}
