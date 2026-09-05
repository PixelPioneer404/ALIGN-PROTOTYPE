import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Calculator, MapPin, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAlign } from '../context/AlignContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { setUserRequirement } = useAlign();

  const handleDemoPrompt = (promptText) => {
    navigate('/match', { state: { prefilledPrompt: promptText } });
  };

  return (
    <div className="w-full flex-1 flex flex-col custom-gradient-mesh">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:py-24 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-status-success-bg border border-secondary/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="text-xs font-semibold text-status-success-text uppercase tracking-wider">
              SIH 2026 • AI-Assisted Scheme Discovery & Decision Support
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-text-primary tracking-tight leading-[1.1]">
                Find Government Financial Support Built for Your Enterprise.
              </h1>

              <p className="font-sans text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl">
                Tell ALIGN what you need in plain everyday language. We interpret your need, check verified government rules with zero hallucinations, simulate your EMIs, and guide you to your local channel partner.
              </p>

              {/* Action Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  to="/match"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-primary hover:bg-primary-container text-white font-semibold text-base transition-all duration-200 shadow-elevated active:scale-98"
                >
                  <span>Find a Scheme</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <div className="flex items-center gap-3 px-4 py-2 text-xs text-text-secondary">
                  <ShieldCheck className="w-5 h-5 text-secondary shrink-0" />
                  <span>Verified Concessional Rates • NSFDC / MoSJE Compliant</span>
                </div>
              </div>

              {/* Demo Quick Start Box */}
              <div className="mt-6 p-4 rounded-xl bg-surface-card border border-border-subtle shadow-subtle">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-secondary" />
                    SIH Demo Requirement Quick-Fill:
                  </span>
                  <span className="text-[11px] text-text-muted">Click to test</span>
                </div>
                <button
                  onClick={() => handleDemoPrompt("I need ₹1.2 lakh to start a tailoring business. My family income is around ₹3 lakh and I live in Kolkata.")}
                  className="w-full text-left p-3 rounded-lg bg-surface-subtle hover:bg-surface-container border border-border-subtle/80 text-sm text-text-primary font-medium transition-colors group flex items-center justify-between"
                >
                  <span className="line-clamp-1 italic">
                    "I need ₹1.2 lakh to start a tailoring business. My family income is around ₹3 lakh and I live in Kolkata."
                  </span>
                  <span className="text-primary text-xs font-semibold shrink-0 group-hover:translate-x-1 transition-transform ml-2">
                    Try Prompt →
                  </span>
                </button>
              </div>
            </div>

            {/* Right Hero Visual Cards */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="p-6 rounded-2xl bg-surface-card border border-border-subtle shadow-card-modern">
                <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">ALIGN Core Principle</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-status-info-bg text-status-info-text">
                    Zero Math Hallucinations
                  </span>
                </div>
                <div className="space-y-3 pt-4 text-sm">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-text-primary">AI interprets:</strong>
                      <span className="text-text-secondary"> Gemini extracts your intent into structured JSON.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-text-primary">Code decides:</strong>
                      <span className="text-text-secondary"> Deterministic rule engine checks statutory criteria.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-text-primary">Code calculates:</strong>
                      <span className="text-text-secondary"> Actuarial reducing-balance financial formulas.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-text-primary">Database stores:</strong>
                      <span className="text-text-secondary"> Verified NSFDC schemes and authorized channel partners.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-text-primary">RAG retrieves:</strong>
                      <span className="text-text-secondary"> Official circular citations only when unstructured guidance is needed.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars Section */}
      <section className="py-16 bg-surface-card border-y border-border-subtle">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">End-to-End Assistance</span>
            <h2 className="font-display text-3xl font-bold text-text-primary mt-2">
              From natural language to an in-hand application checklist.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-surface-ivory border border-border-subtle flex flex-col gap-4">
              <div className="w-12 h-12 rounded-lg bg-surface-subtle text-primary flex items-center justify-center">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-text-primary">Universal Financial Calculator</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Compare eligible schemes side-by-side. Slide loan amounts or repayment tenures and watch every scheme recalculate instantaneously. Ask what-if questions in plain English.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-surface-ivory border border-border-subtle flex flex-col gap-4">
              <div className="w-12 h-12 rounded-lg bg-surface-subtle text-accent flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-text-primary">Channel Partner Discovery</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Locate verified State Channelising Agencies (SCAs), Public Sector Banks (PSBs), and Regional Rural Banks (RRBs) in your district authorized for your selected scheme.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-surface-ivory border border-border-subtle flex flex-col gap-4">
              <div className="w-12 h-12 rounded-lg bg-surface-subtle text-secondary flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-text-primary">Personalized Application Checklist</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Generate and download a dynamic, print-ready PDF checklist with exact required documents, nodal officer contact info, and step-by-step submission instructions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
