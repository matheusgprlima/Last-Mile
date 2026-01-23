import React from 'react';
import { ArrowRight, Activity, Globe, Search, Map, ShieldCheck, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: 'app' | 'discoveries' | 'help' | 'who-this-is-for') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-x-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] rounded-full bg-indigo-900/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col items-center pt-20 pb-12">
        
        {/* --- HERO SECTION --- */}
        <div className="max-w-4xl text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/50 border border-blue-800/50 text-blue-300 text-xs font-mono mb-8 tracking-wider animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            LIVE EVIDENCE HUB
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 leading-tight">
            Last Mile: HIV Science <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">+ Care + Help,</span> in one place.
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            A trusted HIV hub for people living with HIV, families, students, and clinicians — combining validated milestones, live discoveries, and location-based help.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            <button 
              onClick={() => onNavigate('app')}
              className="px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
            >
              Explore the Roadmap
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onNavigate('help')}
              className="group px-8 py-4 rounded-lg bg-slate-900/40 hover:bg-emerald-950/20 text-slate-200 hover:text-emerald-200 font-semibold text-sm border border-slate-700 hover:border-emerald-500/30 transition-all flex items-center gap-2 backdrop-blur-sm"
              title="Access testing, treatment, and support resources"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500/70 group-hover:text-emerald-400 transition-colors" />
              Find Help Near You
            </button>
            <button 
              onClick={() => onNavigate('who-this-is-for')}
              className="px-5 py-4 text-sm text-slate-500 hover:text-slate-300 font-medium transition-colors hover:underline underline-offset-4 decoration-slate-800/50"
            >
              Is this for me?
            </button>
          </div>
        </div>

        {/* --- 3 PILLARS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-24 animate-in fade-in duration-1000 delay-300">
          
          {/* Pillar A: Roadmap */}
          <div 
            onClick={() => onNavigate('app')}
            className="glass-card p-8 rounded-2xl border border-slate-800 hover:border-blue-500/30 hover:bg-slate-900/60 transition-all cursor-pointer group"
          >
             <div className="w-12 h-12 rounded-xl bg-blue-900/20 border border-blue-800/30 flex items-center justify-center mb-6 text-blue-400 group-hover:text-blue-300 group-hover:scale-105 transition-all">
               <Map className="w-6 h-6" />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Evidence Roadmap</h3>
             <p className="text-sm text-slate-400 mb-6 leading-relaxed">
               A timeline of validated science. From the 1983 discovery to the Berlin Patient and beyond.
             </p>
             <ul className="space-y-2 mb-8">
               <li className="flex items-center gap-2 text-xs text-slate-500">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Validated Milestones
               </li>
               <li className="flex items-center gap-2 text-xs text-slate-500">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Scientific Gaps
               </li>
             </ul>
             <div className="flex items-center text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
               EXPLORE HISTORY <ChevronRight className="w-3 h-3 ml-1" />
             </div>
          </div>

          {/* Pillar B: Discoveries */}
          <div 
            onClick={() => onNavigate('discoveries')}
            className="glass-card p-8 rounded-2xl border border-slate-800 hover:border-red-500/30 hover:bg-slate-900/60 transition-all cursor-pointer group"
          >
             <div className="w-12 h-12 rounded-xl bg-red-900/20 border border-red-800/30 flex items-center justify-center mb-6 text-red-400 group-hover:text-red-300 group-hover:scale-105 transition-all">
               <Activity className="w-6 h-6" />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Live Discoveries</h3>
             <p className="text-sm text-slate-400 mb-6 leading-relaxed">
               Real-time monitor of new clinical trials, policy changes, and public health impact.
             </p>
             <ul className="space-y-2 mb-8">
               <li className="flex items-center gap-2 text-xs text-slate-500">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Recent Trials
               </li>
               <li className="flex items-center gap-2 text-xs text-slate-500">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Policy Updates
               </li>
             </ul>
             <div className="flex items-center text-xs font-bold text-red-400 group-hover:translate-x-1 transition-transform">
               SEE WHAT'S NEW <ChevronRight className="w-3 h-3 ml-1" />
             </div>
          </div>

          {/* Pillar C: Get Help */}
          <div 
            onClick={() => onNavigate('help')}
            className="glass-card p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/30 hover:bg-slate-900/60 transition-all cursor-pointer group"
          >
             <div className="w-12 h-12 rounded-xl bg-emerald-900/20 border border-emerald-800/30 flex items-center justify-center mb-6 text-emerald-400 group-hover:text-emerald-300 group-hover:scale-105 transition-all">
               <Search className="w-6 h-6" />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Get Help</h3>
             <p className="text-sm text-slate-400 mb-6 leading-relaxed">
               Find testing, treatment, and support resources tailored to your location.
             </p>
             <ul className="space-y-2 mb-8">
               <li className="flex items-center gap-2 text-xs text-slate-500">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Testing & PrEP
               </li>
               <li className="flex items-center gap-2 text-xs text-slate-500">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Care Access
               </li>
             </ul>
             <div className="flex items-center text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
               FIND RESOURCES <ChevronRight className="w-3 h-3 ml-1" />
             </div>
          </div>
        </div>

        {/* --- MICRO FLOW (60 Seconds) --- */}
        <div className="w-full max-w-4xl mb-24 animate-in fade-in duration-1000 delay-500">
          <p className="text-xs font-mono text-slate-500 text-center uppercase tracking-widest mb-8">
            What you can do here (In 60 Seconds)
          </p>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left bg-slate-900/30 p-8 rounded-2xl border border-slate-800">
            <div className="flex-1">
              <div className="text-2xl font-bold text-slate-700 mb-2">01</div>
              <p className="text-sm text-slate-300 font-medium">Explore validated milestones.</p>
              <p className="text-xs text-slate-500 mt-1">From discovery to the Berlin Patient.</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-slate-800"></div>
            <div className="flex-1">
              <div className="text-2xl font-bold text-slate-700 mb-2">02</div>
              <p className="text-sm text-slate-300 font-medium">Check what’s new.</p>
              <p className="text-xs text-slate-500 mt-1">Live updates from the Discoveries feed.</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-slate-800"></div>
            <div className="flex-1">
              <div className="text-2xl font-bold text-slate-700 mb-2">03</div>
              <p className="text-sm text-slate-300 font-medium">Get help where you live.</p>
              <p className="text-xs text-slate-500 mt-1">Testing, ART, PrEP/PEP, and Support.</p>
            </div>
          </div>
        </div>

        {/* --- TRUST STRIP --- */}
        <div className="w-full text-center animate-in fade-in duration-1000 delay-700">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-8">
            Built on peer-reviewed research and official global health institutions
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <span className="text-lg font-serif font-bold text-slate-300">Nature</span>
             <span className="text-lg font-serif font-bold text-slate-300">The Lancet</span>
             <div className="flex items-center gap-1 font-sans font-bold text-slate-300">
               <Globe className="w-4 h-4" /> WHO
             </div>
             <span className="text-lg font-sans font-bold text-slate-300 tracking-tight">NIH</span>
             <span className="text-lg font-sans font-bold text-slate-300">CDC</span>
             <span className="text-lg font-sans font-bold text-slate-300 tracking-tighter">UNAIDS</span>
             <span className="text-sm font-sans font-bold text-slate-300 border-l border-slate-700 pl-6">Ministry of Health (Brazil)</span>
          </div>
        </div>

        {/* --- FOOTER DISCLAIMER --- */}
        <div className="mt-24 pt-8 border-t border-slate-900 w-full text-center">
           <div className="inline-flex items-center gap-2 text-xs text-slate-600 bg-slate-950/50 px-3 py-1.5 rounded-full border border-slate-800">
             <ShieldCheck className="w-3 h-3" />
             Not medical advice. For emergencies, contact local emergency services.
           </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;