import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Download,
  CheckCircle2,
  Building2,
  Phone,
  Clock,
  ArrowLeft,
  Sparkles,
  Send,
  ExternalLink,
  ShieldAlert,
  Info,
  CheckSquare,
  Square,
  HelpCircle
} from 'lucide-react';
import { useAlign } from '../context/AlignContext';

export default function ApplicationGuidancePage() {
  const navigate = useNavigate();
  const {
    userRequirement,
    selectedScheme,
    selectedPartner,
    calculatorState,
  } = useAlign();

  // Fallback defaults if accessed directly
  const scheme = selectedScheme || {
    _id: 'SCHEME-NSFDC-MF-01',
    name: 'NSFDC Micro Finance Scheme',
    shortName: 'Micro Finance Scheme',
    interestRate: 6.5,
    maxLoanAmount: 125000,
    maxTenureMonths: 36,
    moratoriumMonths: 3,
    documents: [
      { id: 'DOC-ID-01', name: 'Identity & Address Proof (Aadhaar / Voter ID)', issuingAuthority: 'UIDAI / Election Commission', isMandatory: true, description: 'Address confirmation' },
      { id: 'DOC-INC-02', name: 'Family Income Certificate (<= ₹5,00,000)', issuingAuthority: 'SDO / BDO / Revenue Officer', isMandatory: true, description: 'Statutory family income certificate' },
      { id: 'DOC-CST-03', name: 'Community / Caste Certificate', issuingAuthority: 'District Welfare Officer', isMandatory: true, description: 'Eligibility verification' },
      { id: 'DOC-PRJ-04', name: 'Equipment Quotation (Sewing Machines Bill)', issuingAuthority: 'Registered Vendor', isMandatory: true, description: 'Machinery quotation' },
      { id: 'DOC-BNK-05', name: 'Bank Passbook Copy with IFSC', issuingAuthority: 'Any Bank Branch', isMandatory: true, description: 'Bank account verification' }
    ],
    applicationProcess: [
      { stepNumber: 1, title: 'Dossier Assembly', description: 'Collect statutory income certificate and machine quotation.', estimatedTimeline: '3-5 days' },
      { stepNumber: 2, title: 'Branch Desk Submission', description: 'Submit physical dossier at WBSCSTDFCL Bikash Bhavan desk.', estimatedTimeline: '1 day' },
      { stepNumber: 3, title: 'Field Scrutiny & Appraisal', description: 'Officer conducts physical premises inspection.', estimatedTimeline: '7-10 working days' },
      { stepNumber: 4, title: 'Sanction & Vendor Disbursal', description: 'Direct loan disbursement to equipment vendor.', estimatedTimeline: '5 days' }
    ]
  };

  const partner = selectedPartner || {
    _id: 'PARTNER-KOL-SCA-01',
    name: 'West Bengal SC, ST & OBC Development & Finance Corporation',
    type: 'SCA',
    address: 'Bikash Bhavan, North Block, 5th Floor, DF Block, Sector 1, Bidhannagar, Kolkata 700091',
    contact: {
      phone: '+91 33 2334 1234',
      email: 'contact@wbscstdfcl.gov.in',
      nodalOfficerName: 'Debabrata Sen (District Nodal Officer)'
    }
  };

  // Checklist tracking state
  const [checkedDocs, setCheckedDocs] = useState({});
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  // Scheme-Specific Assistant State
  const [question, setQuestion] = useState('Can I apply without an income certificate?');
  const [isAsking, setIsAsking] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Hello! I am your dedicated guidance assistant for the ${scheme.name}. Ask me about mandatory documents, application procedures, or repayment clauses.`,
      sourceType: 'system_welcome',
    }
  ]);

  const toggleCheck = (docId) => {
    setCheckedDocs((prev) => ({ ...prev, [docId]: !prev[docId] }));
  };

  const handleDownloadPDF = async () => {
    setIsDownloadingPDF(true);
    try {
      const payload = {
        schemeId: scheme._id,
        partnerId: partner._id,
        scheme,
        partner,
        userRequirement: userRequirement || {
          purpose: 'business',
          businessType: 'Tailoring',
          amount: 120000,
          annualFamilyIncome: 300000,
          location: 'Kolkata'
        },
        financialSummary: {
          loanAmount: calculatorState.activeLoanAmount || 120000,
          tenureMonths: calculatorState.activeTenureMonths || 36,
          monthlyEMI: 3678,
          interestRate: scheme.interestRate
        }
      };

      const res = await fetch('/api/pdf/application-checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to generate PDF');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ALIGN-Application-Checklist-${(scheme.shortName || 'Scheme').replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download error:', err);
      alert('Failed to download checklist PDF. Please try again.');
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const handleAskAssistant = async (e, customQ) => {
    e?.preventDefault();
    const query = customQ || question;
    if (!query.trim()) return;

    // Add user message
    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setIsAsking(true);

    try {
      const res = await fetch('/api/assistant/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schemeId: scheme._id,
          partnerId: partner._id,
          question: query.trim()
        })
      });

      const json = await res.json();
      if (json.success) {
        setMessages([
          ...newMessages,
          {
            sender: 'assistant',
            text: json.data.answer,
            sourceType: json.data.sourceType,
            citations: json.data.citations,
            disclaimer: json.data.disclaimer
          }
        ]);
      }
    } catch (err) {
      console.error('Assistant error:', err);
    } finally {
      setIsAsking(false);
      setQuestion('');
    }
  };

  return (
    <div className="w-full flex-1 max-w-[1200px] mx-auto px-4 lg:px-6 py-8 pb-32">
      {/* Target Scheme & Channel Partner Snapshot Bar */}
      <div className="w-full bg-surface-card rounded-2xl border border-border-subtle p-5 shadow-sm mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Target Scheme */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-status-info-bg text-primary flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Target Scheme</span>
              <h3 className="font-display text-base font-bold text-primary">{scheme.name}</h3>
              <p className="text-xs text-text-secondary">
                Rate: <strong className="font-mono text-primary">{scheme.interestRate}% p.a.</strong> • Ceiling: ₹{(scheme.maxLoanAmount / 100000).toFixed(2)}L • {scheme.moratoriumMonths}m Moratorium
              </p>
            </div>
          </div>

          <div className="h-10 w-px bg-border-subtle hidden sm:block"></div>

          {/* Selected Nodal Channel Partner */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-subtle text-accent flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Authorized Nodal Desk</span>
              <h3 className="font-display text-base font-bold text-primary">{partner.name}</h3>
              <p className="text-xs text-text-secondary">
                {partner.address?.split(',')[0]} • Lead: {partner.contact?.nodalOfficerName || 'Nodal Officer'}
              </p>
            </div>
          </div>
        </div>

        {/* Change Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/compare')}
            className="px-3 py-1.5 rounded-lg border border-border-strong text-text-primary hover:bg-surface-subtle text-xs font-semibold transition-colors"
          >
            Change scheme
          </button>
          <button
            type="button"
            onClick={() => navigate('/partners')}
            className="px-3 py-1.5 rounded-lg border border-border-strong text-text-primary hover:bg-surface-subtle text-xs font-semibold transition-colors"
          >
            Change partner
          </button>
        </div>
      </div>

      {/* Main Editorial Header */}
      <div className="max-w-3xl mb-8">
        <span className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-1.5 mb-2">
          <CheckCircle2 className="w-4 h-4 text-secondary" />
          Application Guidance & Statutory Checklist • Step 5 of 5
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
          You're ready for the next step.
        </h1>
        <p className="font-sans text-base text-text-secondary mt-2 leading-relaxed">
          Here is your verified statutory document checklist and the step-by-step physical dispatch process for your selected scheme and authorized nodal desk. ALIGN equips you with clear, audited requirements before you visit the branch.
        </p>
      </div>

      {/* Two Column Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Dossier, Documents & Steps (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Required Documents Checklist */}
          <div className="bg-surface-card rounded-2xl p-6 border border-border-subtle shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-4">
              <div>
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">Statutory Requirements</span>
                <h2 className="font-display text-xl font-bold text-text-primary">
                  Required Documents Checklist
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-status-success-bg text-status-success-text">
                {Object.values(checkedDocs).filter(Boolean).length} of {scheme.documents?.length || 5} Prepared
              </span>
            </div>

            <div className="space-y-3">
              {(scheme.documents || []).map((doc) => {
                const isChecked = !!checkedDocs[doc.id];
                return (
                  <div
                    key={doc.id}
                    onClick={() => toggleCheck(doc.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-status-success-bg/30 border-secondary/40'
                        : 'bg-surface-subtle/70 border-border-subtle hover:bg-surface-subtle'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button type="button" className="mt-0.5 text-primary shrink-0">
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-secondary" />
                        ) : (
                          <Square className="w-5 h-5 text-text-muted" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`text-sm font-bold ${isChecked ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                            {doc.name}
                          </h4>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white text-text-secondary border border-border-subtle">
                            {doc.isMandatory ? 'Mandatory' : 'Supporting'}
                          </span>
                        </div>

                        <p className="text-xs text-text-secondary mt-1">
                          {doc.description}
                        </p>

                        <div className="mt-2 text-[11px] text-text-muted">
                          Issuing Authority: <strong className="text-text-primary">{doc.issuingAuthority}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Application Process */}
          <div className="bg-surface-card rounded-2xl p-6 border border-border-subtle shadow-sm">
            <div className="pb-4 border-b border-border-subtle mb-4">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">Submission Workflow</span>
              <h2 className="font-display text-xl font-bold text-text-primary">
                Official Application Roadmap
              </h2>
            </div>

            <div className="space-y-4">
              {(scheme.applicationProcess || []).map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {step.stepNumber || idx + 1}
                  </div>
                  <div className="flex-1 pb-4 border-b border-border-subtle/60 last:border-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-text-primary">{step.title}</h4>
                      {step.estimatedTimeline && (
                        <span className="text-[11px] font-mono text-text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3 text-secondary" />
                          {step.estimatedTimeline}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                      {step.description}
                    </p>
                    {step.responsibleEntity && (
                      <span className="text-[11px] text-text-muted mt-1 block">
                        Action by: <strong className="text-text-primary">{step.responsibleEntity}</strong>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Institutional Advisory */}
          <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle text-xs text-text-secondary space-y-2">
            <div className="flex items-center gap-2 text-text-primary font-bold">
              <Info className="w-4 h-4 text-primary shrink-0" />
              <span>Institutional Guidance & Branch Discretion Notice</span>
            </div>
            <p>
              Procedures and internal processing timelines may vary slightly across individual district branches. Borrowers are advised to present the printed checklist along with original documents directly to the designated nodal officer.
            </p>
            <p>
              Official scheme circular reference: <a href="https://nsfdc.nic.in" target="_blank" rel="noreferrer" className="text-primary underline font-semibold">nsfdc.nic.in</a>
            </p>
          </div>
        </div>

        {/* Right Column: PDF Download Banner + Grounded AI Assistant (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Dynamic PDF Checklist Download Action Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-white shadow-elevated">
            <div className="flex items-start justify-between gap-2 mb-4">
              <span className="text-[10px] font-bold text-on-primary-container uppercase tracking-wider">
                Personalized Takeaway
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/20 text-white">
                PDF Ready
              </span>
            </div>

            <h3 className="font-display text-2xl font-bold tracking-tight mb-2">
              ALIGN Application Checklist.pdf
            </h3>

            <p className="text-xs text-white/80 leading-relaxed mb-6">
              Dynamically generated with your tailoring enterprise profile, selected WBSCSTDFCL Bikash Bhavan desk, contact telephone, and complete document checklist.
            </p>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isDownloadingPDF}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white hover:bg-surface-subtle text-primary font-bold text-sm transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              {isDownloadingPDF ? (
                <>
                  <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span>
                  <span>Generating Dynamic PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Application Checklist PDF</span>
                </>
              )}
            </button>
          </div>

          {/* Grounded Scheme AI Assistant Drawer */}
          <div className="bg-surface-card rounded-2xl border border-border-subtle shadow-sm p-5 flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-secondary" />
                <h3 className="font-bold text-sm text-text-primary">Scheme-Specific AI Copilot</h3>
              </div>
              <span className="text-[10px] text-text-muted">Grounded RAG</span>
            </div>

            {/* Conversation Log */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 mb-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl text-xs ${
                    m.sender === 'user'
                      ? 'bg-primary text-white ml-6'
                      : 'bg-surface-subtle border border-border-subtle text-text-primary mr-4'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>

                  {m.sourceType && (
                    <div className="mt-2 pt-1.5 border-t border-border-subtle/50 flex flex-wrap items-center justify-between gap-1 text-[10px] text-text-muted">
                      <span className="font-semibold text-secondary">
                        {m.sourceType === 'structured_database_rules'
                          ? '✓ Authoritative Structured DB Rule'
                          : m.sourceType === 'rag_retrieval'
                          ? '✓ Grounded Policy Circular Excerpt'
                          : ''}
                      </span>
                      {m.citations?.[0] && (
                        <a
                          href={m.citations[0].url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline flex items-center gap-0.5"
                        >
                          <span>{m.citations[0].section || 'Circular'}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Demo Question Chips */}
            <div className="space-y-1.5 mb-3">
              <span className="text-[10px] text-text-muted uppercase font-semibold block">Suggested Questions:</span>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={(e) => handleAskAssistant(e, 'Can I apply without an income certificate?')}
                  className="text-left text-xs p-2 rounded-lg bg-surface-subtle hover:bg-surface-container text-text-primary transition-colors truncate"
                >
                  "Can I apply without an income certificate?"
                </button>
                <button
                  type="button"
                  onClick={(e) => handleAskAssistant(e, 'What happens after I submit my application?')}
                  className="text-left text-xs p-2 rounded-lg bg-surface-subtle hover:bg-surface-container text-text-primary transition-colors truncate"
                >
                  "What happens after I submit my application?"
                </button>
                <button
                  type="button"
                  onClick={(e) => handleAskAssistant(e, 'What is the repayment period?')}
                  className="text-left text-xs p-2 rounded-lg bg-surface-subtle hover:bg-surface-container text-text-primary transition-colors truncate"
                >
                  "What is the repayment period?"
                </button>
              </div>
            </div>

            {/* Question Input */}
            <form onSubmit={handleAskAssistant} className="flex items-center gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about this scheme or partner..."
                className="w-full px-3 py-2 rounded-xl bg-surface-subtle border border-border-subtle text-xs text-text-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={isAsking || !question.trim()}
                className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 disabled:opacity-40"
              >
                {isAsking ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
