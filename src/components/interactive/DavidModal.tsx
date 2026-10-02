'use client';
import { useState, useRef, useEffect } from 'react';
import { IMAGES } from '@/lib/images';

type Currency = 'USD' | 'GBP' | 'EUR' | 'GHS';
type ChatMsg = { id: number; from: 'david' | 'user'; text: string } | { id: number; from: 'thinking' };

const CURRENCY_CONFIG: Record<Currency, { symbol: string; rate: number }> = {
  USD: { symbol: '$', rate: 1.27 }, GBP: { symbol: '£', rate: 1 }, EUR: { symbol: '€', rate: 1.17 }, GHS: { symbol: '₵', rate: 15.5 },
};
const MOCK_BUSINESSES: Record<string, { name: string; desc: string; employees: string; location: string; tagline: string; stats: [string, string][] }> = {
  Banking: { name: 'Meridian Trust Bank', desc: 'We provide retail and commercial banking services across three branches.', employees: '40 Management, 180 Staff', location: 'London, UK', tagline: 'A fictional bank for us to play with.', stats: [['3','Branches'],['220','Employees'],['Retail &','Commercial'],['Fully','Regulated']] },
  FMCG: { name: 'Sunburst Consumer Goods', desc: 'We manufacture and distribute fast-moving consumer goods to retail partners nationwide.', employees: '25 Management, 210 Staff', location: 'Accra, Ghana', tagline: 'A fictional consumer goods company for us to play with.', stats: [['4','Product lines'],['235','Employees'],['Nationwide','Distribution'],['Retail','Partners']] },
  Restaurants: { name: 'Copperleaf Kitchens Group', desc: 'We operate a group of casual dining restaurants across the region.', employees: '12 Management, 140 Staff', location: 'Mumbai, India', tagline: 'A fictional restaurant group for us to play with.', stats: [['12','Restaurants'],['140','Employees'],['Multiple','Locations'],['Events &','Catering']] },
  Insurance: { name: 'Ashcombe Mutual Insurance', desc: 'We provide commercial and personal lines insurance and claims handling.', employees: '18 Management, 90 Staff', location: 'London, UK', tagline: 'A fictional insurer for us to play with.', stats: [['2','Offices'],['108','Employees'],['Commercial','& Personal'],['Claims','Handling']] },
  Construction: { name: 'Kaine & Holt Construction Group', desc: 'We deliver commercial and infrastructure construction projects across the region.', employees: '22 Management, 140 Site Workers', location: 'Manchester, UK', tagline: 'A fictional construction group for us to play with.', stats: [['8','Live projects'],['162','Employees'],['Multiple','Sites'],['Commercial &','Infrastructure']] },
  Manufacturing: { name: 'Demo Manufacturing Limited', desc: 'We manufacture plastic bottles and containers for other industries.', employees: '14 Management, 87 Workers', location: 'Accra, Ghana', tagline: 'A fictional manufacturer for us to play with.', stats: [['2','Production lines'],['101','Employees'],['1','Factory'],['B2B','Supply']] },
  Healthcare: { name: 'Riverside Health Partners', desc: 'We provide outpatient and diagnostic healthcare services across three clinics.', employees: '18 Management, 210 Clinical & Support Staff', location: 'Mumbai, India', tagline: 'A fictional healthcare group for us to play with.', stats: [['3','Clinics'],['228','Employees'],['Outpatient','Care'],['Diagnostic','Services']] },
  Legal: { name: 'Hartley Dunmore Solicitors', desc: 'We provide commercial and corporate legal advisory services.', employees: '12 Partners & Management, 58 Staff', location: 'London, UK', tagline: 'A fictional law firm for us to play with.', stats: [['12','Partners'],['70','Employees'],['Corporate','Practice'],['Client','Advisory']] },
  Retail: { name: 'Kofi & Sons Retail Group', desc: 'We operate a regional chain of consumer goods retail stores.', employees: '16 Management, 95 Store Staff', location: 'Accra, Ghana', tagline: 'A fictional retail group for us to play with.', stats: [['14','Stores'],['111','Employees'],['Regional','Chain'],['1','Warehouse']] },
  Hospitality: { name: 'Bluewater Hotels Group', desc: 'We operate a group of boutique hotels and guest services.', employees: '20 Management, 160 Staff', location: 'Mumbai, India', tagline: 'A fictional hotel group for us to play with.', stats: [['6','Hotels'],['180','Employees'],['Boutique','Stays'],['Guest','Services']] },
  'Professional Services': { name: 'Meridian Advisory Partners', desc: 'We provide strategic and financial advisory services to mid-market clients.', employees: '15 Partners & Management, 70 Staff', location: 'London, UK', tagline: 'A fictional advisory firm for us to play with.', stats: [['15','Partners'],['85','Employees'],['Mid-market','Clients'],['Strategy &','Finance']] },
  Education: { name: 'Crestview Academy Trust', desc: 'We run primary and secondary education across two campuses.', employees: '25 Management & Faculty, 180 Staff', location: 'Accra, Ghana', tagline: 'A fictional school trust for us to play with.', stats: [['2','Campuses'],['205','Employees'],['Primary','Education'],['Secondary','Education']] },
  Mining: { name: 'Northstar Minerals Ltd', desc: 'We operate mineral extraction and processing sites across two regions.', employees: '30 Management, 420 Site Workers', location: 'Kumasi, Ghana', tagline: 'A fictional mining company for us to play with.', stats: [['2','Regions'],['450','Employees'],['Mineral','Extraction'],['On-site','Processing']] },
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
const PERSONAL_OI_PHOTO = IMAGES.avatarConsult1;
const DAVID_PHOTO = IMAGES.avatarConsult2;

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

const OTHER_OPTION = 'Other (please tell me)';
const DISCOVERY_QUESTIONS = [
  { key: 'objective', multi: true, text: 'Right now, what matters most to you?', options: ['Increase revenue growth','Improve team efficiency','Reduce operating costs','Better organisation of documents','Improve customer service','Strengthen compliance and risk management',OTHER_OPTION] },
  { key: 'systems', multi: true, text: 'Which best describes how your team works today?', options: ['Mostly spreadsheets & email','Mostly verbal or informal communication','A few disconnected tools','A mix of legacy and modern systems','One central system already','Not sure yet'] },
  { key: 'staffing', multi: false, text: 'Right now, would you say your team is…', options: ['Stretched thin, doing more than they should','About right, but using some manual systems & processes','Well staffed, but could be a little more efficient','Hard to describe at the moment'] },
  { key: 'growth', multi: true, text: 'Which of these is a constraint on growth today?', options: ['Attracting new customers','Converting interest into sales','Retaining existing customers','Operational capacity to meet demand','Not yet clear'] },
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
const MOMENT_LINES: { t: string; cls: string }[] = [
  { t: 'Now imagine this wasn’t a demo.', cls: 'lead' },
  { t: 'Imagine if I understood your company this well.', cls: '' },
  { t: 'Your people, meetings, documents, customers, projects, decisions and everything your company has learned.', cls: 'muted' },
  { t: 'That’s when I stop being a demonstration.', cls: 'muted' },
  { t: 'I become part of your team.', cls: 'accent' },
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
const SIZE_OPTIONS = ['1–10','11–50','51–250','251–1,000','1,000+'];
const COUNTRY_OPTIONS = ['Ghana','Nigeria','Kenya','South Africa','United Kingdom','Ireland','United States','Canada','India','United Arab Emirates','Other'];
const ROLE_OPTIONS = ['Managing Director','CEO / Founder','Director','Finance','Operations','HR / People','Sales & Marketing','Other'];

const INDUSTRY_ICONS: Record<string, string> = {
  Banking: '<path d="M3 21h18M4 21V10M20 21V10M3 10l9-6 9 6M7 10v11M12 10v11M17 10v11"/>',
  FMCG: '<path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8"/>',
  Restaurants: '<path d="M7 2v7a2 2 0 002 2h0a2 2 0 002-2V2M9 11v11M17 2v20M17 2a3 3 0 013 3v4a3 3 0 01-3 3"/>',
  Healthcare: '<circle cx="12" cy="12" r="10"/><path d="M12 7v10M7 12h10"/>',
  Manufacturing: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  Legal: '<path d="M12 2v20M5 8l-3 6a3 3 0 006 0l-3-6zM19 8l-3 6a3 3 0 006 0l-3-6zM5 8h14M8 22h8"/>',
  Insurance: '<path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/>',
  Construction: '<path d="M2 20h20M4 20v-4a8 8 0 0116 0v4M12 8V4M9 8V5M15 8V5"/>',
  Retail: '<path d="M6 2l1.5 5h9L18 2M4 7h16l-1.5 13a2 2 0 01-2 2H7.5a2 2 0 01-2-2L4 7zM9 11v4M15 11v4"/>',
  Hospitality: '<path d="M3 21h18M5 21V10l7-6 7 6v11M9 21v-6h6v6"/>',
  'Professional Services': '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/>',
  Education: '<path d="M2 9l10-5 10 5-10 5-10-5zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>',
  Mining: '<path d="M17 2l4 4-9 9-4-4 9-9zM12.5 6.5L3 16v5h5l9.5-9.5"/>',
};
// Featured tiles on "Play with" (photo cards); the rest sit behind "More industries".
const FEATURED_INDUSTRIES: { key: string; label: string; photo: string }[] = [
  { key: 'Restaurants', label: 'Restaurants', photo: '/images/industries/restaurants.jpg' },
  { key: 'Banking', label: 'Banking & Financial Services', photo: '/images/industries/banking.jpg' },
  { key: 'Legal', label: 'Legal & Professional Services', photo: '/images/industries/legal.jpg' },
  { key: 'Healthcare', label: 'Healthcare', photo: '/images/industries/healthcare.jpg' },
  { key: 'Manufacturing', label: 'Manufacturing', photo: '/images/industries/manufacturing.jpg' },
  { key: 'Construction', label: 'Construction & Property', photo: '/images/industries/construction.jpg' },
];
const INDUSTRY_PHOTOS: Record<string, string> = Object.fromEntries(FEATURED_INDUSTRIES.map(i => [i.key, i.photo]));
const OFFICE_PHOTO = '/images/industries/office.jpg';

const ICONS = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  back: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  store: '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4"/>',
  people: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0112 0M16 4.5a3 3 0 010 6M21 20a5 5 0 00-4-4.9"/>',
  pin: '<path d="M12 22s7-6.3 7-12a7 7 0 10-14 0c0 5.7 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
  calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
  myoi: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
  folder: '<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/>',
  file: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14zM20 17v4H6.5"/>',
  more: '<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  bell: '<path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0014 0M12 17v5M8 22h8"/>',
  bolt: '<path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
};
const OBJECTIVE_ICONS: Record<string, string> = {
  'Increase revenue growth': '<path d="M3 3v18h18"/><path d="M7 15v3M12 11v7M17 7v11"/>',
  'Improve team efficiency': ICONS.people,
  'Reduce operating costs': '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
  'Better organisation of documents': ICONS.file,
  'Improve customer service': '<circle cx="9" cy="7" r="3.5"/><path d="M2 21a7 7 0 0114 0M16 11l2 2 4-4"/>',
  'Strengthen compliance and risk management': '<path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  [OTHER_OPTION]: '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>',
};
const SHELL_NAV: [string, string][] = [['My OI', ICONS.myoi],['Command Centre', ICONS.grid],['Projects', ICONS.folder],['Work', ICONS.briefcase],['Documents', ICONS.file],['People', ICONS.people],['Meetings', ICONS.calendar],['Knowledge Bank', ICONS.book],['More', ICONS.more]];

const STEP_LABELS = ['Meet','Play with','We create','Choose role','My OI (Demo)','Imagine if','Work together','Tell us','Quick questions','Your report'];
const SCREEN_STEP: Record<string, number> = {
  intro: 1, industry: 2, 'business-intro': 3, role: 4, connecting: 5, chat: 5, moment: 6, offer: 7, arrange: 7,
  company: 8, discovery: 9, report: 10, 'capacity-report': 10,
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
function initialsOf(name: string): string { return name.split(/\s+/).filter(Boolean).map(x => x[0]).join('').slice(0,2).toUpperCase() || 'OI'; }

function Ico({ d, size = 18, sw = 1.8 }: { d: string; size?: number; sw?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: d }} />;
}
function ConsultantHead() {
  return (
    <div className="oi-consultant">
      <img src={PERSONAL_OI_PHOTO} alt="" />
      <div><strong>Personal OI</strong><span>Your OI Consultant</span></div>
    </div>
  );
}

type SpeechRecognitionLike = { lang: string; interimResults: boolean; start: () => void; stop: () => void; onresult: ((e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null; onend: (() => void) | null; onerror: (() => void) | null };

// ── Component ──────────────────────────────────────────────────────────────
export default function DavidModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [screen, setScreen] = useState('intro');
  const [nameVal, setNameVal] = useState('');
  const [selIndustry, setSelIndustry] = useState('');
  const [showAllIndustries, setShowAllIndustries] = useState(false);
  const [selRole, setSelRole] = useState('');
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([]);
  const [continueVisible, setContinueVisible] = useState(false);
  const [listening, setListening] = useState(false);
  const [connectingText, setConnectingText] = useState('Connecting you to a demonstration organisation…');
  const [momentCount, setMomentCount] = useState(0);
  const [invite, setInvite] = useState({ name: '', email: '', sent: false });
  const [company, setCompany] = useState({ company: '', website: '', industry: '', country: '', size: '', role: '', none: false });
  const [discIdx, setDiscIdx] = useState(0);
  const [discSel, setDiscSel] = useState<string[]>([]);
  const [otherText, setOtherText] = useState('');
  const [loadingLine, setLoadingLine] = useState('');
  const [loadingPct, setLoadingPct] = useState(0);
  const [workforceSelection, setWorkforceSelection] = useState<string[]>([]);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [voiceGender, setVoiceGender] = useState('');
  const [avatarPhotoSel, setAvatarPhotoSel] = useState<string | null>(null);
  const [personalName, setPersonalName] = useState('');
  const [personalStyle, setPersonalStyle] = useState('');
  const [voiceOn, setVoiceOn] = useState(true);
  const [showAvatarSection, setShowAvatarSection] = useState(false);
  const [crData, setCrData] = useState<{ company: string; country: string; industry: string; date: string; summary: string; driversHTML: string; findingsHTML: string } | null>(null);

  const sr = useRef({ name: '', industry: '', position: '', orgAnswers: {} as Record<string,string|string[]>, chatCount: 0, mockBusiness: null as (typeof MOCK_BUSINESSES)[string] | null, momentStarted: false, activeQuestions: [] as typeof DISCOVERY_QUESTIONS, usedResponses: new Set<string>() });
  const chatLogRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const recogRef = useRef<SpeechRecognitionLike | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const msgId = useRef(0);

  function later(fn: () => void, ms: number) { timers.current.push(setTimeout(fn, ms)); }

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && isOpen) onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setScreen('intro'); setNameVal(''); setSelIndustry(''); setShowAllIndustries(false); setSelRole('');
      setChatMsgs([]); setContinueVisible(false); setListening(false); setMomentCount(0);
      setInvite({ name: '', email: '', sent: false }); setCompany({ company: '', website: '', industry: '', country: '', size: '', role: '', none: false });
      setDiscIdx(0); setDiscSel([]); setOtherText(''); setLoadingLine(''); setLoadingPct(0); setWorkforceSelection([]);
      setVoiceGender(''); setAvatarPhotoSel(null); setPersonalName(''); setPersonalStyle(''); setShowAvatarSection(false); setCrData(null);
      sr.current = { name: '', industry: '', position: '', orgAnswers: {}, chatCount: 0, mockBusiness: null, momentStarted: false, activeQuestions: [], usedResponses: new Set() };
    }
    return () => {
      timers.current.forEach(clearTimeout); timers.current = [];
      try { recogRef.current?.stop(); } catch {}
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) { try { speechSynthesis.cancel(); } catch {} }
    };
  }, [isOpen]);

  useEffect(() => { if (chatLogRef.current) chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight; }, [chatMsgs]);
  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = 0; }, [screen, discIdx]);

  const hasSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window;
  function speak(text: string) {
    if (!voiceOn || !hasSpeech) return;
    try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.rate = 1.02; speechSynthesis.speak(u); } catch {}
  }

  // ── Steps 1–4: meet, industry, demo company, role ──
  function submitName() { sr.current.name = nameVal.trim() || 'there'; setScreen('industry'); }
  function pickIndustry(ind: string) {
    setSelIndustry(ind);
    sr.current.industry = ind; sr.current.mockBusiness = MOCK_BUSINESSES[ind] || MOCK_BUSINESSES['Professional Services'];
    later(() => setScreen('business-intro'), 320);
  }
  function pickPosition(pos: string) {
    setSelRole(pos);
    const biz = sr.current.mockBusiness!; sr.current.position = pos;
    setConnectingText('Connecting you to ' + biz.name + ' as ' + posLabel(sr.current.industry, pos) + '…');
    later(() => setScreen('connecting'), 280);
    later(() => { setScreen('chat'); startChat(); }, 1900);
  }

  // ── Step 5: My OI demo ──
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
    later(() => {
      if (!match) {
        const fallback = "As this is a demo, I don't have that information right now, but let me share something else with you.";
        setChatMsgs(prev => prev.filter(m => m.id !== thinkId).concat({ id: ++msgId.current, from: 'david', text: fallback }));
        speak(fallback); later(startMoment, 1800); return;
      }
      if (main) sr.current.usedResponses.add(main.prompt);
      sr.current.chatCount++;
      setChatMsgs(prev => prev.filter(m => m.id !== thinkId).concat({ id: ++msgId.current, from: 'david', text: match.reply }));
      speak(match.reply);
      if (sr.current.chatCount >= 1) setContinueVisible(true);
      if (sr.current.chatCount >= 5) later(startMoment, 1400);
    }, 1100);
  }
  function toggleMic() {
    const w = window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike };
    const Recog = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Recog) { chatInputRef.current?.focus(); return; }
    if (listening) { try { recogRef.current?.stop(); } catch {} return; }
    const r = new Recog(); r.lang = 'en-GB'; r.interimResults = false;
    r.onresult = e => { const t = e.results[0]?.[0]?.transcript; if (t) sendChat(t); };
    r.onend = () => setListening(false); r.onerror = () => setListening(false);
    recogRef.current = r; setListening(true);
    try { r.start(); } catch { setListening(false); }
  }

  // ── Step 6: Imagine if ──
  function startMoment() {
    if (sr.current.momentStarted) return; sr.current.momentStarted = true;
    try { recogRef.current?.stop(); } catch {}
    setScreen('moment'); setMomentCount(0);
    let idx = 0;
    function next() {
      if (idx >= MOMENT_LINES.length) return;
      speak(MOMENT_LINES[idx].t); idx++; setMomentCount(idx);
      later(next, 1900);
    }
    later(next, 300);
  }

  // ── Step 8: company details ──
  function submitCompany() {
    const a = sr.current.orgAnswers;
    a.company = company.none ? (sr.current.name !== 'there' ? sr.current.name + '’s future organisation' : 'Your future organisation') : (company.company.trim() || 'Your organisation');
    a.website = company.none ? '' : company.website.trim();
    if (company.industry) sr.current.industry = company.industry;
    a.country = company.country || 'your region';
    if (company.size) a.size = company.size;
    a.role = company.role;
    startDiscovery();
  }

  // ── Step 9: quick questions ──
  function startDiscovery() {
    const hook = INDUSTRY_HOOKS[sr.current.industry] || DEFAULT_HOOK;
    sr.current.activeQuestions = [...DISCOVERY_QUESTIONS, { key: 'industryHook', multi: false, text: hook.question, options: hook.options.map(o => o.text) }];
    setDiscIdx(0); setDiscSel([]); setOtherText(''); setScreen('discovery'); speak(sr.current.activeQuestions[0].text);
  }
  function toggleDisc(opt: string) {
    const q = sr.current.activeQuestions[discIdx];
    if (!q.multi) { setDiscSel([opt]); return; }
    setDiscSel(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]);
  }
  function confirmDisc() {
    const q = sr.current.activeQuestions[discIdx];
    const vals = discSel.map(v => v === OTHER_OPTION ? otherText.trim() : v).filter(Boolean);
    sr.current.orgAnswers[q.key] = q.multi ? vals : (vals[0] || '');
    const next = discIdx + 1;
    if (next >= sr.current.activeQuestions.length) { startCapacityReport(); }
    else { setDiscIdx(next); setDiscSel([]); setOtherText(''); speak(sr.current.activeQuestions[next].text); }
  }

  // ── Step 10: report ──
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
      { name:'Decision Velocity', level: hasAnswer(a,'objective','Improve team efficiency')?0:1, why: hasAnswer(a,'objective','Improve team efficiency')?'You flagged team efficiency — usually a decision-speed problem more than a headcount one.':'Not your stated top priority, but worth monitoring as you grow.' },
      { name:'Workforce Leverage', level:(hasAnswer(a,'objective','Reduce operating costs')||SMALL_SIZES.includes(size))?0:1, why: hasAnswer(a,'objective','Reduce operating costs')?'You flagged reducing operating costs — workforce leverage is usually the fastest lever.':'At '+size+' employees, coordination overhead is worth watching.' },
      { name:'Risk Visibility', level:((HIGH_STAKES.includes(ind)||hasAnswer(a,'objective','Strengthen compliance and risk management'))&&!central)?0:1, why: HIGH_STAKES.includes(ind)?'Higher-stakes industries need risk surfaced earlier, not just at review.':hasAnswer(a,'objective','Strengthen compliance and risk management')?'You flagged compliance and risk — that needs risk surfaced continuously, not at review.':'Standard risk exposure for your industry at this size.' },
      { name:'Scale Readiness', level: central?(LARGE_SIZES.includes(size)?2:1):0, why: central?'A central system supports growth without a rebuild.':'Worth establishing a central system before headcount grows further.' },
      { name:'Team Capacity', level: stretched?0:(manual||efficient?1:0), why: stretched?'The team is stretched thin — the fastest gain is rarely more headcount, it\'s removing manual work.':manual?'Team size looks right, but manual processes absorb capacity.':efficient?'Staffing isn\'t the constraint — the bottleneck is more likely speed of decisions and handoffs.':'Hard to know without clearer visibility into where the team\'s time is going.' },
      { name:'Growth & Retention Exposure', level: attracting?1:(retaining||converting||capC?0:1), why: attracting?'New-customer acquisition is a focus — referral systems are usually the fastest lever.':converting?'A conversion gap usually means interest isn\'t being turned into sales efficiently.':retaining?'Retention gaps are often more expensive than they look.':capC?'Demand isn\'t the problem — fulfilment capacity is.':'Not flagged as a clear constraint yet.' },
      { name: hook.driverName, level: hookOpt?hookOpt.level:0, why: hookOpt?hookOpt.why:'Worth mapping directly — this wasn\'t confirmed in discovery.' },
    ];
  }
  function startCapacityReport() {
    const a = sr.current.orgAnswers; const ind = sr.current.industry || 'Professional Services';
    const companyName = String(a.company || 'Your organisation'); const country = String(a.country || 'your region'); const size = String(a.size || 'a growing team of');
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
    const summary = companyName+' is a '+size+'-employee '+ind.toLowerCase()+' organisation based in '+country+'. The clearest priorities are '+objT+', and most work runs through '+st+' today. The team is '+staffingT+', and the bigger constraint on the customer side is '+growthT+'.';
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    setCrData({ company: companyName, country, industry: ind, date, summary, driversHTML, findingsHTML });
    setScreen('report');
    speak('Here is what I understand about '+companyName+'.');
  }

  // ── Next steps: workforce, pricing, setup ──
  function startBuildWorkforce() {
    const names = INDUSTRY_WORKFORCE[sr.current.industry] || INDUSTRY_WORKFORCE['Professional Services'];
    setWorkforceSelection([...names]); setScreen('build-workforce');
    speak('For a '+sr.current.industry+' organisation, here is the OI Workforce I would recommend.');
  }
  function valueLineFor(name: string): string {
    const person = WORKFORCE_LIBRARY[name]; if (!person) return '';
    const title = person.title.toLowerCase(); const a = sr.current.orgAnswers; const obj = toArr(a.objective);
    if (title.includes('finance')||title.includes('cfo')) return obj.includes('Reduce operating costs')?'Directly targets the cost reduction you flagged.':'Keeps financial visibility current, not just at month-end.';
    if (title.includes('operations')||title.includes('warehouse')||title.includes('quality')) return hasAnswer(a,'staffing','Stretched thin, doing more than they should')?'Takes manual coordination off a stretched team.':'Removes fragmented-systems overhead slowing execution.';
    if (title.includes('hr')||title.includes('people')) return obj.includes('Improve team efficiency')?'Directly supports the team efficiency priority you flagged.':'Keeps workforce risk visible before it becomes a retention problem.';
    if (title.includes('sales')) { if (hasAnswer(a,'growth','Attracting new customers')) return 'Built for the growth constraint you flagged: attracting new customers.'; if (hasAnswer(a,'growth','Converting interest into sales')) return 'Targets the conversion gap you flagged.'; if (hasAnswer(a,'growth','Retaining existing customers')) return 'Focused on the retention risk you flagged.'; return 'Keeps pipeline and account risk visible before deals are lost.'; }
    if (title.includes('risk')||title.includes('compliance')||title.includes('legal')) return obj.includes('Strengthen compliance and risk management')?'Directly supports the compliance and risk priority you flagged.':'Surfaces risk earlier than a periodic review would.';
    if (title.includes('procurement')) return obj.includes('Reduce operating costs')?'Targets supplier cost, supporting the cost reduction you flagged.':'Keeps contract risk visible before renewal deadlines.';
    if (title.includes('executive')||title.includes('ceo')) return obj.includes('Better organisation of documents')?'Keeps every document, decision and board pack organised in one place.':'Takes the coordination off your plate, so you can focus on '+(obj[0] ? 'what you flagged: '+obj[0].toLowerCase() : 'your top priority')+'.';
    return 'Takes the coordination off your plate, so you can focus on '+(obj[0] ? 'what you flagged: '+obj[0].toLowerCase() : 'your top priority')+'.';
  }
  function calcMonthly(name: string): number { const p = WORKFORCE_LIBRARY[name]; return p ? Math.round((p.benchmark/12)*OI_PRICING_PCT) : 0; }
  function startLoading() {
    setScreen('loading'); let idx = 0;
    function step() { if (idx>=LOADING_LINES.length) { later(startWelcome,500); return; } setLoadingLine(LOADING_LINES[idx]); setLoadingPct(Math.round(((idx+1)/LOADING_LINES.length)*100)); idx++; later(step,750); }
    step();
  }
  function startWelcome() { setScreen('welcome'); speak('Welcome, '+sr.current.name+". Everything's ready. I'm looking forward to working with you."); }
  function startPersonalise() { setVoiceGender(''); setAvatarPhotoSel(null); setPersonalName(''); setPersonalStyle(''); setShowAvatarSection(false); setScreen('personalise'); }

  const totalOI = workforceSelection.reduce((s,n) => s+calcMonthly(n), 0);
  const totalHuman = workforceSelection.reduce((s,n) => { const p=WORKFORCE_LIBRARY[n]; return s+(p?Math.round(p.benchmark/12):0); }, 0);

  const biz = sr.current.mockBusiness;
  const currentDiscQ = sr.current.activeQuestions[discIdx];
  const discNeedsOther = discSel.includes(OTHER_OPTION) && !otherText.trim();
  const unusedResp = RESPONSES.filter(r => !sr.current.usedResponses.has(r.prompt));
  const quickPrompts = [...unusedResp.filter(r => r.roles.includes(sr.current.position)), ...unusedResp.filter(r => !r.roles.includes(sr.current.position))].slice(0,4);
  const stepNum = SCREEN_STEP[screen] || 10;
  const isNextSteps = !SCREEN_STEP[screen];
  const userInitials = initialsOf(sr.current.name === 'there' ? '' : sr.current.name);

  const sc = (name: string) => screen === name;

  if (!isOpen) return null;

  return (
    <div className="david-modal open" role="dialog" aria-modal="true" aria-label="Meet your Personal OI" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="david-panel oi-panel">
        <button className="david-close" onClick={onClose} aria-label="Close">&times;</button>
        <div className="david-topbar">
          <div className="oi-top-avatar"><img src={PERSONAL_OI_PHOTO} alt="" /><span className="live-dot"></span></div>
          <div className="david-topbar-text"><strong>Personal OI</strong><span>Your OI Consultant</span></div>
          <div className="oi-stepper" aria-label={'Step '+stepNum+' of 10'}>
            <div className="oi-stepper-label"><b>{isNextSteps ? 'Next steps' : 'Step '+stepNum+' of 10'}</b>{!isNextSteps && <span> &middot; {STEP_LABELS[stepNum-1]}</span>}</div>
            <div className="oi-stepper-track">{STEP_LABELS.map((l,i) => <span key={l} className={i < stepNum ? 'done' : ''}></span>)}</div>
          </div>
          {hasSpeech && (
            <button className={'david-voice-toggle'+(voiceOn?' on':'')} type="button" onClick={() => { setVoiceOn(v => { if (v) { try { speechSynthesis.cancel(); } catch {} } return !v; }); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
              <span>{voiceOn ? 'Voice on' : 'Voice off'}</span>
            </button>
          )}
        </div>

        <div className="david-body" ref={bodyRef}>
          {/* 1 · Meet Personal OI */}
          <div className={'david-screen oi-screen oi-center'+(sc('intro')?' active':'')} data-screen="intro">
            <div className="oi-meet-card">
              <div className="oi-meet-glow"></div>
              <img className="oi-meet-photo" src={PERSONAL_OI_PHOTO} alt="Your Personal OI" />
              <h3>Hi, I&rsquo;m your Personal OI.</h3>
              <p>Great to meet you.<br />Let&rsquo;s explore what I can do together.</p>
              <p className="oi-meet-ask">What should I call you?</p>
              <form className="oi-meet-row" onSubmit={e => { e.preventDefault(); submitName(); }}>
                <input type="text" placeholder="Your first name" maxLength={30} value={nameVal} onChange={e => setNameVal(e.target.value)} autoFocus aria-label="Your first name" />
                <button type="submit" aria-label="Continue"><Ico d={ICONS.arrow} size={20} sw={2} /></button>
              </form>
            </div>
          </div>

          {/* 2 · Play with */}
          <div className={'david-screen oi-screen'+(sc('industry')?' active':'')} data-screen="industry">
            <div className="oi-head">
              <h3>Let&rsquo;s play, {sr.current.name || 'there'}.</h3>
              <p>What type of organisation would you like to play with?</p>
            </div>
            <div className="oi-industry-grid">
              {FEATURED_INDUSTRIES.map(ind => (
                <button key={ind.key} type="button" className={'oi-industry-tile'+(selIndustry===ind.key?' selected':'')} onClick={() => pickIndustry(ind.key)}>
                  <span className="oi-industry-photo" style={{ backgroundImage: 'url('+ind.photo+')' }}>{selIndustry===ind.key && <span className="oi-tick"><Ico d={ICONS.check} size={13} sw={3} /></span>}</span>
                  <span className="oi-industry-label"><Ico d={INDUSTRY_ICONS[ind.key]} size={20} /><span>{ind.label}</span></span>
                </button>
              ))}
            </div>
            {!showAllIndustries ? (
              <button type="button" className="oi-link-btn" onClick={() => setShowAllIndustries(true)}>More industries</button>
            ) : (
              <div className="oi-chip-grid">
                {Object.keys(INDUSTRY_ICONS).filter(k => !INDUSTRY_PHOTOS[k]).map(ind => (
                  <button key={ind} type="button" className={'oi-chip'+(selIndustry===ind?' selected':'')} onClick={() => pickIndustry(ind)}><Ico d={INDUSTRY_ICONS[ind]} size={16} />{ind}</button>
                ))}
              </div>
            )}
          </div>

          {/* 3 · We create */}
          <div className={'david-screen oi-screen'+(sc('business-intro')?' active':'')} data-screen="business-intro">
            <div className="oi-head">
              <h3>We create</h3>
              <p>I&rsquo;ve created a fictional organisation for us to play with.</p>
            </div>
            {biz && (
              <div className="oi-biz-card">
                <div className="oi-biz-photo" style={{ backgroundImage: 'url('+(INDUSTRY_PHOTOS[sr.current.industry] || OFFICE_PHOTO)+')' }}></div>
                <div className="oi-biz-title">
                  <span className="oi-biz-icon"><Ico d={INDUSTRY_ICONS[sr.current.industry] || ICONS.store} size={26} /></span>
                  <div><strong>{biz.name}</strong><span>{biz.tagline}</span></div>
                </div>
                <div className="oi-biz-stats">
                  {biz.stats.map(([v,l],i) => (
                    <div key={i} className="oi-biz-stat"><Ico d={[ICONS.store, ICONS.people, ICONS.pin, ICONS.calendar][i]} size={20} /><b>{v}</b><span>{l}</span></div>
                  ))}
                </div>
                <p className="oi-biz-note">It&rsquo;s completely fictional, so we can look around, ask questions and mess around.<strong>We can&rsquo;t break anything.</strong></p>
                <button type="button" className="oi-btn oi-btn-navy oi-btn-block" onClick={() => setScreen('role')}>Continue <Ico d={ICONS.arrow} size={16} sw={2} /></button>
              </div>
            )}
          </div>

          {/* 4 · Choose role */}
          <div className={'david-screen oi-screen'+(sc('role')?' active':'')} data-screen="role">
            <div className="oi-head">
              <h3>Choose role</h3>
              <p>What role would you like to take at {biz?.name || 'your demo organisation'}?</p>
            </div>
            <div className="oi-role-grid">
              {POSITION_OPTIONS.map(pos => (
                <button key={pos} type="button" className={'oi-role'+(selRole===pos?' selected':'')} onClick={() => pickPosition(pos)}>{posLabel(sr.current.industry, pos)}</button>
              ))}
            </div>
          </div>

          {/* 5 · connecting */}
          <div className={'david-screen oi-screen oi-center'+(sc('connecting')?' active':'')} data-screen="connecting">
            <div className="david-connecting"><div className="david-spinner"></div><p>{connectingText}</p></div>
          </div>

          {/* 5 · My OI (Demo) */}
          <div className={'david-screen oi-chat-screen'+(sc('chat')?' active':'')} data-screen="chat">
            <div className="oi-chat-intro"><b>Let&rsquo;s play &mdash; Welcome to My OI.</b> You&rsquo;re now in the full My OI experience, using {biz?.name || 'your demo organisation'}.</div>
            <div className="oi-shell">
              <aside className="oi-shell-side" aria-hidden="true">
                <img className="oi-shell-logo" src={IMAGES.logo} alt="" />
                {SHELL_NAV.map(([label, icon], i) => <div key={label} className={'oi-shell-nav'+(i===0?' active':'')}><Ico d={icon} size={15} />{label}</div>)}
              </aside>
              <div className="oi-shell-main">
                <div className="oi-shell-top">
                  <div className="oi-shell-search"><Ico d={ICONS.search} size={14} />Search across people, projects, meetings, emails&hellip;</div>
                  <span className="oi-shell-ico"><Ico d={ICONS.bell} size={16} /></span>
                  <span className="oi-shell-ico"><Ico d={ICONS.gear} size={16} /></span>
                  <span className="oi-shell-me">{userInitials}</span>
                </div>
                <div className="oi-david-card">
                  <img src={DAVID_PHOTO} alt="David, your Executive OI" />
                  <div className="oi-david-text">
                    <strong>David <span className="oi-online"><i></i>Online</span></strong>
                    <span>Your Executive OI &middot; {posLabel(sr.current.industry, sr.current.position)}</span>
                    <em>Think. Plan. Do. With you, always.</em>
                  </div>
                  <div className="oi-david-brand">{biz?.name}</div>
                </div>
                <div className="oi-prompts">
                  {quickPrompts.map(r => <button key={r.prompt} type="button" onClick={() => sendChat(r.prompt)}>{r.prompt}</button>)}
                </div>
                <div className="oi-chat-log" ref={chatLogRef}>
                  {chatMsgs.map(msg => msg.from==='thinking'
                    ? <div key={msg.id} className="david-msg from-david thinking"><span></span><span></span><span></span></div>
                    : <div key={msg.id} className={'david-msg from-'+msg.from}>{(msg as {text:string}).text}</div>
                  )}
                </div>
                {continueVisible && (
                  <div className="oi-chat-next"><button className="david-continue-btn" type="button" onClick={startMoment}>I&rsquo;ve seen enough &mdash; what&rsquo;s next? &rarr;</button></div>
                )}
                <div className={'oi-voice'+(listening?' listening':'')}>
                  <span className="oi-wave">{Array.from({ length: 9 }).map((_,i) => <i key={i}></i>)}</span>
                  <button type="button" className="oi-mic" onClick={toggleMic} aria-label={listening ? 'Stop listening' : 'Speak to David'}><Ico d={ICONS.mic} size={20} sw={2} /></button>
                  <span className="oi-wave">{Array.from({ length: 9 }).map((_,i) => <i key={i}></i>)}</span>
                  <div className="oi-voice-label">{listening ? 'David is listening…' : 'Tap the mic to talk to David'}</div>
                </div>
                <div className="oi-ask">
                  <Ico d={ICONS.mic} size={16} />
                  <input type="text" ref={chatInputRef} placeholder="Ask me anything…" onKeyDown={e => { if (e.key==='Enter') sendChat((e.target as HTMLInputElement).value); }} />
                  <button type="button" onClick={() => sendChat(chatInputRef.current?.value || '')} aria-label="Send"><Ico d={ICONS.arrow} size={16} sw={2.2} /></button>
                </div>
              </div>
            </div>
          </div>

          {/* 6 · Imagine if */}
          <div className={'david-screen oi-screen oi-center'+(sc('moment')?' active':'')} data-screen="moment">
            <div className="oi-imagine">
              <ConsultantHead />
              <div className="oi-imagine-body">
                <img className="oi-imagine-photo" src={PERSONAL_OI_PHOTO} alt="" />
                <div className="oi-imagine-lines">
                  {MOMENT_LINES.slice(0, momentCount).map((l,i) => <p key={i} className={'oi-line '+l.cls}>{l.t}</p>)}
                </div>
              </div>
              <div className={'oi-imagine-actions'+(momentCount >= MOMENT_LINES.length ? ' show' : '')}>
                <button type="button" className="oi-btn oi-btn-blue" onClick={() => setScreen('offer')}>Continue <Ico d={ICONS.arrow} size={16} sw={2} /></button>
              </div>
              <svg className="oi-imagine-wave" viewBox="0 0 600 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30 C 120 0, 220 60, 340 30 S 520 0, 600 26 V60 H0z" /></svg>
            </div>
          </div>

          {/* 7 · Shall we work together? */}
          <div className={'david-screen oi-screen'+(sc('offer')?' active':'')} data-screen="offer">
            <div className="oi-card oi-narrow">
              <ConsultantHead />
              <h3 className="oi-offer-q">Would you like me to come and work with you for the next 14 days &mdash; <span>FREE</span>?</h3>
              <div className="oi-offer-grid">
                <div className="oi-offer-opt">
                  <span className="oi-offer-icon"><Ico d={ICONS.bolt} size={26} /></span>
                  <strong>Yes, come and work with us.</strong>
                  <p>Start our 14-day OI Experience.</p>
                  <button type="button" className="oi-btn oi-btn-blue oi-btn-block" onClick={() => setScreen('company')}>Start 14-day Experience</button>
                </div>
                <div className="oi-offer-opt">
                  <span className="oi-offer-icon"><Ico d={ICONS.people} size={26} /></span>
                  <strong>I&rsquo;d like to involve my organisation.</strong>
                  <p>Bring a colleague or decision-maker into the conversation.</p>
                  <button type="button" className="oi-btn oi-btn-outline oi-btn-block" onClick={() => setScreen('arrange')}>Arrange a conversation</button>
                </div>
              </div>
              <button type="button" className="oi-link-btn" onClick={onClose}>Not right now</button>
            </div>
          </div>

          {/* 7b · Arrange a conversation */}
          <div className={'david-screen oi-screen'+(sc('arrange')?' active':'')} data-screen="arrange">
            <div className="oi-card oi-narrow oi-form">
              <ConsultantHead />
              {!invite.sent ? (<>
                <h3 className="oi-card-title">Who should join us?</h3>
                <p className="oi-card-sub">I&rsquo;ll invite them to a short conversation so you can explore OI Workforce together.</p>
                <form onSubmit={e => { e.preventDefault(); if (invite.email.includes('@')) setInvite(v => ({ ...v, sent: true })); }}>
                  <label className="oi-field"><span>Their name</span><input type="text" value={invite.name} onChange={e => setInvite(v => ({ ...v, name: e.target.value }))} placeholder="e.g. Ama Mensah" /></label>
                  <label className="oi-field"><span>Their work email</span><input type="email" required value={invite.email} onChange={e => setInvite(v => ({ ...v, email: e.target.value }))} placeholder="name@company.com" /></label>
                  <button type="submit" className="oi-btn oi-btn-blue oi-btn-block" disabled={!invite.email.includes('@')}>Send invitation <Ico d={ICONS.arrow} size={16} sw={2} /></button>
                </form>
                <button type="button" className="oi-link-btn" onClick={() => setScreen('offer')}>&larr; Back</button>
              </>) : (
                <div className="oi-sent">
                  <span className="oi-offer-icon"><Ico d={ICONS.mail} size={26} /></span>
                  <h3 className="oi-card-title">Invitation on its way</h3>
                  <p className="oi-card-sub">I&rsquo;ll be in touch with {invite.name.trim() || invite.email} to find a time that works. In the meantime, you can start the experience yourself.</p>
                  <button type="button" className="oi-btn oi-btn-blue oi-btn-block" onClick={() => setScreen('company')}>Start 14-day Experience</button>
                  <button type="button" className="oi-link-btn" onClick={onClose}>Close for now</button>
                </div>
              )}
            </div>
          </div>

          {/* 8 · Tell us about your company */}
          <div className={'david-screen oi-screen'+(sc('company')?' active':'')} data-screen="company">
            <div className="oi-card oi-narrow oi-form">
              <ConsultantHead />
              <h3 className="oi-card-title">Tell us about your company</h3>
              <form className="oi-form-grid" onSubmit={e => { e.preventDefault(); submitCompany(); }}>
                <label className="oi-row"><span>Company name</span><input type="text" value={company.company} disabled={company.none} onChange={e => setCompany(c => ({ ...c, company: e.target.value }))} placeholder="Your company" /></label>
                <label className="oi-row"><span>Website <em>(optional)</em></span><input type="text" value={company.website} disabled={company.none} onChange={e => setCompany(c => ({ ...c, website: e.target.value }))} placeholder="https://yourcompany.com" /></label>
                <label className="oi-row"><span>Industry</span>
                  <select value={company.industry || sr.current.industry} onChange={e => setCompany(c => ({ ...c, industry: e.target.value }))}>{Object.keys(INDUSTRY_ICONS).map(o => <option key={o} value={o}>{o}</option>)}</select>
                </label>
                <label className="oi-row"><span>Country / Region</span>
                  <select value={company.country} onChange={e => setCompany(c => ({ ...c, country: e.target.value }))}><option value="">Select</option>{COUNTRY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}</select>
                </label>
                <label className="oi-row"><span>Company size</span>
                  <select value={company.size} onChange={e => setCompany(c => ({ ...c, size: e.target.value }))}><option value="">Select</option>{SIZE_OPTIONS.map(o => <option key={o} value={o}>{o} people</option>)}</select>
                </label>
                <label className="oi-row"><span>Your role</span>
                  <select value={company.role} onChange={e => setCompany(c => ({ ...c, role: e.target.value }))}><option value="">Select</option>{ROLE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}</select>
                </label>
                <label className="oi-check"><input type="checkbox" checked={company.none} onChange={e => setCompany(c => ({ ...c, none: e.target.checked }))} /><span>I don&rsquo;t have a company yet</span></label>
                <button type="submit" className="oi-btn oi-btn-blue oi-btn-block" disabled={!company.none && !company.company.trim()}>Continue <Ico d={ICONS.arrow} size={16} sw={2} /></button>
              </form>
            </div>
          </div>

          {/* 9 · A few quick questions */}
          <div className={'david-screen oi-screen'+(sc('discovery')?' active':'')} data-screen="discovery">
            {currentDiscQ && (
              <div className="oi-card oi-narrow">
                <ConsultantHead />
                <p className="oi-q-intro">Whilst I&rsquo;m getting to know your company, let me ask you&hellip;</p>
                <div className="oi-q-count">Question {discIdx+1} of {sr.current.activeQuestions.length}</div>
                <h3 className="oi-q-text">{currentDiscQ.text}</h3>
                <p className="oi-q-hint">{currentDiscQ.multi ? 'Choose one or more.' : 'Choose one.'}</p>
                <div className="oi-opt-grid">
                  {currentDiscQ.options.map(opt => {
                    const on = discSel.includes(opt); const icon = currentDiscQ.key === 'objective' ? OBJECTIVE_ICONS[opt] : '';
                    return (
                      <button key={opt} type="button" className={'oi-opt'+(on?' selected':'')+(opt===OTHER_OPTION?' wide':'')} aria-pressed={on} onClick={() => toggleDisc(opt)}>
                        {on ? <span className="oi-opt-check"><Ico d={ICONS.check} size={13} sw={3} /></span> : icon ? <span className="oi-opt-icon"><Ico d={icon} size={20} /></span> : <span className="oi-opt-dot"></span>}
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
                {discSel.includes(OTHER_OPTION) && <input className="oi-other-input" type="text" placeholder="Tell me what matters most…" value={otherText} onChange={e => setOtherText(e.target.value)} autoFocus />}
                <button type="button" className="oi-btn oi-btn-blue oi-btn-block" disabled={discSel.length===0 || discNeedsOther} onClick={confirmDisc}>Continue <Ico d={ICONS.arrow} size={16} sw={2} /></button>
              </div>
            )}
          </div>

          {/* 10 · What I understand about your company */}
          <div className={'david-screen oi-screen'+(sc('report')?' active':'')} data-screen="report">
            {crData && (
              <div className="oi-card oi-narrow">
                <ConsultantHead />
                <div className="oi-brief">
                  <div className="oi-brief-text">
                    <img src={IMAGES.logo} alt="Hyphen OI Workforce" />
                    <h3>What I Understand About Your Company</h3>
                    <p className="oi-brief-sub">An Operational Intelligence Brief</p>
                    <ul>
                      <li>{crData.company}</li>
                      <li>{crData.country}</li>
                      <li>{crData.industry}</li>
                      <li>Generated {crData.date}</li>
                    </ul>
                  </div>
                  <div className="oi-brief-photo" style={{ backgroundImage: 'url('+OFFICE_PHOTO+')' }}><span>{crData.company}</span></div>
                </div>
                <div className="oi-brief-actions">
                  <button type="button" className="oi-btn oi-btn-blue" onClick={() => setScreen('capacity-report')}>View Report Online <Ico d={ICONS.arrow} size={16} sw={2} /></button>
                  <button type="button" className="oi-btn oi-btn-outline" onClick={() => window.print()}><Ico d={ICONS.download} size={17} sw={2} /> Download PDF</button>
                </div>
                <button type="button" className="oi-link-btn" onClick={startBuildWorkforce}>Continue to next steps &rarr;</button>
              </div>
            )}
          </div>

          {/* 10 · full report */}
          <div className={'david-screen oi-screen oi-tint'+(sc('capacity-report')?' active':'')} data-screen="capacity-report">
            {crData && (
              <div className="cr-paper">
                <div className="cr-paper-head"><div className="cr-paper-logo"><span className="cr-logo-mark">OI</span><span className="cr-logo-word">Hyphen OI Workforce</span></div><div className="cr-paper-tag">Confidential &middot; Prepared for {crData.company}</div></div>
                <div className="david-eyebrow">An Operational Intelligence Brief</div>
                <div className="david-wizard-q">What I understand about {crData.company}, and how OI Workforce can help.</div>
                <div className="cr-paper-section-label">Executive Summary</div>
                <div className="cr-summary-box" style={{ marginBottom:22 }}>{crData.summary}</div>
                <div className="cr-paper-section-label">Capacity Drivers</div>
                <div className="cr-drivers-grid" style={{ marginBottom:26 }} dangerouslySetInnerHTML={{ __html: crData.driversHTML }} />
                <div className="cr-paper-section-label">Findings &amp; Recommendations</div>
                <div dangerouslySetInnerHTML={{ __html: crData.findingsHTML }} />
                <div className="cr-paper-footer"><span>Generated by OI Workforce &middot; {crData.date} &middot; Illustrative demo data</span></div>
              </div>
            )}
            <div className="cr-paper-actions">
              <button type="button" className="oi-btn oi-btn-outline" onClick={() => setScreen('report')}><Ico d={ICONS.back} size={16} sw={2} /> Back</button>
              <button type="button" className="oi-btn oi-btn-outline" onClick={() => window.print()}><Ico d={ICONS.download} size={17} sw={2} /> Download PDF</button>
              <button type="button" className="oi-btn oi-btn-blue" onClick={startBuildWorkforce}>Continue <Ico d={ICONS.arrow} size={16} sw={2} /></button>
            </div>
          </div>

          {/* Next steps · recommended workforce */}
          <div className={'david-screen oi-screen'+(sc('build-workforce')?' active':'')} data-screen="build-workforce">
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
              <button className="oi-btn oi-btn-blue oi-btn-block" type="button" onClick={() => setScreen('pricing')}>Continue <Ico d={ICONS.arrow} size={16} sw={2} /></button>
            </div>
          </div>

          {/* Next steps · pricing */}
          <div className={'david-screen oi-screen'+(sc('pricing')?' active':'')} data-screen="pricing">
            <div className="david-wizard" style={{ maxWidth:580 }}>
              <div className="david-eyebrow">Pricing</div>
              <div className="david-wizard-q">Your Recommended Workforce Price&trade;</div>
              <p style={{ fontSize:13, color:'var(--grey)', margin:'-8px 0 14px', textAlign:'center' }}>Adjust this to fit your budget &mdash; remove a role, or swap it for a different one.</p>
              <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:8, marginBottom:16 }}>
                <label style={{ fontSize:12, color:'var(--grey)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.03em' }}>Currency</label>
                <select className="oi-select-sm" value={currency} onChange={e => setCurrency(e.target.value as Currency)}>
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
                      <select value={name} onChange={e => setWorkforceSelection(prev => { const n=[...prev]; n[idx]=e.target.value; return n; })}>
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
              <button type="button" className="oi-btn oi-btn-outline oi-btn-block" style={{ marginBottom:16 }} onClick={() => { const u=Object.keys(WORKFORCE_LIBRARY).find(n=>!workforceSelection.includes(n)); if(u) setWorkforceSelection(prev=>[...prev,u]); }}>+ Add another OI Consultant</button>
              <div className="cr-summary-box" style={{ fontWeight:600 }}>{workforceSelection.length===0?'No OI Consultants selected yet — add one above.':'Total: '+fmtMoney(totalOI,currency)+' / month. That\'s '+fmtMoney(totalHuman-totalOI,currency)+' / month less than hiring the human equivalent.'}</div>
              <div className="david-trial-banner"><span>Don&rsquo;t worry about any of this yet</span>Try your full workforce free for 14 days &mdash; nothing to pay, no card, no obligation.</div>
              <button className="oi-btn oi-btn-blue oi-btn-block" type="button" style={{ fontSize:16, padding:'16px 24px' }} onClick={startLoading}>Start free for 14 days &rarr;</button>
              <p style={{ fontSize:12, color:'var(--grey)', textAlign:'center', marginTop:14, lineHeight:1.7 }}>No credit card needed for your trial.<br />This pricing is fully editable after your trial &mdash; no obligation to continue.</p>
            </div>
          </div>

          {/* Next steps · loading */}
          <div className={'david-screen oi-screen oi-center'+(sc('loading')?' active':'')} data-screen="loading">
            <div className="david-loading">
              <img className="oi-round-photo" src={PERSONAL_OI_PHOTO} alt="" />
              <div className="david-loading-line">{loadingLine}</div>
              <div className="david-loading-track"><div className="david-loading-fill" style={{ width:loadingPct+'%' }}></div></div>
            </div>
          </div>

          {/* Next steps · welcome */}
          <div className={'david-screen oi-screen oi-center'+(sc('welcome')?' active':'')} data-screen="welcome">
            <div className="oi-meet-card">
              <div className="oi-meet-glow"></div>
              <img className="oi-meet-photo" src={PERSONAL_OI_PHOTO} alt="" />
              <h3>Welcome, {sr.current.name}.</h3>
              <p>Everything&rsquo;s ready. I&rsquo;m looking forward to working with you.</p>
              <p className="oi-meet-small">You&rsquo;re on secure cloud to start &mdash; the fastest way in. Need fully offline or on-premise later? Same platform, switch anytime.</p>
              <button type="button" className="oi-btn oi-btn-white" onClick={startPersonalise}>Personalise my Personal OI</button>
            </div>
          </div>

          {/* Next steps · personalise */}
          <div className={'david-screen oi-screen'+(sc('personalise')?' active':'')} data-screen="personalise">
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
              <button className="oi-btn oi-btn-blue oi-btn-block" type="button" onClick={onClose}>Take me to My OI</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
