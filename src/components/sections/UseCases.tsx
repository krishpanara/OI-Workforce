import Image from 'next/image';
import { IMAGES } from '@/lib/images';

export default function UseCases() {
  return (
    <>
      {/* Projects */}
      <section className="shotsection" id="usecases">
        <div className="wrap">
          <div className="textblock reveal">
            <span className="tag">Projects</span>
            <h3>The full picture, everywhere you work.</h3>
            <p>Every project, visible in one place. Status, blockers, decisions and next steps are surfaced automatically, so leadership always knows what&apos;s happening without chasing anyone for a report.</p>
            <ul>
              <li data-pin="1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D5FD4" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                Real-time project visibility across every team
              </li>
              <li data-pin="2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D5FD4" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                Blockers and risks surfaced automatically
              </li>
              <li data-pin="3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D5FD4" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                No manual status updates or reporting required
              </li>
            </ul>
          </div>
          <div className="browser-frame reveal">
            <div className="browser-bar">
              <span className="bdot"></span><span className="bdot"></span><span className="bdot"></span>
              <span className="burl">app.oiworkforce.com/projects</span>
            </div>
            <div className="shot-media">
              <Image src={IMAGES.screenshotProjects} alt="Projects screenshot" width={780} height={520} style={{width:'100%',height:'auto',display:'block'}}/>
              <div className="pin active" style={{left:'25%',top:'40%'}}>1</div>
              <div className="pin" style={{left:'58%',top:'32%'}}>2</div>
              <div className="pin" style={{left:'76%',top:'62%'}}>3</div>
              <div className="shimmer"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Tasks */}
      <section className="shotsection">
        <div className="wrap">
          <div className="textblock reveal">
            <span className="tag">Tasks</span>
            <h3>Every task, assigned and tracked without chasing.</h3>
            <p>Tasks are created, assigned and followed up by the OI Consultants, not a project manager. When something&apos;s at risk of slipping, it&apos;s flagged before it does.</p>
            <ul>
              <li data-pin="1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D5FD4" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                Auto-assigned with clear ownership and deadlines
              </li>
              <li data-pin="2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D5FD4" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                Slipping tasks flagged before they miss
              </li>
              <li data-pin="3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D5FD4" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                Completed tasks added to the knowledge bank automatically
              </li>
            </ul>
          </div>
          <div className="browser-frame reveal">
            <div className="browser-bar">
              <span className="bdot"></span><span className="bdot"></span><span className="bdot"></span>
              <span className="burl">app.oiworkforce.com/tasks</span>
            </div>
            <div className="shot-media">
              <Image src={IMAGES.screenshotTasks} alt="Tasks screenshot" width={780} height={520} style={{width:'100%',height:'auto',display:'block'}}/>
              <div className="pin active" style={{left:'22%',top:'35%'}}>1</div>
              <div className="pin" style={{left:'55%',top:'55%'}}>2</div>
              <div className="pin" style={{left:'75%',top:'25%'}}>3</div>
              <div className="shimmer"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Conversations */}
      <section className="shotsection alt-bg">
        <div className="wrap">
          <div className="textblock reveal">
            <span className="tag">Conversations</span>
            <h3>Every conversation logged. Every decision captured.</h3>
            <p>Whether it&apos;s a WhatsApp message, a meeting or a voice call, OI captures what was said, what was decided and what happens next. Nothing gets lost between conversations.</p>
            <ul>
              <li data-pin="1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D5FD4" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                Every channel, one searchable record
              </li>
              <li data-pin="2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D5FD4" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                Decisions and follow-ups extracted automatically
              </li>
              <li data-pin="3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D5FD4" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                Works via WhatsApp, voice, web, or any connected channel
              </li>
            </ul>
          </div>
          <div className="browser-frame reveal">
            <div className="browser-bar">
              <span className="bdot"></span><span className="bdot"></span><span className="bdot"></span>
              <span className="burl">app.oiworkforce.com/conversations</span>
            </div>
            <div className="shot-media">
              <Image src={IMAGES.screenshotConversations} alt="Conversations screenshot" width={780} height={520} style={{width:'100%',height:'auto',display:'block'}}/>
              <div className="pin active" style={{left:'28%',top:'42%'}}>1</div>
              <div className="pin" style={{left:'60%',top:'28%'}}>2</div>
              <div className="pin" style={{left:'80%',top:'58%'}}>3</div>
              <div className="shimmer"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
