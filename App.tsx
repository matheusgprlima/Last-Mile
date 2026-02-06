import React, { useState, useEffect } from 'react';
import { Activity, AlertOctagon, ChevronLeft, Map, LifeBuoy, Radio, Search, HelpCircle } from 'lucide-react';
import LandingPage from './components/LandingPage';
import AnalysisResultDisplay from './components/AnalysisResultDisplay';
import DiscoveryFeed from './components/DiscoveryFeed';
import Assist from './pages/Assist';
import GetHelp from './pages/GetHelp';
import WhoThisIsFor from './pages/WhoThisIsFor';
import { analyzeEvidence } from './services/geminiService';
import { AnalysisResponse } from './types';
import { DEFAULT_MILESTONES } from './data/defaultMilestones';
import { prefetchDiscoveries } from './utils/discoveryFeedCache';

function App() {
  const [view, setView] = useState<'landing' | 'app' | 'assist' | 'discoveries' | 'help' | 'who-this-is-for'>('landing');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize with default milestones
  useEffect(() => {
    if (!result) {
      setResult({
        rejected: false,
        new_cards: DEFAULT_MILESTONES,
        matches_existing: []
      });
    }
  }, []);

  // Prefetch discoveries as soon as user enters main app (so Discoveries tab is ready)
  useEffect(() => {
    if (view !== 'landing') {
      prefetchDiscoveries();
    }
  }, [view]);

  const handleAnalyze = async (text: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const data = await analyzeEvidence(text);
      
      setResult(prev => {
        // Always preserve existing cards (or fallback to defaults)
        const currentCards = prev?.new_cards || DEFAULT_MILESTONES;

        if (data.rejected) {
            // If rejected, update status but keep existing data
            return {
                rejected: true,
                reason: data.reason,
                matches_existing: prev?.matches_existing || [],
                new_cards: currentCards
            };
        } else {
            // If successful, append new cards to existing ones
            return {
                rejected: false,
                matches_existing: data.matches_existing,
                new_cards: [...currentCards, ...(data.new_cards || [])]
            };
        }
      });

    } catch (err) {
      setError("Unable to process evidence. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // View: Landing
  if (view === 'landing') {
    return <LandingPage onNavigate={(v) => setView(v)} />;
  }

  // View: Main App Layout
  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('landing')} className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-white transition-colors" title="Back to Home">
               <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
               <Activity className="w-5 h-5 text-blue-500" />
               <h1 className="text-sm font-bold text-slate-100 tracking-wide hidden sm:block">
                 LAST MILE <span className="text-slate-600 px-2">|</span> <span className="text-slate-400 font-normal">Evidence Hub</span>
               </h1>
               <h1 className="text-sm font-bold text-slate-100 tracking-wide sm:hidden">
                 LAST MILE
               </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-6">
             <nav className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar">
               <button 
                 onClick={() => setView('app')}
                 className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap ${view === 'app' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
               >
                 <Map className="w-3 h-3" />
                 Roadmap
               </button>
               <button 
                 onClick={() => setView('discoveries')}
                 className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap ${view === 'discoveries' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
               >
                 <Radio className="w-3 h-3" />
                 Discoveries
               </button>
               <button 
                 onClick={() => setView('help')}
                 className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap ${view === 'help' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
               >
                 <Search className="w-3 h-3" />
                 Get Help
               </button>
               <button 
                 onClick={() => setView('assist')}
                 className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap ${view === 'assist' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
               >
                 <LifeBuoy className="w-3 h-3" />
                 Agents
               </button>
               <button 
                 onClick={() => setView('who-this-is-for')}
                 className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap ${view === 'who-this-is-for' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
               >
                 <HelpCircle className="w-3 h-3" />
                 Who
               </button>
             </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        
        {view === 'app' && (
          <>
            {/* Intro / Context */}
            <div className="mb-10 animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold text-white mb-2">Scientific Evidence Roadmap</h2>
              <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">
                 A living timeline of validated HIV/AIDS research milestones. 
                 Pre-loaded with foundational science; use the Frontier card to expand the record.
              </p>
            </div>

            {/* Global Error */}
            {error && (
              <div className="mb-8 rounded-lg bg-red-950/30 border border-red-900/50 p-4 flex items-center gap-3">
                <AlertOctagon className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Rejection State */}
            {result?.rejected && (
               <div className="mb-8 rounded-xl bg-orange-950/20 border border-orange-900/50 p-6 flex items-start gap-4 animate-in fade-in">
                 <AlertOctagon className="w-6 h-6 text-orange-500 shrink-0" />
                 <div>
                   <h3 className="text-sm font-bold text-orange-400 mb-1">Evidence Rejected</h3>
                   <p className="text-sm text-slate-400 mb-3">{result.reason}</p>
                   <button 
                     onClick={() => setResult(prev => ({ ...prev!, rejected: false }))}
                     className="text-xs text-orange-400 hover:text-orange-300 underline"
                   >
                     Dismiss
                   </button>
                 </div>
               </div>
            )}

            {/* The Grid */}
            <AnalysisResultDisplay 
               data={result} 
               onAnalyzeNew={handleAnalyze} 
               isAnalyzing={isAnalyzing} 
            />
          </>
        )}

        {view === 'discoveries' && (
          <DiscoveryFeed />
        )}

        {view === 'help' && (
          <GetHelp />
        )}

        {view === 'assist' && (
          <Assist onSelectAgent={(agent) => console.log("Selected agent:", agent.name)} />
        )}

        {view === 'who-this-is-for' && (
          <WhoThisIsFor />
        )}

      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center mt-20">
         <p className="text-xs text-slate-700 font-mono">
           LAST MILE platform // Evidence-based Logic
         </p>
      </footer>
    </div>
  );
}

export default App;