import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle, Edit2, RotateCcw, Check, Scale } from 'lucide-react';
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
    { role: 'ai', content: 'What kind of support are you seeking? Please describe your business, how much capital you need, and your district.' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [extractedData, setExtractedData] = useState(userRequirement);
  const [isEditingExtracted, setIsEditingExtracted] = useState(false);
  const [matchedResults, setMatchedResults] = useState(eligibleSchemes);
  const [errorMsg, setErrorMsg] = useState('');

  // When navigated with prefilled prompt from Landing page, we can auto-analyze or let user click
  useEffect(() => {
    if (location.state?.prefilledPrompt && messages.length === 1 && !extractedData) {
      handleUserMessage(location.state.prefilledPrompt);
      // clear the state so it doesn't trigger again on re-render
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
        const structured = { ...json.data.extracted, rawPrompt: newMessages.map(m=>m.content).join(' ') };
        setExtractedData(structured);
        setUserRequirement(structured);

        // Automatically run deterministic rule engine matching immediately
        await runMatching(structured);
        setHasSearched(true);
      } else {
        setMessages([...newMessages, { role: 'ai', content: json.data.nextQuestion || 'Could you provide more details?' }]);
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
    <div className="w-full flex-1 max-w-[1200px] mx-auto px-4 lg:px-6 py-8 pb-32">
      {/* Editorial Header */}
      <div className="max-w-3xl mb-8">
        <span className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-1.5 mb-2">
          <Sparkles className="w-4 h-4 text-secondary" />
          Natural Language Requirement • Step 2 of 5
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
          What kind of support are you seeking?
        </h1>
        <p className="font-sans text-base text-text-secondary mt-2 leading-relaxed">
          Describe your business, how much capital you need, and your district in your own words. ALIGN extracts your intent and checks verified government scheme rules deterministically.
        </p>
      </div>

      {/* Input Form Section */}
      <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 shadow-sm mb-8">
        <form onSubmit={handleAnalyze} className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-text-primary flex items-center justify-between">
            <span>Your Need in Natural Language</span>
            <span className="text-xs font-normal text-text-muted">No financial jargon required</span>
          </label>

          {/* Chat History */}
          <div className="flex flex-col gap-3 mb-4 max-h-80 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-border-strong scrollbar-track-transparent">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3.5 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-br-none shadow-sm' 
                    : 'bg-surface-subtle text-text-primary rounded-bl-none border border-border-subtle shadow-sm'
                }`}>
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
              placeholder="Type your response here... (Press Enter to send)"
              className="w-full p-4 pr-12 rounded-xl bg-surface-ivory border border-border-subtle text-text-primary text-base placeholder:text-text-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none shadow-inner-light"
            />
          </div>

          {/* Quick Prompt Chips */}
          {messages.length === 1 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-semibold text-text-muted mr-1">Quick start:</span>
              <button
                type="button"
                onClick={() => handleUserMessage('I need ₹1.2 lakh to start a tailoring business. My family income is around ₹3 lakh and I live in Kolkata.')}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-surface-ivory hover:bg-surface-subtle border border-border-subtle text-text-secondary transition-all shadow-sm hover:shadow-md"
              >
                Tailoring Business (₹1.2L)
              </button>
              <button
                type="button"
                onClick={() => handleUserMessage('I want ₹2.5 lakh for an artisan pottery workshop in Kolkata with family income of ₹2.8 lakh.')}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-surface-ivory hover:bg-surface-subtle border border-border-subtle text-text-secondary transition-all shadow-sm hover:shadow-md"
              >
                Artisan Workshop (₹2.5L)
              </button>
              <button
                type="button"
                onClick={() => handleUserMessage('I need ₹80,000 for purchasing raw fabrics and sewing tools for garment retail in Kolkata.')}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-surface-ivory hover:bg-surface-subtle border border-border-subtle text-text-secondary transition-all shadow-sm hover:shadow-md"
              >
                Small Retail (₹80K)
              </button>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
            <div className="text-xs text-text-muted flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span>Gemini interprets intent • Code evaluates statutory rules</span>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing || isMatching}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-container disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-sm active:scale-98"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Analyzing with AI...</span>
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
            {isAnalyzing ? "Interpreting Requirement with Gemini AI..." : "Evaluating Government Scheme Rules..."}
          </h3>
          <p className="text-xs text-text-secondary mt-1.5 max-w-md">
            ALIGN is extracting structured parameters, checking statutory NSFDC eligibility ceilings, and ranking concessional microfinance options deterministically.
          </p>
        </div>
      )}

      {/* Extracted Requirements Review Card (Appears only after search) */}
      {hasSearched && extractedData && (
        <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 shadow-sm mb-8 animate-fadeIn">
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-sm">
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
              Ranked deterministically based on concessional rates, statutory limits, and purpose alignment.
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
                className={`p-6 rounded-2xl bg-surface-card border transition-all duration-200 shadow-sm ${
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
                  <div className="flex items-center gap-4 bg-surface-subtle p-3 rounded-xl border border-border-subtle shrink-0">
                    <div className="text-right">
                      <span className="text-[11px] text-text-muted uppercase font-medium block">Concessional Rate</span>
                      <span className="text-2xl font-bold text-primary font-mono">{scheme.interestRate}% <span className="text-xs font-normal">p.a.</span></span>
                    </div>
                    <div className="h-8 w-px bg-border-subtle"></div>
                    <div>
                      <span className="text-[11px] text-text-muted uppercase font-medium block">Max Loan Ceiling</span>
                      <span className="text-base font-bold text-text-primary font-mono">₹{(scheme.maxLoanAmount / 100000).toFixed(2)} Lakh</span>
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
                      className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-semibold transition-colors shadow-sm active:scale-98"
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

      {/* Floating Dynamic Compare Dock (Appears only after search and when 2 or more schemes are checked) */}
      {hasSearched && selectedSchemeIdsForComparison.length >= 2 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-2xl w-full px-4 animate-slideUp">
          <div className="p-4 rounded-2xl bg-primary text-white shadow-drawer border border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5 text-on-primary-container" />
              </div>
              <div>
                <p className="font-bold text-sm">
                  {selectedSchemeIdsForComparison.length} Schemes Selected for Comparison
                </p>
                <p className="text-xs text-white/70">
                  Inspect EMI, total repayment & what-if scenarios side-by-side
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceedToCompare}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-surface-subtle text-primary font-bold text-xs transition-colors shrink-0 shadow-sm active:scale-98"
            >
              <span>Compare Schemes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
