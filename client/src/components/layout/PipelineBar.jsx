import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const steps = [
  { path: '/', label: 'Overview', step: 1 },
  { path: '/match', label: 'Scheme Matching', step: 2 },
  { path: '/compare', label: 'Financial Compare', step: 3 },
  { path: '/partners', label: 'Partner Discovery', step: 4 },
  { path: '/guidance', label: 'Application Guidance', step: 5 },
];

export default function PipelineBar() {
  const location = useLocation();
  const currentStepIndex = steps.findIndex((s) => s.path === location.pathname);
  const activeStep = currentStepIndex !== -1 ? steps[currentStepIndex] : steps[0];

  if (location.pathname === '/') return null;

  return (
    <section className="w-full bg-surface-subtle border-b border-border-subtle/70 py-2.5">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-secondary/20 animate-pulse"></span>
          <span className="font-bold text-text-primary tracking-wide uppercase">
            Step {activeStep.step} of 5: {activeStep.label}
          </span>
          <span className="text-text-muted hidden sm:inline">|</span>
          <span className="text-text-secondary hidden sm:inline">
            Deterministic Decision Pipeline (No LLM Hallucinations)
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {steps.map((s, idx) => {
            const isPassed = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <React.Fragment key={s.path}>
                <Link
                  to={s.path}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    isCurrent
                      ? 'bg-primary text-white font-semibold'
                      : isPassed
                      ? 'text-text-primary hover:bg-surface-card'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isCurrent ? 'bg-white/20 text-white' : isPassed ? 'bg-secondary/20 text-secondary' : 'bg-surface-container text-text-muted'
                  }`}>
                    {s.step}
                  </span>
                  <span>{s.label}</span>
                </Link>
                {idx < steps.length - 1 && <span className="text-text-muted/40">›</span>}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
