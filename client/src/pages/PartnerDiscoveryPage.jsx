import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Search,
  Building2,
  Phone,
  Clock,
  ArrowRight,
  Maximize2,
  Minimize2,
  CheckCircle2,
  ArrowLeft,
  Navigation,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { useAlign } from '../context/AlignContext';

export default function PartnerDiscoveryPage() {
  const navigate = useNavigate();
  const {
    userRequirement,
    selectedScheme,
    setSelectedScheme,
    selectedPartner,
    setSelectedPartner,
    eligibleSchemes,
  } = useAlign();

  const [partners, setPartners] = useState([]);
  const [activePartnerId, setActivePartnerId] = useState(selectedPartner?._id || null);
  const [locationQuery, setLocationQuery] = useState(userRequirement?.location || 'Kolkata');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback to top eligible scheme if selectedScheme is somehow null
  const activeScheme = React.useMemo(() => {
    if (selectedScheme) return selectedScheme;
    if (eligibleSchemes && eligibleSchemes.length > 0) {
      return eligibleSchemes[0].scheme || eligibleSchemes[0];
    }
    return {
      _id: 'SCHEME-NSFDC-MF-01',
      name: 'NSFDC Micro Finance Scheme',
      shortName: 'Micro Finance',
      category: 'microfinance',
      interestRate: 6.5,
      maxLoanAmount: 125000,
      maxTenureMonths: 36
    };
  }, [selectedScheme, eligibleSchemes]);

  useEffect(() => {
    if (!selectedScheme && activeScheme) {
      setSelectedScheme(activeScheme);
    }
  }, [selectedScheme, activeScheme]);

  // Fetch partners for the active scheme
  useEffect(() => {
    fetchPartners();
  }, [activeScheme, locationQuery]);

  const fetchPartners = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/schemes/${activeScheme._id}/partners?city=${encodeURIComponent(locationQuery)}`);
      const json = await res.json();
      if (json.success) {
        setPartners(json.data);
        // Default select first partner if none selected
        if (!activePartnerId && json.data.length > 0) {
          setActivePartnerId(json.data[0]._id);
          setSelectedPartner(json.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch partners:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPartners = React.useMemo(() => {
    return partners.filter((p) => {
      if (filterType !== 'all' && p.type !== filterType) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchAddr = p.address.toLowerCase().includes(query);
        const matchType = p.type.toLowerCase().includes(query);
        return matchName || matchAddr || matchType;
      }
      return true;
    });
  }, [partners, filterType, searchQuery]);

  const handleSelectPartner = (partner) => {
    setActivePartnerId(partner._id);
    setSelectedPartner(partner);
  };

  const handleProceedToGuidance = () => {
    const chosen = partners.find((p) => p._id === activePartnerId) || partners[0];
    if (chosen) {
      setSelectedPartner(chosen);
    }
    navigate('/guidance');
  };

  return (
    <div className="w-full flex-1 max-w-[1200px] mx-auto px-4 lg:px-6 py-8 pb-32">
      {/* Target Scheme Banner */}
      <div className="w-full bg-surface-card rounded-2xl border border-border-subtle p-5 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 font-bold">
            <Building2 className="w-5 h-5 text-on-primary-container" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Target Scheme Selected</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-status-success-bg text-status-success-text">
                Verified Concessional Credit
              </span>
            </div>
            <h2 className="font-display text-lg font-bold text-text-primary mt-0.5">
              {activeScheme.name}
            </h2>
            <p className="text-xs text-text-secondary">
              Rate: <strong className="text-primary font-mono">{activeScheme.interestRate}% p.a.</strong> • Ceiling: <strong className="text-text-primary font-mono">₹{(activeScheme.maxLoanAmount / 100000).toFixed(2)} Lakh</strong> • Max Repayment: {activeScheme.maxTenureMonths} Months
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/compare')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-strong text-text-primary hover:bg-surface-subtle text-xs font-semibold transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Change scheme</span>
        </button>
      </div>

      {/* Page Heading & Search Controls */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-4">
          <div>
            <span className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              Channel Partner Discovery • Step 4 of 5
            </span>
            <h1 className="font-display text-3xl font-bold text-text-primary tracking-tight">
              Where would you like to apply?
            </h1>
            <p className="font-sans text-sm text-text-secondary mt-1">
              Locate authorized State Channelising Agencies (SCAs) and Bank branches in your district accredited for this scheme.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-status-success-bg text-status-success-text text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span>{filteredPartners.length} Authorized Desks in {locationQuery}</span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-surface-card rounded-xl p-3 border border-border-subtle shadow-sm flex flex-col md:flex-row items-center gap-3">
          {/* Location Query */}
          <div className="w-full md:w-1/3 relative flex items-center">
            <MapPin className="w-4 h-4 text-text-muted absolute left-3" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="City / District..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-subtle text-xs font-medium text-text-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Search Name Query */}
          <div className="w-full md:w-2/3 relative flex items-center">
            <Search className="w-4 h-4 text-text-muted absolute left-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search branch name, landmark or PIN code..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-subtle text-xs font-medium text-text-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Map Expand / Collapse Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMapExpanded(!isMapExpanded)}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-subtle hover:bg-surface-container border border-border-subtle text-xs font-semibold text-text-primary shrink-0 transition-colors"
          >
            {isMapExpanded ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Compact Map</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Expand Map</span>
              </>
            )}
          </button>
        </div>

        {/* Filter Type Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-3">
          <span className="text-xs text-text-muted mr-1">Partner Type:</span>
          {['all', 'SCA', 'PSB', 'RRB', 'SFB'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                filterType === type
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-subtle hover:bg-surface-container text-text-secondary border border-border-subtle'
              }`}
            >
              {type === 'all' ? 'All Partners' : type === 'SCA' ? 'SCAs (State Agencies)' : type === 'PSB' ? 'PSBs (Public Sector Banks)' : type === 'RRB' ? 'RRBs (Rural Banks)' : 'SFBs (Small Finance Banks)'}
            </button>
          ))}
        </div>
      </div>

      {/* Split-Screen Main Layout (Partner Cards + Connected Map) */}
      <div className={`grid gap-6 transition-all duration-300 ${
        isMapExpanded ? 'grid-cols-1 md:grid-cols-12' : 'grid-cols-1 md:grid-cols-12'
      }`}>
        {/* Left Column: Partner List */}
        <div className={`${isMapExpanded ? 'md:col-span-4' : 'md:col-span-7'} flex flex-col gap-4 order-2 md:order-1`}>
          {filteredPartners.map((partner) => {
            const isSelected = activePartnerId === partner._id;

            return (
              <div
                key={partner._id}
                onClick={() => handleSelectPartner(partner)}
                className={`p-5 rounded-2xl bg-surface-card border cursor-pointer transition-all duration-200 shadow-sm ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20 bg-status-info-bg/30'
                    : 'border-border-subtle hover:border-border-strong'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        partner.type === 'SCA'
                          ? 'bg-primary text-white'
                          : partner.type === 'PSB'
                          ? 'bg-accent text-white'
                          : 'bg-secondary text-white'
                      }`}>
                        {partner.type}
                      </span>
                      <span className="text-[11px] font-medium text-text-muted">
                        PIN: {partner.pincode}
                      </span>
                    </div>

                    <h3 className="font-display text-base font-bold text-text-primary leading-snug">
                      {partner.name}
                    </h3>
                  </div>

                  <div className="shrink-0">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-primary bg-primary text-white' : 'border-border-strong bg-white'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed mb-3">
                  {partner.address}
                </p>

                {/* Contact & Hours */}
                <div className="pt-2.5 border-t border-border-subtle/80 flex flex-wrap items-center justify-between gap-2 text-xs text-text-muted">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <span className="font-mono text-text-primary">{partner.contact?.phone}</span>
                  </div>

                  {partner.contact?.nodalOfficerName && (
                    <span className="text-[11px] text-text-secondary">
                      Officer: <strong className="text-text-primary">{partner.contact.nodalOfficerName}</strong>
                    </span>
                  )}
                </div>

                <div className="mt-2 pt-2 border-t border-border-subtle/50 flex items-center justify-between text-[11px]">
                  <span className="text-secondary font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Verified Channel Partner (Demo)
                  </span>
                  <span className="text-primary font-bold">Click to pinpoint</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Interactive Map Canvas */}
        <div className={`${isMapExpanded ? 'md:col-span-8' : 'md:col-span-5'} order-1 md:order-2 sticky top-24 h-[420px] md:h-[580px]`}>
          <div className="w-full h-full rounded-2xl overflow-hidden border border-border-subtle shadow-card-modern bg-[#EAF0F6] relative flex flex-col">
            {/* Map Header Overlay */}
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl border border-border-subtle shadow-sm text-xs">
              <span className="font-semibold text-text-primary flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-primary" />
                {locationQuery} District Partner Grid
              </span>
              <span className="text-[10px] text-text-muted">Interactive Pins</span>
            </div>

            {/* Interactive Styled Map View */}
            <div className="flex-1 w-full h-full relative flex items-center justify-center p-6">
              {/* Map SVG Grid Representation */}
              <svg className="w-full h-full opacity-30" viewBox="0 0 500 500">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2B4C6F" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* River Hooghly simulation line for Kolkata */}
                <path d="M 120 0 Q 150 150, 100 250 T 160 500" fill="none" stroke="#2B4C6F" strokeWidth="8" strokeOpacity="0.3" />
              </svg>

              {/* Connected Map Pins corresponding to partners */}
              <div className="absolute inset-0 p-8 flex items-center justify-center">
                {filteredPartners.map((partner, index) => {
                  const isSelected = activePartnerId === partner._id;
                  // Layout positions simulating Kolkata locations
                  const positions = [
                    { top: '35%', left: '60%' }, // WBSCSTDFCL Salt Lake
                    { top: '48%', left: '42%' }, // PNB BBD Bagh / Dalhousie
                    { top: '22%', left: '72%' }, // BGVB Barasat
                    { top: '65%', left: '48%' }, // Bandhan Gariahat
                  ];
                  const pos = positions[index % positions.length];

                  return (
                    <div
                      key={partner._id}
                      style={{ top: pos.top, left: pos.left }}
                      onClick={() => handleSelectPartner(partner)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                    >
                      {/* Pin Container */}
                      <div className="flex flex-col items-center">
                        <div className={`px-2 py-1 rounded-lg shadow-elevated text-[11px] font-bold whitespace-nowrap mb-1 transition-all ${
                          isSelected
                            ? 'bg-primary text-white scale-110 ring-2 ring-primary/30'
                            : 'bg-white text-text-primary hover:bg-surface-subtle'
                        }`}>
                          {partner.shortCode || partner.type}
                        </div>

                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-125 ${
                          isSelected
                            ? 'bg-primary text-white ring-4 ring-secondary/30'
                            : 'bg-secondary text-white'
                        }`}>
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div className="w-2 h-2 rounded-full bg-black/20 mt-0.5"></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Partner Preview Floating Card on Map */}
              {activePartnerId && (
                <div className="absolute bottom-4 left-4 right-4 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-border-subtle shadow-elevated animate-slideUp text-xs">
                  {(() => {
                    const current = partners.find((p) => p._id === activePartnerId);
                    if (!current) return null;
                    return (
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-secondary uppercase block">Selected Channel Partner</span>
                          <strong className="text-text-primary text-sm block leading-tight">{current.name}</strong>
                          <span className="text-text-secondary text-[11px]">{current.address}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleProceedToGuidance}
                          className="px-3 py-2 rounded-lg bg-primary hover:bg-primary-container text-white font-semibold text-xs shrink-0 flex items-center gap-1 shadow-sm"
                        >
                          <span>Confirm Desk</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-2xl w-full px-4">
        <div className="p-4 rounded-2xl bg-primary text-white shadow-drawer border border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-on-primary-container" />
            </div>
            <div>
              <p className="font-bold text-sm">
                Ready for Application Guidance
              </p>
              <p className="text-xs text-white/70">
                Scheme & Channel Partner locked. Generate verified document checklist.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleProceedToGuidance}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-secondary hover:bg-secondary-dark text-white font-bold text-xs transition-colors shrink-0 shadow-sm active:scale-98"
          >
            <span>Continue to Guidance</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
