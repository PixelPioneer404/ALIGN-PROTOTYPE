import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  Scale,
  MapPin,
  FileCheck,
  ArrowRight,
  RotateCcw,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAlign } from '../../context/AlignContext';

const NAV_ITEMS = [
  { path: '/', label: 'Overview', step: '1', icon: Compass },
  { path: '/match', label: 'Find Schemes', step: '2', icon: Sparkles },
  { path: '/compare', label: 'Compare Schemes', step: '3', icon: Scale },
  { path: '/partners', label: 'Channel Partners', step: '4', icon: MapPin },
  { path: '/guidance', label: 'Document Checklist', step: '5', icon: FileCheck },
];

export default function Navbar() {
  const location = useLocation();
  const { userRequirement, selectedScheme, resetAll } = useAlign();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E2DAD0] shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition-all">
      {/* 1. Official Government Institutional Micro-Banner */}
      <div className="w-full bg-[#001733] text-white/85 border-b border-white/10 text-[11px] font-medium">
        <div className="max-w-[1240px] mx-auto px-4 lg:px-6 h-7 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* National Tricolor Emblem Accent */}
            <span className="flex items-center gap-[2px] p-[1.5px] bg-white/10 rounded-xs ring-1 ring-white/20">
              <span className="w-1.5 h-3 bg-[#FF9933] rounded-[1px]"></span>
              <span className="w-1.5 h-3 bg-white rounded-[1px]"></span>
              <span className="w-1.5 h-3 bg-[#138808] rounded-[1px]"></span>
            </span>
            <span className="font-bold text-white uppercase tracking-wider text-[10px]">
              Government of India
            </span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span className="text-white/70 hidden sm:inline text-[10px] uppercase tracking-wider">
              Ministry of Social Justice & Empowerment
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px]">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Statutory Rule Engine FY 2025–26</span>
            </div>
            <span className="text-white/20 hidden md:inline">|</span>
            <span className="text-white/70 hidden md:inline font-mono">
              Zero AI Hallucinations
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Official Working Navigation Bar */}
      <div className="max-w-[1240px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Authority Label */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-black flex items-center justify-center shadow-[0_2px_8px_rgba(0,32,70,0.25)] group-hover:scale-105 transition-all border border-border-subtle/80">
            <img src="/logo.jpg" alt="ALIGN Logo" className="w-full h-full object-cover" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-surface-ivory shadow-xs"></span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-2xl text-primary tracking-tight leading-none">
                ALIGN
              </span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 tracking-wider">
                PORTAL
              </span>
            </div>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest leading-none mt-1">
              National Scheme Decision Support
            </span>
          </div>
        </Link>

        {/* Tactile Segmented Navigation Capsule (Single-Line, Zero Wrapping, Perfectly Aligned) */}
        <nav className="hidden md:flex items-center bg-[#ECE5DB] p-1.5 rounded-full border border-[#DDD4C7] shadow-[inset_0_1px_3px_rgba(0,0,0,0.07),0_1px_1px_rgba(255,255,255,0.8)]">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group whitespace-nowrap shrink-0 flex items-center gap-2 h-9 px-3.5 rounded-full transition-all duration-200 text-xs ${
                  isActive
                    ? 'bg-primary text-white font-bold shadow-[0_2px_8px_rgba(0,32,70,0.28)] ring-1 ring-white/15'
                    : 'text-text-secondary hover:text-primary hover:bg-white/80 font-medium hover:shadow-xs'
                }`}
              >
                {/* Step Numeral Pill */}
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-black/[0.04] text-text-muted group-hover:bg-primary/10 group-hover:text-primary'
                  }`}
                >
                  {item.step}
                </span>

                {/* Status Dot for Active / Icon for Inactive */}
                {isActive ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] shrink-0 animate-pulse"></span>
                ) : (
                  <Icon className="w-3.5 h-3.5 text-text-muted/80 group-hover:text-primary shrink-0 transition-colors" />
                )}

                {/* Tab Label (Guaranteed Single-Line) */}
                <span className="whitespace-nowrap tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right Utility & Action CTAs */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {userRequirement && (
            <button
              type="button"
              onClick={resetAll}
              title="Reset session and clear inputs"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-status-error-text transition-all px-3 py-1.5 rounded-full border border-border-subtle/80 hover:bg-white/80 hover:shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <Link
            to="/match"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-white text-xs font-bold transition-all duration-150 shadow-[0_2px_8px_rgba(0,32,70,0.2)] hover:shadow-[0_4px_14px_rgba(0,32,70,0.25)] active:scale-95"
          >
            <span>Find Schemes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-[#ECE5DB] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border-subtle bg-surface-card p-4 shadow-lg animate-fadeIn">
          <div className="flex flex-col gap-1 mb-3">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-text-primary hover:bg-surface-subtle'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-surface-subtle text-text-muted'
                      }`}
                    >
                      {item.step}
                    </span>
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <span className="text-xs font-mono">Active</span>}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-border-subtle flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-text-secondary">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <span>NSFDC Statutory Guidelines</span>
            </div>
            {userRequirement && (
              <button
                type="button"
                onClick={() => {
                  resetAll();
                  setMobileMenuOpen(false);
                }}
                className="text-status-error-text font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
