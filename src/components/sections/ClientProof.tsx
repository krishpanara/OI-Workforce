import Image from 'next/image';
import { IMAGES } from '@/lib/images';

const testimonials = [
  {
    quote: 'Every recommendation OI makes is logged and auditable. In regulated lending that\'s not a nice-to-have, it\'s the whole ballgame.',
    name: 'Angel Thomas',
    role: 'MD, In2Equity, mortgages, loans & insurance, UK',
    logo: IMAGES.logoIn2Equity,
    logoAlt: 'In2Equity logo',
  },
  {
    quote: 'Our warehouse teams don\'t always have signal. OI still works there. That\'s the difference between a tool built for Accra and one just translated for it.',
    name: 'Freda Donkor',
    role: 'CEO, FH Depot, FMCG, Accra, Ghana',
    logo: IMAGES.logoFHDepot,
    logoAlt: 'FH Depot logo',
  },
  {
    quote: 'Client privilege means we can\'t hand documents to just any AI tool. OI\'s sovereign deployment is what let us actually say yes.',
    name: 'Patrick Opoku-Boateng',
    role: 'Senior Partner, Fortwell, solicitors, London, UK',
    logo: IMAGES.logoFortwell,
    logoAlt: 'Fortwell logo',
  },
  {
    quote: 'We built OI Workforce\'s brand, and now we run our own campaign reporting through it. If it didn\'t save us real time, we wouldn\'t recommend it to clients.',
    name: 'Emefa Atisu',
    role: 'Marketing Manager, The Social House, Ghana',
    logo: IMAGES.logoSocialHouse,
    logoAlt: 'The Social House logo',
  },
  {
    quote: 'As a software company ourselves, we\'re picky about AI tooling. OI\'s LLM Logic actually routes the right model to the right job, instead of forcing one model to do everything.',
    name: 'Brijesh Shukla',
    role: 'MD, Omfinitive, software, India',
    logo: IMAGES.logoOmfinitive,
    logoAlt: 'Omfinitive logo',
  },
  {
    quote: 'Recruitment lives or dies on speed. OI gets a shortlist to us in hours, not days, and it\'s already checked references and flagged gaps we\'d have missed at 11pm before a client call.',
    name: 'Susan Taylor',
    role: 'Recruitment Manager, Mercury Careers, UK',
    logo: IMAGES.logoMercuryCareers,
    logoAlt: 'Mercury Careers logo',
  },
];

export default function ClientProof() {
  return (
    <section className="client-proof" id="proof">
      <div className="wrap">
        <div className="section-head reveal" style={{textAlign:'left', marginBottom:'8px'}}>
          <div className="eyebrow">Early partners</div>
          <h2 style={{fontSize:'30px'}}>Who&apos;s already putting OI to work.</h2>
          <p style={{color:'var(--grey)', fontSize:'15px', maxWidth:'640px', marginTop:'10px'}}>The organisations below are already working with OI Workforce. The quotes underneath are draft copy, written to match each organisation&apos;s context ahead of their actual sign-off, not real statements from them yet.</p>
        </div>

        <div className="testimonial-grid reveal">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <span className="tq-mark">&ldquo;</span>
              <p>{t.quote}</p>
              <div className="testimonial-attrib">
                <div className="testimonial-attrib-left">
                  <div className="testimonial-logo">
                    <Image src={t.logo} alt={t.logoAlt} width={32} height={32} style={{maxWidth:'100%', maxHeight:'100%', objectFit:'contain'}}/>
                  </div>
                  <div>
                    <div className="ta-name">{t.name}</div>
                    <div className="ta-role">{t.role}</div>
                  </div>
                </div>
                <span className="testimonial-draft">Draft</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
