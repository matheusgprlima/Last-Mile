import React from 'react';
import { ArrowRight, Activity, Globe } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] rounded-full bg-indigo-900/10 blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/50 border border-blue-800/50 text-blue-300 text-xs font-mono mb-8 tracking-wider animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          LIVE EVIDENCE TRACKING
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
          Tracking the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Last Mile</span> <br />
          of HIV Research
        </h1>

        {/* Hero Subtitle */}
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          An evidence-based roadmap of what science has proven, what is implemented today, and what still stands between research and a cure.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
          <button 
            onClick={onStart}
            className="group px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
          >
            Explore the Evidence Roadmap
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Trust Section */}
        <div className="w-full pt-10 border-t border-slate-800/50 animate-in fade-in duration-1000 delay-500">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-6">
            Built on trusted global scientific sources
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Text-based Logos for simplicity */}
             <span className="text-lg font-serif font-bold text-slate-300">Nature</span>
             <span className="text-lg font-serif font-bold text-slate-300">The Lancet</span>
             <div className="flex items-center gap-1 font-sans font-bold text-slate-300">
               <Globe className="w-4 h-4" /> WHO
             </div>
             <span className="text-lg font-sans font-bold text-slate-300 tracking-tight">NIH</span>
             <span className="text-lg font-sans font-bold text-slate-300">CDC</span>
             <span className="text-lg font-sans font-bold text-slate-300 tracking-tighter">UNAIDS</span>
          </div>
          <p className="text-xs text-slate-600 mt-6">
            All milestones are derived from peer-reviewed research, clinical trials, and official global health institutions.
          </p>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;