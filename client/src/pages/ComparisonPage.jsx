import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SlidersHorizontal,
  RotateCcw,
  ArrowRight,
  Info,
  Sparkles,
  Send,
  Check,
  AlertTriangle,
  ArrowUpRight,
  TrendingDown,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { useAlign } from '../context/AlignContext';

export default function ComparisonPage() {
  const navigate = useNavigate();
  const {
    userRequirement,
    eligibleSchemes,
    selectedSchemeIdsForComparison,
    calculatorState,
    setCalculatorState,
    setSelectedScheme,
    addWhatIfScenario,
  } = useAlign();

  const [loanAmount, setLoanAmount] = useState(calculatorState.activeLoanAmount || 120000);
  const [tenureMonths, setTenureMonths] = useState(calculatorState.activeTenureMonths || 36);
  const [calculations, setCalculations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // What-If Assistant State
  const [whatIfQuery, setWhatIfQuery] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [whatIfResult, setWhatIfResult] = useState(null);
  const [isAssistantExpanded, setIsAssistantExpanded] = useState(false);

  // Resolve compared schemes
  const comparedSchemes = React.useMemo(() => {
    if (!eligibleSchemes || eligibleSchemes.length === 0) return [];
    if (selectedSchemeIdsForComparison.length === 0) {
      return eligibleSchemes.slice(0, 3).map((s) => s.scheme || s);
    }
    return eligibleSchemes
      .filter((s) => selectedSchemeIdsForComparison.includes(s.scheme?._id || s._id))
      .map((s) => s.scheme || s);
  }, [eligibleSchemes, selectedSchemeIdsForComparison]);

  // Fetch financial calculations whenever loanAmount or tenureMonths change
  useEffect(() => {
    fetchCalculations(loanAmount, tenureMonths);
  }, [loanAmount, tenureMonths, comparedSchemes]);

  const fetchCalculations = async (amount, tenure) => {
    setIsLoading(true);
    try {
      const schemeIds = comparedSchemes.map((s) => s._id);
      const res = await fetch('/api/financial/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loanAmount: amount, tenureMonths: tenure, schemeIds }),
      });
      const json = await res.json();
      if (json.success) {
        setCalculations(json.data.calculations);
      }
    } catch (err) {
      console.error('Failed to calculate finances:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    const defaultAmt = userRequirement?.amount || 120000;
    const defaultTen = 36;
    setLoanAmount(defaultAmt);
    setTenureMonths(defaultTen);
    setCalculatorState({ activeLoanAmount: defaultAmt, activeTenureMonths: defaultTen });
    setWhatIfResult(null);
    setIsAssistantExpanded(false);
  };

  const handleSelectScheme = (scheme) => {
    setSelectedScheme(scheme);
    navigate('/partners');
  };

  const handleWhatIfSubmit = async (e) => {
    e?.preventDefault();
    if (!whatIfQuery.trim()) return;

    setIsSimulating(true);
    try {
      const schemeIds = comparedSchemes.map((s) => s._id);
      const res = await fetch('/api/financial/what-if', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentScenario: { loanAmount, tenureMonths, schemeIds },
          query: whatIfQuery.trim(),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setWhatIfResult(json.data);
        setIsAssistantExpanded(true);
        // Add to history
        addWhatIfScenario({
          scenarioPrompt: whatIfQuery,
          loanAmount: json.data.parsedDelta.loanAmount,
          tenureMonths: json.data.parsedDelta.tenureMonths,
        });
      }
    } catch (err) {
      console.error('What-if error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleApplyScenario = () => {
    if (!whatIfResult) return;
    const newAmt = whatIfResult.parsedDelta.loanAmount || loanAmount;
    const newTen = whatIfResult.parsedDelta.tenureMonths || tenureMonths;
    setLoanAmount(newAmt);
    setTenureMonths(newTen);
    setCalculatorState({ activeLoanAmount: newAmt, activeTenureMonths: newTen });
    setIsAssistantExpanded(false);
  };

  return (
    <div className="w-full flex-1 max-w-[1200px] mx-auto px-4 lg:px-6 py-8 pb-36">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-1.5 mb-2">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            Universal Comparison & Simulation • Step 3 of 5
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Compare your options before you decide.
          </h1>
          <p className="font-sans text-base text-text-secondary mt-2 leading-relaxed max-w-2xl">
            See how your loan amount and repayment tenure affect monthly EMI and total interest liabilities deterministically across all eligible schemes.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-status-success-bg text-status-success-text text-xs font-semibold border border-secondary/20">
            {comparedSchemes.length} Schemes in Comparison
          </span>
        </div>
      </div>

      {/* User Requirement Snapshot Strip */}
      {userRequirement && (
        <div className="w-full bg-surface-card rounded-xl border border-border-subtle p-4 mb-8 flex flex-wrap items-center justify-between gap-3 shadow-sm text-xs">
          <div className="flex flex-wrap items-center gap-2 text-text-secondary">
            <span className="font-bold text-text-primary">Active Profile:</span>
            <span className="bg-surface-subtle px-2.5 py-1 rounded font-medium text-text-primary capitalize">
              {userRequirement.businessType || userRequirement.purpose}
            </span>
            <span className="text-text-muted">•</span>
            <span>Target: <strong className="text-text-primary font-mono">₹{Number(userRequirement.amount).toLocaleString('en-IN')}</strong></span>
            <span className="text-text-muted">•</span>
            <span>Annual Income: <strong className="text-text-primary font-mono">₹{Number(userRequirement.annualFamilyIncome).toLocaleString('en-IN')}</strong></span>
            <span className="text-text-muted">•</span>
            <span>District: <strong className="text-text-primary">{userRequirement.location}</strong></span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/match')}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Change requirement
          </button>
        </div>
      )}

      {/* Universal Interactive Financial Control Panel */}
      <div className="w-full bg-surface-card border border-border-subtle rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-subtle gap-2">
          <div>
            <h2 className="font-bold text-lg text-text-primary flex items-center gap-2">
              <span>Adjust your financing parameters</span>
            </h2>
            <p className="text-xs text-text-secondary">
              Slide amount or tenure to rebalance all compared statutory schemes instantaneously.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-surface-subtle text-xs font-semibold transition-colors self-start sm:self-auto"
          >
            <span>Reset (₹1.20L / 3Y)</span>
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          {/* Amount Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-text-primary">Required Loan Amount</label>
              <div className="px-3 py-1 rounded-lg bg-surface-subtle border border-border-subtle text-base font-bold font-mono text-primary">
                ₹{Number(loanAmount).toLocaleString('en-IN')}
              </div>
            </div>
            <input
              type="range"
              min="20000"
              max="500000"
              step="5000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-text-muted">
              <span>Min: ₹20,000</span>
              <span>₹1.25L (Microfinance Cap)</span>
              <span>Max: ₹5,00,000</span>
            </div>
          </div>

          {/* Tenure Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-text-primary">Repayment Tenure</label>
              <div className="px-3 py-1 rounded-lg bg-surface-subtle border border-border-subtle text-base font-bold font-mono text-primary">
                {tenureMonths} Months ({Math.round(tenureMonths / 12 * 10) / 10} Yrs)
              </div>
            </div>
            <input
              type="range"
              min="12"
              max="84"
              step="6"
              value={tenureMonths}
              onChange={(e) => setTenureMonths(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-text-muted">
              <span>1 Year (12m)</span>
              <span>3 Years (36m - MF Cap)</span>
              <span>5 Years (60m)</span>
              <span>7 Years (84m)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {comparedSchemes.map((scheme) => {
          const calc = calculations.find((c) => c.schemeId === scheme._id) || {};
          const isTenureCapped = tenureMonths > scheme.maxTenureMonths;
          const isAmountExceeded = loanAmount > scheme.maxLoanAmount;

          return (
            <div
              key={scheme._id}
              className={`p-6 rounded-2xl bg-surface-card border transition-all flex flex-col justify-between shadow-sm ${
                scheme._id === 'SCHEME-NSFDC-MF-01'
                  ? 'border-secondary/40 ring-1 ring-secondary/20'
                  : 'border-border-subtle'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-surface-subtle text-text-secondary uppercase">
                    {scheme.category.replace('_', ' ')}
                  </span>
                  {scheme._id === 'SCHEME-NSFDC-MF-01' && (
                    <span className="text-[11px] font-bold text-secondary">
                      ★ Recommended
                    </span>
                  )}
                </div>

                <h3 className="font-display text-xl font-bold text-text-primary mb-1">
                  {scheme.shortName || scheme.name}
                </h3>

                <p className="text-xs text-text-secondary mb-4 line-clamp-2">
                  {scheme.targetBeneficiary}
                </p>

                {/* Primary Financial Metric Box */}
                <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle/80 mb-4">
                  <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider block">
                    Monthly Repayment (EMI)
                  </span>
                  <div className="text-3xl font-bold font-mono text-primary tracking-tight mt-0.5">
                    ₹{calc.monthlyEMI ? Math.round(calc.monthlyEMI).toLocaleString('en-IN') : '...'}
                    <span className="text-xs font-normal text-text-secondary ml-1">/ month</span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-border-subtle/70 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-text-muted block text-[10px]">Total Repayment</span>
                      <span className="font-bold text-text-primary font-mono">
                        ₹{calc.totalRepayment ? Math.round(calc.totalRepayment).toLocaleString('en-IN') : '...'}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-muted block text-[10px]">Total Interest</span>
                      <span className="font-bold text-text-primary font-mono">
                        ₹{calc.totalInterest ? Math.round(calc.totalInterest).toLocaleString('en-IN') : '...'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Terms Breakdown */}
                <div className="space-y-2 text-xs py-2">
                  <div className="flex justify-between py-1 border-b border-border-subtle/50">
                    <span className="text-text-muted">Interest Rate:</span>
                    <span className="font-bold text-primary font-mono">{scheme.interestRate}% p.a.</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-border-subtle/50">
                    <span className="text-text-muted">Effective Tenure:</span>
                    <span className="font-bold text-text-primary">
                      {calc.effectiveTenureMonths || tenureMonths} Months
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-border-subtle/50">
                    <span className="text-text-muted">Principal Moratorium:</span>
                    <span className="font-bold text-secondary">
                      {scheme.moratoriumMonths} Months Grace
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-border-subtle/50">
                    <span className="text-text-muted">Max Loan Ceiling:</span>
                    <span className="font-bold text-text-primary font-mono">
                      ₹{(scheme.maxLoanAmount / 100000).toFixed(2)} Lakh
                    </span>
                  </div>
                </div>

                {/* Statutory Constraint Badges */}
                {isTenureCapped && (
                  <div className="mt-3 p-2.5 rounded-lg bg-status-warning-bg border border-status-warning-text/20 text-status-warning-text text-xs flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>Tenure capped at statutory limit ({scheme.maxTenureMonths} mo).</span>
                  </div>
                )}

                {isAmountExceeded && (
                  <div className="mt-3 p-2.5 rounded-lg bg-status-warning-bg border border-status-warning-text/20 text-status-warning-text text-xs flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>Requested amount exceeds scheme cap (₹{(scheme.maxLoanAmount / 100000).toFixed(2)}L).</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-4 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => handleSelectScheme(scheme)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-white font-semibold text-xs transition-all shadow-sm active:scale-98"
                >
                  <span>Select This Scheme</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating What-If AI Assistant (Fixed near bottom) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-full px-4">
        <div className="bg-surface-card rounded-2xl border border-border-subtle shadow-drawer overflow-hidden transition-all duration-300">
          {/* Expanded AI Explanation Drawer */}
          {isAssistantExpanded && whatIfResult && (
            <div className="p-5 border-b border-border-subtle bg-surface-subtle/50 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    ALIGN What-If Scenario Analysis
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAssistantExpanded(false)}
                  className="text-text-muted hover:text-text-primary text-xs"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-text-primary leading-relaxed mb-3">
                {whatIfResult.explanation}
              </p>

              {/* Concise Before/After Comparison */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                {whatIfResult.calculations?.slice(0, 3).map((calc) => (
                  <div key={calc.schemeId} className="p-2 rounded-lg bg-surface-card border border-border-subtle text-xs">
                    <span className="font-semibold text-text-primary block truncate">{calc.shortName || calc.schemeName}</span>
                    <div className="flex items-baseline gap-1 mt-1 font-mono">
                      <span className="font-bold text-primary">₹{Math.round(calc.monthlyEMI).toLocaleString('en-IN')}</span>
                      <span className={`text-[10px] ${calc.emiDelta <= 0 ? 'text-secondary font-bold' : 'text-text-muted'}`}>
                        ({calc.emiDelta <= 0 ? '' : '+'}{Math.round(calc.emiDelta).toLocaleString('en-IN')})
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 text-xs">
                <span className="text-text-muted italic">
                  See the comparison cards above to notice the full impact.
                </span>

                <button
                  type="button"
                  onClick={handleApplyScenario}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary-dark text-white font-semibold text-xs shadow-sm active:scale-98 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply this scenario</span>
                </button>
              </div>
            </div>
          )}

          {/* Compact Input Bar */}
          <form onSubmit={handleWhatIfSubmit} className="flex items-center gap-2 p-2 px-4">
            <Sparkles className="w-5 h-5 text-secondary shrink-0" />
            <input
              type="text"
              value={whatIfQuery}
              onChange={(e) => setWhatIfQuery(e.target.value)}
              placeholder="Ask ALIGN to explore a what-if scenario... (e.g. 'What if I repay over 5 years?')"
              className="w-full py-2 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            />

            {whatIfResult && !isAssistantExpanded && (
              <button
                type="button"
                onClick={() => setIsAssistantExpanded(true)}
                className="text-xs text-primary font-semibold hover:underline shrink-0 px-2"
              >
                View Result
              </button>
            )}

            <button
              type="submit"
              disabled={isSimulating || !whatIfQuery.trim()}
              className="w-9 h-9 rounded-xl bg-primary hover:bg-primary-container disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-colors shadow-sm"
              title="Submit what-if query"
            >
              {isSimulating ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
