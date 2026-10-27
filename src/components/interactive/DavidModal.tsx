'use client';
import { useState, useRef, useEffect, type CSSProperties } from 'react';
import { IMAGES } from '@/lib/images';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

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

const OTHER_OPTION = 'Other (please specify)';
type DiscoveryQuestion = { key: string; multi: boolean; text: string; options: string[]; freeText?: false } | { key: string; freeText: true; text: string; placeholder: string };
const DISCOVERY_QUESTIONS: DiscoveryQuestion[] = [
  { key: 'goals', multi: true, text: 'What are your main goals right now?', options: ['Grow revenue','Improve operational efficiency','Improve customer service','Reduce costs','Improve compliance and risk management',OTHER_OPTION] },
  { key: 'challenges', multi: true, text: 'What are your biggest challenges?', options: ['Finding information','Too many tools and systems','Manual and repetitive work','Slow decision-making','Team capacity and workload','Keeping knowledge when people leave',OTHER_OPTION] },
  { key: 'whoUses', multi: false, text: 'Who will be using OI?', options: ['Just me','A small team (1–10 people)','Multiple teams (11–50 people)','Most of the organisation (51–250 people)','Entire organisation (250+ people)','Not sure yet'] },
  { key: 'tools', multi: true, text: 'What systems and tools do you currently use?', options: ['Microsoft 365','Google Workspace','Slack','Teams','Salesforce','HubSpot','Xero','SAP','Notion','Jira',OTHER_OPTION,"We don't use many tools yet"] },
  { key: 'infoManagement', multi: true, text: 'How do you currently manage information?', options: ['Emails','Shared drives (e.g. OneDrive, Google Drive)','Documents and folders','CRM or business systems','Team chat (e.g. Teams, Slack, WhatsApp)','Individual files and spreadsheets',"Not sure / it's spread across multiple places"] },
  { key: 'workTypes', multi: true, text: 'What type of work would you like OI to help with?', options: ['Research and analysis','Meetings and follow-up','Document creation and management','Project and task management','Customer and stakeholder support','Data and reporting','Process improvement and automation','Compliance and risk',OTHER_OPTION] },
  { key: 'successLooks', multi: true, text: 'What does success look like for you?', options: ['Save time and reduce manual work','Improve decision-making','Increase productivity and capacity','Better customer experience','Reduce costs','Stronger compliance and governance',OTHER_OPTION] },
  { key: 'timeline', multi: false, text: 'When would you like to get started?', options: ['As soon as possible','Within the next 1–3 months','Within 3–6 months','Later this year','Just exploring for now'] },
  { key: 'notes', freeText: true, text: 'Anything else I should know?', placeholder: "Is there anything you'd like to share about your organisation, plans or the challenges you're facing?" },
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
  { prompt: "Prepare tomorrow's board pack", trigger: ['board pack','board meeting'], roles: ['CEO','Finance Manager'], reply: "On it — I've pulled Q3 numbers, project status and this week's risk flags. Want the board pack as a Word doc, a slide deck, or both?" },
  { prompt: "Show me this month's biggest operational risks", trigger: ['operational risk','biggest risk','risks'], roles: ['Operations Manager','CEO'], reply: "Three stand out: a supplier renewal 9 days overdue, warehouse capacity at 94%, and a repeated shipping delay. Want me to draft next steps?" },
  { prompt: "Summarise last week's leadership meeting", trigger: ['summarise','summarize','leadership meeting','last week'], roles: ['CEO'], reply: "Q2 budget approved, new supplier selected and the Kumasi hiring freeze lifted. Two actions are still open with Michael and Sarah — both due Friday." },
  { prompt: "Which customers are at risk?", trigger: ['customers at risk','at-risk customer','churn'], roles: ['Sales Manager','CEO'], reply: "Two accounts are ordering less and have an unanswered support ticket. Want a save-plan brief for both, or shall I route them to their owners?" },
  { prompt: "Review our cashflow", trigger: ['cashflow','cash flow'], roles: ['Finance Manager'], reply: "Cashflow is healthy for six weeks, but week eight is tight if the Fortwell invoice slips again. Want me to send them a reminder?" },
  { prompt: "Show outstanding actions", trigger: ['outstanding action','overdue','outstanding task'], roles: ['Operations Manager','HR Manager'], reply: "Six open actions, two overdue: a vendor contract review with Sarah Johnson and a policy update with Marcus Webb. The rest are on track." },
  { prompt: "Who approved this project?", trigger: ['who approved','approval','approved this'], roles: ['CEO','Operations Manager'], reply: "Cliff Williams approved it on the 14th, after Sarah Johnson's risk review came back green. The full trail is in the organisation ledger." },
  { prompt: "How's our supplier performance this quarter?", trigger: ['supplier performance','supplier review','vendor performance'], roles: ['Procurement Manager'], reply: "Two suppliers are behind on deliveries, and one contract renews in three weeks. Want me to draft a renegotiation brief before then?" },
];
const FOLLOWUPS = [
  { trigger: ['both'], reply: "Perfect. I'll prepare both. You'll find the Word doc and the slide deck in your Outputs panel shortly, ready to share." },
  { trigger: ['yes please','sure','please do'], reply: "On it. I'll get that ready for you now." },
  { trigger: ['word doc','word document'], reply: "Done. The Word version will be in your Outputs panel in a moment." },
  { trigger: ['slide deck','presentation'], reply: "Done. The slide deck will be in your Outputs panel in a moment." },
  { trigger: ['thank you','thanks'], reply: "Anytime. Let me know if there's anything else you'd like me to pull together." },
];
const MOMENT_LINES: { t: string; cls: string }[] = [
  { t: 'In the last few minutes, we’ve looked at performance, prepared for a meeting and joined information across several parts of Copperleaf.', cls: '' },
  { t: 'Now imagine if everything we’d just worked with belonged to your organisation.', cls: '' },
  { t: 'That’s what OI can do for you.', cls: 'accent' },
];
const MOMENT_FEATURES: { icon: string; title: string; text: string }[] = [
  { icon: 'book', title: 'All your knowledge', text: 'Connected and available in seconds' },
  { icon: 'bolt', title: 'Your team prepared', text: 'With the right information at the right time' },
  { icon: 'briefcase', title: 'Real work completed', text: 'Not just answers, but outcomes' },
];
const HOW_IT_WORKS: { icon: string; title: string; text: string }[] = [
  { icon: 'search', title: 'I learn about your organisation', text: 'You give me a few basic details, I research what I can and ask you a few quick questions.' },
  { icon: 'file', title: 'I show you what I understand', text: 'You’ll get a personalised Operational Intelligence Brief based on my research and your answers.' },
  { icon: 'calendar', title: 'You decide whether we work together', text: 'If you like what you see, you can invite me to work with you for the next 7 days — FREE.' },
  { icon: 'shield', title: 'No obligation', text: 'You’re in control. You can stop at any time.' },
];
const BRIEF_CARDS: { icon: string; title: string; text: string }[] = [
  { icon: 'store', title: 'Your Organisation', text: 'What you do, your market, and recent developments.' },
  { icon: 'mic', title: 'What You Told Me', text: 'Your priorities, challenges and goals.' },
  { icon: 'search', title: 'What I Found', text: 'Public information from your website, news and online sources.' },
  { icon: 'people', title: 'How You Appear to Work', text: 'Team structure, systems and ways of working.' },
  { icon: 'lightbulb', title: 'What I Notice', text: 'Key observations and opportunities.' },
  { icon: 'pin', title: 'Potential Opportunities', text: 'Areas where OI could help.' },
  { icon: 'gear', title: 'Your Current Technology', text: 'Systems and tools identified.' },
  { icon: 'bolt', title: 'Where OI Could Work With You', text: 'Initial use cases and ideas.' },
];
const BRIEF_COLORS = ['#1D5FD4', '#D6558C', '#7C5CFC', '#2C8C8A', '#7C5CFC', '#27AE60', '#F2994A', '#1D5FD4'];
const SEVEN_DAY_ITEMS: { icon: string; title: string; text: string }[] = [
  { icon: 'book', title: 'Learn', text: 'Understand your organisation and help you achieve real results.' },
  { icon: 'link', title: 'Connect', text: 'Bring together your people, your information and your tools' },
  { icon: 'briefcase', title: 'Work', text: 'Complete tasks, support meetings and provide insights' },
  { icon: 'chart', title: 'Measure', text: 'Track activity and identify what’s working' },
  { icon: 'bolt', title: 'Prove', text: 'Show you the real value and what I’m capable of' },
];
const SEVEN_DAY_TODO = [
  'Use OI as you would with a new team member',
  'Give me access to the information and tools you want me to work with',
  'Talk, chat or assign tasks whenever you need support',
  'Review my updates and give feedback',
];
const EXPERIENCE_STATS: { icon: string; value: number; label: string; text: string }[] = [
  { icon: 'check', value: 28, label: 'Tasks completed', text: 'From meetings, emails and internal requests' },
  { icon: 'file', value: 42, label: 'Documents analysed', text: 'Reports, policies, emails and project files' },
  { icon: 'question', value: 67, label: 'Questions answered', text: 'From you and your team' },
  { icon: 'calendar', value: 6, label: 'Meetings supported', text: 'Summaries, actions and follow-ups' },
  { icon: 'lightbulb', value: 12, label: 'Insights identified', text: 'Opportunities and recommendations' },
  { icon: 'gear', value: 4, label: 'Workflows improved', text: 'Automations and better processes' },
];
const OTHER_OUTCOMES = [
  { title: 'Time released', text: '~100 hours/month' },
  { title: 'Faster decisions', text: 'Improved data access' },
  { title: 'Better knowledge', text: 'Connected active teams' },
  { title: 'Better customer experience', text: 'Quicker, more relevant responses' },
];
const WELCOME_CHECKLIST = ['Confirm your package','Set up your OI Consultants','Connect your tools and integrations','Align your workforce to your goals'];
const WELCOME_TIMELINE = [
  { when: 'Today', text: 'Confirm your order and complete onboarding' },
  { when: 'Within 24 hours', text: 'Set up your OI Consultants and integrations' },
  { when: 'Within 3 days', text: 'Your OI Workforce is fully working with you' },
  { when: 'Ongoing', text: 'Review progress and add more OI Consultants' },
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
function staffingPhrase(a: Record<string, string | string[]>): string {
  if (hasAnswer(a,'challenges','Team capacity and workload')) return 'stretched thin right now';
  if (hasAnswer(a,'challenges','Manual and repetitive work')) return 'about the right size, though a lot of the work still runs through manual systems';
  if (hasAnswer(a,'whoUses','Just me')) return 'a team of one, for now';
  return "sized appropriately, though that's not fully clear yet";
}
function growthPhrase(a: Record<string, string | string[]>): string {
  if (hasAnswer(a,'goals','Grow revenue')) return 'growing revenue';
  if (hasAnswer(a,'goals','Improve customer service')) return 'improving customer service';
  if (hasAnswer(a,'goals','Reduce costs')) return 'reducing costs';
  if (hasAnswer(a,'challenges','Team capacity and workload')) return 'building the operational capacity to meet demand';
  return "not yet clear — worth a quick check with whoever owns customer relationships";
}
const HIGH_STAKES = ['Legal','Healthcare','Mining','Construction'];
const SMALL_SIZES = ['1–10','11–50'];
const LARGE_SIZES = ['251–1,000','1,000+'];
const COUNTRY_OPTIONS = ['Ghana','Nigeria','Kenya','South Africa','United Kingdom','Ireland','United States','Canada','India','United Arab Emirates','Other'];
const CITY_BY_COUNTRY: Record<string, string> = {
  Ghana: 'Accra', Nigeria: 'Lagos', Kenya: 'Nairobi', 'South Africa': 'Johannesburg', 'United Kingdom': 'London',
  Ireland: 'Dublin', 'United States': 'New York', Canada: 'Toronto', India: 'Mumbai', 'United Arab Emirates': 'Dubai',
};

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
  shield: '<path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/>',
  lightbulb: '<path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0012 2z"/>',
  question: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 115.8 1c0 2-3 2-3 4"/><path d="M12 17h.01"/>',
  infinity: '<path d="M7 9a3 3 0 100 6 5 5 0 004-2 5 5 0 004 2 3 3 0 100-6 5 5 0 00-4 2 5 5 0 00-4-2z"/>',
  link: '<path d="M10 14a4 4 0 005.66 0l3-3a4 4 0 00-5.66-5.66l-1 1"/><path d="M14 10a4 4 0 00-5.66 0l-3 3a4 4 0 005.66 5.66l1-1"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15v3M12 11v7M17 7v11"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5"/>',
};
const GOALS_ICONS: Record<string, string> = {
  'Grow revenue': ICONS.chart,
  'Improve operational efficiency': ICONS.bolt,
  'Improve customer service': '<circle cx="9" cy="7" r="3.5"/><path d="M2 21a7 7 0 0114 0M16 11l2 2 4-4"/>',
  'Reduce costs': '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
  'Improve compliance and risk management': ICONS.shield,
  [OTHER_OPTION]: '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>',
};
const ICON_LIST = '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>';
const ICON_CHAT = '<path d="M8 10h8M8 14h5"/><path d="M21 12c0 4.4-4 8-9 8-1.1 0-2.2-.2-3.2-.5L3 21l1.5-4.3C3.6 15.4 3 13.8 3 12c0-4.4 4-8 9-8s9 3.6 9 8z"/>';
const ICON_HEART_PEOPLE = '<circle cx="9" cy="7" r="3.5"/><path d="M2 21a7 7 0 0114 0M16 11l2 2 4-4"/>';
const ICON_COINS = '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>';
const ICON_OTHER = '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>';
const QUESTION_ICONS: Record<string, string> = {
  'Finding information': ICONS.search, 'Too many tools and systems': ICONS.grid, 'Manual and repetitive work': ICONS.gear,
  'Slow decision-making': ICONS.target, 'Team capacity and workload': ICONS.people, 'Keeping knowledge when people leave': ICONS.book,
  Emails: ICONS.mail, 'Shared drives (e.g. OneDrive, Google Drive)': ICONS.folder, 'Documents and folders': ICONS.file,
  'CRM or business systems': ICONS.briefcase, 'Team chat (e.g. Teams, Slack, WhatsApp)': ICON_CHAT, 'Individual files and spreadsheets': ICONS.grid,
  "Not sure / it's spread across multiple places": ICONS.question,
  'Research and analysis': ICONS.search, 'Meetings and follow-up': ICONS.calendar, 'Document creation and management': ICONS.file,
  'Project and task management': ICON_LIST, 'Customer and stakeholder support': ICONS.people, 'Data and reporting': ICONS.chart,
  'Process improvement and automation': ICONS.gear, 'Compliance and risk': ICONS.shield,
  'Save time and reduce manual work': ICONS.bolt, 'Improve decision-making': ICONS.lightbulb, 'Increase productivity and capacity': ICONS.chart,
  'Better customer experience': ICON_HEART_PEOPLE, 'Reduce costs': ICON_COINS, 'Stronger compliance and governance': ICONS.shield,
  'As soon as possible': ICONS.bolt, 'Within the next 1–3 months': ICONS.calendar, 'Within 3–6 months': ICONS.calendar,
  'Later this year': ICONS.calendar, 'Just exploring for now': ICONS.search,
  [OTHER_OPTION]: ICON_OTHER,
};
const WHOUSES_PHOTOS: Record<string, string> = {
  'Just me': IMAGES.avatarConsult2,
  'A small team (1–10 people)': IMAGES.avatarConsult4,
  'Multiple teams (11–50 people)': IMAGES.avatarConsult7,
  'Most of the organisation (51–250 people)': IMAGES.avatarConsult9,
  'Entire organisation (250+ people)': IMAGES.avatarConsult11,
};
// Real brand marks for the tools question (Simple Icons, CC0; Microsoft and Teams drawn by hand). [fill, path] pairs on a 24×24 grid.
const BRAND_PATHS: Record<string, [string, string][]> = {
  "Slack": [['#E01E5A', 'M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z'], ['#36C5F0', 'M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z'], ['#2EB67D', 'M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z'], ['#ECB22E', 'M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z']],
  "Salesforce": [['#00A1E0', 'M10.006 5.415a4.195 4.195 0 013.045-1.306c1.56 0 2.954.9 3.69 2.205.63-.3 1.35-.45 2.1-.45 2.85 0 5.159 2.34 5.159 5.22s-2.31 5.22-5.176 5.22c-.345 0-.69-.044-1.02-.104a3.75 3.75 0 01-3.3 1.95c-.6 0-1.155-.15-1.65-.375A4.314 4.314 0 018.88 20.4a4.302 4.302 0 01-4.05-2.82c-.27.062-.54.076-.825.076-2.204 0-4.005-1.8-4.005-4.05 0-1.5.811-2.805 2.01-3.51-.255-.57-.39-1.2-.39-1.846 0-2.58 2.1-4.65 4.65-4.65 1.53 0 2.85.705 3.72 1.8']],
  "HubSpot": [['#FF7A59', 'M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067a2.196 2.196 0 001.252 1.973l.013.006v2.852a6.22 6.22 0 00-2.969 1.31l.012-.01-7.828-6.095A2.497 2.497 0 104.3 4.656l-.012.006 7.697 5.991a6.176 6.176 0 00-1.038 3.446c0 1.343.425 2.588 1.147 3.607l-.013-.02-2.342 2.343a1.968 1.968 0 00-.58-.095h-.002a2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l.005.014 2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207v.002a3.206 3.206 0 01-3.207 3.207z']],
  "Xero": [['#13B5EA', 'M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.585 14.655c-1.485 0-2.69-1.206-2.69-2.689 0-1.485 1.207-2.691 2.69-2.691 1.485 0 2.69 1.207 2.69 2.691s-1.207 2.689-2.69 2.689zM7.53 14.644c-.099 0-.192-.041-.267-.116l-2.043-2.04-2.052 2.047c-.069.068-.16.108-.258.108-.202 0-.368-.166-.368-.368 0-.099.04-.191.111-.263l2.04-2.05-2.038-2.047c-.075-.069-.113-.162-.113-.261 0-.203.166-.366.368-.366.098 0 .188.037.258.105l2.055 2.048 2.048-2.045c.069-.071.162-.108.26-.108.211 0 .375.165.375.366 0 .098-.029.188-.104.258l-2.056 2.055 2.055 2.051c.068.069.104.16.104.258 0 .202-.165.368-.365.368h-.01zm8.017-4.591c-.796.101-.882.476-.882 1.404v2.787c0 .202-.165.366-.366.366-.203 0-.367-.165-.368-.366v-4.53c0-.204.16-.366.362-.366.166 0 .316.125.346.289.27-.209.6-.317.93-.317h.105c.195 0 .359.165.359.368 0 .201-.164.352-.375.359 0 0-.09 0-.164.008l.053-.002zm-3.091 2.205H8.625c0 .019.003.037.006.057.02.105.045.211.083.31.194.531.765 1.275 1.829 1.29.33-.003.631-.086.9-.229.21-.12.391-.271.525-.428.045-.058.09-.112.12-.168.18-.229.405-.186.54-.083.164.135.18.391.045.57l-.016.016c-.21.27-.435.495-.689.66-.255.164-.525.284-.811.345-.33.09-.645.104-.975.06-1.095-.135-2.01-.93-2.28-2.01-.06-.21-.09-.42-.09-.645 0-.855.421-1.695 1.125-2.205.885-.615 2.085-.66 3-.075.63.405 1.035 1.021 1.185 1.771.075.419-.21.794-.734.81l.068-.046zm6.129-2.223c-1.064 0-1.931.865-1.931 1.931 0 1.064.866 1.931 1.931 1.931s1.931-.867 1.931-1.931c0-1.065-.866-1.933-1.931-1.933v.002zm0 2.595c-.367 0-.666-.297-.666-.666 0-.367.3-.665.666-.665.367 0 .667.299.667.665 0 .369-.3.667-.667.666zm-8.04-2.603c-.91 0-1.672.623-1.886 1.466v.03h3.776c-.203-.855-.973-1.494-1.891-1.494v-.002z']],
  "SAP": [['#0FAAFF', 'M0 6.064v11.872h12.13L24 6.064zm3.264 2.208h.005c.863.001 1.915.245 2.676.633l-.82 1.43c-.835-.404-1.255-.442-1.73-.467-.708-.038-1.064.215-1.069.488-.007.332.669.633 1.305.838.964.306 2.19.715 2.377 1.9L7.77 8.437h2.046l2.064 5.576-.007-5.575h2.37c2.257 0 3.318.764 3.318 2.519 0 1.575-1.09 2.514-2.936 2.514h-.763l-.01 2.094-3.588-.003-.25-.908c-.37.122-.787.189-1.23.189-.456 0-.885-.071-1.263-.2l-.358.919-2 .006.09-.462c-.029.025-.057.05-.087.074-.535.43-1.208.629-2.037.644l-.213.002a5.075 5.075 0 0 1-2.581-.675l.73-1.448c.79.467 1.286.572 1.956.558.347-.007.598-.07.761-.239a.557.557 0 0 0 .156-.369c.007-.376-.53-.553-1.185-.756-.531-.164-1.135-.389-1.606-.735-.559-.41-.825-.924-.812-1.65a1.99 1.99 0 0 1 .566-1.377c.519-.537 1.357-.863 2.363-.863zm10.597 1.67v1.904h.521c.694 0 1.247-.23 1.248-.964 0-.709-.554-.94-1.248-.94zm-5.087.767l-.748 2.362c.223.085.481.133.757.133.268 0 .52-.047.742-.126l-.736-2.37z']],
  "Notion": [['#000000', 'M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z']],
  "Jira": [['#0052CC', 'M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.001 1.001 0 0 0 23.013 0Z']],
};
const TOOL_ICONS: Record<string, string> = {
  [OTHER_OPTION]: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
  "We don't use many tools yet": '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
};
function BrandLogo({ name }: { name: string }) {
  if (name === 'Microsoft 365') return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" fill="#F35325" /><rect x="12" y="1" width="9" height="9" fill="#81BC06" />
      <rect x="1" y="12" width="9" height="9" fill="#05A6F0" /><rect x="12" y="12" width="9" height="9" fill="#FFBA08" />
    </svg>
  );
  if (name === 'Google Workspace') return (
    <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
  if (name === 'Teams') return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="19.2" cy="6.6" r="2.4" fill="#7B83EB" /><rect x="15.6" y="10" width="7.4" height="8.6" rx="2.6" fill="#7B83EB" />
      <circle cx="13" cy="5.4" r="3" fill="#5059C9" /><rect x="8.6" y="9.4" width="9.6" height="11" rx="3" fill="#5059C9" />
      <rect x="1" y="6.5" width="12" height="12" rx="2" fill="#4B53BC" /><path d="M4 9.5h6v1.8H7.9V16H6.1v-4.7H4z" fill="#fff" />
    </svg>
  );
  const parts = BRAND_PATHS[name]; if (!parts) return null;
  return <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">{parts.map(([fill, d], i) => <path key={i} fill={fill} d={d} />)}</svg>;
}
const SHELL_NAV: [string, string][] = [['My OI', ICONS.myoi],['Command Centre', ICONS.grid],['Projects', ICONS.folder],['Work', ICONS.briefcase],['Documents', ICONS.file],['People', ICONS.people],['Meetings', ICONS.calendar],['Knowledge Bank', ICONS.book],['More', ICONS.more]];

const STEP_LABELS = ['Meet','Play with','We create','Choose role','My OI (Demo)','Imagine if','Work together','Tell us','Quick questions','Your report','7-Day Experience','What happened','Value report','Workforce','Investment','Welcome'];
const TRANSIENT_SCREENS = new Set(['connecting', 'loading']);
const SCREEN_STEP: Record<string, number> = {
  intro: 1, industry: 2, 'business-intro': 3, role: 4, connecting: 5, chat: 5, moment: 6, offer: 7, arrange: 7,
  company: 8, discovery: 9, report: 10, 'capacity-report': 10,
  '7day-start': 11, 'what-happened': 12, 'value-report': 13, 'build-workforce': 14, pricing: 15, welcome: 16,
};

// Helpers
function toArr(v: string | string[] | undefined): string[] { if (!v) return []; return Array.isArray(v) ? v : [v]; }
function answerText(a: Record<string, string | string[]>, k: string, fb: string, keepCase = false): string {
  const arr = toArr(a[k]); if (!arr.length) return fb;
  const l = keepCase ? arr : arr.map(x => x.toLowerCase());
  return l.length === 1 ? l[0] : l.slice(0,-1).join(', ') + ' and ' + l[l.length-1];
}
function hasAnswer(a: Record<string, string | string[]>, k: string, v: string): boolean { return toArr(a[k]).includes(v); }
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
function CheckDot({ i }: { i: number }) {
  return <span className="oi-check-dot" style={{ background:BRIEF_COLORS[i % BRIEF_COLORS.length] }}><Ico d={ICONS.check} size={10} sw={3} /></span>;
}

type SpeechRecognitionLike = { lang: string; interimResults: boolean; start: () => void; stop: () => void; onresult: ((e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null; onend: (() => void) | null; onerror: ((e: { error?: string }) => void) | null };

// ── Component ──────────────────────────────────────────────────────────────
export default function DavidModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [screen, setScreen] = useState('intro');
  const [slideDir, setSlideDir] = useState<'fwd' | 'back'>('fwd');
  const [signup, setSignup] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [selIndustry, setSelIndustry] = useState('');
  const [showAllIndustries, setShowAllIndustries] = useState(false);
  const [selRole, setSelRole] = useState('');
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([]);
  const [continueVisible, setContinueVisible] = useState(false);
  const [listening, setListening] = useState(false);
  const [micMessage, setMicMessage] = useState('');
  const [connectingText, setConnectingText] = useState('Connecting you to a demonstration organisation…');
  const [momentCount, setMomentCount] = useState(0);
  const [invite, setInvite] = useState({ name: '', email: '', sent: false });
  const [company, setCompany] = useState({ company: '', website: '', email: '', industry: '', country: '', size: '', role: '', none: false });
  const [orgStage, setOrgStage] = useState<'form' | 'searching' | 'found'>('form');
  const [orgPct, setOrgPct] = useState(0);
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
  const [voiceOn, setVoiceOn] = useState(false);
  const voiceOnRef = useRef(false);
  useEffect(() => { voiceOnRef.current = voiceOn; }, [voiceOn]);
  const [showAvatarSection, setShowAvatarSection] = useState(false);
  const [crData, setCrData] = useState<{ company: string; country: string; industry: string; date: string; summary: string; driversHTML: string; findingsHTML: string } | null>(null);

  const sr = useRef({ name: '', lastName: '', email: '', phone: '', password: '', industry: '', position: '', orgAnswers: {} as Record<string,string|string[]>, chatCount: 0, mockBusiness: null as (typeof MOCK_BUSINESSES)[string] | null, momentStarted: false, activeQuestions: [] as typeof DISCOVERY_QUESTIONS, usedResponses: new Set<string>() });
  const chatLogRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const recogRef = useRef<SpeechRecognitionLike | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const msgId = useRef(0);
  const historyRef = useRef<string[]>([]);

  // Steps the visitor actually finished by moving forward from them; jumping via the header numbers doesn't count.
  const [completed, setCompleted] = useState<Set<number>>(() => new Set());
  const [stepWin, setStepWin] = useState(0);
  const screenRef = useRef('intro');
  const jumpingRef = useRef(false);

  function later(fn: () => void, ms: number) { timers.current.push(setTimeout(fn, ms)); }
  function nav(s: string) {
    const from = SCREEN_STEP[screenRef.current], to = SCREEN_STEP[s];
    if (!jumpingRef.current && from && (!to || to > from)) setCompleted(c => c.has(from) ? c : new Set(c).add(from));
    screenRef.current = s;
    setSlideDir('fwd'); setScreen(prev => { if (!TRANSIENT_SCREENS.has(prev)) historyRef.current.push(prev); return s; });
  }
  function goBack() { const prev = historyRef.current.pop(); if (prev) { screenRef.current = prev; setSlideDir('back'); setScreen(prev); } }

  useBodyScrollLock(isOpen);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && isOpen) onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setScreen('intro'); screenRef.current = 'intro'; setCompleted(new Set()); setStepWin(0); setSlideDir('fwd'); historyRef.current = []; setSignup({ firstName: '', lastName: '', email: '', phone: '' }); setSelIndustry(''); setShowAllIndustries(false); setSelRole('');
      setChatMsgs([]); setContinueVisible(false); setListening(false); setMicMessage(''); setMomentCount(0);
      setInvite({ name: '', email: '', sent: false }); setCompany({ company: '', website: '', email: '', industry: '', country: '', size: '', role: '', none: false });
      setOrgStage('form'); setOrgPct(0);
      setDiscIdx(0); setDiscSel([]); setOtherText(''); setLoadingLine(''); setLoadingPct(0); setWorkforceSelection([]);
      setVoiceGender(''); setAvatarPhotoSel(null); setPersonalName(''); setPersonalStyle(''); setShowAvatarSection(false); setCrData(null);
      setVoiceOn(false); voiceOnRef.current = false; try { if (hasSpeech) speechSynthesis.cancel(); } catch {}
      sr.current = { name: '', lastName: '', email: '', phone: '', password: '', industry: '', position: '', orgAnswers: {}, chatCount: 0, mockBusiness: null, momentStarted: false, activeQuestions: [], usedResponses: new Set() };
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
  const hasRecognition = typeof window !== 'undefined' && !!((window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition || (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).webkitSpeechRecognition);

  useEffect(() => {
    if (!isOpen || !hasSpeech) return;
    speechSynthesis.getVoices();
  }, [isOpen, hasSpeech]);

  function speak(text: string) {
    if (!voiceOnRef.current || !hasSpeech) return;
    try {
      speechSynthesis.cancel();
      later(() => {
        if (!voiceOnRef.current) return;
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 1.02; u.lang = 'en-GB';
        try { speechSynthesis.speak(u); } catch {}
      }, 60);
    } catch {}
  }

  // ── Steps 1–4: meet, industry, demo company, role ──
  function genPassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let s = ''; for (let i = 0; i < 10; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  }
  function submitSignup() {
    sr.current.name = signup.firstName.trim() || 'there';
    sr.current.lastName = signup.lastName.trim();
    sr.current.email = signup.email.trim();
    sr.current.phone = signup.phone.trim();
    sr.current.password = genPassword();
    nav('industry');
  }
  function pickIndustry(ind: string) {
    setSelIndustry(ind);
    sr.current.industry = ind; sr.current.mockBusiness = MOCK_BUSINESSES[ind] || MOCK_BUSINESSES['Professional Services'];
    later(() => nav('business-intro'), 320);
  }
  function pickPosition(pos: string) {
    setSelRole(pos);
    const biz = sr.current.mockBusiness!; sr.current.position = pos;
    setConnectingText('Connecting you to ' + biz.name + ' as ' + posLabel(sr.current.industry, pos) + '…');
    later(() => nav('connecting'), 280);
    later(() => { nav('chat'); startChat(); }, 1900);
  }

  // ── Step 5: My OI demo ──
  function startChat() {
    const name = sr.current.name && sr.current.name !== 'there' ? ', '+sr.current.name : '';
    const greeting = 'Good '+timeOfDay()+name+'. How can I help you today?';
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
    if (!Recog) { setMicMessage("Voice input isn't supported in this browser — try Chrome or Edge, or just type below."); chatInputRef.current?.focus(); return; }
    if (listening) { try { recogRef.current?.stop(); } catch {} return; }
    setMicMessage('');
    const r = new Recog(); r.lang = 'en-GB'; r.interimResults = false;
    r.onresult = e => { const t = e.results[0]?.[0]?.transcript; if (t) sendChat(t); };
    r.onend = () => setListening(false);
    r.onerror = e => {
      setListening(false);
      const reason = e?.error === 'not-allowed' || e?.error === 'service-not-allowed'
        ? 'Microphone access was blocked — allow it in your browser settings and try again.'
        : e?.error === 'no-speech' ? "Didn't catch that — tap the mic and try again."
        : "Voice input isn't available right now — try typing instead.";
      setMicMessage(reason);
    };
    recogRef.current = r; setListening(true);
    try { r.start(); } catch { setListening(false); setMicMessage("Couldn't start the microphone — try typing instead."); }
  }

  // ── Step 6: Imagine if ──
  function startMoment() {
    if (sr.current.momentStarted) return; sr.current.momentStarted = true;
    try { recogRef.current?.stop(); } catch {}
    nav('moment'); setMomentCount(0);
    let idx = 0;
    function next() {
      if (idx >= MOMENT_LINES.length) return;
      speak(MOMENT_LINES[idx].t); idx++; setMomentCount(idx);
      later(next, 1900);
    }
    later(next, 300);
  }

  // ── Step 8: find the organisation ──
  function startOrgSearch() {
    setOrgStage('searching'); setOrgPct(0); let idx = 0; const steps = 5;
    function step() { idx++; setOrgPct(Math.round((idx/steps)*100)); if (idx>=steps) { later(() => setOrgStage('found'), 350); return; } later(step, 320); }
    step();
  }
  function orgTryAgain() { setOrgStage('form'); }
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
    sr.current.activeQuestions = DISCOVERY_QUESTIONS;
    setDiscIdx(0); setDiscSel([]); setOtherText(''); nav('discovery'); speak(sr.current.activeQuestions[0].text);
  }
  function toggleDisc(opt: string) {
    const q = sr.current.activeQuestions[discIdx]; if (q.freeText) return;
    if (!q.multi) { setDiscSel([opt]); return; }
    setDiscSel(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]);
  }
  function discBack() {
    const prev = discIdx - 1;
    if (prev < 0) { setOrgStage('found'); goBack(); return; }
    const q = sr.current.activeQuestions[prev]; const existing = sr.current.orgAnswers[q.key];
    setSlideDir('back'); setDiscIdx(prev); setDiscSel(q.freeText ? [] : toArr(existing)); setOtherText(q.freeText ? String(existing || '') : '');
  }
  function confirmDisc() {
    const q = sr.current.activeQuestions[discIdx];
    if (q.freeText) { sr.current.orgAnswers[q.key] = otherText.trim(); }
    else { const vals = discSel.map(v => v === OTHER_OPTION ? otherText.trim() : v).filter(Boolean); sr.current.orgAnswers[q.key] = q.multi ? vals : (vals[0] || ''); }
    const next = discIdx + 1;
    if (next >= sr.current.activeQuestions.length) { startCapacityReport(); }
    else { setSlideDir('fwd'); setDiscIdx(next); setDiscSel([]); setOtherText(''); speak(sr.current.activeQuestions[next].text); }
  }

  // ── Step 10: report ──
  function scoreDrivers(): { name: string; level: number; why: string }[] {
    const a = sr.current.orgAnswers; const ind = sr.current.industry || 'Professional Services';
    const size = String(a.size || '1–10');
    const toolCount = toArr(a.tools).filter(t => t!==OTHER_OPTION && t!=="We don't use many tools yet").length;
    const central = hasAnswer(a,'infoManagement','CRM or business systems') && toolCount<=2;
    const fragmented = toolCount>=3 || hasAnswer(a,'challenges','Too many tools and systems');
    const informal = hasAnswer(a,'infoManagement','Emails') || hasAnswer(a,'infoManagement',"Not sure / it's spread across multiple places");
    const st = answerText(a,'tools','a mix of tools',true);
    const stretched = hasAnswer(a,'challenges','Team capacity and workload'); const manual = hasAnswer(a,'challenges','Manual and repetitive work');
    const findingInfo = hasAnswer(a,'challenges','Finding information'); const slowDecisions = hasAnswer(a,'challenges','Slow decision-making');
    const growingRevenue = hasAnswer(a,'goals','Grow revenue'); const custService = hasAnswer(a,'goals','Improve customer service');
    const reduceCosts = hasAnswer(a,'goals','Reduce costs'); const compliance = hasAnswer(a,'goals','Improve compliance and risk management');
    const hook = INDUSTRY_HOOKS[ind] || DEFAULT_HOOK; const hookAnswer = String(a.industryHook || ''); const hookOpt = hook.options.find(o => o.text === hookAnswer);
    return [
      { name:'Knowledge Continuity', level: central?2:(fragmented?1:0), why: central?'A central system gives knowledge somewhere to live beyond individual people.':informal?'With information spread across emails and individual files, very little knowledge is likely captured.':'With tools like '+st+', knowledge is likely still tied to individuals.' },
      { name:'System Cohesion', level: central?2:(fragmented?1:0), why:'Based on the tools in use today: '+st+'.' },
      { name:'Decision Velocity', level: slowDecisions?0:1, why: slowDecisions?'You flagged slow decision-making — usually a visibility problem more than a headcount one.':'Not flagged as a top challenge, but worth monitoring as you grow.' },
      { name:'Workforce Leverage', level:(reduceCosts||SMALL_SIZES.includes(size))?0:1, why: reduceCosts?'You flagged reducing costs — workforce leverage is usually the fastest lever.':'At '+size+' employees, coordination overhead is worth watching.' },
      { name:'Risk Visibility', level:((HIGH_STAKES.includes(ind)||compliance)&&!central)?0:1, why: HIGH_STAKES.includes(ind)?'Higher-stakes industries need risk surfaced earlier, not just at review.':compliance?'You flagged compliance and risk management — that needs risk surfaced continuously, not at review.':'Standard risk exposure for your industry at this size.' },
      { name:'Scale Readiness', level: central?(LARGE_SIZES.includes(size)?2:1):0, why: central?'A central system supports growth without a rebuild.':'Worth establishing a central system before headcount grows further.' },
      { name:'Team Capacity', level: stretched?0:(manual?1:0), why: stretched?'Team capacity and workload was flagged — the fastest gain is rarely more headcount, it\'s removing manual work.':manual?'Manual and repetitive work was flagged — processes absorb capacity that could go elsewhere.':'Team capacity wasn\'t flagged as a constraint.' },
      { name:'Growth & Retention Exposure', level: growingRevenue?1:(custService||reduceCosts?0:1), why: growingRevenue?'Growing revenue is a stated goal — referral and pipeline systems are usually the fastest lever.':custService?'Customer service is a stated goal — service gaps are often more expensive than they look.':findingInfo?'Finding information was flagged as a challenge — that slows everything downstream.':'Not flagged as a clear constraint yet.' },
      { name: hook.driverName, level: hookOpt?hookOpt.level:0, why: hookOpt?hookOpt.why:'Worth mapping directly — this wasn\'t confirmed in discovery.' },
    ];
  }
  function startCapacityReport() {
    const a = sr.current.orgAnswers; const ind = sr.current.industry || 'Professional Services';
    const companyName = String(a.company || 'Your organisation'); const country = String(a.country || 'your region');
    const sizeKnown = Boolean(a.size); const size = String(a.size || 'a growing');
    const profile = INDUSTRY_PROFILES[ind] || INDUSTRY_PROFILES['Professional Services'];
    const st = answerText(a,'tools','a mix of tools',true); const staffingT = staffingPhrase(a); const growthT = growthPhrase(a);
    const objT = answerText(a,'goals','improve execution');
    const levels = ['Early','Developing','Established'];
    const check = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
    const driversHTML = scoreDrivers().map(d => '<div class="cr-driver-card"><div class="cr-driver-name">'+d.name+'</div><div class="cr-driver-dots">'+[0,1,2].map(i=>'<span class="'+(i<=d.level?'filled':'')+'"></span>').join('')+'</div><div class="cr-driver-level">'+levels[d.level]+'</div><div class="cr-driver-why">'+d.why+'</div></div>').join('');
    const findings = [
      { label:'Organisational maturity', text: hasAnswer(a,'infoManagement','CRM or business systems')?'Developing well — you already have a central system in place.':'Developing — core functions exist, but with work through '+st+', knowledge is spread across people.' },
      { label:'Strengths', text:'A clear departmental structure already in place across '+profile.depts.slice(0,3).join(', ')+'.' },
      { label:'Potential risk', text:'Knowledge tied to individual people is the most common risk at '+(sizeKnown?size+'-employee':'this size of')+' organisations relying on '+st+'.' },
      { label:'Priority opportunity', text:'The fastest wins are the priorities you already chose: '+objT+'.' },
      { label:'What this could look like in 90 days', text:'A working OI Workforce covering your core departments, actively reducing the manual coordination '+st+' currently requires.' },
      { label:'Suggested next priority', text:'Confirm your organisational structure, then connect the systems your team already uses.' },
    ];
    const findingsHTML = findings.map(f => '<div class="cr-finding">'+check+'<div><div class="cr-finding-label">'+f.label+'</div><div class="cr-finding-text">'+f.text+'</div></div></div>').join('');
    const summary = companyName+' is a '+(sizeKnown?size+'-employee ':'')+ind.toLowerCase()+' organisation based in '+country+'. The clearest priorities are '+objT+', and most work runs through '+st+' today. The team is '+staffingT+', and the bigger constraint on the customer side is '+growthT+'.';
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    setCrData({ company: companyName, country, industry: ind, date, summary, driversHTML, findingsHTML });
    nav('report');
    speak('Here is what I understand about '+companyName+'.');
  }

  // ── Next steps: 7-day experience, value report, workforce, pricing, setup ──
  function populateWorkforce() {
    const names = INDUSTRY_WORKFORCE[sr.current.industry] || INDUSTRY_WORKFORCE['Professional Services'];
    setWorkforceSelection(prev => prev.length ? prev : [...names]);
  }
  function startSevenDay() {
    populateWorkforce(); nav('7day-start');
    speak('Great! I now understand your organisation, and I\'m ready to start working with you.');
  }
  function startWhatHappened() { nav('what-happened'); speak('Here\'s what I\'ve done so far.'); }
  function startValueReport() { nav('value-report'); speak('Here\'s what I\'ve learned, what I\'ve done and the value I can bring.'); }
  function startBuildWorkforce() {
    populateWorkforce(); nav('build-workforce');
    speak('For a '+sr.current.industry+' organisation, here is the OI Workforce I would recommend.');
  }
  function valueLineFor(name: string): string {
    const person = WORKFORCE_LIBRARY[name]; if (!person) return '';
    const title = person.title.toLowerCase(); const a = sr.current.orgAnswers; const obj = toArr(a.goals);
    if (title.includes('finance')||title.includes('cfo')) return obj.includes('Reduce costs')?'Directly targets the cost reduction you flagged.':'Keeps financial visibility current, not just at month-end.';
    if (title.includes('operations')||title.includes('warehouse')||title.includes('quality')) return hasAnswer(a,'challenges','Team capacity and workload')?'Takes manual coordination off a stretched team.':'Removes fragmented-systems overhead slowing execution.';
    if (title.includes('hr')||title.includes('people')) return obj.includes('Improve operational efficiency')?'Directly supports the operational efficiency priority you flagged.':'Keeps workforce risk visible before it becomes a retention problem.';
    if (title.includes('sales')) { if (growingRevenue(a)) return 'Built for the growth priority you flagged: growing revenue.'; if (obj.includes('Improve customer service')) return 'Targets the customer service priority you flagged.'; return 'Keeps pipeline and account risk visible before deals are lost.'; }
    if (title.includes('risk')||title.includes('compliance')||title.includes('legal')) return obj.includes('Improve compliance and risk management')?'Directly supports the compliance and risk priority you flagged.':'Surfaces risk earlier than a periodic review would.';
    if (title.includes('procurement')) return obj.includes('Reduce costs')?'Targets supplier cost, supporting the cost reduction you flagged.':'Keeps contract risk visible before renewal deadlines.';
    if (title.includes('executive')||title.includes('ceo')) return hasAnswer(a,'challenges','Finding information')?'Keeps every document, decision and board pack organised in one place.':'Takes the coordination off your plate, so you can focus on '+(obj[0] ? 'what you flagged: '+obj[0].toLowerCase() : 'your top priority')+'.';
    return 'Takes the coordination off your plate, so you can focus on '+(obj[0] ? 'what you flagged: '+obj[0].toLowerCase() : 'your top priority')+'.';
  }
  function growingRevenue(a: Record<string,string|string[]>) { return hasAnswer(a,'goals','Grow revenue'); }
  function calcMonthly(name: string): number { const p = WORKFORCE_LIBRARY[name]; return p ? Math.round((p.benchmark/12)*OI_PRICING_PCT) : 0; }
  function startLoading() {
    nav('loading'); let idx = 0;
    function step() { if (idx>=LOADING_LINES.length) { later(startWelcome,500); return; } setLoadingLine(LOADING_LINES[idx]); setLoadingPct(Math.round(((idx+1)/LOADING_LINES.length)*100)); idx++; later(step,750); }
    step();
  }
  function startWelcome() { nav('welcome'); speak('Welcome, '+sr.current.name+". Everything's ready. I'm looking forward to working with you."); }
  // Header step numbers: jump straight to any step, filling in demo defaults for anything skipped.
  function goToStep(n: number) {
    if (n === stepNum && !isNextSteps) return;
    const backward = n < stepNum;
    timers.current.forEach(clearTimeout); timers.current = [];
    try { recogRef.current?.stop(); } catch {}
    try { if (hasSpeech) speechSynthesis.cancel(); } catch {}
    if (n >= 3 && !sr.current.mockBusiness) {
      const ind = sr.current.industry || 'Professional Services';
      sr.current.industry = ind; sr.current.mockBusiness = MOCK_BUSINESSES[ind] || MOCK_BUSINESSES['Professional Services']; setSelIndustry(ind);
    }
    if (n >= 5 && !sr.current.position) { sr.current.position = POSITION_OPTIONS[0]; setSelRole(POSITION_OPTIONS[0]); }
    if (n >= 11) populateWorkforce();
    jumpingRef.current = true;
    switch (n) {
      case 1: nav('intro'); break;
      case 2: nav('industry'); break;
      case 3: nav('business-intro'); break;
      case 4: nav('role'); break;
      case 5: nav('chat'); if (!chatMsgs.length) startChat(); break;
      case 6: if (sr.current.momentStarted) { nav('moment'); setMomentCount(MOMENT_LINES.length); } else startMoment(); break;
      case 7: nav('offer'); break;
      case 8: if (orgStage === 'searching') setOrgStage('form'); nav('company'); break;
      case 9: startDiscovery(); break;
      case 10: startCapacityReport(); break;
      case 11: startSevenDay(); break;
      case 12: startWhatHappened(); break;
      case 13: startValueReport(); break;
      case 14: startBuildWorkforce(); break;
      case 15: nav('pricing'); break;
      case 16: startWelcome(); break;
    }
    jumpingRef.current = false;
    if (backward) setSlideDir('back');
  }
  function startPersonalise() { setVoiceGender(''); setAvatarPhotoSel(null); setPersonalName(''); setPersonalStyle(''); setShowAvatarSection(false); nav('personalise'); }

  const totalOI = workforceSelection.reduce((s,n) => s+calcMonthly(n), 0);
  const totalHuman = workforceSelection.reduce((s,n) => { const p=WORKFORCE_LIBRARY[n]; return s+(p?Math.round(p.benchmark/12):0); }, 0);
  const replacementValue = totalHuman*12;
  const capabilityValue = Math.round(replacementValue*1.5);
  const productiveValue = Math.round(replacementValue*1.8);
  const annualOIWithDiscount = Math.round(totalOI*12*0.9);

  const biz = sr.current.mockBusiness;
  const currentDiscQ = sr.current.activeQuestions[discIdx];
  const discNeedsOther = !currentDiscQ?.freeText && discSel.includes(OTHER_OPTION) && !otherText.trim();
  const unusedResp = RESPONSES.filter(r => !sr.current.usedResponses.has(r.prompt));
  const quickPrompts = [...unusedResp.filter(r => r.roles.includes(sr.current.position)), ...unusedResp.filter(r => !r.roles.includes(sr.current.position))].slice(0,4);
  const stepNum = SCREEN_STEP[screen] || 16;
  const isNextSteps = !SCREEN_STEP[screen];
  const canGoBack = screen === 'discovery' || (!TRANSIENT_SCREENS.has(screen) && historyRef.current.length > 0);
  const headerBack = screen === 'discovery' ? discBack : goBack;
  // The header shows five step numbers at a time, sliding so the current step sits in the middle (two either side).
  const STEP_WIN = 5, maxWin = STEP_LABELS.length - STEP_WIN;
  useEffect(() => { setStepWin(Math.max(0, Math.min(stepNum - 3, maxWin))); }, [stepNum, maxWin]);
  const userInitials = initialsOf(sr.current.name === 'there' ? '' : sr.current.name);
  function sevenDayRange(): string {
    const start = new Date(); const end = new Date(); end.setDate(end.getDate()+6);
    const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
    return fmt(start)+' – '+fmt(end)+', '+end.getFullYear();
  }

  const sc = (name: string) => screen === name;

  if (!isOpen) return null;

  return (
    <div className="david-modal open" role="dialog" aria-modal="true" aria-label="Meet your Personal OI" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={'david-panel oi-panel'+(slideDir === 'back' ? ' oi-slide-back' : '')+(stepNum === 5 ? ' oi-step5' : '')+(screen === 'chat' ? ' oi-fixed-h' : '')}>
        <button className="david-close" onClick={onClose} aria-label="Close">&times;</button>
        <div className="david-topbar">
          {canGoBack && <button type="button" className="oi-top-back" onClick={headerBack} aria-label="Back" title="Back"><Ico d={ICONS.back} size={15} sw={2.2} /></button>}
          <div className="oi-top-avatar"><img src={PERSONAL_OI_PHOTO} alt="" /><span className="live-dot"></span></div>
          <div className="david-topbar-text"><strong>Personal OI</strong><span>Your OI Consultant</span></div>
          <div className="oi-steps">
            <button type="button" className="oi-steps-arrow" disabled={stepWin === 0} onClick={() => setStepWin(w => Math.max(0, w - STEP_WIN))} aria-label="Previous steps"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg></button>
            <div className="oi-steps-view">
              <ol className="oi-steps-track" style={{ '--win': stepWin } as CSSProperties} aria-label={isNextSteps ? 'All steps complete' : 'Step '+stepNum+' of 16: '+STEP_LABELS[stepNum-1]}>
                {STEP_LABELS.map((l,i) => {
                  const state = !isNextSteps && i === stepNum-1 ? 'current' : completed.has(i+1) ? 'done' : '';
                  return <li key={l} className={state} aria-current={state === 'current' ? 'step' : undefined}><button type="button" tabIndex={i >= stepWin && i < stepWin + STEP_WIN ? 0 : -1} title={(i+1)+'. '+l} aria-label={'Go to step '+(i+1)+': '+l} onClick={() => goToStep(i+1)}>{i+1}</button></li>;
                })}
              </ol>
            </div>
            <button type="button" className="oi-steps-arrow" disabled={stepWin >= maxWin} onClick={() => setStepWin(w => Math.min(maxWin, w + STEP_WIN))} aria-label="Next steps"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg></button>
          </div>
          {hasSpeech && (
            <button className={'david-voice-toggle'+(voiceOn?' on':'')} type="button" aria-pressed={voiceOn} aria-label={voiceOn ? 'Turn voice off' : 'Turn voice on'} title={voiceOn ? 'Voice on' : 'Voice off'} onClick={() => { setVoiceOn(v => { if (v) { try { speechSynthesis.cancel(); } catch {} } return !v; }); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 5L6 9H2v6h4l5 4V5z"/>{voiceOn ? <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/> : <path d="M23 9l-6 6M17 9l6 6"/>}</svg>
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
              <p className="oi-meet-ask">Let&rsquo;s get you set up.</p>
              <form className="oi-meet-form" onSubmit={e => { e.preventDefault(); submitSignup(); }}>
                <div className="oi-meet-form-row">
                  <input type="text" placeholder="First name" maxLength={30} value={signup.firstName} onChange={e => setSignup(s => ({ ...s, firstName: e.target.value }))} required autoFocus aria-label="First name" />
                  <input type="text" placeholder="Last name" maxLength={30} value={signup.lastName} onChange={e => setSignup(s => ({ ...s, lastName: e.target.value }))} required aria-label="Last name" />
                </div>
                <input type="email" placeholder="Email" value={signup.email} onChange={e => setSignup(s => ({ ...s, email: e.target.value }))} required aria-label="Email" />
                <input type="tel" placeholder="Phone number (optional)" value={signup.phone} onChange={e => setSignup(s => ({ ...s, phone: e.target.value }))} aria-label="Phone number" />
                <button type="submit" className="oi-btn oi-btn-white oi-btn-block" disabled={!signup.firstName.trim() || !signup.lastName.trim() || !signup.email.trim()}>Continue <Ico d={ICONS.arrow} size={16} sw={2} /></button>
              </form>
              <p className="oi-meet-small">I&rsquo;ll generate a secure password for you automatically &mdash; no need to create one.</p>
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
                <div style={{ display:'flex', gap:10 }}>
                  <button type="button" className="oi-btn oi-btn-navy" style={{ flex:1 }} onClick={() => nav('role')}>Continue <Ico d={ICONS.arrow} size={16} sw={2} /></button>
                </div>
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
                <div className="oi-david-card" style={{ backgroundImage: 'linear-gradient(100deg, rgba(11,30,63,.94) 0%, rgba(17,32,58,.8) 45%, rgba(17,32,58,.25) 100%), url('+(INDUSTRY_PHOTOS[sr.current.industry] || OFFICE_PHOTO)+')' }}>
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
                <div className={'oi-voice'+(listening?' listening':'')}>
                  <span className="oi-wave">{Array.from({ length: 9 }).map((_,i) => <i key={i}></i>)}</span>
                  <button type="button" className={'oi-mic'+(!hasRecognition?' unsupported':'')} onClick={toggleMic} aria-label={listening ? 'Stop listening' : 'Speak to David'}><Ico d={ICONS.mic} size={20} sw={2} /></button>
                  <span className="oi-wave">{Array.from({ length: 9 }).map((_,i) => <i key={i}></i>)}</span>
                  <div className={'oi-voice-label'+(micMessage?' oi-voice-error':'')}>{micMessage || (listening ? 'David is listening…' : hasRecognition ? 'Tap the mic to talk to David' : 'Voice input not supported here — type below')}</div>
                </div>
                <div className="oi-ask">
                  <input type="text" ref={chatInputRef} placeholder="Ask me anything…" onKeyDown={e => { if (e.key==='Enter') sendChat((e.target as HTMLInputElement).value); }} />
                  <button type="button" onClick={() => sendChat(chatInputRef.current?.value || '')} aria-label="Send"><Ico d={ICONS.arrow} size={16} sw={2.2} /></button>
                </div>
                {continueVisible && <div className="oi-chat-next"><button className="david-continue-btn" type="button" onClick={startMoment}>I&rsquo;ve seen enough &mdash; what&rsquo;s next? &rarr;</button></div>}
              </div>
            </div>
          </div>

          {/* 6 · Imagine if */}
          <div className={'david-screen oi-screen oi-center'+(sc('moment')?' active':'')} data-screen="moment">
            <div className="oi-imagine">
              <div className="oi-head" style={{ marginBottom:16 }}><h3>Imagine&hellip;</h3><p>Now picture this working for your organisation.</p></div>
              <div className="oi-imagine-body">
                <img className="oi-imagine-photo" src={PERSONAL_OI_PHOTO} alt="" />
                <div className="oi-imagine-lines">
                  {MOMENT_LINES.slice(0, momentCount).map((l,i) => <p key={i} className={'oi-line '+l.cls}>{l.t}</p>)}
                </div>
              </div>
              <div className="oi-feature-photo" style={{ backgroundImage: 'linear-gradient(100deg, rgba(0,27,92,.88) 0%, rgba(0,27,92,.55) 48%, rgba(0,27,92,.15) 100%), url('+(INDUSTRY_PHOTOS[sr.current.industry] || OFFICE_PHOTO)+')' }}>
                <div className="oi-feature-rows">
                  {MOMENT_FEATURES.map(f => (
                    <div key={f.title} className="oi-feature-row"><span className="oi-feature-icon"><Ico d={ICONS[f.icon as keyof typeof ICONS]} size={18} /></span><div><strong>{f.title}</strong><span>{f.text}</span></div></div>
                  ))}
                </div>
                <div className="oi-infinity-banner"><span className="oi-feature-icon"><Ico d={ICONS.infinity} size={22} /></span><p>A workforce that understands your organisation, uses your knowledge and helps your people do more of what matters.</p></div>
              </div>
              <div className={'oi-imagine-actions'+(momentCount >= MOMENT_LINES.length ? ' show' : '')} style={{ display:'flex', justifyContent:'flex-end', alignItems:'center', gap:10 }}>
                <button type="button" className="oi-btn oi-btn-blue" onClick={() => nav('offer')}>Show me what this could look like for my organisation <Ico d={ICONS.arrow} size={16} sw={2} /></button>
              </div>
            </div>
          </div>

          {/* 7 · Would you like me to come and work with you? */}
          <div className={'david-screen oi-screen'+(sc('offer')?' active':'')} data-screen="offer">
            <div className="oi-card oi-narrow">
              <h3 className="oi-card-title" style={{ textAlign:'center' }}>Would you like me to come and work with you?</h3>
              <p className="oi-card-sub" style={{ textAlign:'center' }}>First, let me get to know your organisation.</p>
              <p className="oi-offer-intro">I can quickly research your organisation, ask you a few short questions and show you what I understand. You&rsquo;ll get a personalised Operational Intelligence Brief that you can review, download and even share with your team. If you like what you see, you can then invite me to work with you for the next 7 days &mdash; <strong>FREE</strong> &mdash; so I can show you what I can actually do for you.</p>
              <div className="oi-howitworks">
                <div className="oi-howitworks-title">Here&rsquo;s how it works</div>
                {HOW_IT_WORKS.map((s,i) => (
                  <div key={s.title} className="oi-step-row">
                    <span className="oi-step-num">{i+1}</span>
                    <span className="oi-feature-icon"><Ico d={ICONS[s.icon as keyof typeof ICONS]} size={17} /></span>
                    <div><strong>{s.title}</strong><span>{s.text}</span></div>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:10, marginTop:14 }}>
                <button type="button" className="oi-btn oi-btn-blue" style={{ flex:1 }} onClick={() => { setOrgStage('form'); nav('company'); }}>Get to know my organisation <Ico d={ICONS.arrow} size={16} sw={2} /></button>
              </div>
              <div className="oi-offer-links">
                <button type="button" className="oi-link-btn" onClick={() => nav('arrange')}>Prefer to loop in a colleague first?</button>
                <button type="button" className="oi-link-btn" onClick={onClose}>I&rsquo;m not ready yet</button>
              </div>
            </div>
          </div>

          {/* 7b · Arrange a conversation (secondary entry point) */}
          <div className={'david-screen oi-screen'+(sc('arrange')?' active':'')} data-screen="arrange">
            <div className="oi-card oi-narrow oi-form">
              {!invite.sent ? (<>
                <h3 className="oi-card-title">Who should join us?</h3>
                <p className="oi-card-sub">I&rsquo;ll invite them to a short conversation so you can explore OI Workforce together.</p>
                <form onSubmit={e => { e.preventDefault(); if (invite.email.includes('@')) setInvite(v => ({ ...v, sent: true })); }}>
                  <label className="oi-field"><span>Their name</span><input type="text" value={invite.name} onChange={e => setInvite(v => ({ ...v, name: e.target.value }))} placeholder="e.g. Ama Mensah" /></label>
                  <label className="oi-field"><span>Their work email</span><input type="email" required value={invite.email} onChange={e => setInvite(v => ({ ...v, email: e.target.value }))} placeholder="name@company.com" /></label>
                  <button type="submit" className="oi-btn oi-btn-blue oi-btn-block" disabled={!invite.email.includes('@')}>Send invitation <Ico d={ICONS.arrow} size={16} sw={2} /></button>
                </form>
              </>) : (
                <div className="oi-sent">
                  <span className="oi-offer-icon"><Ico d={ICONS.mail} size={26} /></span>
                  <h3 className="oi-card-title">Invitation on its way</h3>
                  <p className="oi-card-sub">I&rsquo;ll be in touch with {invite.name.trim() || invite.email} to find a time that works. In the meantime, you can start the experience yourself.</p>
                  <button type="button" className="oi-btn oi-btn-blue oi-btn-block" onClick={() => { setOrgStage('form'); nav('company'); }}>Start my 7-Day Experience</button>
                  <button type="button" className="oi-link-btn" onClick={onClose}>Close for now</button>
                </div>
              )}
            </div>
          </div>

          {/* 8 · Tell us about your company */}
          <div className={'david-screen oi-screen'+(sc('company')?' active':'')} data-screen="company">
            <div className="oi-card oi-narrow oi-form">
              <div className="oi-org-hero" style={{ backgroundImage: 'linear-gradient(180deg, rgba(0,27,92,.2) 0%, rgba(0,27,92,.82) 100%), url('+OFFICE_PHOTO+')' }}>
                <img className="oi-org-hero-photo" src={PERSONAL_OI_PHOTO} alt="" />
                <div className="oi-org-hero-name"><strong>Personal OI</strong><span>Your OI Consultant</span></div>
              </div>
              {orgStage === 'form' && (<>
                <h3 className="oi-card-title">Let me find your organisation.</h3>
                <p className="oi-card-sub">Tell me the name of your organisation and if possible, your website or work email. It will search and find publicly available information to build an initial understanding of your organisation.</p>
                <form className="oi-form-grid" onSubmit={e => { e.preventDefault(); startOrgSearch(); }}>
                  <label className="oi-row"><span>Organisation name</span><input type="text" value={company.company} disabled={company.none} onChange={e => setCompany(c => ({ ...c, company: e.target.value }))} placeholder="Rockstone's Office" /></label>
                  <label className="oi-row"><span>Website <em>(optional)</em></span><input type="text" value={company.website} disabled={company.none} onChange={e => setCompany(c => ({ ...c, website: e.target.value }))} placeholder="https://yourcompany.com" /></label>
                  <label className="oi-row"><span>Work email <em>(optional)</em></span><input type="text" value={company.email} disabled={company.none} onChange={e => setCompany(c => ({ ...c, email: e.target.value }))} placeholder="name@yourcompany.com" /></label>
                  <label className="oi-row"><span>Country / Region</span>
                    <select value={company.country} onChange={e => setCompany(c => ({ ...c, country: e.target.value }))}><option value="">Select</option>{COUNTRY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}</select>
                  </label>
                  <label className="oi-check"><input type="checkbox" checked={company.none} onChange={e => setCompany(c => ({ ...c, none: e.target.checked }))} /><span>I don&rsquo;t have a company yet</span></label>
                  <button type="submit" className="oi-btn oi-btn-blue oi-btn-block" disabled={!company.none && !company.company.trim()}><Ico d={ICONS.search} size={16} sw={2} /> Find my organisation <Ico d={ICONS.arrow} size={16} sw={2} /></button>
                </form>
              </>)}
              {orgStage === 'searching' && (
                <div className="oi-searching">
                  <div className="oi-searching-top">
                    <p>Give me a moment&hellip; I&rsquo;m searching and gathering publicly available information about your organisation.</p>
                    <span className="oi-searching-icon"><Ico d={ICONS.search} size={18} sw={2} /></span>
                  </div>
                  <div className="david-loading-track"><div className="david-loading-fill" style={{ width:orgPct+'%' }}></div></div>
                </div>
              )}
              {orgStage === 'found' && (<>
                <h3 className="oi-card-title">I think I&rsquo;ve found you.</h3>
                <div className="oi-found-card">
                  <div className="oi-found-photo-col">
                    <div className="oi-found-photo" style={{ backgroundImage: 'url('+(INDUSTRY_PHOTOS[company.industry || sr.current.industry] || OFFICE_PHOTO)+')' }}></div>
                    <span>{(company.none ? (sr.current.name !== 'there' ? sr.current.name + '’s future organisation' : 'Your future organisation') : (company.company.trim() || 'Your organisation')).toUpperCase()}</span>
                  </div>
                  <div className="oi-found-info">
                    <strong>{company.none ? (sr.current.name !== 'there' ? sr.current.name + '’s future organisation' : 'Your future organisation') : (company.company.trim() || 'Your organisation')}</strong>
                    <span className="oi-found-meta">{company.industry || sr.current.industry || 'Professional Services'}</span>
                    <div className="oi-found-row"><Ico d={ICONS.pin} size={14} /><span>{company.country ? (CITY_BY_COUNTRY[company.country] || '') + (CITY_BY_COUNTRY[company.country] ? ', ' : '') + company.country : 'your region'}</span></div>
                    {!company.none && company.website.trim() && <div className="oi-found-row"><Ico d={ICONS.link} size={14} /><span>{company.website}</span></div>}
                    <p className="oi-found-desc">{(company.none ? (sr.current.name !== 'there' ? sr.current.name + '’s future organisation' : 'Your future organisation') : (company.company.trim() || 'Your organisation'))} operates in the {(company.industry || sr.current.industry || 'professional services').toLowerCase()} sector, based in {company.country ? (CITY_BY_COUNTRY[company.country] || company.country) : 'your region'}{company.country ? ', ' + company.country : ''}.</p>
                  </div>
                  <div className="oi-found-also-col">
                    <div className="oi-found-also">Also found</div>
                    <div className="oi-found-tags">
                      <span className="oi-chip-sm"><Ico d={ICONS.briefcase} size={13} />LinkedIn</span>
                      <span className="oi-chip-sm"><Ico d={ICONS.people} size={13} />Facebook</span>
                      <span className="oi-chip-sm"><Ico d={ICONS.bolt} size={13} />X (Twitter)</span>
                      <span className="oi-chip-sm"><Ico d={ICONS.file} size={13} />Company news</span>
                    </div>
                  </div>
                </div>
                <p className="oi-found-q">Is this your organisation?</p>
                <div style={{ display:'flex', gap:10 }}>
                  <button type="button" className="oi-btn oi-btn-outline oi-btn-block" onClick={orgTryAgain}>No, try again</button>
                  <button type="button" className="oi-btn oi-btn-blue oi-btn-block" onClick={submitCompany}>Yes, that&rsquo;s us</button>
                </div>
              </>)}
            </div>
          </div>

          {/* 9 · Whilst I'm getting to know your company */}
          <div className={'david-screen oi-screen'+(sc('discovery')?' active':'')} data-screen="discovery">
            {currentDiscQ && (
              <div className="oi-card oi-narrow" key={discIdx}>
                <p className="oi-q-intro">Whilst I&rsquo;m getting to know your company, let me ask you&hellip;</p>
                <div className="oi-q-row">
                  <div className="oi-q-avatar">
                    <img src={PERSONAL_OI_PHOTO} alt="" />
                    <strong>Personal OI</strong>
                    <em>Your OI Consultant</em>
                  </div>
                  <div className="oi-q-bubble">
                    <div className="oi-q-count">Question {discIdx+1} of {sr.current.activeQuestions.length}</div>
                    <h3 className="oi-q-text">{currentDiscQ.text}</h3>
                    <p className="oi-q-hint">{currentDiscQ.freeText ? 'Optional, but every detail helps me prepare for you.' : currentDiscQ.multi ? 'You can select a few, or tell me in your own words.' : 'Choose the option that fits best.'}</p>
                  </div>
                </div>
                {currentDiscQ.freeText ? (
                  <div>
                    <textarea className="oi-other-input oi-textarea" placeholder={currentDiscQ.placeholder} maxLength={500} value={otherText} onChange={e => setOtherText(e.target.value)} rows={5} />
                    <div className="oi-char-count">{otherText.length}/500</div>
                  </div>
                ) : currentDiscQ.key === 'tools' ? (<>
                  <div className="oi-opt-grid oi-opt-grid-icons">
                    {currentDiscQ.options.filter(o => o!==OTHER_OPTION && o!=="We don't use many tools yet").map(opt => {
                      const on = discSel.includes(opt);
                      return (
                        <button key={opt} type="button" className={'oi-opt oi-opt-icon-btn'+(on?' selected':'')} aria-pressed={on} onClick={() => toggleDisc(opt)}>
                          {on ? <span className="oi-opt-check"><Ico d={ICONS.check} size={13} sw={3} /></span> : <span className="oi-opt-logo"><BrandLogo name={opt} /></span>}
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="oi-opt-grid">
                    {[OTHER_OPTION, "We don't use many tools yet"].map(opt => {
                      const on = discSel.includes(opt);
                      return (
                        <button key={opt} type="button" className={'oi-opt wide'+(on?' selected':'')} aria-pressed={on} onClick={() => toggleDisc(opt)}>
                          {on ? <span className="oi-opt-check"><Ico d={ICONS.check} size={13} sw={3} /></span> : <span className="oi-opt-icon"><Ico d={TOOL_ICONS[opt]} size={20} /></span>}
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                  {discSel.includes(OTHER_OPTION) && <input className="oi-other-input" type="text" placeholder="Tell me more…" value={otherText} onChange={e => setOtherText(e.target.value)} autoFocus />}
                </>) : (<>
                  <div className={'oi-opt-grid'+(currentDiscQ.key==='whoUses'?' oi-opt-grid-photo':'')}>
                    {currentDiscQ.options.map(opt => {
                      const on = discSel.includes(opt);
                      const photo = currentDiscQ.key === 'whoUses' ? WHOUSES_PHOTOS[opt] : undefined;
                      const icon = currentDiscQ.key === 'goals' ? GOALS_ICONS[opt] : QUESTION_ICONS[opt] || '';
                      return (
                        <button key={opt} type="button" className={'oi-opt'+(on?' selected':'')+(opt===OTHER_OPTION?' wide':'')+(photo?' oi-opt-photo-btn':'')} aria-pressed={on} onClick={() => toggleDisc(opt)}>
                          {on ? <span className="oi-opt-check"><Ico d={ICONS.check} size={13} sw={3} /></span>
                            : photo ? <span className="oi-opt-photo" style={{ backgroundImage:'url('+photo+')' }}></span>
                            : photo === undefined && currentDiscQ.key === 'whoUses' ? <span className="oi-opt-icon"><Ico d={ICONS.people} size={20} /></span>
                            : icon ? <span className="oi-opt-icon"><Ico d={icon} size={20} /></span> : <span className="oi-opt-dot"></span>}
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                  {discSel.includes(OTHER_OPTION) && <input className="oi-other-input" type="text" placeholder="Tell me more…" value={otherText} onChange={e => setOtherText(e.target.value)} autoFocus />}
                </>)}
                <div style={{ display:'flex', gap:10, marginTop:14 }}>
                  <button type="button" className="oi-btn oi-btn-blue" style={{ flex:1 }} disabled={!currentDiscQ.freeText && (discSel.length===0 || discNeedsOther)} onClick={confirmDisc}>{discIdx === sr.current.activeQuestions.length-1 ? 'Continue' : 'Next'} <Ico d={ICONS.arrow} size={16} sw={2} /></button>
                </div>
              </div>
            )}
          </div>

          {/* 10 · What I understand about your company */}
          <div className={'david-screen oi-screen'+(sc('report')?' active':'')} data-screen="report">
            {crData && (
              <div className="david-wizard" style={{ maxWidth:680 }}>
                <div className="oi-brief-head">
                  <div>
                    <div className="david-eyebrow">Your Operational Intelligence Brief</div>
                    <p className="oi-brief-head-sub">Here is what I understand about your organisation.</p>
                  </div>
                  <button type="button" className="oi-link-btn oi-edit-details" onClick={() => { setOrgStage('found'); nav('company'); }}><Ico d={ICONS.gear} size={13} sw={2} /> Edit details</button>
                </div>
                <div className="oi-brief">
                  <div className="oi-brief-text">
                    <ConsultantHead />
                    <p>I&rsquo;ve combined what you told me with publicly available information to create an initial Operational Intelligence Brief about your organisation.</p>
                    <p>You can review it below, download a full version and even share it with your team.</p>
                  </div>
                  <div className="oi-brief-photo" style={{ backgroundImage: 'url('+(INDUSTRY_PHOTOS[crData.industry] || OFFICE_PHOTO)+')' }}>
                    <span>{crData.company}</span>
                    <em>{crData.industry} &middot; {crData.country}{company.size ? ' · '+company.size+' people' : ''}</em>
                  </div>
                </div>
                <div className="oi-brief-grid">
                  {BRIEF_CARDS.map((c,i) => (
                    <div key={c.title} className="oi-brief-card">
                      <span className="oi-brief-card-icon" style={{ background:BRIEF_COLORS[i % BRIEF_COLORS.length] }}><Ico d={ICONS[c.icon as keyof typeof ICONS]} size={16} sw={2} /></span>
                      <strong>{c.title}</strong>
                      <span>{c.text}</span>
                    </div>
                  ))}
                </div>
                <button type="button" className="oi-link-btn" style={{ display:'block', textAlign:'center', marginBottom:14 }} onClick={() => nav('capacity-report')}>View the full interactive report &rarr;</button>
                <div className="oi-brief-actions-row">
                  <button type="button" className="oi-btn oi-btn-outline" onClick={() => window.print()}><Ico d={ICONS.download} size={16} sw={2} /> Download full report</button>
                  <button type="button" className="oi-btn oi-btn-outline"><Ico d={ICONS.link} size={16} sw={2} /> Share internally</button>
                </div>
                <button type="button" className="oi-btn oi-btn-blue oi-btn-block" onClick={startSevenDay}>Let&rsquo;s explore a 7-Day OI Experience <Ico d={ICONS.arrow} size={16} sw={2} /></button>
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
              <button type="button" className="oi-btn oi-btn-outline" onClick={() => window.print()}><Ico d={ICONS.download} size={17} sw={2} /> Download PDF</button>
              <button type="button" className="oi-btn oi-btn-blue" onClick={startSevenDay}>Continue <Ico d={ICONS.arrow} size={16} sw={2} /></button>
            </div>
          </div>

          {/* 11 · Your 7-day OI Experience Starts Now */}
          <div className={'david-screen oi-screen'+(sc('7day-start')?' active':'')} data-screen="7day-start">
            <div className="oi-card oi-narrow">
              <ConsultantHead />
              <h3 className="oi-card-title">Your 7-Day OI Experience Starts Now</h3>
              <p className="oi-7d-intro">Great! I now understand your organisation, and I&rsquo;m ready to start working with you.</p>
              <div className="oi-day-badge"><strong>Day 1 of 7 &middot; 7-Day OI Experience</strong><span>{sevenDayRange()}</span></div>
              <p className="oi-7d-note">We&rsquo;re just getting started. I&rsquo;ll keep you updated as we go.</p>
              <div className="oi-howitworks">
                <div className="oi-howitworks-title">What I&rsquo;ll be doing over the next 7 days</div>
                <div className="oi-sevenday-grid">
                  {SEVEN_DAY_ITEMS.map((it,i) => (
                    <div key={it.title} className="oi-sevenday-item"><span className="oi-feature-icon" style={{ background:BRIEF_COLORS[i % BRIEF_COLORS.length], color:'#fff' }}><Ico d={ICONS[it.icon as keyof typeof ICONS]} size={18} /></span><strong>{it.title}</strong><span>{it.text}</span></div>
                  ))}
                </div>
              </div>
              <div className="oi-howitworks">
                <div className="oi-howitworks-title">What you need to do</div>
                <ul className="oi-check-list">
                  {SEVEN_DAY_TODO.map((t,i) => <li key={t}><CheckDot i={i} />{t}</li>)}
                </ul>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button type="button" className="oi-btn oi-btn-blue" style={{ flex:1 }} onClick={startWhatHappened}>Start my 7-Day Experience <Ico d={ICONS.arrow} size={16} sw={2} /></button>
              </div>
            </div>
          </div>

          {/* 12 · What happened during your 7-day Experience */}
          <div className={'david-screen oi-screen'+(sc('what-happened')?' active':'')} data-screen="what-happened">
            <div className="oi-card oi-narrow">
              <ConsultantHead />
              <h3 className="oi-card-title">What happened during your 7-day Experience?</h3>
              <p className="oi-wh-intro">Over the past 7 days, I&rsquo;ve been learning from your organisation, completing real work and connecting your information.</p>
              <p className="oi-wh-lead">Here&rsquo;s what I&rsquo;ve done so far.</p>
              <div className="oi-stat-toolbar"><span>Show: Last 7 days &#9662;</span><span>{sevenDayRange()}</span></div>
              <div className="oi-stat-grid">
                {EXPERIENCE_STATS.map((s,i) => (
                  <div key={s.label} className="oi-stat-tile"><span className="oi-feature-icon" style={{ background:BRIEF_COLORS[i % BRIEF_COLORS.length], color:'#fff' }}><Ico d={ICONS[s.icon as keyof typeof ICONS]} size={18} /></span><strong>{s.value}</strong><span className="oi-stat-label">{s.label}</span><span className="oi-stat-text">{s.text}</span></div>
                ))}
              </div>
              <div className="oi-wh-actions">
                <button type="button" className="oi-btn oi-btn-outline" onClick={() => window.print()}><Ico d={ICONS.download} size={17} sw={2} /> Download full report</button>
                <button type="button" className="oi-btn oi-btn-outline" onClick={() => { window.location.href = 'mailto:?subject=My OI Workforce — 7-Day Experience&body=Here is what my Personal OI has done this week.'; }}><Ico d={ICONS.mail} size={17} sw={2} /> Share internally</button>
                <button type="button" className="oi-btn oi-btn-blue" style={{ flex:1 }} onClick={startValueReport}>See my OI Value Report <Ico d={ICONS.arrow} size={16} sw={2} /></button>
              </div>
            </div>
          </div>

          {/* 13 · Your OI Value Report */}
          <div className={'david-screen oi-screen'+(sc('value-report')?' active':'')} data-screen="value-report">
            <div className="oi-card oi-narrow">
              <ConsultantHead />
              <h3 className="oi-card-title">Your OI Value Report</h3>
              <p className="oi-vr-intro">Here&rsquo;s what I&rsquo;ve learned, what I&rsquo;ve done and the value I can bring.</p>
              <div className="oi-badge-row">
                <span className="oi-badge pink"><Ico d={ICONS.store} size={14} /> Spend less</span>
                <span className="oi-badge blue"><Ico d={ICONS.bolt} size={14} /> Do more</span>
                <span className="oi-badge green"><Ico d={ICONS.check} size={14} /> Work better</span>
              </div>
              <div className="oi-howitworks">
                <div className="oi-howitworks-title">Potential and demonstrated value</div>
                <div className="oi-value-grid">
                  <div className="oi-value-card"><strong>{fmtMoney(replacementValue, currency)}</strong><span>Replacement Value</span><em>Estimated annual value</em></div>
                  <div className="oi-value-card"><strong>{fmtMoney(capabilityValue, currency)}</strong><span>Capability Value</span><em>Estimated annual value</em></div>
                  <div className="oi-value-card"><strong>{fmtMoney(productiveValue, currency)}</strong><span>Productive Value</span><em>Estimated annual value</em></div>
                </div>
              </div>
              <div className="oi-howitworks">
                <div className="oi-howitworks-title">Other key outcomes</div>
                <div className="oi-outcome-grid">
                  {OTHER_OUTCOMES.map((o,i) => <div key={o.title} className="oi-outcome-item"><CheckDot i={i} /><div><strong>{o.title}</strong><span>{o.text}</span></div></div>)}
                </div>
              </div>
              <div className="oi-wh-actions">
                <button type="button" className="oi-btn oi-btn-outline" onClick={() => window.print()}><Ico d={ICONS.download} size={17} sw={2} /> Download full report</button>
                <button type="button" className="oi-btn oi-btn-outline" onClick={() => { window.location.href = 'mailto:?subject=Our OI Value Report'; }}><Ico d={ICONS.people} size={17} sw={2} /> Share with your team</button>
                <button type="button" className="oi-btn oi-btn-blue" style={{ flex:1 }} onClick={startBuildWorkforce}>See my recommended Workforce <Ico d={ICONS.arrow} size={16} sw={2} /></button>
              </div>
            </div>
          </div>

          {/* 14 · recommended workforce */}
          <div className={'david-screen oi-screen'+(sc('build-workforce')?' active':'')} data-screen="build-workforce">
            <div className="david-wizard" style={{ maxWidth:560 }}>
              <div className="david-eyebrow">Your Recommended Workforce&trade;</div>
              <div className="david-wizard-q">Based on our chat, here&rsquo;s the OI Workforce I&rsquo;d recommend — built around what you told me matters: {answerText(sr.current.orgAnswers,'goals','your top priorities')}.</div>
              <div className="oi-wf-list">
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
              <div style={{ display:'flex', gap:10 }}>
                <button className="oi-btn oi-btn-blue" style={{ flex:1 }} type="button" onClick={() => nav('pricing')}>See your investment <Ico d={ICONS.arrow} size={16} sw={2} /></button>
              </div>
            </div>
          </div>

          {/* 15 · investment */}
          <div className={'david-screen oi-screen'+(sc('pricing')?' active':'')} data-screen="pricing">
            <div className="david-wizard" style={{ maxWidth:580 }}>
              <div className="david-eyebrow">Your Investment</div>
              <div className="david-wizard-q">Estimated annual value {fmtMoney(capabilityValue, currency)}</div>
              <p className="oi-price-intro">Adjust this to fit your budget &mdash; remove a role, or swap it for a different one.</p>
              <div className="oi-price-currency">
                <label>Currency</label>
                <select className="oi-select-sm" value={currency} onChange={e => setCurrency(e.target.value as Currency)}>
                  <option value="USD">USD $</option><option value="GBP">GBP £</option><option value="EUR">EUR €</option><option value="GHS">GHS ₵</option>
                </select>
              </div>
              <div className="oi-price-list">
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
              <button type="button" className="oi-btn oi-btn-outline oi-btn-block oi-price-add" onClick={() => { const u=Object.keys(WORKFORCE_LIBRARY).find(n=>!workforceSelection.includes(n)); if(u) setWorkforceSelection(prev=>[...prev,u]); }}>+ Add another OI Consultant</button>
              <div className="oi-invest-summary">
                <div className="oi-invest-row oi-invest-head"><span>Total investment</span><span>Monthly</span><span>Annual (-10%)</span></div>
                <div className="oi-invest-row oi-invest-total"><span>Total monthly investment</span><strong>{fmtMoney(totalOI,currency)}</strong><strong>{fmtMoney(annualOIWithDiscount,currency)}</strong></div>
              </div>
              <div className="cr-summary-box" style={{ fontWeight:600 }}>{workforceSelection.length===0?'No OI Consultants selected yet — add one above.':'That\'s '+fmtMoney(totalHuman-totalOI,currency)+' / month less than hiring the human equivalent.'}</div>
              <div style={{ display:'flex', gap:10, marginBottom:10 }}>
                <button className="oi-btn oi-btn-blue oi-employ-btn" type="button" onClick={startLoading}>Employ my OI Workforce &rarr;</button>
              </div>
              <p className="oi-price-note">No long-term contract. This pricing is fully editable at any time &mdash; swap, add or remove a role whenever you need to.</p>
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

          {/* 16 · Let's start working together */}
          <div className={'david-screen oi-screen'+(sc('welcome')?' active':'')} data-screen="welcome">
            <div className="oi-card oi-narrow">
              <ConsultantHead />
              <h3 className="oi-card-title">Let&rsquo;s start working together</h3>
              <p className="oi-card-sub">Great! Your OI Workforce is ready to go.</p>
              <ul className="oi-check-list">
                {WELCOME_CHECKLIST.map((t,i) => <li key={t}><CheckDot i={i} />{t}</li>)}
              </ul>
              <div className="oi-howitworks">
                <div className="oi-howitworks-title">What happens next?</div>
                <div className="oi-timeline">
                  {WELCOME_TIMELINE.map(row => (
                    <div key={row.when} className="oi-timeline-row"><span className="oi-timeline-when">{row.when}</span><span className="oi-timeline-text">{row.text}</span></div>
                  ))}
                </div>
              </div>
              <div style={{ display:'flex', gap:10, marginBottom:10 }}>
                <button type="button" className="oi-btn oi-btn-blue" style={{ flex:1 }} onClick={onClose}>Complete and start <Ico d={ICONS.arrow} size={16} sw={2} /></button>
              </div>
              <button type="button" className="oi-link-btn" onClick={startPersonalise}>Personalise my Personal OI</button>
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
              <div style={{ display:'flex', gap:10 }}>
                <button className="oi-btn oi-btn-blue" style={{ flex:1 }} type="button" onClick={onClose}>Take me to My OI</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
