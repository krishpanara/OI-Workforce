'use client';
import { useState, useRef, useEffect } from 'react';
import { IMAGES } from '@/lib/images';

type Currency = 'USD' | 'GBP' | 'EUR' | 'GHS';
type ChatMsg = { id: number; from: 'david' | 'user'; text: string } | { id: number; from: 'thinking' };

const CURRENCY_CONFIG: Record<Currency, { symbol: string; rate: number }> = {
  USD: { symbol: '$', rate: 1.27 }, GBP: { symbol: '£', rate: 1 }, EUR: { symbol: '€', rate: 1.17 }, GHS: { symbol: '₵', rate: 15.5 },
};
const MOCK_BUSINESSES: Record<string, { name: string; desc: string; employees: string; location: string }> = {
  Banking: { name: 'Meridian Trust Bank', desc: 'We provide retail and commercial banking services across three branches.', employees: '40 Management, 180 Staff', location: 'London, UK' },
  FMCG: { name: 'Sunburst Consumer Goods', desc: 'We manufacture and distribute fast-moving consumer goods to retail partners nationwide.', employees: '25 Management, 210 Staff', location: 'Accra, Ghana' },
  Restaurants: { name: 'Copperleaf Kitchens Group', desc: 'We operate a group of casual dining restaurants across the region.', employees: '12 Management, 140 Staff', location: 'Mumbai, India' },
  Insurance: { name: 'Ashcombe Mutual Insurance', desc: 'We provide commercial and personal lines insurance and claims handling.', employees: '18 Management, 90 Staff', location: 'London, UK' },
  Construction: { name: 'Kaine & Holt Construction Group', desc: 'We deliver commercial and infrastructure construction projects across the region.', employees: '22 Management, 140 Site Workers', location: 'Manchester, UK' },
  Manufacturing: { name: 'Demo Manufacturing Limited', desc: 'We manufacture plastic bottles and containers for other industries.', employees: '14 Management, 87 Workers', location: 'Accra, Ghana' },
  Healthcare: { name: 'Riverside Health Partners', desc: 'We provide outpatient and diagnostic healthcare services across three clinics.', employees: '18 Management, 210 Clinical & Support Staff', location: 'Mumbai, India' },
  Legal: { name: 'Hartley Dunmore Solicitors', desc: 'We provide commercial and corporate legal advisory services.', employees: '12 Partners & Management, 58 Staff', location: 'London, UK' },
  Retail: { name: 'Kofi & Sons Retail Group', desc: 'We operate a regional chain of consumer goods retail stores.', employees: '16 Management, 95 Store Staff', location: 'Accra, Ghana' },
  Hospitality: { name: 'Bluewater Hotels Group', desc: 'We operate a group of boutique hotels and guest services.', employees: '20 Management, 160 Staff', location: 'Mumbai, India' },
  'Professional Services': { name: 'Meridian Advisory Partners', desc: 'We provide strategic and financial advisory services to mid-market clients.', employees: '15 Partners & Management, 70 Staff', location: 'London, UK' },
  Education: { name: 'Crestview Academy Trust', desc: 'We run primary and secondary education across two campuses.', employees: '25 Management & Faculty, 180 Staff', location: 'Accra, Ghana' },
  Mining: { name: 'Northstar Minerals Ltd', desc: 'We operate mineral extraction and processing sites across two regions.', employees: '30 Management, 420 Site Workers', location: 'Kumasi, Ghana' },
};
const POSITION_OPTIONS = ['CEO','Finance Manager','Operations Manager','HR Manager','Sales Manager','Marketing Manager','Procurement Manager'];
const POSITION_LABELS: Record<string, Record<string, string>> = {
  Banking: { 'Operations Manager': 'Branch Operations Manager', 'Sales Manager': 'Relationship Manager' },
  FMCG: { 'Marketing Manager': 'Brand Manager' },
  Restaurants: { CEO: 'Owner / CEO', 'Operations Manager': 'General Manager', 'Sales Manager': 'Front of House Manager' },
  Healthcare: { 'Operations Manager': 'Clinical Operations Manager', 'Sales Manager': 'Patient Services Manager' },
  Legal: { CEO: 'Managing Partner', 'Operations Manager': 'Practice Operations Manager', 'Sales Manager': 'Business Development Manager' },
  Insurance: { 'Sales Manager': 'Underwriting Manager' },
};
function posLabel(industry: string, pos: string) { return (POSITION_LABELS[industry] || {})[pos] || pos; }

const CONSULTANT_PHOTOS: Record<string, string> = {
  'Adwoa Mensah': IMAGES.avatarConsult1, 'James Whitfield': IMAGES.avatarConsult2, 'Kwame Asante': IMAGES.avatarConsult3,
  'Priya Sharma': IMAGES.avatarConsult4, 'Kofi Boateng': IMAGES.avatarConsult5, 'Funmilayo Adeyemi': IMAGES.avatarConsult6,
  'Sarah Mitchell': IMAGES.avatarConsult7, 'Ravi Kumar': IMAGES.avatarConsult8, 'Chidinma Okafor': IMAGES.avatarConsult9,
  'Michael Osei': IMAGES.avatarConsult10, 'Abena Owusu': IMAGES.avatarConsult11,
  'Amara Diallo': IMAGES.avatarConsult12, 'Yaw Darko': IMAGES.avatarConsult13, 'Nneka Obi': IMAGES.avatarConsult14,
};
const AVATAR_NAMES = ['James Whitfield','Priya Sharma','Kwame Asante','Sarah Mitchell','Kofi Boateng','Chidinma Okafor'];

const INDUSTRY_PROFILES: Record<string, { depts: string[] }> = {
  Banking: { depts: ['Operations','Risk & Compliance','Finance','Customer Service','Credit'] },
  FMCG: { depts: ['Operations','Sales','Marketing','Warehouse','Finance'] },
  Restaurants: { depts: ['Operations','Kitchen','Finance','HR','Front of House'] },
  Insurance: { depts: ['Underwriting','Claims','Risk & Compliance','Finance','Customer Service'] },
  Construction: { depts: ['Operations','Projects','Finance','Procurement','Health & Safety'] },
  Manufacturing: { depts: ['Operations','Production','Finance','Sales','Procurement','Warehouse','Quality'] },
  Healthcare: { depts: ['Clinical Operations','Finance','HR','Administration','Compliance'] },
  Legal: { depts: ['Legal','Finance','Client Services','Compliance'] },
  Retail: { depts: ['Operations','Sales','Finance','Warehouse','Marketing'] },
  Hospitality: { depts: ['Operations','Finance','HR','Guest Services'] },
  'Professional Services': { depts: ['Client Services','Finance','Operations','Business Development'] },
  Education: { depts: ['Academic Operations','Finance','Admissions','HR'] },
  Mining: { depts: ['Operations','Safety','Finance','Procurement','Logistics'] },
};

const WIZARD_STEPS = [
  { key: 'company', q: "What's your organisation called?", placeholder: 'Organisation name' },
  { key: 'website', q: "What's your website?", placeholder: 'yourcompany.com' },
  { key: 'country', q: 'Where are most of your people based?', placeholder: 'Country' },
  { key: 'email', q: "And what's your work email?", placeholder: 'name@yourcompany.com' },
];

