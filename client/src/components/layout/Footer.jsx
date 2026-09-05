import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-subtle border-t border-border-subtle py-10 mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-border-subtle/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-base">
              A
            </div>
            <div>
              <p className="font-bold text-text-primary text-base leading-none">ALIGN</p>
              <p className="text-xs text-text-muted mt-1">SIH 2026 Prototype • Ministry of Social Justice & Empowerment Alignment</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-card border border-border-subtle text-xs text-text-secondary">
            <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
            <span>AI interprets. Deterministic code calculates & decides. Zero financial hallucination.</span>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-text-muted">
          <p className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-text-muted shrink-0" />
            <span>ALIGN is an AI-assisted decision-support platform. ALIGN does not approve loans or submit government applications directly.</span>
          </p>
          <p>© 2026 ALIGN Team. Built for Smart India Hackathon.</p>
        </div>
      </div>
    </footer>
  );
}
