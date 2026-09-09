import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Edit2,
  RotateCcw,
  Check,
  Scale,
  X,
  HelpCircle,
  Info,
  MapPin,
  Building2,
  DollarSign
} from 'lucide-react';
import { useAlign } from '../context/AlignContext';

export default function SchemeMatchingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    userRequirement,
    setUserRequirement,
    eligibleSchemes,
    setEligibleSchemes,
    selectedSchemeIdsForComparison,
    toggleSchemeComparison,
    setSelectedScheme,
  } = useAlign();

  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: 'What kind of support are you seeking? Describe your enterprise, how much capital you need, and your district in everyday language.'
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [extractedData, setExtractedData] = useState(userRequirement);
  const [isEditingExtracted, setIsEditingExtracted] = useState(false);
  const [matchedResults, setMatchedResults] = useState(eligibleSchemes);
  const [errorMsg, setErrorMsg] = useState('');

  // Interactive Clarification Pop-up Modal State
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [clarificationDetails, setClarificationDetails] = useState(null);
  const [clarificationForm, setClarificationForm] = useState({
    businessType: '',
    amount: '',
    annualFamilyIncome: '',
    location: '',
    category: 'General'
  });

  // When navigated with prefilled prompt from Landing page
  useEffect(() => {
    if (location.state?.prefilledPrompt && messages.length === 1 && !extractedData) {
      handleUserMessage(location.state.prefilledPrompt);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  const handleUserMessage = async (msgContent) => {
    if (!msgContent.trim()) return;

    const newMessages = [...messages, { role: 'user', content: msgContent }];
    setMessages(newMessages);
    setInputValue('');

    setIsAnalyzing(true);
    setHasSearched(false);
    setErrorMsg('');

    try {
      const res = await fetch('/api/analyze-requirement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error?.message || 'Extraction failed');
      }

      if (json.data.isComplete && json.data.extracted) {
        // Complete prompt! Do NOT show pop-up modal. Proceed directly.
        setShowClarificationModal(false);
        const structured = {
          ...json.data.extracted,
          rawPrompt: newMessages.map((m) => m.content).join(' ')
        };
        setExtractedData(structured);
        setUserRequirement(structured);

        // Automatically run deterministic rule engine matching immediately
        await runMatching(structured);
        setHasSearched(true);
      } else {
        // Underspecified prompt detected (e.g. user just said 'business' or omitted amount/location)
        // 1. Add AI clarification question to chat
        setMessages([
          ...newMessages,
          { role: 'ai', content: json.data.nextQuestion || 'Could you provide a few more details about your requirement?' }
        ]);

        // 2. Open the frontend interactive clarification pop-up modal!
        setClarificationDetails(json.data);
        setClarificationForm({
          businessType: json.data.detected?.businessType || (json.data.detected?.purpose === 'business' ? '' : json.data.detected?.purpose) || '',
          amount: json.data.detected?.amount || '',
          annualFamilyIncome: json.data.detected?.annualFamilyIncome !== null && json.data.detected?.annualFamilyIncome !== undefined ? json.data.detected?.annualFamilyIncome : '',
          location: json.data.detected?.location || '',
          category: json.data.detected?.category || 'General'
        });
        setShowClarificationModal(true);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to analyze requirement.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = (e) => {
    e?.preventDefault();
    handleUserMessage(inputValue);
  };

  const handleClarificationSubmit = async (e) => {
    e?.preventDefault();
    if (!clarificationForm.businessType.trim()) {
      setErrorMsg('Please specify what kind of business or vocation you are planning.');
      return;
    }
    if (!clarificationForm.amount || Number(clarificationForm.amount) <= 0) {
      setErrorMsg('Please specify the required funding or loan amount.');
      return;
    }

    const businessTypeClean = clarificationForm.businessType.trim();
    const amountClean = Number(clarificationForm.amount);
    const incomeClean = clarificationForm.annualFamilyIncome !== '' ? Number(clarificationForm.annualFamilyIncome) : 300000;
    const locationClean = clarificationForm.location.trim() || 'Kolkata';
    const categoryClean = clarificationForm.category || 'General';

    // Infer purpose category
    let purpose = 'business';
    const bLower = businessTypeClean.toLowerCase();
    if (bLower.includes('education') || bLower.includes('study') || bLower.includes('degree')) purpose = 'education';
    else if (bLower.includes('dairy') || bLower.includes('cattle') || bLower.includes('cow') || bLower.includes('agriculture')) purpose = 'agriculture';

    const structured = {
      purpose,
      businessType: businessTypeClean,
      amount: amountClean,
      annualFamilyIncome: incomeClean,
      location: locationClean,
      category: categoryClean,
      rawPrompt: `Clarified: ${businessTypeClean}, Loan: ₹${amountClean.toLocaleString('en-IN')}, Household Income: ₹${incomeClean.toLocaleString('en-IN')}, Location: ${locationClean}`
    };

    // Close modal
    setShowClarificationModal(false);
    setErrorMsg('');

    // Append clarified summary in chat
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: `I want to pursue ${businessTypeClean} in ${locationClean}. Required loan: ₹${amountClean.toLocaleString('en-IN')}. Annual family income: ₹${incomeClean.toLocaleString('en-IN')}.`
      },
      {
        role: 'ai',
        content: `Thank you! All essential statutory parameters are confirmed (${businessTypeClean} • ₹${amountClean.toLocaleString('en-IN')} • ${locationClean}). Evaluating verified government schemes deterministically now.`
      }
    ]);

    setExtractedData(structured);
    setUserRequirement(structured);
    await runMatching(structured);
    setHasSearched(true);
  };

  const runMatching = async (reqData) => {
    setIsMatching(true);
    try {
      const res = await fetch('/api/schemes/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqData),
      });

      const json = await res.json();
      if (json.success) {
        setMatchedResults(json.data.rankedSchemes);
        setEligibleSchemes(json.data.rankedSchemes);
      }
    } catch (err) {
      console.error('Matching failed:', err);
    } finally {
      setIsMatching(false);
    }
  };

  const handleSaveExtractedEdits = async () => {
    setIsEditingExtracted(false);
    setUserRequirement(extractedData);
    await runMatching(extractedData);
    setHasSearched(true);
  };

  // Direct Path A: Select scheme directly and go to partner discovery
  const handleSelectDirect = (scheme) => {
    setSelectedScheme(scheme);
    navigate('/partners');
  };

  // Path B: Compare selected schemes
  const handleProceedToCompare = () => {
    navigate('/compare');
  };

  return (
    <div className="w-full flex-1 max-w-[1240px] mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-32">
      {/* Editorial Header */}
      <div className="max-w-3xl mb-6 sm:mb-8">
        <span className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-1.5 mb-2">
          <Sparkles className="w-4 h-4 text-secondary shrink-0" />
          Natural Language Requirement • Step 2 of 5
        </span>
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary tracking-tight">
          What kind of support are you seeking?
        </h1>
        <p className="font-sans text-sm sm:text-base text-text-secondary mt-2 leading-relaxed">
          Describe your business, how much capital you need, and your district in your own words. ALIGN extracts your intent and checks verified government scheme rules deterministically.
        </p>
      </div>

      {/* Input Form Section */}
      <div className="bg-surface-card rounded-2xl border border-border-subtle p-4 sm:p-6 shadow-sm mb-8">
        <form onSubmit={handleAnalyze} className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-text-primary flex items-center justify-between">
            <span>Your Need in Natural Language</span>
            <span className="text-xs font-normal text-text-muted hidden sm:inline">No financial jargon required</span>
          </label>

          {/* Chat History */}
          <div className="flex flex-col gap-3 mb-2 max-h-80 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-border-strong scrollbar-track-transparent">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`p-3.5 rounded-2xl max-w-[90%] sm:max-w-[82%] text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-br-none shadow-sm'
                      : 'bg-surface-subtle text-text-primary rounded-bl-none border border-border-subtle shadow-sm'
                  }`}
                >
                  {msg.role === 'ai' && <Sparkles className="w-4 h-4 inline-block mr-2 text-secondary shrink-0 mb-0.5" />}
                  <span>{msg.content}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <textarea
              rows={2}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAnalyze(e);
                }
              }}
              placeholder="e.g. I want to start a tailoring business in Kolkata needing ₹1.2 lakh... (or enter 'business' to test clarification)"
              className="w-full p-3.5 sm:p-4 pr-12 rounded-xl bg-surface-ivory border border-border-subtle text-text-primary text-sm sm:text-base placeholder:text-text-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none shadow-inner-light"
            />
          </div>

          {/* Quick Prompt Chips */}
          {messages.length === 1 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-semibold text-text-muted mr-1">Faculty Test Scenarios:</span>
              <button
                type="button"
                onClick={() => handleUserMessage('business')}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 transition-all shadow-xs flex items-center gap-1"
                title="Tests prompt clarification pop-up when user enters just 'business'"
              >
                <HelpCircle className="w-3 h-3 text-amber-600" />
                <span>Test Single Word: "business"</span>
              </button>
              <button
                type="button"
                onClick={() => handleUserMessage('I need ₹1.2 lakh to start a tailoring business. My family income is around ₹3 lakh and I live in Kolkata.')}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-surface-ivory hover:bg-surface-subtle border border-border-subtle text-text-secondary transition-all shadow-xs hover:shadow-sm"
              >
                Tailoring Shop (₹1.2L • Complete)
              </button>
              <button
                type="button"
                onClick={() => handleUserMessage('I am an artisan pottery craftsman in Varanasi seeking ₹1.5 lakh loan with family income ₹2 lakh.')}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-surface-ivory hover:bg-surface-subtle border border-border-subtle text-text-secondary transition-all shadow-xs hover:shadow-sm"
              >
                PM Vishwakarma Artisan (₹1.5L)
              </button>
              <button
                type="button"
                onClick={() => handleUserMessage('I want to start a dairy farm with cattle in Barasat')}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-surface-ivory hover:bg-surface-subtle border border-border-subtle text-text-secondary transition-all shadow-xs hover:shadow-sm"
              >
                Dairy Farming (Partial Prompt)
              </button>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-border-subtle">
            <div className="text-xs text-text-muted flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary shrink-0"></span>
              <span>Gemini interprets intent • Code evaluates statutory rules</span>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing || isMatching}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-container disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-sm active:scale-98 min-h-[44px]"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Analyzing Intent...</span>
                </>
              ) : (
                <>
                  <span>Analyze & Find Schemes</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-status-error-bg text-status-error-text text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Visual Analysis Progress State */}
      {(isAnalyzing || isMatching) && (
        <div className="bg-surface-card rounded-2xl border border-border-subtle p-8 shadow-sm mb-8 flex flex-col items-center justify-center text-center animate-fadeIn">
          <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4"></div>
          <h3 className="font-display text-lg font-bold text-text-primary">
            {isAnalyzing ? 'Interpreting Requirement with Gemini AI...' : 'Evaluating 14 Government Scheme Rules...'}
          </h3>
          <p className="text-xs text-text-secondary mt-1.5 max-w-md">
            ALIGN checks verified income caps, concessional interest rates, and vocation categories deterministically with zero math hallucinations.
          </p>
        </div>
      )}

      {/* Extracted Requirements Review Card (Appears only after search) */}
      {hasSearched && extractedData && (
        <div className="bg-surface-card rounded-2xl border border-border-subtle p-5 sm:p-6 shadow-sm mb-8 animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
              <h2 className="font-bold text-base text-text-primary">What ALIGN Understood (Verified Parameters)</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingExtracted(!isEditingExtracted)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditingExtracted ? 'Cancel Editing' : 'Edit Parameters'}</span>
            </button>
          </div>

          {isEditingExtracted ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">Purpose / Trade</label>
                <input
                  type="text"
                  value={extractedData.businessType}
                  onChange={(e) => setExtractedData({ ...extractedData, businessType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border-subtle text-sm font-medium text-text-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">Required Loan (₹)</label>
                <input
                  type="number"
                  value={extractedData.amount}
                  onChange={(e) => setExtractedData({ ...extractedData, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border-subtle text-sm font-medium text-text-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">Annual Family Income (₹)</label>
                <input
                  type="number"
                  value={extractedData.annualFamilyIncome}
                  onChange={(e) => setExtractedData({ ...extractedData, annualFamilyIncome: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border-subtle text-sm font-medium text-text-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">Location / District</label>
                <input
                  type="text"
                  value={extractedData.location}
                  onChange={(e) => setExtractedData({ ...extractedData, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border-subtle text-sm font-medium text-text-primary"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveExtractedEdits}
                  className="px-4 py-2 rounded-lg bg-primary text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Update & Re-evaluate</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 text-sm">
              <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle/70">
                <span className="text-xs text-text-muted block">Enterprise Purpose</span>
                <span className="font-bold text-text-primary capitalize">{extractedData.businessType || extractedData.purpose}</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle/70">
                <span className="text-xs text-text-muted block">Required Loan</span>
                <span className="font-bold text-primary font-mono text-base">₹{Number(extractedData.amount).toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle/70">
                <span className="text-xs text-text-muted block">Annual Family Income</span>
                <span className="font-bold text-text-primary font-mono">₹{Number(extractedData.annualFamilyIncome).toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle/70">
                <span className="text-xs text-text-muted block">Applicant District</span>
                <span className="font-bold text-text-primary">{extractedData.location}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Eligible Schemes Results Header (Appears only after search) */}
      {hasSearched && matchedResults && matchedResults.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 animate-fadeIn">
          <div>
            <h2 className="font-display text-2xl font-bold text-text-primary flex items-center gap-2">
              <span>Recommended Schemes</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-status-success-bg text-status-success-text border border-secondary/20">
                {matchedResults.length} Qualified Options
              </span>
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              Ranked deterministically based on concessional rates, statutory limits, and vocation alignment.
            </p>
          </div>

          <span className="text-xs text-text-muted">
            Select 2 or 3 schemes to compare side-by-side
          </span>
        </div>
      )}

      {/* Schemes List (Appears only after search) */}
      {hasSearched && matchedResults && matchedResults.length > 0 && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {matchedResults.map((item) => {
            const scheme = item.scheme;
            const isSelectedForCompare = selectedSchemeIdsForComparison.includes(scheme._id);

            return (
              <div
                key={scheme._id}
                className={`p-5 sm:p-6 rounded-2xl bg-surface-card border transition-all duration-200 shadow-sm ${
                  item.isTopRecommendation
                    ? 'border-secondary/40 ring-1 ring-secondary/20'
                    : 'border-border-subtle hover:border-border-strong'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-border-subtle">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {item.isTopRecommendation && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary text-white uppercase tracking-wider">
                          ★ Top Recommendation
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-surface-subtle text-text-secondary uppercase">
                        {scheme.category.replace('_', ' ')}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-status-success-bg text-status-success-text">
                        Statutory Rule Verified
                      </span>
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl font-bold text-text-primary">
                      {scheme.name}
                    </h3>

                    <p className="text-xs text-text-secondary mt-1 italic">
                      {item.recommendationRationale}
                    </p>
                  </div>

                  {/* Key Financial Badge */}
                  <div className="flex items-center justify-between sm:justify-start gap-4 bg-surface-subtle p-3 rounded-xl border border-border-subtle shrink-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-text-muted uppercase font-medium block">Concessional Rate</span>
                      <span className="text-xl sm:text-2xl font-bold text-primary font-mono">
                        {scheme.interestRate}% <span className="text-xs font-normal">p.a.</span>
                      </span>
                    </div>
                    <div className="h-8 w-px bg-border-subtle"></div>
                    <div>
                      <span className="text-[11px] text-text-muted uppercase font-medium block">Max Assistance</span>
                      <span className="text-sm sm:text-base font-bold text-text-primary font-mono">
                        {scheme.maxLoanAmount >= 10000000
                          ? `₹${(scheme.maxLoanAmount / 10000000).toFixed(1)} Cr`
                          : `₹${(scheme.maxLoanAmount / 100000).toFixed(2)} Lakh`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Explainable Statutory Reasons */}
                <div className="py-4">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">
                    Deterministic Eligibility Audit:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.reasons?.map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-text-secondary">
                        <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-4 border-t border-border-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Compare Checkbox */}
                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-text-primary cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isSelectedForCompare}
                      onChange={() => toggleSchemeComparison(scheme._id)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary border-border-strong cursor-pointer"
                    />
                    <span>Select for comparison ({selectedSchemeIdsForComparison.length}/3 selected)</span>
                  </label>

                  {/* Direct Action Path A */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectDirect(scheme)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-semibold transition-colors shadow-sm active:scale-98 min-h-[42px]"
                    >
                      <span>Select & Find Partner</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Dynamic Compare Dock */}
      {hasSearched && selectedSchemeIdsForComparison.length >= 2 && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-2xl w-full px-3 sm:px-4 animate-slideUp">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-primary text-white shadow-drawer border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5 text-on-primary-container" />
              </div>
              <div>
                <p className="font-bold text-xs sm:text-sm">
                  {selectedSchemeIdsForComparison.length} Schemes Selected for Comparison
                </p>
                <p className="text-[11px] sm:text-xs text-white/70">
                  Inspect EMI, total repayment & what-if scenarios side-by-side
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceedToCompare}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-surface-subtle text-primary font-bold text-xs transition-colors shrink-0 shadow-sm active:scale-98"
            >
              <span>Compare Schemes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INTERACTIVE CLARIFICATION POP-UP MODAL (Triggers on 'business' or partial) */}
      {/* ========================================================================= */}
      {showClarificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-card rounded-2xl sm:rounded-3xl border border-border-subtle shadow-elevated max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 relative scrollbar-thin">
            {/* Close / Dismiss Button */}
            <button
              type="button"
              onClick={() => setShowClarificationModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badge & Title */}
            <div className="pr-8 mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider mb-2">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Clarification Required • Complete Profile</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-text-primary">
                Specify Your Enterprise Need
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">
                You entered a broad prompt. Government schemes require verified vocational categories, capital amount, and household income ceilings. Please clarify below:
              </p>
            </div>

            <form onSubmit={handleClarificationSubmit} className="space-y-4">
              {/* Field 1: Business Type */}
              <div className="p-3.5 rounded-xl bg-surface-subtle border border-border-subtle/80">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                    <span>1. What kind of business / trade are you starting or expanding?</span>
                    <span className="text-status-error-text">*</span>
                  </label>
                  {clarificationForm.businessType ? (
                    <span className="text-[11px] font-semibold text-status-success-text flex items-center gap-1">
                      <Check className="w-3 h-3" /> Selected
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-700">Missing</span>
                  )}
                </div>
                <input
                  type="text"
                  value={clarificationForm.businessType}
                  onChange={(e) => setClarificationForm({ ...clarificationForm, businessType: e.target.value })}
                  placeholder="e.g. Tailoring & Garments, Dairy Farming, Pottery Crafts, Retail Store..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-border-subtle text-sm text-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 mb-2 shadow-xs"
                />
                {/* Popular Quick-Select Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: '🧵 Tailoring & Garments', val: 'tailoring' },
                    { label: '🥛 Dairy & Animal Husbandry', val: 'dairy_farming' },
                    { label: '🏺 Artisan Pottery & Crafts', val: 'artisan_crafts' },
                    { label: '🛒 Retail / Kirana Store', val: 'retail_shop' },
                    { label: '🍲 Street Vendor / Food Cart', val: 'street_vendor' },
                    { label: '🪚 Carpentry & Woodwork', val: 'carpentry' },
                    { label: '💻 Tech Startup', val: 'tech_startup' },
                    { label: '🎓 Higher Education', val: 'higher_education' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setClarificationForm({ ...clarificationForm, businessType: item.val })}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                        clarificationForm.businessType.toLowerCase().includes(item.val)
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-white hover:bg-surface-ivory border border-border-subtle text-text-secondary'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 2: Loan Amount */}
              <div className="p-3.5 rounded-xl bg-surface-subtle border border-border-subtle/80">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                    <span>2. How much capital / loan do you need? (₹)</span>
                    <span className="text-status-error-text">*</span>
                  </label>
                  {clarificationForm.amount ? (
                    <span className="text-[11px] font-semibold text-status-success-text flex items-center gap-1">
                      <Check className="w-3 h-3" /> ₹{Number(clarificationForm.amount).toLocaleString('en-IN')}
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-700">Missing</span>
                  )}
                </div>
                <input
                  type="number"
                  value={clarificationForm.amount}
                  onChange={(e) => setClarificationForm({ ...clarificationForm, amount: e.target.value })}
                  placeholder="e.g. 120000 for ₹1.2 Lakh"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-border-subtle text-sm text-text-primary font-mono font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 mb-2 shadow-xs"
                />
                {/* Fast-Fill Amount Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: '₹20K (Micro Vendor)', val: 20000 },
                    { label: '₹50K (MUDRA Shishu)', val: 50000 },
                    { label: '₹1.2L (Micro Finance)', val: 120000 },
                    { label: '₹2.5L (Artisan / Workshop)', val: 250000 },
                    { label: '₹5.0L (MUDRA Kishore)', val: 500000 },
                    { label: '₹10L (MUDRA Tarun)', val: 1000000 },
                    { label: '₹25L (Stand-Up / PMEGP)', val: 2500000 },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setClarificationForm({ ...clarificationForm, amount: item.val })}
                      className={`px-2.5 py-1 rounded-full text-xs font-mono font-medium transition-all ${
                        Number(clarificationForm.amount) === item.val
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-white hover:bg-surface-ivory border border-border-subtle text-text-secondary'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 3: Household Income & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Income */}
                <div className="p-3.5 rounded-xl bg-surface-subtle border border-border-subtle/80">
                  <label className="text-xs font-bold text-text-primary block mb-1">
                    3. Annual Household Income (₹)
                  </label>
                  <input
                    type="number"
                    value={clarificationForm.annualFamilyIncome}
                    onChange={(e) => setClarificationForm({ ...clarificationForm, annualFamilyIncome: e.target.value })}
                    placeholder="e.g. 300000"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-border-subtle text-sm text-text-primary font-mono font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 mb-2 shadow-xs"
                  />
                  <div className="flex flex-wrap gap-1">
                    {[150000, 300000, 500000, 800000].map((inc) => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => setClarificationForm({ ...clarificationForm, annualFamilyIncome: inc })}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                          Number(clarificationForm.annualFamilyIncome) === inc
                            ? 'bg-primary text-white font-bold'
                            : 'bg-white border border-border-subtle text-text-secondary'
                        }`}
                      >
                        ₹{(inc / 100000).toFixed(1)}L
                      </button>
                    ))}
                  </div>
                </div>

                {/* District */}
                <div className="p-3.5 rounded-xl bg-surface-subtle border border-border-subtle/80">
                  <label className="text-xs font-bold text-text-primary block mb-1">
                    4. Applicant District / City
                  </label>
                  <input
                    type="text"
                    value={clarificationForm.location}
                    onChange={(e) => setClarificationForm({ ...clarificationForm, location: e.target.value })}
                    placeholder="e.g. Kolkata, Delhi, Varanasi..."
                    className="w-full px-3 py-2 rounded-lg bg-white border border-border-subtle text-sm text-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 mb-2 shadow-xs"
                  />
                  <div className="flex flex-wrap gap-1">
                    {['Kolkata', 'Delhi', 'Varanasi', 'Jaipur', 'Bengaluru'].map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setClarificationForm({ ...clarificationForm, location: loc })}
                        className={`px-2 py-0.5 rounded text-[11px] ${
                          clarificationForm.location.toLowerCase() === loc.toLowerCase()
                            ? 'bg-primary text-white font-bold'
                            : 'bg-white border border-border-subtle text-text-secondary'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Field 5: Target Category */}
              <div className="p-3.5 rounded-xl bg-surface-subtle border border-border-subtle/80">
                <label className="text-xs font-bold text-text-primary block mb-1.5">
                  5. Target Beneficiary Category (Optional Subsidies)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'General',
                    'Women Entrepreneur',
                    'SC / ST',
                    'OBC',
                    'Traditional Artisan / Vishwakarma',
                    'Minority'
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setClarificationForm({ ...clarificationForm, category: cat })}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        clarificationForm.category === cat
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-white hover:bg-surface-ivory border border-border-subtle text-text-secondary'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-border-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowClarificationModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-text-secondary hover:bg-surface-subtle transition-colors"
                >
                  Dismiss & Type in Chat
                </button>
                <button
                  type="submit"
                  disabled={!clarificationForm.businessType || !clarificationForm.amount}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-container disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all active:scale-98 min-h-[44px]"
                >
                  <span>Confirm & Match Schemes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
