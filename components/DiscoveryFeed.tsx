import React, { useState, useEffect, useMemo } from 'react';
import { DiscoveryCard, DiscoveryResponse } from '../types';
import AnalyzerInput from './AnalyzerInput';
import { SEED_DISCOVERIES } from '../data/discoverySeed';
import { 
  Globe, 
  Calendar, 
  ExternalLink, 
  Radio, 
  Newspaper,
  CheckCircle2,
  AlertOctagon,
  TrendingUp,
  MapPin,
  RefreshCw,
  Clock
} from 'lucide-react';
import { analyzeDiscovery } from '../services/geminiService';
import { validateEvidenceSource } from '../utils/evidenceLink';

const SEEN_STORAGE_KEY = 'last_mile_seen_discoveries';

const DiscoveryFeed: React.FC = () => {
  const [showInput, setShowInput] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userCards, setUserCards] = useState<DiscoveryCard[]>([]);
  const [activeFeed, setActiveFeed] = useState<DiscoveryCard[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('Just now');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load seen IDs from storage
  const getSeenIds = (): string[] => {
    try {
      return JSON.parse(localStorage.getItem(SEEN_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  };

  const markIdsAsSeen = (ids: string[]) => {
    const seen = getSeenIds();
    const updated = Array.from(new Set([...seen, ...ids]));
    localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(updated));
  };

  const refreshFeed = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/discoveries/feed?refresh=1');
      const data = await res.json();
      if (data.success && Array.isArray(data.discoveries) && data.discoveries.length > 0) {
        const seenIds = getSeenIds();
        const unseen = data.discoveries.filter((d: DiscoveryCard) => !seenIds.includes(d.id));
        const pool = unseen.length >= 4 ? unseen : data.discoveries;
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 8);
        setActiveFeed(selected);
        markIdsAsSeen(selected.map((s: DiscoveryCard) => s.id));
        setLastUpdate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } else {
        const seenIds = getSeenIds();
        const unseen = SEED_DISCOVERIES.filter(d => !seenIds.includes(d.id));
        const pool = unseen.length >= 4 ? unseen : SEED_DISCOVERIES;
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 8);
        setActiveFeed(selected);
        markIdsAsSeen(selected.map(s => s.id));
        setLastUpdate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        if (!res.ok) setError('Could not load live feed. Showing curated discoveries.');
        else if (data.discoveries?.length === 0)
          setError('Nenhuma descoberta nova nesta atualização. Exibindo destaques curados.');
        else setError(null);
      }
    } catch {
      const seenIds = getSeenIds();
      const unseen = SEED_DISCOVERIES.filter(d => !seenIds.includes(d.id));
      const pool = unseen.length >= 4 ? unseen : SEED_DISCOVERIES;
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 4);
      setActiveFeed(selected);
      markIdsAsSeen(selected.map(s => s.id));
      setLastUpdate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setError('Network error. Showing cached discoveries.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load: try API first, then seed
  useEffect(() => {
    void refreshFeed();
  }, []);

  const handleAnalyze = async (text: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result: DiscoveryResponse = await analyzeDiscovery(text);
      if (result.discovery_cards && result.discovery_cards.length > 0) {
        setUserCards(prev => [...result.discovery_cards, ...prev]);
        setShowInput(false);
      } else if (result.rejected_items && result.rejected_items.length > 0) {
        setError(`Input rejected: ${result.rejected_items[0].reason}`);
      }
    } catch (e) {
      setError("Failed to analyze discovery. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Combine user-added and auto-fed cards
  const allCards = useMemo(() => {
    // User cards always go first, followed by the active feed
    return [...userCards, ...activeFeed];
  }, [userCards, activeFeed]);

  const handleSourceClick = (src: string) => {
    const result = validateEvidenceSource(src);
    if (result.ok && result.resolvedUrl) {
      window.open(result.resolvedUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert(`Invalid Source: ${result.reason || "Unable to resolve link."}`);
    }
  };

  return (
    <div className="animate-in fade-in duration-700 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
             <h2 className="text-sm font-bold text-red-400 tracking-wider uppercase">Live Monitor</h2>
           </div>
           <h1 className="text-3xl font-bold text-white mb-2">Global Discoveries</h1>
           <p className="text-slate-400 text-sm max-w-xl">
             Advances only: new treatments, trials, policy progress, and research toward a cure — not general news.
           </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-slate-500 px-3 py-1.5 border border-slate-800 rounded-lg">
            <Clock className="w-3 h-3" />
            UPDATED {lastUpdate.toUpperCase()}
          </div>
          <button 
            onClick={() => void refreshFeed()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors text-xs font-semibold uppercase tracking-wide group disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh feed with latest HIV/AIDS news"
          >
            <RefreshCw className={`w-4 h-4 group-active:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading…' : 'Refresh'}
          </button>
          <button 
            onClick={() => setShowInput(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg border border-red-500 transition-colors text-xs font-semibold uppercase tracking-wide"
          >
            <Radio className="w-4 h-4" />
            Inject News
          </button>
        </div>
      </div>

      {/* Input Overlay */}
      {showInput && (
        <div className="mb-12">
          <AnalyzerInput 
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            onCancel={() => setShowInput(false)}
            title="Discovery Monitor Input"
            description="Paste a news article, press release, or surveillance report to extract a Discovery Card."
            placeholder="Paste text here..."
          />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-8 rounded-lg bg-red-950/30 border border-red-900/50 p-4 flex items-center gap-3 animate-in fade-in">
          <AlertOctagon className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Feed Grid */}
      <div className="space-y-6">
        {allCards.length === 0 && !showInput && (
          <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/30">
            <Newspaper className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-slate-300 font-semibold mb-1">No discoveries loaded</h3>
            <p className="text-slate-500 text-sm">Wait for auto-sync or inject a news report.</p>
          </div>
        )}

        {allCards.map((card, idx) => (
          <div key={card.id || idx} className="glass-card p-6 md:p-8 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row gap-8 relative overflow-hidden group">
            
            {/* Type Indicator Line */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 opacity-75 bg-gradient-to-b from-red-500 to-transparent`} />

            <div className="flex-1">
              {/* Meta Header */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                 <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-950/40 text-red-400 border border-red-900/50">
                   {card.discovery_type}
                 </span>
                 <span className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                   <MapPin className="w-3 h-3" />
                   {card.country_or_region}
                 </span>
                 <span className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                   <Calendar className="w-3 h-3" />
                   {card.date_announced}
                 </span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-red-100 transition-colors">
                {card.title}
              </h3>
              
              <div className="space-y-4">
                 <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                   {card.summary}
                 </p>
                 
                 <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/50">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                       <TrendingUp className="w-3 h-3" />
                       Why this matters
                    </h4>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {card.why_this_matters}
                    </p>
                 </div>
              </div>

              {/* Sources */}
              <div className="mt-6 flex flex-wrap gap-2">
                {card.sources.map((src, i) => {
                   const validation = validateEvidenceSource(src);
                   const label = card.source_labels?.[i] ?? (src.startsWith('http') ? 'Read more' : src);
                   return (
                     <button 
                       key={i} 
                       onClick={() => handleSourceClick(src)}
                       disabled={!validation.ok}
                       className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] rounded border transition-all ${
                         validation.ok 
                         ? 'bg-slate-950 text-slate-300 border-slate-700 hover:border-blue-500/50 hover:bg-slate-900 cursor-pointer' 
                         : 'bg-slate-950 text-slate-600 border-slate-800 opacity-50 cursor-not-allowed'
                       }`}
                     >
                       <ExternalLink className={`w-3 h-3 ${validation.ok ? 'text-blue-400' : 'text-slate-700'}`} />
                       {label}
                     </button>
                   );
                })}
              </div>
            </div>

            {/* Sidebar / Context */}
            <div className="md:w-64 flex-shrink-0 flex flex-col gap-4 pt-2 md:border-l md:border-slate-800 md:pl-8">
               <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Confidence Basis</div>
                  <div className="flex items-start gap-2 text-sm text-emerald-400">
                     <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                     {card.confidence_basis}
                  </div>
               </div>
               
               <div className="mt-auto">
                 <div className="text-[10px] font-mono text-slate-600">ID: {card.id}</div>
               </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscoveryFeed;