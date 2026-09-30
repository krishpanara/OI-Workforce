const aiModels = [
  { color: '#10A37F', name: 'OpenAI GPT' },
  { color: '#D4A27F', name: 'Anthropic Claude' },
  { color: '#4285F4', name: 'Google Gemini' },
  { color: '#0668E1', name: 'Meta Llama' },
  { color: '#FF6B35', name: 'Mistral' },
  { color: '#8E44AD', name: 'DeepSeek' },
  { color: '#111827', name: 'xAI Grok' },
  { color: '#722ED1', name: 'Alibaba Qwen' },
  { color: '#39594D', name: 'Cohere Command' },
  { color: '#DC2626', name: 'AI21 Jamba' },
  { color: '#FF9900', name: 'Amazon Nova' },
  { color: '#5865F2', name: 'Microsoft Phi' },
  { color: '#054ADA', name: 'IBM Granite' },
  { color: '#FF3621', name: 'Databricks DBRX' },
  { color: '#059669', name: 'TII Falcon' },
  { color: '#F59E0B', name: '01.AI Yi' },
  { color: '#2563EB', name: 'Zhipu GLM' },
  { color: '#E60012', name: 'Baidu Ernie' },
  { color: '#7C3AED', name: 'Reka' },
  { color: '#20808D', name: 'Perplexity Sonar' },
  { color: '#6366F1', name: 'Stability AI' },
  { color: '#000000', name: 'ElevenLabs (voice)' },
  { color: '#10B981', name: 'Whisper (speech)' },
  { color: '#EC4899', name: 'LLaVA (vision)' },
  { color: '#F97316', name: 'Nous Hermes' },
  { color: '#0EA5E9', name: 'Together AI' },
  { color: '#EF4444', name: 'Fireworks AI' },
  { color: '#29B5E8', name: 'Snowflake Arctic' },
  { color: '#F55036', name: 'Groq-hosted models' },
  { color: '#2C8C8A', name: 'Local / on-premise models' },
];

const enterpriseSystems = [
  { color: '#EA4335', name: 'Microsoft 365' },
  { color: '#00A1E0', name: 'Salesforce' },
  { color: '#0FAAFF', name: 'SAP' },
  { color: '#F80000', name: 'Oracle' },
  { color: '#0078D4', name: 'Workday' },
  { color: '#171717', name: 'NetSuite' },
  { color: '#0052CC', name: 'Jira' },
  { color: '#4A154B', name: 'Slack' },
  { color: '#2CA01C', name: 'Xero' },
  { color: '#714B67', name: 'Odoo' },
  { color: '#2CA01C', name: 'QuickBooks' },
  { color: '#C8202F', name: 'Zoho' },
  { color: '#FF7A59', name: 'HubSpot' },
  { color: '#00DC00', name: 'Sage' },
  { color: '#4285F4', name: 'Google Workspace' },
  { color: '#F06A6A', name: 'Asana' },
  { color: '#FF3D57', name: 'Monday.com' },
  { color: '#0079BF', name: 'Trello' },
  { color: '#62D84E', name: 'ServiceNow' },
  { color: '#03363D', name: 'Zendesk' },
  { color: '#3EB86E', name: 'Freshworks' },
  { color: '#73C41D', name: 'BambooHR' },
  { color: '#D0271D', name: 'ADP' },
  { color: '#7B68EE', name: 'ClickUp' },
  { color: '#2684FF', name: 'Confluence' },
  { color: '#038387', name: 'SharePoint' },
  { color: '#F2C811', name: 'Power BI' },
  { color: '#E97627', name: 'Tableau' },
  { color: '#FFCC22', name: 'DocuSign' },
  { color: '#000000', name: 'Notion' },
];

const channels = [
  { color: '#25D366', name: 'WhatsApp Business' },
  { color: '#5B6472', name: 'SMS / text messages' },
  { color: '#1D5FD4', name: 'Phone calls' },
  { color: '#2A7DE1', name: 'Call recordings' },
  { color: '#2C8C8A', name: 'Call transcripts' },
  { color: '#267A76', name: 'Voice notes' },
  { color: '#2A7DE1', name: 'Video (internal & external)' },
  { color: '#26A5E4', name: 'Telegram' },
  { color: '#0084FF', name: 'Facebook Messenger' },
  { color: '#3A76F0', name: 'Signal' },
  { color: '#F59E0B', name: 'USSD sessions' },
  { color: '#FFC300', name: 'Mobile money logs (MoMo)' },
  { color: '#8B5CF6', name: 'Scanned documents & photos' },
  { color: '#059669', name: 'Field agent reports' },
  { color: '#6366F1', name: 'Databases' },
  { color: '#5B6472', name: 'Scraped & API sources' },
  { color: '#DC2626', name: 'Point-of-sale data' },
  { color: '#374151', name: 'Faxes' },
];

function doubled<T>(arr: T[]): T[] { return [...arr, ...arr]; }

export default function Integrations() {

  return (
    <section className="integrations" style={{background:'var(--white)'}}>
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">Works with what you already run</div>
          <h2 style={{fontSize:'30px'}}>Works with the systems you already use.</h2>
        </div>

        <div className="int-group reveal">
          <div className="int-group-label">Intelligence engine <span style={{fontWeight:400, textTransform:'none', letterSpacing:'normal', color:'var(--grey)'}}>136+ models supported</span></div>
          <div className="int-marquee">
            <div className="int-marquee-track">
              {doubled(aiModels).map((m, i) => (
                <div key={i} className="int-pill"><span className="dot" style={{background:m.color}}></span>{m.name}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="int-group reveal">
          <div className="int-group-label">Enterprise systems <span style={{fontWeight:400, textTransform:'none', letterSpacing:'normal', color:'var(--grey)'}}>30+ platforms, including your own (Odoo)</span></div>
          <div className="int-marquee reverse">
            <div className="int-marquee-track" style={{animationDuration:'52s'}}>
              {doubled(enterpriseSystems).map((m, i) => (
                <div key={i} className="int-pill"><span className="dot" style={{background:m.color}}></span>{m.name}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="int-group reveal">
          <div className="int-group-label">Everyday &amp; regional channels <span style={{fontWeight:400, textTransform:'none', letterSpacing:'normal', color:'var(--grey)'}}>18 channel types, built for how business actually happens on the ground</span></div>
          <div className="int-marquee">
            <div className="int-marquee-track" style={{animationDuration:'36s'}}>
              {doubled(channels).map((m, i) => (
                <div key={i} className="int-pill"><span className="dot" style={{background:m.color}}></span>{m.name}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
