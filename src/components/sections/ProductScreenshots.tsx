'use client';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';

export default function ProductScreenshots() {
  return (
    <>
      {/* MY OI */}
      <section className="shotsection" id="product">
        <div className="wrap">
          <div className="textblock reveal">
            <span className="tag">My OI: your executive office</span>
            <h3>Not a chatbot. Where you delegate real work and it actually gets done.</h3>
            <p>Ask it to prepare a board pack, analyse last quarter&apos;s financials, or research a topic. It doesn&apos;t reply with a paragraph. It delivers exactly what you&apos;d hand to a real chief of staff. It gathers information across every connected system, narrates exactly what it&apos;s doing while it works, and hands back a finished deliverable in whatever form you actually need it: read aloud, a summary, a full report, or a slide deck.</p>
            <ul id="ul-myoi">
              <li data-pin="1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D5FD4" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                Talks through its own process in real time, step by step
              </li>
              <li data-pin="2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D5FD4" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                Voice or type, same conversation, same memory
              </li>
              <li data-pin="3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D5FD4" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                Delivers in the format you actually need next
              </li>
            </ul>
          </div>
          <div className="browser-frame reveal">
            <div className="browser-bar">
              <span className="bdot"></span><span className="bdot"></span><span className="bdot"></span>
              <span className="burl" id="url-myoi" data-url="app.oiworkforce.com/my-oi">app.oiworkforce.com/my-oi</span>
            </div>
            <div className="shot-media" id="shot-myoi">
              <Image src={IMAGES.screenshotMyOI} alt="My OI screenshot" width={780} height={520} style={{width:'100%',height:'auto',display:'block'}}/>
              <div className="pin active" id="pin1-myoi" style={{left:'22%',top:'38%'}} data-target="1">1</div>
              <div className="pin" id="pin2-myoi" style={{left:'55%',top:'62%'}} data-target="2">2</div>
              <div className="pin" id="pin3-myoi" style={{left:'78%',top:'28%'}} data-target="3">3</div>
              <div className="pin-label" id="plabel-myoi">Talks through its own process</div>
              <div className="spot-box" id="spot-myoi"></div>
              <div className="shimmer" id="shimmer-myoi"></div>
              <div className="fake-cursor" id="cursor-myoi"></div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMAND CENTRE */}
      <section className="shotsection">
        <div className="wrap">
          <div className="textblock reveal">
            <span className="tag">Command Centre: your executive office</span>
            <h3>Every team. Every project. Every decision. One place.</h3>
            <p>The Command Centre gives leadership the whole picture, not a report from each department that&apos;s already out of date. Projects, tasks, decisions, risks and blockers surface automatically so leaders spend time acting, not asking.</p>
            <ul id="ul-cc">
              <li data-pin="1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D5FD4" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                Real-time project and task status across every team
              </li>
              <li data-pin="2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D5FD4" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                Decisions and risks flagged before they become problems
              </li>
              <li data-pin="3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D5FD4" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                No manual reporting, no chasing for updates
              </li>
            </ul>
          </div>
          <div className="browser-frame reveal">
            <div className="browser-bar">
              <span className="bdot"></span><span className="bdot"></span><span className="bdot"></span>
              <span className="burl" id="url-cc" data-url="app.oiworkforce.com/command-centre">app.oiworkforce.com/command-centre</span>
            </div>
            <div className="shot-media" id="shot-cc">
              <Image src={IMAGES.screenshotCommandCentre} alt="Command Centre screenshot" width={780} height={520} style={{width:'100%',height:'auto',display:'block'}}/>
              <div className="pin active" id="pin1-cc" style={{left:'30%',top:'45%'}} data-target="1">1</div>
              <div className="pin" id="pin2-cc" style={{left:'62%',top:'30%'}} data-target="2">2</div>
              <div className="pin" id="pin3-cc" style={{left:'80%',top:'65%'}} data-target="3">3</div>
              <div className="pin-label" id="plabel-cc">Real-time project status</div>
              <div className="spot-box" id="spot-cc"></div>
              <div className="shimmer" id="shimmer-cc"></div>
              <div className="fake-cursor" id="cursor-cc"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
