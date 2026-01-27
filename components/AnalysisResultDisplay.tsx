import React, { useState, useMemo } from 'react';
import { AnalysisResponse, NewCard, Category } from '../types';
import { 
  X,
  Calendar, 
  Activity, 
  AlertCircle, 
  Beaker, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Plus,
  ExternalLink,
  Info,
  ChevronRight,
  ClipboardCheck,
  TrendingUp,
  Sparkles,
  Loader2
} from 'lucide-react';
import AnalyzerInput from './AnalyzerInput';
import { validateEvidenceSource } from '../utils/evidenceLink';
import { formatStudyPack } from '../utils/studyPack';
import NotebookLMModal from './NotebookLMModal';

interface AnalysisResultDisplayProps {
  data: AnalysisResponse | null;
  onAnalyzeNew: (text: string) => void;
  isAnalyzing: boolean;
}

const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ data, onAnalyzeNew, isAnalyzing }) => {
  const [showInput, setShowInput] = useState(false);
  const [selectedCard, setSelectedCard] = useState<NewCard | null>(null);

  const hasMatches = data?.matches_existing && data.matches_existing.length > 0;
  
  // Sort cards by year for the roadmap view
  const sortedCards = useMemo(() => {
    const cards = data?.new_cards || [];
    return [...cards].sort((a, b) => a.light.year - b.light.year);
  }, [data?.new_cards]);

  return (
    <div className="animate-in fade-in duration-700">
      
      {/* Existing Matches Notification */}
      {hasMatches && (
        <div className="mb-8 bg-amber-950/30 border border-amber-900/50 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-1">
              Duplicate Evidence Detected
            </h3>
            <ul className="text-xs text-amber-300/80 space-y-1 list-disc list-inside">
              {data?.matches_existing?.map((match, idx) => (
                <li key={idx}>
                  Matched <strong>{match.existing_id}</strong>: {match.reason}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ROADMAP GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        
        {/* Render New Cards */}
        {sortedCards.map((card, idx) => (
          <EvidenceCard 
            key={card.light.id || idx} 
            card={card} 
            onClick={() => setSelectedCard(card)} 
          />
        ))}

        {/* LOADING STATE CARD */}
        {isAnalyzing && <LoadingCard />}

        {/* FRONTIER CARD (Control / Input Trigger) */}
        {!showInput && !isAnalyzing && (
          <div className="group relative min-h-[320px] rounded-xl border-2 border-dashed border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 hover:border-blue-500/30 transition-all cursor-pointer flex flex-col items-center justify-center text-center p-8"
               onClick={() => setShowInput(true)}>
             <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-blue-900/30 flex items-center justify-center mb-4 transition-colors">
                <Plus className="w-6 h-6 text-slate-400 group-hover:text-blue-400" />
             </div>
             <h3 className="text-lg font-bold text-slate-200 mb-2">The Frontier</h3>
             <p className="text-sm text-slate-500 max-w-[200px] mb-6">
               Future milestones awaiting scientific validation.
             </p>
             <button className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold group-hover:bg-blue-600 group-hover:text-white transition-colors">
               Add a new research article
             </button>
             
             {/* Invite hint */}
             <div className="absolute -bottom-10 left-0 right-0 text-[10px] text-slate-600 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Want to add newer research or local updates? Click above.
             </div>
          </div>
        )}

        {/* ACTIVE INPUT */}
        {showInput && (
           <div className="md:col-span-2 lg:col-span-3">
             <AnalyzerInput 
                onAnalyze={(text) => {
                  onAnalyzeNew(text);
                  setShowInput(false);
                }} 
                isAnalyzing={isAnalyzing}
                onCancel={() => setShowInput(false)}
                title="Expand the Roadmap"
                description="Paste an abstract, DOI, or clinical trial summary to add a new validated node to the evidence timeline."
             />
           </div>
        )}

      </div>

      {/* FULL ANALYSIS MODAL */}
      {selectedCard && (
        <FullAnalysisModal 
          card={selectedCard} 
          onClose={() => setSelectedCard(null)} 
        />
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

/* LoadingCard: Placeholder during analysis */
const LoadingCard: React.FC = () => (
  <div className="glass-card rounded-xl p-6 flex flex-col h-full border border-blue-500/30 shadow-lg shadow-blue-900/10 relative overflow-hidden animate-in fade-in duration-300">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse" />
    
    <div className="flex items-start justify-between mb-5 animate-pulse">
      <div className="flex flex-col gap-2.5">
         <div className="h-5 w-24 bg-slate-800 rounded"></div>
         <div className="h-3 w-16 bg-slate-800 rounded ml-0.5"></div>
      </div>
      <div className="h-5 w-20 bg-slate-800 rounded"></div>
    </div>

    <div className="h-6 w-3/4 bg-slate-800 rounded mb-3 animate-pulse"></div>
    <div className="space-y-2 mb-6 animate-pulse">
      <div className="h-3 w-full bg-slate-800 rounded"></div>
      <div className="h-3 w-5/6 bg-slate-800 rounded"></div>
      <div className="h-3 w-4/6 bg-slate-800 rounded"></div>
    </div>

    <div className="mt-auto pt-4 border-t border-slate-800/50 flex items-center justify-center gap-2 text-blue-400">
       <Loader2 className="w-4 h-4 animate-spin" />
       <span className="text-xs font-mono uppercase tracking-widest">Validating Evidence...</span>
    </div>
  </div>
);

/* CategoryBadge: Color-coded label for research categories */
const CategoryBadge: React.FC<{ category: Category }> = ({ category }) => {
  const colors: Record<Category, string> = {
    "Discovery": "bg-blue-950/40 text-blue-400 border-blue-900/50",
    "Diagnostics": "bg-emerald-950/40 text-emerald-400 border-emerald-900/50",
    "Treatment": "bg-purple-950/40 text-purple-400 border-purple-900/50",
    "Prevention": "bg-rose-950/40 text-rose-400 border-rose-900/50",
    "Long-acting": "bg-indigo-950/40 text-indigo-400 border-indigo-900/50",
    "Vaccines": "bg-amber-950/40 text-amber-400 border-amber-900/50",
    "Cure Research": "bg-cyan-950/40 text-cyan-400 border-cyan-900/50"
  };

  return (
    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${colors[category] || 'bg-slate-900 text-slate-400 border-slate-800'}`}>
      {category}
    </span>
  );
};

/* EvidenceCard: Light preview of a milestone node */
const EvidenceCard: React.FC<{ card: NewCard; onClick: () => void }> = ({ card, onClick }) => {
  const { light } = card;

  return (
    <div className="group glass-card rounded-xl p-6 flex flex-col h-full hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-900/10 transition-all cursor-pointer relative overflow-hidden" onClick={onClick}>
      
      {/* Top Glow on Hover */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex flex-col gap-2.5">
           <CategoryBadge category={light.category} />
           <span className="text-xs font-mono text-slate-500 flex items-center gap-1.5 ml-0.5">
             <Calendar className="w-3 h-3" />
             {light.year} {light.month ? `/ ${light.month}` : ''}
           </span>
        </div>
        <div className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
          light.status === 'Validated' 
            ? 'text-emerald-400 border-emerald-900/30 bg-emerald-950/20' 
            : 'text-amber-400 border-amber-900/30 bg-amber-950/20'
        }`}>
          {light.status}
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-100 mb-3 group-hover:text-blue-200 transition-colors leading-snug">
        {light.title}
      </h3>

      <p className="text-sm text-slate-400 leading-relaxed mb-6 line-clamp-3">
        {light.one_liner}
      </p>

      <div className="mt-auto pt-4 border-t border-slate-800/50 flex items-center justify-between">
         <div className="flex flex-wrap gap-1.5">
            {light.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-slate-900/50 text-[10px] text-slate-500 border border-slate-800/50">
                #{tag}
              </span>
            ))}
         </div>
         <div className="text-blue-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
           <ArrowRight className="w-4 h-4" />
         </div>
      </div>
    </div>
  );
};

/* FullAnalysisModal: On-demand details for a specific milestone */
const FullAnalysisModal: React.FC<{ card: NewCard; onClose: () => void }> = ({ card, onClose }) => {
  const { light, full } = card;
  const [showNotebookModal, setShowNotebookModal] = useState(false);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
        <div className="relative w-full md:max-w-4xl h-full md:h-auto md:max-h-[92vh] bg-slate-900 border border-slate-800 md:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-slate-800 bg-slate-900/95 backdrop-blur flex items-start justify-between z-10 sticky top-0 md:static">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                  <CategoryBadge category={light.category} />
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{light.year} MILESTONE</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight pr-8">{light.title}</h2>
            </div>
            <button onClick={onClose} className="p-2 -mr-2 -mt-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 bg-slate-900/50">
            
            {/* Canonical Claim Section */}
            <section>
              <div className="flex items-center gap-2 mb-3 text-blue-400">
                  <ClipboardCheck className="w-4 h-4" />
                  <h3 className="text-xs font-bold uppercase tracking-widest">Canonical Claim</h3>
              </div>
              <p className="text-xl md:text-2xl text-slate-100 font-light leading-relaxed">
                {full.canonical_claim}
              </p>
            </section>

            {/* Why it Matters */}
            <section className="bg-slate-800/20 border border-slate-800/60 rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-3 text-blue-400">
                  <Info className="w-4 h-4" />
                  <h3 className="text-xs font-bold uppercase tracking-widest">Why it matters today</h3>
              </div>
              <p className="text-base text-slate-300 leading-relaxed font-light">
                {full.why_it_matters_today}
              </p>
            </section>

            {/* Grid: Validation & Limitations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              
              {/* What was Validated */}
              <div>
                  <div className="flex items-center gap-2 mb-4 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-widest">What was Validated</h3>
                  </div>
                  <ul className="space-y-3">
                    {full.what_was_validated.map((item, i) => (
                      <li key={i} className="text-sm text-slate-300 leading-relaxed flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500/40 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
              </div>

              {/* Limitations */}
              <div>
                  <div className="flex items-center gap-2 mb-4 text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-widest">Limitations & Biases</h3>
                  </div>
                  <ul className="space-y-3">
                    {full.limitations.map((item, i) => (
                      <li key={i} className="text-sm text-slate-300 leading-relaxed flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50 mt-2 shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
              </div>
            </div>

            {/* Grid: Gaps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 pt-4 border-t border-slate-800/30">
              
              {/* Scientific Gaps */}
              <div>
                  <div className="flex items-center gap-2 mb-4 text-blue-400">
                    <Beaker className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-widest">Scientific Gaps</h3>
                  </div>
                  <ul className="space-y-3">
                    {full.scientific_gaps.map((item, i) => (
                      <li key={i} className="text-sm text-slate-300 leading-relaxed flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mt-2 shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
              </div>

              {/* Implementation Gaps */}
              <div>
                  <div className="flex items-center gap-2 mb-4 text-indigo-400">
                    <Activity className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-widest">Implementation Barriers</h3>
                  </div>
                  <ul className="space-y-3">
                    {full.implementation_gaps.map((item, i) => (
                      <li key={i} className="text-sm text-slate-300 leading-relaxed flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 mt-2 shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
              </div>
            </div>

            {/* Quantitative Findings */}
            {full.quantitative_findings.length > 0 && (
              <section className="pt-4">
                <div className="flex items-center gap-2 mb-6 text-slate-400">
                    <TrendingUp className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-widest">Quantitative Data</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {full.quantitative_findings.map((f, i) => (
                    <div key={i} className="p-5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
                      <div className="text-2xl font-light text-blue-400 mb-1">{f.value}</div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{f.metric}</div>
                      <p className="text-xs text-slate-500 leading-relaxed italic">{f.context}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Sources */}
            <section className="pt-8 border-t border-slate-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-2 text-slate-500">
                    <BookOpen className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-widest">Evidence Sources</h3>
                </div>
                <button 
                    onClick={() => setShowNotebookModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 hover:from-blue-800/40 hover:to-indigo-800/40 text-blue-200 hover:text-white rounded-lg border border-blue-500/20 hover:border-blue-400/40 transition-all text-xs font-semibold shadow-sm"
                >
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    Study in NotebookLM
                </button>
              </div>

              <div className="space-y-2">
                {full.sources.primary.map((src, i) => {
                  const validation = validateEvidenceSource(src);
                  return (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 hover:bg-slate-900/50 border border-slate-800/40 transition-colors group">
                        <div className="flex items-center gap-3">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
                            {src.type}
                          </span>
                          <span className="text-sm text-slate-300 font-medium font-mono group-hover:text-blue-300 transition-colors">
                            {src.citation || src.id}
                          </span>
                        </div>
                        {validation.ok && (
                          <a href={validation.resolvedUrl} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-blue-400 transition-colors p-1">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                    </div>
                  );
                })}
                {full.sources.secondary.map((src, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-transparent opacity-60 hover:opacity-100 transition-opacity">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-500 border border-slate-800">
                        {src.publisher}
                      </span>
                      <span className="text-xs text-slate-500 italic">
                        {src.title} ({src.year})
                      </span>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-900 text-center z-10">
            <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.2em]">
              LAST MILE // VALIDATED CORE RECORD // {light.id}
            </p>
          </div>
        </div>
      </div>

      {/* Notebook Modal */}
      {showNotebookModal && (
        <NotebookLMModal 
          isOpen={showNotebookModal}
          onClose={() => setShowNotebookModal(false)}
          seedText={formatStudyPack(card)}
          title={light.title}
        />
      )}
    </>
  );
};

export default AnalysisResultDisplay;