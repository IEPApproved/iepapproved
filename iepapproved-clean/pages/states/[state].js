// pages/states/[state].js — IEP Approved
// Dynamic state page — Unlimited members only

import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { createClient } from '../../lib/supabase';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'complaint', label: 'File a Complaint' },
  { id: 'pti', label: 'PTI Centers' },
  { id: 'advocacy', label: 'Advocacy Orgs' },
  { id: 'laws', label: 'State Laws' },
  { id: 'ada', label: 'Ask Ada' },
];

const STATE_NAMES = {
  al: 'Alabama', ak: 'Alaska', az: 'Arizona', ar: 'Arkansas', ca: 'California',
  co: 'Colorado', ct: 'Connecticut', de: 'Delaware', fl: 'Florida', ga: 'Georgia',
  hi: 'Hawaii', id: 'Idaho', il: 'Illinois', in: 'Indiana', ia: 'Iowa',
  ks: 'Kansas', ky: 'Kentucky', la: 'Louisiana', me: 'Maine', md: 'Maryland',
  ma: 'Massachusetts', mi: 'Michigan', mn: 'Minnesota', ms: 'Mississippi', mo: 'Missouri',
  mt: 'Montana', ne: 'Nebraska', nv: 'Nevada', nh: 'New Hampshire', nj: 'New Jersey',
  nm: 'New Mexico', ny: 'New York', nc: 'North Carolina', nd: 'North Dakota', oh: 'Ohio',
  ok: 'Oklahoma', or: 'Oregon', pa: 'Pennsylvania', ri: 'Rhode Island', sc: 'South Carolina',
  sd: 'South Dakota', tn: 'Tennessee', tx: 'Texas', ut: 'Utah', vt: 'Vermont',
  va: 'Virginia', wa: 'Washington', wv: 'West Virginia', wi: 'Wisconsin', wy: 'Wyoming',
};

export default function StatePage() {
  const router = useRouter();
  const { state: stateParam } = router.query;
  const { user, profile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stateData, setStateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adaInput, setAdaInput] = useState('');
  const [adaMessages, setAdaMessages] = useState([]);
  const [adaThinking, setAdaThinking] = useState(false);

  const isUnlimited = profile?.tier === 'unlimited';
  const stateCode = stateParam ? stateParam.toUpperCase() : '';
  const stateName = stateParam ? (STATE_NAMES[stateParam.toLowerCase()] || stateCode) : '';

  useEffect(() => {
    if (!stateParam || authLoading) return;
    if (!user || !isUnlimited) {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    supabase
      .from('state_content')
      .select('*')
      .ilike('state_code', stateCode)
      .single()
      .then(({ data }) => {
        if (data) setStateData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [stateParam, authLoading, user, isUnlimited]);

  const askAda = async () => {
    if (!adaInput.trim() || adaThinking) return;
    const question = adaInput.trim();
    setAdaInput('');
    const newMessages = [...adaMessages, { role: 'user', content: question }];
    setAdaMessages(newMessages);
    setAdaThinking(true);
    try {
      const res = await fetch('/api/ada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, lang: 'en' }),
      });
      const data = await res.json();
      const reply = data.message || 'I had trouble with that. Please try again.';
      setAdaMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setAdaMessages(prev => [...prev, { role: 'assistant', content: 'I had trouble with that. Please try again.' }]);
    }
    setAdaThinking(false);
  };

  if (!authLoading && (!user || !isUnlimited)) {
    return (
      <>
        <Head>
          <title>{stateName} IEP Resources — IEP Approved</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Nav />
        <section style={s.gateSection}>
          <div style={s.gateInner}>
            <div style={s.gateCode}>{stateCode}</div>
            <h1 style={s.gateTitle}>{stateName} IEP Resources</h1>
            <p style={s.gateSub}>
              State-specific complaint procedures, PTI centers, advocacy organizations,
              and laws beyond federal IDEA — available to Ada Unlimited members.
            </p>
            <Link href="/signup" style={s.gateBtn}>
              Get Ada Unlimited — $4.99/month
            </Link>
            <p style={s.gateFine}>Unlimited Ada questions + all 50 state pages. Cancel anytime.</p>
            <div style={s.gateFeatures}>
              <div style={s.gateFeature}><span style={s.gateCheck}>✓</span><span>State complaint procedures and timelines</span></div>
              <div style={s.gateFeature}><span style={s.gateCheck}>✓</span><span>Your federally-funded PTI center</span></div>
              <div style={s.gateFeature}><span style={s.gateCheck}>✓</span><span>State laws exceeding federal IDEA</span></div>
              <div style={s.gateFeature}><span style={s.gateCheck}>✓</span><span>Local advocacy organizations</span></div>
              <div style={s.gateFeature}><span style={s.gateCheck}>✓</span><span>Unlimited Ada questions about your state</span></div>
            </div>
            <Link href="/states" style={s.gateBack}>← Back to all states</Link>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  if (loading || authLoading) {
    return (
      <>
        <Nav />
        <div style={s.loadingWrap}>
          <p style={s.loadingText}>Loading {stateName} resources...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{stateName} IEP Resources — IEP Approved</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Nav />

      <section style={s.stateHeader}>
        <div style={s.stateHeaderInner}>
          <Link href="/states" style={s.backLink}>← All States</Link>
          <div style={s.stateHeaderRow}>
            <div style={s.stateCodeBig}>{stateCode}</div>
            <div>
              <h1 style={s.stateNameBig}>{stateName}</h1>
              <div style={s.unlimitedBadge}>Ada Unlimited — State Resources Unlocked</div>
            </div>
          </div>
        </div>
      </section>

      <div style={s.tabBar}>
        <div style={s.tabBarInner}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={activeTab === tab.id ? { ...s.tab, ...s.tabActive } : s.tab}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <section style={s.contentSection}>
        <div style={s.contentInner}>

          {activeTab === 'overview' && (
            <div style={s.tabContent}>
              <h2 style={s.tabTitle}>IEP Resources in {stateName}</h2>
              {stateData ? (
                <div>
                  <div style={s.overviewGrid}>
                    <div style={s.overviewCard}>
                      <h3 style={s.overviewCardTitle}>Complaint Agency</h3>
                      <p style={s.overviewCardText}>
                        {stateData.complaint_agency || 'Contact your State Department of Education'}
                      </p>
                      {stateData.complaint_agency_phone && (
                        <p style={s.overviewCardDetail}>{stateData.complaint_agency_phone}</p>
                      )}
                      <button onClick={() => setActiveTab('complaint')} style={s.overviewCardLink}>
                        View complaint procedures
                      </button>
                    </div>
                    <div style={s.overviewCard}>
                      <h3 style={s.overviewCardTitle}>PTI Centers</h3>
                      <p style={s.overviewCardText}>
                        {stateData.pti_centers && stateData.pti_centers.length > 0
                          ? stateData.pti_centers.length + ' federally-funded center(s) serving ' + stateName + ' families.'
                          : 'Contact PACER Center (pacer.org) for national support.'}
                      </p>
                      <button onClick={() => setActiveTab('pti')} style={s.overviewCardLink}>
                        Find your PTI center
                      </button>
                    </div>
                    <div style={s.overviewCard}>
                      <h3 style={s.overviewCardTitle}>State Law</h3>
                      <p style={s.overviewCardText}>
                        {stateData.state_laws_exceeding_federal
                          ? stateName + ' has additional protections beyond federal IDEA.'
                          : stateName + ' follows federal IDEA requirements.'}
                      </p>
                      <button onClick={() => setActiveTab('laws')} style={s.overviewCardLink}>
                        View state laws
                      </button>
                    </div>
                    <div style={s.overviewCard}>
                      <h3 style={s.overviewCardTitle}>Ask Ada</h3>
                      <p style={s.overviewCardText}>
                        Ask Ada a {stateName}-specific question about your child's IEP rights.
                      </p>
                      <button onClick={() => setActiveTab('ada')} style={s.overviewCardLink}>
                        Ask Ada about {stateName}
                      </button>
                    </div>
                  </div>
                  {stateData.additional_context && (
                    <div style={s.additionalContext}>
                      <h3 style={s.additionalContextTitle}>Important Notes for {stateName} Families</h3>
                      <p style={s.additionalContextText}>{stateData.additional_context}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div style={s.noData}>
                  <p style={s.noDataText}>
                    We are actively building out {stateName} state content. Ask Ada and she will
                    apply federal IDEA, ADA, and Section 504 to your situation.
                  </p>
                  <button onClick={() => setActiveTab('ada')} style={s.noDataBtn}>
                    Ask Ada about {stateName}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'complaint' && (
            <div style={s.tabContent}>
              <h2 style={s.tabTitle}>Filing a State Complaint in {stateName}</h2>
              {stateData && stateData.complaint_procedures ? (
                <div>
                  <div style={s.contentCard}>
                    <h3 style={s.contentCardTitle}>How to File</h3>
                    <p style={s.contentCardText}>{stateData.complaint_procedures}</p>
                  </div>
                  {stateData.complaint_timeline_days && (
                    <div style={s.timelineBadge}>
                      <span style={s.timelineNum}>{stateData.complaint_timeline_days}</span>
                      <span style={s.timelineLabel}>days for a written decision</span>
                    </div>
                  )}
                  {stateData.complaint_agency && (
                    <div style={s.agencyCard}>
                      <h3 style={s.agencyTitle}>Contact Agency</h3>
                      <p style={s.agencyName}>{stateData.complaint_agency}</p>
                      {stateData.complaint_agency_phone && (
                        <p style={s.agencyDetail}>{stateData.complaint_agency_phone}</p>
                      )}
                      {stateData.complaint_agency_url && (
                        <a
                          href={stateData.complaint_agency_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={s.agencyLink}
                        >
                          Visit Website
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div style={s.noData}>
                  <p style={s.noDataText}>
                    State complaint content for {stateName} is being added. Under federal IDEA you
                    have the right to file a complaint for any IDEA violation within the past year.
                  </p>
                  <button onClick={() => setActiveTab('ada')} style={s.noDataBtn}>
                    Ask Ada about filing a complaint
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'pti' && (
            <div style={s.tabContent}>
              <h2 style={s.tabTitle}>Parent Training and Information Centers in {stateName}</h2>
              <p style={s.tabIntro}>
                PTI centers are federally funded under IDEA to provide free training, resources,
                and individual support to families of children with disabilities.
              </p>
              {stateData && stateData.pti_centers && stateData.pti_centers.length > 0 ? (
                <div style={s.orgGrid}>
                  {stateData.pti_centers.map((pti, i) => (
                    <div key={i} style={s.orgCard}>
                      <div style={s.orgTypeBadge}>PTI Center</div>
                      <h3 style={s.orgName}>{pti.name}</h3>
                      {pti.region && <p style={s.orgRegion}>{pti.region}</p>}
                      {pti.description && <p style={s.orgDesc}>{pti.description}</p>}
                      <div style={s.orgLinks}>
                        {pti.phone && (
                          <a href={'tel:' + pti.phone} style={s.orgLink}>{pti.phone}</a>
                        )}
                        {pti.website && (
                          <a href={pti.website} target="_blank" rel="noopener noreferrer" style={s.orgLink}>
                            Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={s.noData}>
                  <p style={s.noDataText}>
                    PTI center data for {stateName} is being added. PACER Center (pacer.org,
                    952-838-9000) provides national support to all families.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'advocacy' && (
            <div style={s.tabContent}>
              <h2 style={s.tabTitle}>Advocacy Organizations in {stateName}</h2>
              <p style={s.tabIntro}>
                Local and statewide organizations that support families with children with disabilities.
              </p>
              {stateData && stateData.advocacy_orgs && stateData.advocacy_orgs.length > 0 ? (
                <div style={s.orgGrid}>
                  {stateData.advocacy_orgs.map((org, i) => (
                    <div key={i} style={s.orgCard}>
                      <div style={s.orgTypeBadge}>Advocacy</div>
                      <h3 style={s.orgName}>{org.name}</h3>
                      {org.description && <p style={s.orgDesc}>{org.description}</p>}
                      <div style={s.orgLinks}>
                        {org.contact && <span style={s.orgLinkText}>{org.contact}</span>}
                        {org.website && (
                          <a href={org.website} target="_blank" rel="noopener noreferrer" style={s.orgLink}>
                            Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={s.noData}>
                  <p style={s.noDataText}>
                    Advocacy data for {stateName} is being added. Ask Ada to help find resources
                    for your child's diagnosis and location.
                  </p>
                  <button onClick={() => setActiveTab('ada')} style={s.noDataBtn}>
                    Ask Ada to help find resources
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'laws' && (
            <div style={s.tabContent}>
              <h2 style={s.tabTitle}>{stateName} Laws and Protections</h2>
              <div style={s.contentCard}>
                <h3 style={s.contentCardTitle}>Federal Floor</h3>
                <p style={s.contentCardText}>
                  Under IDEA, every state must meet federal minimum requirements for special
                  education. These apply to your child regardless of which state you live in.
                </p>
              </div>
              {stateData && stateData.state_laws_exceeding_federal ? (
                <div style={s.contentCard}>
                  <h3 style={s.contentCardTitle}>{stateName} — Additional Protections</h3>
                  <p style={s.contentCardText}>{stateData.state_laws_exceeding_federal}</p>
                </div>
              ) : (
                <div style={s.noData}>
                  <p style={s.noDataText}>
                    State law detail for {stateName} is being added. Ask Ada about specific
                    {' '}{stateName} protections.
                  </p>
                  <button onClick={() => setActiveTab('ada')} style={s.noDataBtn}>
                    Ask Ada about {stateName} law
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ada' && (
            <div style={s.tabContent}>
              <h2 style={s.tabTitle}>Ask Ada About {stateName}</h2>
              <p style={s.tabIntro}>
                Ada knows {stateName} IEP laws. Ask her anything about your child's rights in {stateName}.
              </p>
              <div style={s.adaChat}>
                {adaMessages.length === 0 && (
                  <div style={s.adaStarters}>
                    <p style={s.adaStartersLabel}>Suggested questions for {stateName}:</p>
                    <div style={s.adaStarterBtns}>
                      <button onClick={() => setAdaInput('How do I file a complaint in ' + stateName + '?')} style={s.starterBtn}>
                        How do I file a complaint in {stateName}?
                      </button>
                      <button onClick={() => setAdaInput('What are my rights under ' + stateName + ' IEP laws?')} style={s.starterBtn}>
                        What are my rights under {stateName} IEP laws?
                      </button>
                      <button onClick={() => setAdaInput('Who is my PTI center in ' + stateName + '?')} style={s.starterBtn}>
                        Who is my PTI center in {stateName}?
                      </button>
                      <button onClick={() => setAdaInput('Does ' + stateName + ' have protections beyond federal IDEA?')} style={s.starterBtn}>
                        Does {stateName} have protections beyond federal IDEA?
                      </button>
                    </div>
                  </div>
                )}
                <div style={s.adaMessages}>
                  {adaMessages.map((msg, i) => (
                    <div key={i} style={msg.role === 'user' ? s.userBubble : s.adaBubble}>
                      {msg.role === 'assistant' && <span style={s.adaLabel}>Ada</span>}
                      <p style={s.msgText}>{msg.content}</p>
                    </div>
                  ))}
                  {adaThinking && (
                    <div style={s.adaBubble}>
                      <span style={s.adaLabel}>Ada</span>
                      <p style={s.msgText}>Searching...</p>
                    </div>
                  )}
                </div>
                <div style={s.adaInputRow}>
                  <textarea
                    value={adaInput}
                    onChange={e => setAdaInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        askAda();
                      }
                    }}
                    placeholder={'Ask Ada about ' + stateName + '...'}
                    style={s.adaTextarea}
                    rows={2}
                    disabled={adaThinking}
                  />
                  <button
                    onClick={askAda}
                    disabled={adaThinking || !adaInput.trim()}
                    style={s.adaSendBtn}
                  >
                    Send
                  </button>
                </div>
                <p style={s.adaDisclaimer}>
                  Ada provides legal information, not legal advice. For complex disputes,
                  consult a special education attorney.
                </p>
              </div>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </>
  );
}

const s = {
  gateSection: { backgroundColor: '#0f0a1a', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '80px 0' },
  gateInner: { maxWidth: '560px', margin: '0 auto', padding: '0 24px', textAlign: 'center' },
  gateCode: { color: '#D4A843', fontSize: '72px', fontFamily: 'Cormorant Garamond,serif', fontWeight: '700', lineHeight: 1, marginBottom: '8px' },
  gateTitle: { color: '#ffffff', fontSize: '32px', fontFamily: 'Cormorant Garamond,serif', fontWeight: '700', margin: '0 0 16px' },
  gateSub: { color: '#b8a8d0', fontSize: '16px', lineHeight: '1.7', fontFamily: 'Outfit,sans-serif', margin: '0 0 28px' },
  gateBtn: { display: 'inline-block', backgroundColor: '#D4A843', color: '#2D1B4E', padding: '14px 32px', borderRadius: '8px', fontSize: '16px', fontWeight: '800', fontFamily: 'Outfit,sans-serif' },
  gateFine: { color: 'rgba(184,168,208,0.5)', fontSize: '12px', fontFamily: 'Outfit,sans-serif', margin: '12px 0 28px' },
  gateFeatures: { display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left', marginBottom: '28px' },
  gateFeature: { display: 'flex', gap: '10px', alignItems: 'flex-start', color: '#b8a8d0', fontSize: '14px', fontFamily: 'Outfit,sans-serif' },
  gateCheck: { color: '#D4A843', fontWeight: '700', flexShrink: 0 },
  gateBack: { color: 'rgba(184,168,208,0.5)', fontSize: '13px', fontFamily: 'Outfit,sans-serif' },
  loadingWrap: { backgroundColor: '#0f0a1a', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#b8a8d0', fontSize: '14px', fontFamily: 'Outfit,sans-serif' },
  stateHeader: { backgroundColor: '#2D1B4E', padding: '40px 0 32px' },
  stateHeaderInner: { maxWidth: '1100px', margin: '0 auto', padding: '0 24px' },
  backLink: { color: 'rgba(184,168,208,0.6)', fontSize: '13px', fontFamily: 'Outfit,sans-serif', marginBottom: '16px', display: 'block', textDecoration: 'none' },
  stateHeaderRow: { display: 'flex', alignItems: 'center', gap: '24px' },
  stateCodeBig: { color: '#D4A843', fontSize: '64px', fontFamily: 'Cormorant Garamond,serif', fontWeight: '700', lineHeight: 1, flexShrink: 0 },
  stateNameBig: { color: '#ffffff', fontSize: '36px', fontFamily: 'Cormorant Garamond,serif', fontWeight: '700', margin: '0 0 8px' },
  unlimitedBadge: { display: 'inline-block', backgroundColor: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.4)', color: '#D4A843', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', fontFamily: 'Outfit,sans-serif' },
  tabBar: { backgroundColor: '#1a0f2e', borderBottom: '2px solid rgba(212,168,67,0.2)', position: 'sticky', top: '60px', zIndex: 50 },
  tabBarInner: { maxWidth: '1100px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '4px', overflowX: 'auto' },
  tab: { padding: '14px 18px', background: 'none', border: 'none', borderBottom: '2px solid transparent', marginBottom: '-2px', color: '#b8a8d0', fontSize: '14px', fontFamily: 'Outfit,sans-serif', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' },
  tabActive: { color: '#D4A843', borderBottomColor: '#D4A843' },
  contentSection: { backgroundColor: '#0f0a1a', minHeight: '60vh', padding: '48px 0' },
  contentInner: { maxWidth: '1100px', margin: '0 auto', padding: '0 24px' },
  tabContent: { display: 'flex', flexDirection: 'column', gap: '24px' },
  tabTitle: { color: '#ffffff', fontSize: '28px', fontFamily: 'Cormorant Garamond,serif', fontWeight: '700', margin: 0 },
  tabIntro: { color: '#b8a8d0', fontSize: '15px', lineHeight: '1.7', fontFamily: 'Outfit,sans-serif', margin: 0, maxWidth: '680px' },
  overviewGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '16px' },
  overviewCard: { backgroundColor: '#1a0f2e', border: '1px solid rgba(212,168,67,0.2)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' },
  overviewCardTitle: { color: '#D4A843', fontSize: '14px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', margin: 0 },
  overviewCardText: { color: '#b8a8d0', fontSize: '13px', lineHeight: '1.6', fontFamily: 'Outfit,sans-serif', margin: 0, flex: 1 },
  overviewCardDetail: { color: 'rgba(184,168,208,0.6)', fontSize: '12px', fontFamily: 'Outfit,sans-serif', margin: 0 },
  overviewCardLink: { background: 'none', border: 'none', color: '#D4A843', fontSize: '13px', fontFamily: 'Outfit,sans-serif', fontWeight: '700', cursor: 'pointer', padding: 0, textAlign: 'left' },
  additionalContext: { backgroundColor: '#1a0f2e', border: '1px solid rgba(212,168,67,0.15)', borderRadius: '12px', padding: '24px', marginTop: '8px' },
  additionalContextTitle: { color: '#D4A843', fontSize: '15px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', margin: '0 0 10px' },
  additionalContextText: { color: '#b8a8d0', fontSize: '14px', lineHeight: '1.7', fontFamily: 'Outfit,sans-serif', margin: 0 },
  contentCard: { backgroundColor: '#1a0f2e', border: '1px solid rgba(212,168,67,0.2)', borderRadius: '12px', padding: '24px' },
  contentCardTitle: { color: '#D4A843', fontSize: '15px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', margin: '0 0 10px' },
  contentCardText: { color: '#b8a8d0', fontSize: '14px', lineHeight: '1.7', fontFamily: 'Outfit,sans-serif', margin: 0 },
  timelineBadge: { display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)', borderRadius: '12px', padding: '16px 24px' },
  timelineNum: { color: '#D4A843', fontSize: '36px', fontFamily: 'Cormorant Garamond,serif', fontWeight: '700' },
  timelineLabel: { color: '#e8e0f0', fontSize: '14px', fontFamily: 'Outfit,sans-serif' },
  agencyCard: { backgroundColor: '#1a0f2e', border: '1px solid rgba(212,168,67,0.2)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' },
  agencyTitle: { color: '#D4A843', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', fontFamily: 'Outfit,sans-serif', margin: 0 },
  agencyName: { color: '#e8e0f0', fontSize: '15px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', margin: 0 },
  agencyDetail: { color: '#b8a8d0', fontSize: '14px', fontFamily: 'Outfit,sans-serif', margin: 0 },
  agencyLink: { color: '#D4A843', fontSize: '14px', fontFamily: 'Outfit,sans-serif', fontWeight: '700', textDecoration: 'none' },
  orgGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '16px' },
  orgCard: { backgroundColor: '#1a0f2e', border: '1px solid rgba(212,168,67,0.2)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' },
  orgTypeBadge: { display: 'inline-block', backgroundColor: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)', color: '#D4A843', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', alignSelf: 'flex-start' },
  orgName: { color: '#e8e0f0', fontSize: '15px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', margin: 0 },
  orgRegion: { color: 'rgba(184,168,208,0.6)', fontSize: '12px', fontFamily: 'Outfit,sans-serif', margin: 0 },
  orgDesc: { color: '#b8a8d0', fontSize: '13px', lineHeight: '1.6', fontFamily: 'Outfit,sans-serif', margin: 0, flex: 1 },
  orgLinks: { display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' },
  orgLink: { color: '#D4A843', fontSize: '13px', fontFamily: 'Outfit,sans-serif', fontWeight: '700', textDecoration: 'none' },
  orgLinkText: { color: '#b8a8d0', fontSize: '13px', fontFamily: 'Outfit,sans-serif' },
  noData: { backgroundColor: '#1a0f2e', border: '1px solid rgba(212,168,67,0.15)', borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' },
  noDataText: { color: '#b8a8d0', fontSize: '15px', lineHeight: '1.7', fontFamily: 'Outfit,sans-serif', margin: 0 },
  noDataBtn: { backgroundColor: '#D4A843', color: '#2D1B4E', border: 'none', borderRadius: '8px', padding: '11px 20px', fontSize: '14px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', cursor: 'pointer' },
  adaChat: { display: 'flex', flexDirection: 'column', gap: '16px' },
  adaStarters: { backgroundColor: '#1a0f2e', border: '1px solid rgba(212,168,67,0.15)', borderRadius: '12px', padding: '20px' },
  adaStartersLabel: { color: '#b8a8d0', fontSize: '13px', fontFamily: 'Outfit,sans-serif', margin: '0 0 12px' },
  adaStarterBtns: { display: 'flex', flexDirection: 'column', gap: '8px' },
  starterBtn: { background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)', borderRadius: '8px', color: '#e8e0f0', fontSize: '14px', fontFamily: 'Outfit,sans-serif', padding: '10px 14px', cursor: 'pointer', textAlign: 'left' },
  adaMessages: { display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '60px' },
  adaBubble: { backgroundColor: '#1a0f2e', border: '1px solid rgba(212,168,67,0.2)', borderRadius: '12px 12px 12px 4px', padding: '12px 16px', maxWidth: '85%', alignSelf: 'flex-start' },
  userBubble: { backgroundColor: '#2D1B4E', border: '1px solid rgba(212,168,67,0.3)', borderRadius: '12px 12px 4px 12px', padding: '12px 16px', maxWidth: '75%', alignSelf: 'flex-end' },
  adaLabel: { color: '#D4A843', fontSize: '10px', fontWeight: '700', letterSpacing: '1px', display: 'block', marginBottom: '5px', fontFamily: 'Outfit,sans-serif' },
  msgText: { color: '#e8e0f0', fontSize: '15px', lineHeight: '1.6', margin: 0, fontFamily: 'Outfit,sans-serif', whiteSpace: 'pre-wrap' },
  adaInputRow: { display: 'flex', gap: '10px', alignItems: 'flex-end' },
  adaTextarea: { flex: 1, backgroundColor: '#1a0f2e', border: '1px solid rgba(212,168,67,0.3)', borderRadius: '8px', color: '#e8e0f0', fontSize: '15px', fontFamily: 'Outfit,sans-serif', padding: '10px 12px', resize: 'none', outline: 'none', lineHeight: '1.5' },
  adaSendBtn: { backgroundColor: '#D4A843', color: '#2D1B4E', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', cursor: 'pointer', whiteSpace: 'nowrap', alignSelf: 'flex-end' },
  adaDisclaimer: { color: 'rgba(184,168,208,0.5)', fontSize: '11px', fontFamily: 'Outfit,sans-serif', margin: 0 },
};