const DISCOVERY_QUESTIONS = [
  { key: 'objective', multi: true, text: 'While I look into that, what matters most to you right now? Choose as many as apply.', options: ['Increasing revenue','Driving team efficiency & development','Protecting industry knowledge','Reducing operating cost','Removing fragmented systems'] },
  { key: 'size', multi: false, text: 'Roughly how many people work in your organisation?', options: ['1–10','11–50','51–250','251–1,000','1,000+'] },
  { key: 'systems', multi: true, text: 'Which best describes how your team works today? Choose as many as apply.', options: ['Mostly spreadsheets & email','Mostly verbal or informal communication','A few disconnected tools','A mix of legacy and modern systems','One central system already','Not sure yet'] },
  { key: 'staffing', multi: false, text: 'Right now, would you say your team is…', options: ['Stretched thin, doing more than they should','About right, but using some manual systems & processes','Well staffed, but could be a little more efficient','Hard to describe at the moment'] },
  { key: 'growth', multi: true, text: 'Which of these is a constraint on growth today? Choose as many as apply.', options: ['Attracting new customers','Converting interest into sales','Retaining existing customers','Operational capacity to meet demand','Not yet clear'] },
];
const DEFAULT_HOOK = { driverName: 'Knowledge Capture', question: "How much of your team's best thinking is captured somewhere reusable?", options: [{ text: 'Well captured and reusable', level: 2, why: 'Strong knowledge capture is a real asset.' },{ text: 'Some of it, not consistently', level: 1, why: 'Partial capture is common at this stage.' },{ text: 'Mostly known only by individuals', level: 0, why: 'Knowledge concentrated in individuals is the most common risk at this size.' },{ text: 'Not sure', level: 0, why: 'Worth mapping directly.' }] };
const INDUSTRY_HOOKS: Record<string, typeof DEFAULT_HOOK> = {
  Banking: { driverName: 'Audit Trail Readiness', question: 'If a regulator asked for the full history behind a recent decision — who approved it, when, and why — how quickly could you produce it?', options: [{ text: 'Within minutes, it\'s all logged', level: 2, why: 'A fast, complete audit trail is a strong foundation.' },{ text: 'We\'d need to pull it together manually', level: 1, why: 'Manual reconstruction is a real regulatory exposure.' },{ text: 'We\'re not sure we could reconstruct it', level: 0, why: 'An unreconstructable decision trail is a compliance finding waiting to happen.' },{ text: 'Not applicable to us', level: 1, why: 'Worth revisiting as obligations evolve.' }] },
  Healthcare: { driverName: 'Care Continuity', question: 'When a shift changes, does the next person start with full context, or from a blank page?', options: [{ text: 'Full context every time', level: 2, why: 'Consistent handoff quality is a genuine safety strength.' },{ text: 'Depends who\'s on shift', level: 1, why: 'Handoff quality depending on who\'s working is a well-documented risk.' },{ text: 'Mostly starts from scratch', level: 0, why: 'Context loss at handoff is a consistently cited root cause in care-quality incidents.' },{ text: 'Not sure', level: 0, why: 'Worth mapping directly.' }] },
  Legal: { driverName: 'Knowledge Reuse', question: 'How much of your associates\' time goes into re-researching something the firm has already solved before?', options: [{ text: 'Very little — we reuse prior work well', level: 2, why: 'Strong knowledge reuse is a real competitive edge.' },{ text: 'A noticeable amount', level: 1, why: 'Re-researched work is time paid for twice.' },{ text: 'A significant amount — we repeat ourselves often', level: 0, why: 'Repeated research at scale is one of the largest hidden costs.' },{ text: 'Not sure', level: 0, why: 'Worth measuring directly.' }] },
  Insurance: { driverName: 'Decision Consistency', question: 'If two different underwriters reviewed the same case, would they reach the same decision?', options: [{ text: 'Yes, very consistently', level: 2, why: 'Strong decision consistency is a regulatory strength.' },{ text: 'Mostly, with some variation', level: 1, why: 'Some variation is common, but it\'s an exposure worth tightening.' },{ text: 'Not reliably — it depends who handles it', level: 0, why: 'Inconsistent decisions is a direct fairness and cost exposure.' },{ text: 'Not sure', level: 0, why: 'Worth testing directly.' }] },
  Manufacturing: { driverName: 'Production Capacity Alignment', question: 'Are you able to fulfil every order you receive, or is production capacity holding you back?', options: [{ text: 'We fulfil everything, no issue', level: 2, why: 'Full order fulfilment is a strong position.' },{ text: 'We\'re leaving some revenue on the table', level: 1, why: 'This is a supply-side bottleneck — usually the more fixable of the two.' },{ text: 'This is a significant, ongoing constraint', level: 0, why: 'An unmet-demand business is leaving revenue on the table today.' },{ text: 'Not sure', level: 0, why: 'Worth quantifying directly.' }] },
};

const RESPONSES = [
  { prompt: "Prepare tomorrow's board pack", trigger: ['board pack','board meeting'], roles: ['CEO','Finance Manager'], reply: "On it. I've pulled the Q3 numbers from Finance, the project status from Operations, and the two risk flags Sarah logged this week. Board pack will be ready in your Outputs panel — want it as a Word doc, a slide deck, or both?" },
  { prompt: "Show me this month's biggest operational risks", trigger: ['operational risk','biggest risk','risks'], roles: ['Operations Manager','CEO'], reply: "Three stand out. A supplier contract renewal is 9 days overdue for review. Warehouse capacity is running at 94% with no buffer before peak season. And two customer complaints this week both mention the same shipping delay — that's a pattern, not a one-off. Want me to draft next steps for any of these?" },
  { prompt: "Summarise last week's leadership meeting", trigger: ['summarise','summarize','leadership meeting','last week'], roles: ['CEO'], reply: "Key decisions: Q2 budget approved, the new supplier was selected over the incumbent, and the Kumasi hiring freeze was lifted. Two open actions are still with Michael Brown and Sarah Johnson — both due Friday. I logged all of this to the organisation ledger as it happened." },
  { prompt: "Which customers are at risk?", trigger: ['customers at risk','at-risk customer','churn'], roles: ['Sales Manager','CEO'], reply: "Two accounts show the pattern I'd flag: reduced order frequency plus a support ticket that never got a follow-up. I can prepare a save-plan brief for both, or route them straight to whoever owns those relationships — your call." },
  { prompt: "Review our cashflow", trigger: ['cashflow','cash flow'], roles: ['Finance Manager'], reply: "Cashflow is healthy for the next six weeks, but there's a gap forming in week eight if the Fortwell invoice slips past its due date again — it's happened twice this quarter. Want me to send a reminder now, three days before it's due, or both?" },
  { prompt: "Show outstanding actions", trigger: ['outstanding action','overdue','outstanding task'], roles: ['Operations Manager','HR Manager'], reply: "Six open actions across the team. Two are overdue — a vendor contract review sitting with Sarah Johnson, and a policy update assigned to Marcus Webb. Everything else is on track for this week's deadlines." },
  { prompt: "Who approved this project?", trigger: ['who approved','approval','approved this'], roles: ['CEO','Operations Manager'], reply: "Cliff Williams approved it on the 14th, after Sarah Johnson's risk review came back green. The full approval trail — who reviewed it, what changed, and when — is in the organisation ledger if you ever need to show your work." },
  { prompt: "How's our supplier performance this quarter?", trigger: ['supplier performance','supplier review','vendor performance'], roles: ['Procurement Manager'], reply: "Two suppliers are trending below agreed service levels — both on late-delivery, not quality. One contract renews in three weeks, which is your best leverage point. Want me to draft a renegotiation brief before that renewal date?" },
];
const FOLLOWUPS = [
  { trigger: ['both'], reply: "Perfect. I'll prepare both. You'll find the Word doc and the slide deck in your Outputs panel shortly, ready to share." },
  { trigger: ['yes please','sure','please do'], reply: "On it. I'll get that ready for you now." },
  { trigger: ['word doc','word document'], reply: "Done. The Word version will be in your Outputs panel in a moment." },
  { trigger: ['slide deck','presentation'], reply: "Done. The slide deck will be in your Outputs panel in a moment." },
  { trigger: ['thank you','thanks'], reply: "Anytime. Let me know if there's anything else you'd like me to pull together." },
];
const OUTPUTS_LIBRARY: Record<string, { t: string; m: string }[]> = {
  CEO: [{t:'Board Pack — Q3',m:'DOCX · Ready'},{t:'Leadership Meeting Summary',m:'DOCX · Ready'},{t:'Organisation Ledger — This Week',m:'XLSX · Ready'}],
  'Finance Manager': [{t:'Q2 Financial Report',m:'XLSX · Ready'},{t:'Cashflow Forecast',m:'XLSX · Ready'},{t:'Budget Variance Summary',m:'DOCX · Ready'}],
  'Operations Manager': [{t:'Project Risk Summary',m:'DOCX · Ready'},{t:'Task Queue Overview',m:'DOCX · Ready'},{t:'Warehouse Capacity Report',m:'XLSX · Ready'}],
  'HR Manager': [{t:'Workforce Sentiment Report',m:'DOCX · Ready'},{t:'Retention Risk Brief',m:'DOCX · Ready'},{t:'Headcount Summary',m:'XLSX · Ready'}],
  'Sales Manager': [{t:'Pipeline Health Report',m:'XLSX · Ready'},{t:'At-Risk Accounts Brief',m:'DOCX · Ready'},{t:'Win/Loss Summary',m:'DOCX · Ready'}],
  'Marketing Manager': [{t:'Campaign Performance Summary',m:'PPTX · Ready'},{t:'Brand Sentiment Report',m:'DOCX · Ready'},{t:'Content Calendar',m:'XLSX · Ready'}],
  'Procurement Manager': [{t:'Supplier Risk Review',m:'DOCX · Ready'},{t:'Contract Renewal Tracker',m:'XLSX · Ready'},{t:'Spend by Category',m:'XLSX · Ready'}],
};
const MEETING_REASON: Record<string, string[]> = {
  CEO: ['to walk through it before you\'re in front of the board','to align on it ahead of Thursday\'s leadership call'],
  'Finance Manager': ['to go through the numbers together','to sign off on it before month-end close'],
  'Operations Manager': ['to cover what\'s blocking the warehouse','to walk through this week\'s bottlenecks'],
  'HR Manager': ['to discuss the Kumasi team','to go through this quarter\'s retention numbers'],
  'Sales Manager': ['to go over the at-risk accounts','to plan next steps on the pipeline'],
  'Marketing Manager': ['to review the campaign numbers','to plan next quarter\'s content off the back of it'],
  'Procurement Manager': ['to discuss the contract renewal','to go through supplier terms before they lapse'],
};
const MEETING_CONTACTS = ['Jane Taylor','Michael Osei','Priya Anand'];
const GREETING_TEMPLATES = [
  (n: string, t: string, r: string, c: string, rs: string) => `Good ${t}, ${n}. I've been through your emails and today's diary already. Your ${r} is ready in Outputs, and I've put a 3pm with ${c} in your diary ${rs}. Anything else you'd like me to do?`,
  (n: string, t: string, r: string, c: string, rs: string) => `Morning, ${n}. While you were getting in, I finished your ${r} — it's in Outputs now — and booked ${c} in for 3pm ${rs}. What would you like me to look at next?`,
  (n: string, t: string, r: string, c: string, rs: string) => `${n}, good ${t}. I've cleared your inbox and diary for today, pulled together your ${r}, and scheduled ${c} for 3pm ${rs}. Where should I focus next?`,
];
const MOMENT_LINES = [
  "Everything you've asked me today came from a demonstration organisation.",
  "Now imagine if I understood your business this well.",
  "Imagine I knew every meeting, email, report, customer, project, decision, policy and conversation, and everything your organisation has ever learned.",
  "All securely stored either inside your own organisation or within a secure cloud environment that you control.",
  "That's when I stop being a demonstration.",
  "I'd become part of your team.",
  "Would you like me to come and work for your organisation for the next 14 days, for free?"
];
const LOADING_LINES = ["I'm creating your organisation…","I'm preparing your departments…","I'm setting up your Organisation Memory…","I'm preparing your Executive Office…","I'm creating your first OI Consultants…","I'm setting you up on secure cloud…","I'm getting everything ready…"];
const WORKFORCE_LIBRARY: Record<string, { title: string; color: string; benchmark: number; reason: string }> = {
  'Adwoa Mensah': { title: 'CEO Assistant', color: '#1D5FD4', benchmark: 48000, reason: 'Board packs, minutes and decision registers, ready before the meeting starts.' },
  'James Whitfield': { title: 'OI CFO Analyst', color: '#2C8C8A', benchmark: 52000, reason: 'Cashflow forecasts and board-ready financial summaries, always current.' },
  'Kwame Asante': { title: 'Risk Intelligence Officer', color: '#2A7DE1', benchmark: 50000, reason: 'Monitors operational risk continuously and flags what needs a human call.' },
  'Priya Sharma': { title: 'People Intelligence Lead', color: '#267A76', benchmark: 48000, reason: 'Tracks workforce health and prepares people decisions with full context.' },
  'Kofi Boateng': { title: 'OI Finance', color: '#1D5FD4', benchmark: 42000, reason: 'Tracks spend against budget in real time and flags variances before month-end close.' },
  'Funmilayo Adeyemi': { title: 'OI Risk Analyst', color: '#2A7DE1', benchmark: 40000, reason: 'Flags contract and compliance risk the moment it appears.' },
  'Sarah Mitchell': { title: 'OI HR Manager', color: '#267A76', benchmark: 45000, reason: 'Tracks workforce sentiment and retention risk across every team.' },
  'Ravi Kumar': { title: 'OI Operations Manager', color: '#2C8C8A', benchmark: 48000, reason: 'Keeps daily operations on schedule and flags bottlenecks before they cost you a day.' },
  'Chidinma Okafor': { title: 'OI Sales Manager', color: '#1D5FD4', benchmark: 50000, reason: 'Tracks pipeline health and flags deals losing momentum before they\'re lost.' },
  'Abena Owusu': { title: 'OI Warehouse Manager', color: '#2A7DE1', benchmark: 36000, reason: 'Tracks inventory levels and flags stock-outs before they hit the warehouse floor.' },
  'Emeka Nwosu': { title: 'OI Procurement Manager', color: '#267A76', benchmark: 44000, reason: 'Tracks supplier performance and flags contract renewals before they lapse.' },
  'Grace Appiah': { title: 'OI Medical Receptionist', color: '#1D5FD4', benchmark: 23000, reason: 'Manages appointment scheduling and flags gaps in patient follow-up.' },
  'Thomas Bennett': { title: 'OI Legal Assistant', color: '#001B5C', benchmark: 30000, reason: 'Tracks contract deadlines and flags clauses that need review before signature.' },
  'Elizabeth Turner': { title: 'Executive OI', color: '#1D5FD4', benchmark: 55000, reason: 'Board packs, minutes and decision registers, ready before the meeting starts.' },
  'Yaw Darko': { title: 'Quality OI', color: '#267A76', benchmark: 42000, reason: 'Tracks defect patterns across production lines and flags them before they reach a customer.' },
};
const OI_PRICING_PCT = 0.20;
const INDUSTRY_WORKFORCE: Record<string, string[]> = {
  Banking: ['Elizabeth Turner','Kwame Asante','Funmilayo Adeyemi','Kofi Boateng'],
  FMCG: ['Elizabeth Turner','Chidinma Okafor','Abena Owusu','Kofi Boateng'],
  Restaurants: ['Elizabeth Turner','Sarah Mitchell','Ravi Kumar','Kofi Boateng'],
  Insurance: ['Elizabeth Turner','Funmilayo Adeyemi','Kwame Asante','Kofi Boateng'],
  Construction: ['Elizabeth Turner','Ravi Kumar','Kofi Boateng','Emeka Nwosu'],
  Manufacturing: ['Elizabeth Turner','Ravi Kumar','Abena Owusu','Yaw Darko'],
  Healthcare: ['Elizabeth Turner','Grace Appiah','Kofi Boateng','Priya Sharma'],
  Legal: ['Elizabeth Turner','Thomas Bennett','Kofi Boateng','Funmilayo Adeyemi'],
  Retail: ['Elizabeth Turner','Chidinma Okafor','Abena Owusu','Kofi Boateng'],
  Hospitality: ['Elizabeth Turner','Sarah Mitchell','Chidinma Okafor','Kofi Boateng'],
  'Professional Services': ['Adwoa Mensah','James Whitfield','Chidinma Okafor','Sarah Mitchell'],
  Education: ['Elizabeth Turner','Sarah Mitchell','Kofi Boateng','Priya Sharma'],
  Mining: ['Elizabeth Turner','Kwame Asante','Abena Owusu','Emeka Nwosu'],
};
const STAFFING_PHRASE: Record<string, string> = {
  'Stretched thin, doing more than they should': 'stretched thin right now',
  'About right, but using some manual systems & processes': 'about the right size, though a lot of the work still runs through manual systems',
  'Well staffed, but could be a little more efficient': 'well staffed, with room to run more efficiently',
  'Hard to describe at the moment': "sized appropriately, though that's not fully clear yet",
};
const GROWTH_PHRASE: Record<string, string> = {
  'Attracting new customers': 'attracting new customers',
  'Converting interest into sales': 'converting interest into actual sales',
  'Retaining existing customers': 'retaining the customers you already have',
  'Operational capacity to meet demand': 'building the operational capacity to meet demand',
  'Not yet clear': "not yet clear — worth a quick check with whoever owns customer relationships",
};
const HIGH_STAKES = ['Legal','Healthcare','Mining','Construction'];
const SMALL_SIZES = ['1–10','11–50'];
const LARGE_SIZES = ['251–1,000','1,000+'];

const INDUSTRY_ICONS: Record<string, string> = {
  Banking: '<path d="M3 21h18M4 21V10M20 21V10M3 10l9-6 9 6M7 10v11M12 10v11M17 10v11"/>',
  FMCG: '<path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8"/>',
  Restaurants: '<path d="M7 2v7a2 2 0 002 2h0a2 2 0 002-2V2M9 11v11M17 2v20M17 2a3 3 0 013 3v4a3 3 0 01-3 3"/>',
  Healthcare: '<path d="M12 2a5 5 0 015 5v3h3a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6a2 2 0 012-2h3V7a5 5 0 015-5z"/><path d="M12 11v6M9 14h6"/>',
  Manufacturing: '<path d="M2 20h20M4 20V8l4 3V8l4 3V8l4 3V8l4 3v9"/>',
  Legal: '<path d="M12 2v20M5 8l-3 6a3 3 0 006 0l-3-6zM19 8l-3 6a3 3 0 006 0l-3-6zM5 8h14M8 22h8"/>',
  Insurance: '<path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/>',
  Construction: '<path d="M2 20h20M4 20V10l8-6 8 6v10M9 20v-6h6v6"/>',
  Retail: '<path d="M6 2l1.5 5h9L18 2M4 7h16l-1.5 13a2 2 0 01-2 2H7.5a2 2 0 01-2-2L4 7zM9 11v4M15 11v4"/>',
  Hospitality: '<path d="M3 21h18M5 21V10l7-6 7 6v11M9 21v-6h6v6"/>',
  'Professional Services': '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/>',
  Education: '<path d="M2 9l10-5 10 5-10 5-10-5zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>',
  Mining: '<path d="M17 2l4 4-9 9-4-4 9-9zM12.5 6.5L3 16v5h5l9.5-9.5"/>',
};

