import React, { useState, useMemo, useCallback } from 'react';
import { getHelpCardsForLocation, LocationKey, HelpCard, type HelpLink } from '../data/helpContent';
import { MapPin, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle, ChevronDown, Globe, Ban, RefreshCw } from 'lucide-react';
import { isValidHttpsUrl } from '../utils/evidenceLink';

const LOCATION_LABELS: Record<string, string> = {
  BR: "Brazil",
  IR: "Iran",
  PS: "Gaza / Palestine",
  UA: "Ukraine",
  VE: "Venezuela",
  GLOBAL: "Global",
};

// All US states + DC (alphabetical by name)
const US_STATES: { code: string; name: string }[] = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

function getLocationLabel(country: string, region: string): string {
  if (country === "US") {
    const state = US_STATES.find((s) => s.code === region);
    return state ? `${state.name}, United States` : `${region}, United States`;
  }
  return LOCATION_LABELS[country] ?? country;
}

const GetHelpSection: React.FC = () => {
  const [country, setCountry] = useState<string>("US");
  const [region, setRegion] = useState<string>("CA"); // Default to California
  const [immigrantToggle, setImmigrantToggle] = useState<boolean>(false);
  const [linkOverrides, setLinkOverrides] = useState<Record<string, HelpLink[]>>({});
  const [regeneratingCardId, setRegeneratingCardId] = useState<string | null>(null);

  const cards = useMemo(() => {
    return getHelpCardsForLocation({ country, region }, immigrantToggle);
  }, [country, region, immigrantToggle]);

  const locationLabel = useMemo(() => getLocationLabel(country, region), [country, region]);

  const handleRegenerateLinks = useCallback(async (card: HelpCard) => {
    setRegeneratingCardId(card.id);
    try {
      const res = await fetch('/api/help/regenerate-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: card.id,
          title: card.title,
          description: card.description,
          locationLabel,
          currentLinkLabels: card.links.map((l) => l.label),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? 'Failed to regenerate links');
      }
      const data = await res.json();
      const links = Array.isArray(data?.links) ? data.links : [];
      setLinkOverrides((prev) => ({ ...prev, [card.id]: links as HelpLink[] }));
    } catch (e) {
      console.error('Regenerate help links:', e);
      alert(e instanceof Error ? e.message : 'Failed to regenerate links. Please try again.');
    } finally {
      setRegeneratingCardId(null);
    }
  }, [locationLabel]);

  // All US states have content (CA/FL state-specific, rest national); plus BR, IR, PS, UA, VE
  const hasOfficialConfig =
    country === "US" ||
    ["BR", "IR", "PS", "UA", "VE"].includes(country);

  return (
    <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
            Get Help
          </h2>
          <p className="text-slate-400 text-sm max-w-lg">
            Find official, location-based resources for testing, treatment, and support. 
            <span className="block mt-1 text-slate-500 text-xs italic">
              * This is educational navigation, not medical advice.
            </span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800 backdrop-blur-sm">
          {/* Location Selectors */}
          <div className="flex gap-2">
            <div className="relative">
              <select 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="appearance-none bg-slate-800 text-slate-200 text-sm pl-9 pr-8 py-2 rounded-lg border border-slate-700 focus:border-blue-500 outline-none cursor-pointer hover:bg-slate-700 transition-colors"
              >
                <option value="US">United States</option>
                <option value="BR">Brazil</option>
                <option value="IR">Iran</option>
                <option value="PS">Gaza / Palestine</option>
                <option value="UA">Ukraine</option>
                <option value="VE">Venezuela</option>
                <option value="GLOBAL">Other (Global)</option>
              </select>
              <Globe className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
              <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>

            {country === "US" && (
              <div className="relative">
                <select 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="appearance-none bg-slate-800 text-slate-200 text-sm pl-9 pr-8 py-2 rounded-lg border border-slate-700 focus:border-blue-500 outline-none cursor-pointer hover:bg-slate-700 transition-colors min-w-[180px]"
                >
                  {US_STATES.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <MapPin className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            )}
          </div>

          {/* Immigrant Toggle */}
          <label className="flex items-center gap-2 cursor-pointer group select-none">
            <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${immigrantToggle ? 'bg-blue-600' : 'bg-slate-700'}`}>
              <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${immigrantToggle ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={immigrantToggle} 
              onChange={() => setImmigrantToggle(!immigrantToggle)} 
            />
            <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors max-w-[120px] leading-tight">
              I’m an immigrant / documentation pending
            </span>
          </label>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!hasOfficialConfig && (
          <div className="md:col-span-2 bg-amber-950/20 border border-amber-900/30 rounded-lg p-4 flex items-start gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-400">Limited Local Data</h4>
              <p className="text-xs text-amber-300/80 mt-1">
                We don't have official sources configured for this specific location yet. Showing global resources from WHO and UNAIDS.
              </p>
            </div>
          </div>
        )}

        {cards.map((card) => (
          <HelpCardComponent
            key={card.id}
            card={card}
            linksOverride={linkOverrides[card.id]}
            regenerating={regeneratingCardId === card.id}
            onRegenerateLinks={() => handleRegenerateLinks(card)}
          />
        ))}
      </div>
    </section>
  );
};

const HelpCardComponent: React.FC<{
  card: HelpCard;
  linksOverride?: HelpLink[];
  regenerating: boolean;
  onRegenerateLinks: () => void;
}> = ({ card, linksOverride, regenerating, onRegenerateLinks }) => {
  const links = linksOverride ?? card.links;

  return (
    <div className="glass-card p-5 rounded-xl border border-slate-800 hover:border-blue-500/30 transition-all group">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-slate-200 group-hover:text-blue-200 transition-colors">
          {card.title}
        </h3>
        {card.id === 'immigrant_legal' && (
          <span className="px-2 py-0.5 bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 text-[10px] font-bold uppercase rounded tracking-wider">
            Safe Access
          </span>
        )}
      </div>
      
      <p className="text-sm text-slate-400 mb-5 leading-relaxed">
        {card.description}
      </p>

      {/* Links */}
      <div className="space-y-2 mb-4">
        {links.map((link, idx) => {
          const isValid = isValidHttpsUrl(link.url);
          if (isValid) {
            return (
              <a 
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/50 hover:bg-blue-900/20 border border-slate-800 hover:border-blue-800 transition-all group/link"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-blue-400 group-hover/link:text-blue-300">
                    {link.label}
                  </span>
                  {link.note && (
                    <span className="text-[10px] text-slate-500 group-hover/link:text-slate-400">
                      {link.note}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-mono text-slate-600 bg-slate-900 px-1.5 rounded border border-slate-800">
                     {link.authority}
                   </span>
                   <ExternalLink className="w-3 h-3 text-slate-600 group-hover/link:text-blue-400" />
                </div>
              </a>
            );
          } else {
            return (
              <div 
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/20 border border-slate-800/50 opacity-60 cursor-not-allowed"
                title="Resource unavailable"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-500">
                    {link.label}
                  </span>
                  <span className="text-[10px] text-slate-600">
                    Link unavailable
                  </span>
                </div>
                <Ban className="w-3 h-3 text-slate-600" />
              </div>
            );
          }
        })}
      </div>

      {/* Regenerate links button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={onRegenerateLinks}
          disabled={regenerating}
          className="flex items-center gap-2 w-full justify-center py-2.5 px-3 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 hover:border-slate-600 transition-all text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {regenerating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Regenerating…
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5" />
              In case of bad links click here to regenerate them
            </>
          )}
        </button>
      </div>

      {/* Metadata Footer (Eligibility / Checklist) */}
      {(card.eligibility_notes || card.what_you_need) && (
        <div className="pt-4 border-t border-slate-800/50 space-y-3">
          {card.eligibility_notes && card.eligibility_notes.length > 0 && (
             <div>
               <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Eligibility Notes</div>
               <ul className="space-y-1">
                 {card.eligibility_notes.map((note, i) => (
                   <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                     <span className="text-blue-500/50 mt-0.5">•</span> {note}
                   </li>
                 ))}
               </ul>
             </div>
          )}
          {card.what_you_need && card.what_you_need.length > 0 && (
             <div>
               <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">What you need</div>
               <ul className="space-y-1">
                 {card.what_you_need.map((item, i) => (
                   <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                     <CheckCircle2 className="w-3 h-3 text-emerald-500/50 shrink-0" />
                     {item}
                   </li>
                 ))}
               </ul>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GetHelpSection;