// Helpers
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function toArr(v: string | string[] | undefined): string[] { if (!v) return []; return Array.isArray(v) ? v : [v]; }
function answerText(a: Record<string, string | string[]>, k: string, fb: string): string {
  const arr = toArr(a[k]); if (!arr.length) return fb;
  const l = arr.map(x => x.toLowerCase());
  return l.length === 1 ? l[0] : l.slice(0,-1).join(', ') + ' and ' + l[l.length-1];
}
function hasAnswer(a: Record<string, string | string[]>, k: string, v: string): boolean { return toArr(a[k]).includes(v); }
function phraseJoin(a: Record<string, string | string[]>, k: string, map: Record<string,string>, fb: string): string {
  const arr = toArr(a[k]); if (!arr.length) return fb;
  const p = arr.map(x => map[x] || x.toLowerCase());
  return p.length === 1 ? p[0] : p.slice(0,-1).join(', ') + ' and ' + p[p.length-1];
}
function timeOfDay(): string { const h = new Date().getHours(); return h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'; }
function fmtMoney(gbp: number, cur: Currency): string { const c = CURRENCY_CONFIG[cur]; return c.symbol + Math.round(gbp * c.rate).toLocaleString(); }
const STOPWORDS = new Set(['a','an','the','is','are','of','in','on','to','this','that','our','my','your','it','be','do']);
function looseMatch(trigger: string, lower: string): boolean { return trigger.split(/\s+/).filter(w => w && !STOPWORDS.has(w)).every(w => lower.includes(w)); }

// Expand / Teach card data
const EXPAND_ITEMS = [
  { icon: '<path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/>', title: 'Your meetings', desc: "I can understand what's discussed and decided, not just what's on the calendar." },
  { icon: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/>', title: 'Your documents', desc: 'I can read policies, reports and shared files as they change.' },
  { icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>', title: 'Your projects', desc: 'I can track progress and flag risk automatically, not just on request.' },
  { icon: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>', title: 'Your finance', desc: "I can see cashflow and spend as it happens, not at month-end." },
];
const TEACH_ITEMS = [
  { icon: '<path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/>', title: 'Policies & SOPs', desc: 'Upload directly, whenever you\'re ready.' },
  { icon: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 9h20"/>', title: 'SharePoint', desc: 'Connect your existing library.' },
  { icon: '<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>', title: 'Google Drive', desc: 'Connect your existing library.' },
  { icon: '<path d="M6 2l6 4-6 4-6-4 6-4zM18 2l6 4-6 4-6-4 6-4z"/>', title: 'Dropbox', desc: 'Connect your existing library.' },
];

// ── Component ──────────────────────────────────────────────────────────────
export default function DavidModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [screen, setScreen] = useState('intro');
  const [nameVal, setNameVal] = useState('');
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([]);
  const [continueVisible, setContinueVisible] = useState(false);
  const [connectingText, setConnectingText] = useState('Connecting you to a demonstration organisation…');
  const [momentLines, setMomentLines] = useState<string[]>([]);
  const [momentActionsShow, setMomentActionsShow] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardInput, setWizardInput] = useState('');
  const [discIdx, setDiscIdx] = useState(0);
  const [discMulti, setDiscMulti] = useState<string[]>([]);
  const [summaryEdits, setSummaryEdits] = useState({ company: '', email: '', website: '', country: '' });
  const [loadingLine, setLoadingLine] = useState('');
  const [loadingPct, setLoadingPct] = useState(0);
  const [departments, setDepartments] = useState<string[]>([]);
  const [deptInput, setDeptInput] = useState('');
  const [workforceSelection, setWorkforceSelection] = useState<string[]>([]);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [expandConn, setExpandConn] = useState<Set<number>>(new Set());
  const [teachConn, setTeachConn] = useState<Set<number>>(new Set());
  const [voiceGender, setVoiceGender] = useState('');
  const [avatarPhotoSel, setAvatarPhotoSel] = useState<string | null>(null);
  const [personalName, setPersonalName] = useState('');
  const [personalStyle, setPersonalStyle] = useState('');
  const [voiceOn, setVoiceOn] = useState(true);
  const [showAvatarSection, setShowAvatarSection] = useState(false);
  const [crData, setCrData] = useState<{ company: string; summary: string; driversHTML: string; findingsHTML: string } | null>(null);

  const sr = useRef({ name: '', industry: '', position: '', orgAnswers: {} as Record<string,string|string[]>, chatCount: 0, mockBusiness: null as (typeof MOCK_BUSINESSES)[string] | null, momentStarted: false, activeQuestions: [] as typeof DISCOVERY_QUESTIONS, usedResponses: new Set<string>() });
  const chatLogRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const msgId = useRef(0);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && isOpen) onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setScreen('intro'); setNameVal(''); setChatMsgs([]); setContinueVisible(false);
      setMomentLines([]); setMomentActionsShow(false); setWizardStep(0); setWizardInput('');
      setDiscIdx(0); setDiscMulti([]); setLoadingLine(''); setLoadingPct(0);
      setDepartments([]); setWorkforceSelection([]); setExpandConn(new Set()); setTeachConn(new Set());
      setVoiceGender(''); setAvatarPhotoSel(null); setPersonalName(''); setPersonalStyle(''); setShowAvatarSection(false); setCrData(null);
      sr.current = { name: '', industry: '', position: '', orgAnswers: {}, chatCount: 0, mockBusiness: null, momentStarted: false, activeQuestions: [], usedResponses: new Set() };
    }
  }, [isOpen]);

  useEffect(() => { if (chatLogRef.current) chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight; }, [chatMsgs]);

  const hasSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window;
  function speak(text: string) {
    if (!voiceOn || !hasSpeech) return;
    try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.rate = 1.02; speechSynthesis.speak(u); } catch {}
  }

  // ── Screens ──
  function submitName() { sr.current.name = nameVal.trim() || 'there'; setScreen('industry'); }
  function pickIndustry(ind: string) {
    sr.current.industry = ind; sr.current.mockBusiness = MOCK_BUSINESSES[ind] || MOCK_BUSINESSES['Professional Services'];
    setScreen('business-intro');
  }
  function pickPosition(pos: string) {
    const biz = sr.current.mockBusiness!; sr.current.position = pos;
    setConnectingText('Connecting you to ' + biz.name + ' as ' + posLabel(sr.current.industry, pos) + '…');
    setScreen('connecting');
    setTimeout(() => { setScreen('chat'); startChat(); }, 1600);
  }
  function startChat() {
    const pos = sr.current.position; const outputs = OUTPUTS_LIBRARY[pos] || OUTPUTS_LIBRARY['CEO'];
    const report = pick(outputs).t; const reason = pick(MEETING_REASON[pos] || ['to go through it together']); const contact = pick(MEETING_CONTACTS);
    const greeting = pick(GREETING_TEMPLATES)(sr.current.name, timeOfDay(), report, contact, reason);
    msgId.current++; setChatMsgs([{ id: msgId.current, from: 'david', text: greeting }]);
    speak(greeting); sr.current.chatCount = 0; setContinueVisible(false);
  }
  function sendChat(text: string) {
    const trimmed = text.trim(); if (!trimmed) return;
    if (chatInputRef.current) chatInputRef.current.value = '';
    const uid = ++msgId.current; const thinkId = ++msgId.current;
    setChatMsgs(prev => [...prev, { id: uid, from: 'user', text: trimmed }, { id: thinkId, from: 'thinking' }]);
    const lower = trimmed.toLowerCase();
    const main = RESPONSES.find(r => !sr.current.usedResponses.has(r.prompt) && r.trigger.some(t => looseMatch(t, lower)));
    const fup = !main ? FOLLOWUPS.find(r => r.trigger.some(t => looseMatch(t, lower))) : null;
    const match = main || fup;
    setTimeout(() => {
      if (!match) {
        const fallback = "As this is a demo, I don't have that information right now, but let me share something else with you.";
        setChatMsgs(prev => prev.filter(m => m.id !== thinkId).concat({ id: ++msgId.current, from: 'david', text: fallback }));
        speak(fallback); setTimeout(startMoment, 1800); return;
      }
      if (main) sr.current.usedResponses.add(main.prompt);
      sr.current.chatCount++;
      setChatMsgs(prev => prev.filter(m => m.id !== thinkId).concat({ id: ++msgId.current, from: 'david', text: match.reply }));
      speak(match.reply);
      if (sr.current.chatCount >= 1) setContinueVisible(true);
      if (sr.current.chatCount >= 5) setTimeout(startMoment, 1400);
    }, 1100);
  }
  function startMoment() {
    if (sr.current.momentStarted) return; sr.current.momentStarted = true;
    setScreen('moment'); setMomentLines([]); setMomentActionsShow(false);
    let idx = 0;
    function next() {
      if (idx >= MOMENT_LINES.length) { setMomentActionsShow(true); return; }
      const line = MOMENT_LINES[idx++]; setMomentLines(prev => [...prev, line]); speak(line);
      setTimeout(next, 2200);
    }
    setTimeout(next, 300);
  }
  function startWizard() { setWizardStep(0); setWizardInput(''); setScreen('wizard'); speak(WIZARD_STEPS[0].q); }
  function wizardNext() {
    const step = WIZARD_STEPS[wizardStep]; sr.current.orgAnswers[step.key] = wizardInput.trim() || step.placeholder;
    const next = wizardStep + 1;
    if (next >= WIZARD_STEPS.length) { buildSummary(); } else { setWizardStep(next); setWizardInput(''); speak(WIZARD_STEPS[next].q); }
  }
  function buildSummary() {
    const a = sr.current.orgAnswers;
    setSummaryEdits({ company: String(a.company || ''), email: String(a.email || ''), website: String(a.website || ''), country: String(a.country || '') });
    setScreen('summary');
  }
  function confirmSummary() {
    Object.assign(sr.current.orgAnswers, summaryEdits); startDiscovery();
  }
  function startDiscovery() {
    const hook = INDUSTRY_HOOKS[sr.current.industry] || DEFAULT_HOOK;
    sr.current.activeQuestions = [...DISCOVERY_QUESTIONS, { key: 'industryHook', multi: false, text: hook.question, options: hook.options.map(o => o.text) }];
    setDiscIdx(0); setDiscMulti([]); setScreen('discovery'); speak(sr.current.activeQuestions[0].text);
  }
  function discSinglePick(opt: string) { sr.current.orgAnswers[sr.current.activeQuestions[discIdx].key] = opt; advanceDisc(); }
  function discMultiConfirm() { sr.current.orgAnswers[sr.current.activeQuestions[discIdx].key] = [...discMulti]; advanceDisc(); }
  function advanceDisc() {
    const next = discIdx + 1;
    if (next >= sr.current.activeQuestions.length) { startCapacityReport(); }
    else { setDiscIdx(next); setDiscMulti([]); speak(sr.current.activeQuestions[next].text); }
  }
  function scoreDrivers(): { name: string; level: number; why: string }[] {
    const a = sr.current.orgAnswers; const ind = sr.current.industry || 'Professional Services';
    const size = String(a.size || '1–10'); const central = hasAnswer(a,'systems','One central system already');
    const fragmented = hasAnswer(a,'systems','A few disconnected tools') || hasAnswer(a,'systems','A mix of legacy and modern systems');
    const informal = hasAnswer(a,'systems','Mostly verbal or informal communication');
    const st = answerText(a,'systems','a mix of tools'); const stretched = hasAnswer(a,'staffing','Stretched thin, doing more than they should');
    const manual = hasAnswer(a,'staffing','About right, but using some manual systems & processes'); const efficient = hasAnswer(a,'staffing','Well staffed, but could be a little more efficient');
    const attracting = hasAnswer(a,'growth','Attracting new customers'); const converting = hasAnswer(a,'growth','Converting interest into sales');
    const retaining = hasAnswer(a,'growth','Retaining existing customers'); const capC = hasAnswer(a,'growth','Operational capacity to meet demand');
    const hook = INDUSTRY_HOOKS[ind] || DEFAULT_HOOK; const hookAnswer = String(a.industryHook || ''); const hookOpt = hook.options.find(o => o.text === hookAnswer);
    return [
      { name:'Knowledge Continuity', level: central?2:(fragmented?1:0), why: central?'A central system gives knowledge somewhere to live beyond individual people.':informal?'With mostly verbal coordination, very little knowledge is likely captured.':'With work through '+st+', knowledge is likely still tied to individuals.' },
      { name:'System Cohesion', level: central?2:(fragmented?1:0), why:'Based on how your team works today: '+st+'.' },
      { name:'Decision Velocity', level: hasAnswer(a,'objective','Driving team efficiency & development')?0:1, why: hasAnswer(a,'objective','Driving team efficiency & development')?'You flagged team efficiency — usually a decision-speed problem more than a headcount one.':'Not your stated top priority, but worth monitoring as you grow.' },
      { name:'Workforce Leverage', level:(hasAnswer(a,'objective','Reducing operating cost')||SMALL_SIZES.includes(size))?0:1, why: hasAnswer(a,'objective','Reducing operating cost')?'You flagged reducing operating cost — workforce leverage is usually the fastest lever.':'At '+size+' employees, coordination overhead is worth watching.' },
      { name:'Risk Visibility', level:(HIGH_STAKES.includes(ind)&&!central)?0:1, why: HIGH_STAKES.includes(ind)?'Higher-stakes industries need risk surfaced earlier, not just at review.':'Standard risk exposure for your industry at this size.' },
      { name:'Scale Readiness', level: central?(LARGE_SIZES.includes(size)?2:1):0, why: central?'A central system supports growth without a rebuild.':'Worth establishing a central system before headcount grows further.' },
      { name:'Team Capacity', level: stretched?0:(manual||efficient?1:0), why: stretched?'The team is stretched thin — the fastest gain is rarely more headcount, it\'s removing manual work.':manual?'Team size looks right, but manual processes absorb capacity.':efficient?'Staffing isn\'t the constraint — the bottleneck is more likely speed of decisions and handoffs.':'Hard to know without clearer visibility into where the team\'s time is going.' },
      { name:'Growth & Retention Exposure', level: attracting?1:(retaining||converting||capC?0:1), why: attracting?'New-customer acquisition is a focus — referral systems are usually the fastest lever.':converting?'A conversion gap usually means interest isn\'t being turned into sales efficiently.':retaining?'Retention gaps are often more expensive than they look.':capC?'Demand isn\'t the problem — fulfilment capacity is.':'Not flagged as a clear constraint yet.' },
      { name: hook.driverName, level: hookOpt?hookOpt.level:0, why: hookOpt?hookOpt.why:'Worth mapping directly — this wasn\'t confirmed in discovery.' },
    ];
  }
  function startCapacityReport() {
    const a = sr.current.orgAnswers; const ind = sr.current.industry || 'Professional Services';
    const company = String(a.company || 'Your organisation'); const country = String(a.country || 'your region'); const size = String(a.size || 'a growing team of');
    const profile = INDUSTRY_PROFILES[ind] || INDUSTRY_PROFILES['Professional Services'];
    const st = answerText(a,'systems','a mix of tools'); const staffingT = phraseJoin(a,'staffing',STAFFING_PHRASE,"sized appropriately"); const growthT = phraseJoin(a,'growth',GROWTH_PHRASE,"not yet clear");
    const objT = answerText(a,'objective','improve execution');
    const levels = ['Early','Developing','Established'];
    const check = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
    const driversHTML = scoreDrivers().map(d => '<div class="cr-driver-card"><div class="cr-driver-name">'+d.name+'</div><div class="cr-driver-dots">'+[0,1,2].map(i=>'<span class="'+(i<=d.level?'filled':'')+'"></span>').join('')+'</div><div class="cr-driver-level">'+levels[d.level]+'</div><div class="cr-driver-why">'+d.why+'</div></div>').join('');
    const findings = [
      { label:'Organisational maturity', text: hasAnswer(a,'systems','One central system already')?'Developing well — you already have a central system in place.':'Developing — core functions exist, but with work through '+st+', knowledge is spread across people.' },
      { label:'Strengths', text:'A clear departmental structure already in place across '+profile.depts.slice(0,3).join(', ')+'.' },
      { label:'Potential risk', text:'Knowledge tied to individual people is the most common risk at '+size+' employees relying on '+st+'.' },
      { label:'Priority opportunity', text:'The fastest wins are the priorities you already chose: '+objT+'.' },
      { label:'What this could look like in 90 days', text:'A working OI Workforce covering your core departments, actively reducing the manual coordination '+st+' currently requires.' },
      { label:'Suggested next priority', text:'Confirm your organisational structure, then connect the systems your team already uses.' },
    ];
    const findingsHTML = findings.map(f => '<div class="cr-finding">'+check+'<div><div class="cr-finding-label">'+f.label+'</div><div class="cr-finding-text">'+f.text+'</div></div></div>').join('');
    const summary = company+' is a '+size+'-employee '+ind.toLowerCase()+' organisation based in '+country+'. The clearest priorities are '+objT+', and most work runs through '+st+' today. The team is '+staffingT+', and the bigger constraint on the customer side is '+growthT+'.';
    setCrData({ company, summary, driversHTML, findingsHTML });
    setScreen('capacity-report');
    speak(company+' is a '+ind.toLowerCase()+' organisation. Here is your capacity report.');
  }
  function removeDept(i: number) { setDepartments(prev => prev.filter((_,idx) => idx !== i)); }
  function addDept() { if (deptInput.trim()) { setDepartments(prev => [...prev, deptInput.trim()]); setDeptInput(''); } }
  function startBuildWorkforce() {
    const names = INDUSTRY_WORKFORCE[sr.current.industry] || INDUSTRY_WORKFORCE['Professional Services'];
    setWorkforceSelection([...names]); setScreen('build-workforce');
    speak('For a '+sr.current.industry+' organisation, here is the OI Workforce I would recommend.');
  }
  function valueLineFor(name: string): string {
    const person = WORKFORCE_LIBRARY[name]; if (!person) return '';
    const title = person.title.toLowerCase(); const a = sr.current.orgAnswers; const obj = toArr(a.objective);
    if (title.includes('finance')||title.includes('cfo')) return obj.includes('Reducing operating cost')?'Directly targets the cost reduction you flagged.':'Keeps financial visibility current, not just at month-end.';
    if (title.includes('operations')||title.includes('warehouse')||title.includes('quality')) return hasAnswer(a,'staffing','Stretched thin, doing more than they should')?'Takes manual coordination off a stretched team.':'Removes fragmented-systems overhead slowing execution.';
    if (title.includes('hr')||title.includes('people')) return obj.includes('Driving team efficiency & development')?'Directly supports the team efficiency priority you flagged.':'Keeps workforce risk visible before it becomes a retention problem.';
    if (title.includes('sales')) { if (hasAnswer(a,'growth','Attracting new customers')) return 'Built for the growth constraint you flagged: attracting new customers.'; if (hasAnswer(a,'growth','Converting interest into sales')) return 'Targets the conversion gap you flagged.'; if (hasAnswer(a,'growth','Retaining existing customers')) return 'Focused on the retention risk you flagged.'; return 'Keeps pipeline and account risk visible before deals are lost.'; }
    if (title.includes('risk')||title.includes('compliance')||title.includes('legal')) return obj.includes('Protecting industry knowledge')?'Directly supports protecting industry knowledge.':'Surfaces risk earlier than a periodic review would.';
    if (title.includes('procurement')) return obj.includes('Reducing operating cost')?'Targets supplier cost, supporting the cost reduction you flagged.':'Keeps contract risk visible before renewal deadlines.';
    return 'Keeps you focused on '+(obj[0]||'your top priority').toLowerCase()+', not the coordination around it.';
  }
  function calcMonthly(name: string): number { const p = WORKFORCE_LIBRARY[name]; return p ? Math.round((p.benchmark/12)*OI_PRICING_PCT) : 0; }
  function startLoading() {
    setScreen('loading'); let idx = 0;
    function step() { if (idx>=LOADING_LINES.length) { setTimeout(startWelcome,500); return; } setLoadingLine(LOADING_LINES[idx]); setLoadingPct(Math.round(((idx+1)/LOADING_LINES.length)*100)); idx++; setTimeout(step,750); }
    step();
  }
  function startWelcome() { setScreen('welcome'); speak('Welcome, '+sr.current.name+". Everything's ready. I'm looking forward to working with you."); }
  function startPersonalise() { setVoiceGender(''); setAvatarPhotoSel(null); setPersonalName(''); setPersonalStyle(''); setShowAvatarSection(false); setScreen('personalise'); }

  const totalOI = workforceSelection.reduce((s,n) => s+calcMonthly(n), 0);
  const totalHuman = workforceSelection.reduce((s,n) => { const p=WORKFORCE_LIBRARY[n]; return s+(p?Math.round(p.benchmark/12):0); }, 0);

  const currentDiscQ = sr.current.activeQuestions[discIdx];
  const unusedResp = RESPONSES.filter(r => !sr.current.usedResponses.has(r.prompt));
  const quickPrompts = [...unusedResp.filter(r => r.roles.includes(sr.current.position)), ...unusedResp.filter(r => !r.roles.includes(sr.current.position))].slice(0,4);
  const shellOutputs = OUTPUTS_LIBRARY[sr.current.position] || OUTPUTS_LIBRARY['CEO'];

  const sc = (name: string) => screen === name;

  if (!isOpen) return null;

  return (
    <div className="david-modal open" role="dialog" aria-modal="true" aria-label="Meet your Personal OI" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="david-panel">
        <button className="david-close" onClick={onClose} aria-label="Close">&times;</button>
        <div className="david-topbar">
          <div className="david-avatar">OI<span className="live-dot"></span></div>
          <div className="david-topbar-text"><strong>Personal OI</strong><span>Your OI Consultant</span></div>
          {hasSpeech && (
            <button className={'david-voice-toggle'+(voiceOn?' on':'')} type="button" onClick={() => { setVoiceOn(v => { if (v) { try { speechSynthesis.cancel(); } catch {} } return !v; }); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
              <span>{voiceOn ? 'Voice on' : 'Voice off'}</span>
            </button>
          )}
        </div>

        <div className="david-body">
          {/* intro */}
          <div className={'david-screen david-hero-screen'+(sc('intro')?' active':'')} data-screen="intro">
            <div className="david-intro">
              <div className="david-avatar david-avatar-lg">OI</div>
              <h3>Hi. I&rsquo;m your Personal OI.</h3>
              <p>Your OI Consultant. It&rsquo;s great to meet you. What&rsquo;s your name?</p>
              <div className="david-name-row">
                <input type="text" placeholder="Your first name" maxLength={30} value={nameVal} onChange={e => setNameVal(e.target.value)} onKeyDown={e => { if (e.key==='Enter') submitName(); }} autoFocus />
                <button type="button" onClick={submitName}>Continue</button>
              </div>
            </div>
          </div>

          {/* industry */}
          <div className={'david-screen david-hero-screen'+(sc('industry')?' active':'')} data-screen="industry">
            <div className="david-industry">
              <h3>What industry are you in?</h3>
              <div className="david-industry-grid">
                {Object.keys(INDUSTRY_ICONS).map(ind => (
                  <div key={ind} className="david-industry-card" onClick={() => pickIndustry(ind)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: INDUSTRY_ICONS[ind] }} />
                    <span>{ind}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* business-intro */}
          <div className={'david-screen david-hero-screen'+(sc('business-intro')?' active':'')} data-screen="business-intro">
            <div className="david-wizard" style={{ maxWidth: 560 }}>
              <div className="david-eyebrow">Your Demo Organisation</div>
              <div className="david-wizard-q" style={{ marginBottom: 6 }}>Welcome to {sr.current.mockBusiness?.name}</div>
              <div className="cr-summary-box" style={{ marginBottom: 20 }}>{sr.current.mockBusiness ? sr.current.mockBusiness.desc+' '+sr.current.mockBusiness.employees+', based in '+sr.current.mockBusiness.location+'.' : ''}</div>
              <div className="david-wizard-q">What position would you like to assume in this demo?</div>
              <div className="david-wizard-options cols-3">
                {POSITION_OPTIONS.map(pos => <button key={pos} type="button" onClick={() => pickPosition(pos)}>{posLabel(sr.current.industry, pos)}</button>)}
              </div>
            </div>
          </div>

          {/* connecting */}
          <div className={'david-screen david-hero-screen'+(sc('connecting')?' active':'')} data-screen="connecting">
            <div className="david-connecting"><div className="david-spinner"></div><p>{connectingText}</p></div>
          </div>

          {/* chat */}
          <div className={'david-screen'+(sc('chat')?' active':'')} data-screen="chat" style={{ padding: 0 }}>
            <div className="david-product-shell">
              <div className="dps-rail" aria-hidden="true">
                <div className="dps-rail-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 12l9-9 9 9M5 10v10h14V10"/></svg><span>Home</span></div>
                <div className="dps-rail-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg><span>Command<br />Centre</span></div>
                <div className="dps-rail-item active"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg><span>My OI</span></div>
                <div className="dps-rail-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg><span>Meetings</span></div>
              </div>
              <div className="dps-main">
                <div className="dps-topbar"><strong>{sr.current.mockBusiness?.name || 'Your organisation'}</strong><span>{posLabel(sr.current.industry, sr.current.position)}</span></div>
                <div className="david-chat-log" ref={chatLogRef}>
                  {chatMsgs.map(msg => msg.from==='thinking'
                    ? <div key={msg.id} className="david-msg from-david thinking"><span></span><span></span><span></span></div>
                    : <div key={msg.id} className={'david-msg from-'+msg.from}>{(msg as {text:string}).text}</div>
                  )}
                </div>
                <div className="david-quick-prompts">
                  {quickPrompts.map(r => <button key={r.prompt} type="button" onClick={() => sendChat(r.prompt)}>{r.prompt}</button>)}
                </div>
                {continueVisible && (
                  <div style={{ textAlign: 'center', padding: '6px 0 10px' }}>
                    <button className="david-continue-btn" type="button" onClick={startMoment}>Next &rarr;</button>
                  </div>
                )}
                <div className="david-input-row">
                  <input type="text" ref={chatInputRef} placeholder="Tell me what you need next…" onKeyDown={e => { if (e.key==='Enter') { sendChat((e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value=''; } }} />
                  <button className="david-send-btn" type="button" onClick={() => { const v=chatInputRef.current?.value||''; sendChat(v); if(chatInputRef.current) chatInputRef.current.value=''; }} aria-label="Send">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                  </button>
                </div>
              </div>
              <div className="dps-outputs">
                <div className="dps-outputs-head">Outputs</div>
                {shellOutputs.map((item,i) => <div key={i} className="dps-output-card" style={{ animationDelay:(i*0.12)+'s' }}><strong>{item.t}</strong><span>{item.m}</span></div>)}
              </div>
            </div>
          </div>

          {/* moment */}
          <div className={'david-screen david-hero-screen'+(sc('moment')?' active':'')} data-screen="moment">
            <div className="david-hero-glow"></div>
            <div className="david-moment">
              <p className="david-moment-text">{momentLines.map((l,i) => <span key={i} style={{ display:'block', marginBottom:14 }}>{l}</span>)}</p>
              <div className={'david-moment-actions'+(momentActionsShow?' show':'')}>
                <button className="david-moment-no" type="button" onClick={onClose}>Not right now</button>
                <div className="david-moment-yes-wrap">
                  <button className="david-moment-yes" type="button" onClick={startWizard}>Yes, come work for us</button>
                  <p className="david-moment-caption">14 days free. No card required. Cancel anytime.</p>
                </div>
              </div>
            </div>
          </div>

          {/* wizard */}
          <div className={'david-screen david-hero-screen'+(sc('wizard')?' active':'')} data-screen="wizard">
            <div className="david-wizard">
              {WIZARD_STEPS[wizardStep] && (<>
                <div className="david-wizard-q">{WIZARD_STEPS[wizardStep].q}</div>
                <input type="text" placeholder={WIZARD_STEPS[wizardStep].placeholder} value={wizardInput} onChange={e => setWizardInput(e.target.value)} onKeyDown={e => { if(e.key==='Enter') wizardNext(); }} autoFocus />
                <button className="david-wizard-next" type="button" onClick={wizardNext}>Continue</button>
              </>)}
            </div>
          </div>

          {/* summary */}
          <div className={'david-screen david-hero-screen'+(sc('summary')?' active':'')} data-screen="summary">
            <div className="david-wizard" style={{ maxWidth: 560 }}>
              <div className="david-eyebrow">Digital Discovery&trade;</div>
              <div className="david-wizard-q">Here&rsquo;s what I found for {summaryEdits.company}:</div>
              <div>
                {(['company','email','website','country'] as const).map(k => (
                  <div key={k} className="cr-finding">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                    <div style={{ flex: 1 }}><div className="cr-finding-label">{k==='company'?'Company name':k.charAt(0).toUpperCase()+k.slice(1)}</div><input type="text" className="cr-finding-input" value={summaryEdits[k]} onChange={e => setSummaryEdits(prev => ({ ...prev, [k]: e.target.value }))} /></div>
                  </div>
                ))}
                <div className="cr-finding"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg><div><div className="cr-finding-label">Social media accounts</div><div className="cr-finding-text">LinkedIn &middot; X &middot; Facebook</div></div></div>
              </div>
              <div className="david-wizard-q" style={{ marginTop:18, fontSize:16 }}>Is this your organisation, and does the information look right?</div>
              <button className="david-wizard-next" type="button" onClick={confirmSummary}>Confirm and continue</button>
            </div>
          </div>

          {/* discovery */}
          <div className={'david-screen david-hero-screen'+(sc('discovery')?' active':'')} data-screen="discovery">
            <div className="david-connecting">
              <div className="david-spinner"></div>
              <p style={{ marginBottom:6 }}>Still looking into {String(sr.current.orgAnswers.website||'your website')}&hellip;</p>
              <p style={{ fontSize:12, fontWeight:600, textTransform:'uppercase', letterSpacing:'.04em', marginBottom:22 }}>{sr.current.activeQuestions.length ? 'Question '+(discIdx+1)+' of '+sr.current.activeQuestions.length : ''}</p>
            </div>
            {currentDiscQ && (
              <div className="david-wizard">
                <div className="david-wizard-q">{currentDiscQ.text}</div>
                <div className="david-wizard-options">
                  {currentDiscQ.options.map(opt => (
                    <button key={opt} type="button" className={currentDiscQ.multi && discMulti.includes(opt)?'selected':''} onClick={() => { if (!currentDiscQ.multi) { discSinglePick(opt); } else { setDiscMulti(prev => prev.includes(opt)?prev.filter(x=>x!==opt):[...prev,opt]); } }}>{opt}</button>
                  ))}
                </div>
                {currentDiscQ.multi && <button className="david-wizard-next" type="button" style={{ marginTop:18, opacity:discMulti.length===0?0.5:1 }} disabled={discMulti.length===0} onClick={discMultiConfirm}>Continue</button>}
              </div>
            )}
          </div>

          {/* capacity-report */}
          <div className={'david-screen david-navy-screen'+(sc('capacity-report')?' active':'')} data-screen="capacity-report" style={{ padding:'44px 28px' }}>
            {crData && (
              <div className="cr-paper">
                <div className="cr-paper-head"><div className="cr-paper-logo"><span className="cr-logo-mark">OI</span><span className="cr-logo-word">Hyphen OI Workforce</span></div><div className="cr-paper-tag">Confidential &middot; Prepared for {crData.company}</div></div>
                <div className="david-eyebrow">Organisation Capacity Report&trade;</div>
                <div className="david-wizard-q" style={{ textAlign:'left' }}>Here is your Capacity Report, it helps both you and I see how OI Workforce can help your organisation.</div>
                <div className="cr-paper-section-label">Executive Summary</div>
                <div className="cr-summary-box" style={{ marginBottom:22 }}>{crData.summary}</div>
                <div className="cr-paper-section-label">Capacity Drivers</div>
                <div className="cr-drivers-grid" style={{ marginBottom:26 }} dangerouslySetInnerHTML={{ __html: crData.driversHTML }} />
                <div className="cr-paper-section-label">Findings &amp; Recommendations</div>
                <div dangerouslySetInnerHTML={{ __html: crData.findingsHTML }} />
                <div className="cr-paper-footer"><span>Generated by OI Workforce &middot; Illustrative demo data</span></div>
              </div>
            )}
            <div className="cr-paper-actions">
              <button type="button" className="cr-secondary-btn david-wizard-next" style={{ width:'auto', padding:'13px 22px' }} onClick={() => window.print()}>&darr; Download Report</button>
              <button className="david-wizard-next" type="button" style={{ width:'auto', padding:'13px 30px' }} onClick={startBuildWorkforce}>Continue</button>
            </div>
          </div>

          {/* build-org */}
          <div className={'david-screen david-navy-screen'+(sc('build-org')?' active':'')} data-screen="build-org">
            <div className="david-wizard" style={{ maxWidth:520 }}>
              <div className="david-eyebrow">Organisation Structure</div>
              <div className="david-wizard-q">I&rsquo;ve built a starting structure. Accept, remove, or add to it.</div>
              <div className="cr-org-card">
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {departments.map((dept,i) => <span key={i} className="david-dept-chip">{dept} <button type="button" aria-label={'Remove '+dept} onClick={() => removeDept(i)}>&times;</button></span>)}
                </div>
                <div className="david-name-row" style={{ maxWidth:'100%', marginTop:14 }}>
                  <input type="text" placeholder="Add a department" value={deptInput} onChange={e => setDeptInput(e.target.value)} onKeyDown={e => { if(e.key==='Enter') addDept(); }} />
                  <button type="button" onClick={addDept}>Add</button>
                </div>
              </div>
              <button className="david-wizard-next" type="button" style={{ marginTop:16 }} onClick={startBuildWorkforce}>Build my organisation</button>
            </div>
          </div>

          {/* expand */}
          <div className={'david-screen'+(sc('expand')?' active':'')} data-screen="expand">
            <div className="david-wizard" style={{ maxWidth:540 }}>
              <div className="david-wizard-q">Now that you&rsquo;ve seen what this is worth, here&rsquo;s how I can get even more accurate. Nothing below is required.</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
                {EXPAND_ITEMS.map((item,i) => (
                  <div key={i} className="david-cap-card">
                    <div className="cap-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: item.icon }} /></div>
                    <div className="cap-text"><strong>{item.title}</strong><span>{item.desc}</span></div>
                    <button type="button" className={'cap-connect'+(expandConn.has(i)?' connected':'')} onClick={() => setExpandConn(prev => { const s=new Set(prev); s.add(i); return s; })}>{expandConn.has(i)?'Connected':'Connect'}</button>
                  </div>
                ))}
              </div>
              <p style={{ fontSize:'12.5px', color:'var(--grey)', marginBottom:16 }}>If you don&rsquo;t continue past your 14-day trial, anything you connect here is automatically and permanently deleted from our systems.</p>
              <button className="david-wizard-next" type="button" onClick={() => setScreen('teach')}>Continue</button>
            </div>
          </div>

          {/* teach */}
          <div className={'david-screen'+(sc('teach')?' active':'')} data-screen="teach">
            <div className="david-wizard" style={{ maxWidth:540 }}>
              <div className="david-wizard-q">The more I can read, the more useful I become.</div>
              <div className="cr-summary-box" style={{ marginBottom:16 }}>Policies, SOPs and manuals help me understand how your organisation actually works, not just what it says on your website.</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
                {TEACH_ITEMS.map((item,i) => (
                  <div key={i} className="david-cap-card">
                    <div className="cap-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: item.icon }} /></div>
                    <div className="cap-text"><strong>{item.title}</strong><span>{item.desc}</span></div>
                    <button type="button" className={'cap-connect'+(teachConn.has(i)?' connected':'')} onClick={() => setTeachConn(prev => { const s=new Set(prev); s.add(i); return s; })}>{teachConn.has(i)?'Connected':'Connect'}</button>
                  </div>
                ))}
              </div>
              <p style={{ fontSize:'12.5px', color:'var(--grey)', marginBottom:16 }}>If you don&rsquo;t continue past your 14-day trial, anything you connect or upload here is automatically and permanently deleted from our systems.</p>
              <button className="david-wizard-next" type="button" onClick={startLoading}>Continue</button>
            </div>
          </div>

          {/* build-workforce */}
          <div className={'david-screen david-navy-screen'+(sc('build-workforce')?' active':'')} data-screen="build-workforce">
            <div className="david-wizard" style={{ maxWidth:560 }}>
              <div className="david-eyebrow">Recommended Workforce&trade;</div>
              <div className="david-wizard-q">Our recommendations are built around what you told me matters: {answerText(sr.current.orgAnswers,'objective','your top priorities')}.</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
                {workforceSelection.map(name => {
                  const p = WORKFORCE_LIBRARY[name]; if (!p) return null;
                  const initials = name.split(' ').map(x=>x[0]).join(''); const photo = CONSULTANT_PHOTOS[name];
                  return (
                    <div key={name} className="david-workforce-card">
                      {photo ? <img className="wf-avatar" src={photo} alt={name} /> : <div className="wf-avatar" style={{ background:p.color, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'Manrope,sans-serif', fontWeight:700, fontSize:13 }}>{initials}</div>}
                      <div className="wf-text"><span className="wf-role">{p.title}</span><strong>{name}</strong><p>{p.reason}</p><div className="wf-value"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>{valueLineFor(name)}</div></div>
                    </div>
                  );
                })}
              </div>
              <button className="david-wizard-next" type="button" onClick={() => setScreen('pricing')}>Continue</button>
            </div>
          </div>

          {/* pricing */}
          <div className={'david-screen david-navy-screen'+(sc('pricing')?' active':'')} data-screen="pricing">
            <div className="david-wizard" style={{ maxWidth:580 }}>
              <div className="david-eyebrow">Pricing</div>
              <div className="david-wizard-q">Your Recommended Workforce Price&trade;</div>
              <p style={{ fontSize:13, color:'rgba(255,255,255,.7)', margin:'-8px 0 14px', textAlign:'center' }}>Adjust this to fit your budget &mdash; remove a role, or swap it for a different one.</p>
              <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:8, marginBottom:16 }}>
                <label style={{ fontSize:12, color:'rgba(255,255,255,.65)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.03em' }}>Currency</label>
                <select value={currency} onChange={e => setCurrency(e.target.value as Currency)} style={{ background:'rgba(255,255,255,.95)', border:'none', borderRadius:8, padding:'6px 10px', fontSize:13, fontFamily:'inherit', color:'#1A2233', cursor:'pointer' }}>
                  <option value="USD">USD $</option><option value="GBP">GBP £</option><option value="EUR">EUR €</option><option value="GHS">GHS ₵</option>
                </select>
              </div>
              <div style={{ marginBottom:10 }}>
                {workforceSelection.map((name,idx) => {
                  const p=WORKFORCE_LIBRARY[name]; if (!p) return null;
                  const mOI=calcMonthly(name); const mH=Math.round(p.benchmark/12); const photo=CONSULTANT_PHOTOS[name];
                  return (
                    <div key={idx} className="david-price-row">
                      <div className="david-price-row-top">
                        <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
                          {photo && <img className="david-price-avatar" src={photo} alt={name} />}
                          <div className="david-price-row-title"><strong>{p.title}</strong><span>{name}</span></div>
                        </div>
                        <button type="button" className="david-price-row-remove" aria-label="Remove" onClick={() => setWorkforceSelection(prev => prev.filter((_,i)=>i!==idx))}>&times;</button>
                      </div>
                      <select value={name} onChange={e => setWorkforceSelection(prev => { const n=[...prev]; n[idx]=e.target.value; return n; })} style={{ background:'rgba(255,255,255,.95)', border:'none', borderRadius:8, padding:'6px 10px', fontSize:12, fontFamily:'inherit', color:'#1A2233', width:'100%', cursor:'pointer', marginBottom:8 }}>
                        {Object.entries(WORKFORCE_LIBRARY).map(([n,pp]) => <option key={n} value={n}>{pp.title} — {n}</option>)}
                      </select>
                      <div className="david-price-figures">
                        <div className="fig human">Human equivalent<strong>{fmtMoney(mH,currency)}/mo</strong></div>
                        <div className="fig oi">OI price<strong>{fmtMoney(mOI,currency)}/mo</strong></div>
                        <div className="fig save">You save<strong>{fmtMoney(mH-mOI,currency)}/mo</strong></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button type="button" className="cr-secondary-btn david-wizard-next" style={{ marginBottom:16 }} onClick={() => { const u=Object.keys(WORKFORCE_LIBRARY).find(n=>!workforceSelection.includes(n)); if(u) setWorkforceSelection(prev=>[...prev,u]); }}>+ Add another OI Consultant</button>
              <div className="cr-summary-box" style={{ fontWeight:600 }}>{workforceSelection.length===0?'No OI Consultants selected yet — add one below.':'Total: '+fmtMoney(totalOI,currency)+' / month. That\'s '+fmtMoney(totalHuman-totalOI,currency)+' / month less than hiring the human equivalent.'}</div>
              <div className="david-trial-banner"><span>Don&rsquo;t worry about any of this yet</span>Try your full workforce free for 14 days &mdash; nothing to pay, no card, no obligation.</div>
              <button className="david-wizard-next" type="button" style={{ fontSize:16, padding:'16px 24px' }} onClick={startLoading}>Start free for 14 days &rarr;</button>
              <p style={{ fontSize:12, color:'rgba(255,255,255,.7)', textAlign:'center', marginTop:14, lineHeight:1.7 }}>No credit card needed for your trial.<br />This pricing is fully editable after your trial &mdash; no obligation to continue.</p>
            </div>
          </div>

          {/* loading */}
          <div className={'david-screen david-navy-screen'+(sc('loading')?' active':'')} data-screen="loading">
            <div className="david-loading">
              <div className="david-avatar david-avatar-lg">OI</div>
              <div className="david-loading-line">{loadingLine}</div>
              <div className="david-loading-track"><div className="david-loading-fill" style={{ width:loadingPct+'%' }}></div></div>
            </div>
          </div>

          {/* welcome */}
          <div className={'david-screen david-hero-screen'+(sc('welcome')?' active':'')} data-screen="welcome">
            <div className="david-hero-glow"></div>
            <div className="david-welcome">
              <div className="david-avatar david-avatar-lg">OI</div>
              <h3>Welcome, {sr.current.name}.</h3>
              <p>Everything&rsquo;s ready. I&rsquo;m looking forward to working with you.</p>
              <p style={{ fontSize:'12.5px', color:'rgba(255,255,255,.75)', maxWidth:380, margin:'2px auto 10px' }}>You&rsquo;re on secure cloud to start &mdash; the fastest way in. Need fully offline or on-premise later? Same platform, switch anytime.</p>
              <button type="button" onClick={startPersonalise}>Personalise my Personal OI</button>
            </div>
          </div>

          {/* personalise */}
          <div className={'david-screen david-navy-screen'+(sc('personalise')?' active':'')} data-screen="personalise">
            <div className="david-wizard" style={{ maxWidth:480 }}>
              <div className="david-wizard-q">Want to make me feel more like yours? Entirely optional.</div>
              <div className="david-wizard-q" style={{ fontSize:14, marginTop:4 }}>Would you like me to be a female Personal OI Assistant instead?</div>
              <div className="david-wizard-options">
                <button type="button" className={voiceGender==='female'?'selected':''} onClick={() => { setVoiceGender('female'); setShowAvatarSection(true); speak('Hi, this is how I\'ll sound from now on.'); }}>Yes, switch to a female voice</button>
                <button type="button" className={voiceGender==='male'?'selected':''} onClick={() => { setVoiceGender('male'); setShowAvatarSection(true); speak('Sure, I\'ll keep this voice.'); }}>No, keep this voice</button>
              </div>
              {showAvatarSection && (
                <div style={{ marginTop:20 }}>
                  <div className="david-wizard-q" style={{ fontSize:14 }}>Pick an avatar to go with the voice.</div>
                  <div className="david-avatar-picker">
                    <div className="david-avatar-preview">{avatarPhotoSel ? <img src={avatarPhotoSel} alt="Your Personal OI avatar" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:'50%' }} /> : 'OI'}</div>
                    <div className="david-avatar-suggestions">
                      {AVATAR_NAMES.map(name => { const photo=CONSULTANT_PHOTOS[name]; if (!photo) return null; return <button key={name} type="button" className={avatarPhotoSel===photo?'selected':''} style={{ padding:0, overflow:'hidden' }} aria-label="Choose this avatar" onClick={() => setAvatarPhotoSel(photo)}><img src={photo} alt="Avatar option" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} /></button>; })}
                    </div>
                  </div>
                </div>
              )}
              <div className="david-wizard-q" style={{ marginTop:18, fontSize:14 }}>What would you like to call me?</div>
              <input type="text" placeholder="Give me a name, if you'd like" value={personalName} onChange={e => setPersonalName(e.target.value)} />
              <div className="david-wizard-q" style={{ marginTop:16, fontSize:14 }}>How should I talk to you?</div>
              <div className="david-wizard-options">
                <button type="button" className={personalStyle==='Direct and concise'?'selected':''} onClick={() => setPersonalStyle('Direct and concise')}>Direct and concise</button>
                <button type="button" className={personalStyle==='Warm and detailed'?'selected':''} onClick={() => setPersonalStyle('Warm and detailed')}>Warm and detailed</button>
              </div>
              <button className="david-wizard-next" type="button" onClick={onClose}>Take me to My OI</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
