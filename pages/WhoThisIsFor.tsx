import React from 'react';
import { Users, Heart, GraduationCap, Microscope, Stethoscope, Shield, Activity, Search, Map } from 'lucide-react';

const WhoThisIsFor: React.FC = () => {
  const audiences = [
    {
      title: "People Living with HIV",
      icon: Users,
      desc: "Navigate care, understand your rights, and access verified treatment info.",
      bestTab: "Get Help",
      questions: [
        "Where can I find free care near me?",
        "How do I access ADAP/ART in my state?",
        "What does U=U mean for my daily life?"
      ]
    },
    {
      title: "Family & Caregivers",
      icon: Heart,
      desc: "Learn how to support loved ones with evidence-based empathy and facts.",
      bestTab: "Assist (Agents)",
      questions: [
        "How do I support someone newly diagnosed?",
        "Is PrEP right for a serodiscordant partner?",
        "What terminology should I use?"
      ]
    },
    {
      title: "Students & Learners",
      icon: GraduationCap,
      desc: "Explore the history of the epidemic and the science behind the cure.",
      bestTab: "Roadmap",
      questions: [
        "What was the Berlin Patient milestone?",
        "How do ARVs actually work?",
        "What are the remaining scientific gaps?"
      ]
    },
    {
      title: "Researchers & Educators",
      icon: Microscope,
      desc: "Track the latest trials, policy shifts, and 'last mile' challenges.",
      bestTab: "Roadmap + Discoveries",
      questions: [
        "What is the status of CRISPR cure trials?",
        "What did the PURPOSE 1 trial validate?",
        "What are the current WHO guidelines?"
      ]
    },
    {
      title: "Clinicians & Workers",
      icon: Stethoscope,
      desc: "Quick access to guidelines, clinical trial summaries, and referral resources.",
      bestTab: "Discoveries",
      questions: [
        "What are the new long-acting PrEP options?",
        "Where can I refer a patient for support?",
        "Updates on Doxy-PEP implementation?"
      ]
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Who this is for</h1>
        <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
          Last Mile is built for different people, with the same trusted core. 
          Whether you need immediate help or deep scientific context, we provide a safe, private hub.
        </p>
      </div>

      {/* Audience Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {audiences.map((aud, idx) => (
          <div key={idx} className="glass-card p-6 rounded-xl border border-slate-800 hover:border-blue-500/30 transition-all group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-blue-900/20 border border-blue-800/30 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <aud.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-200">{aud.title}</h3>
            </div>
            
            <p className="text-sm text-slate-400 mb-4 h-10 leading-snug">
              {aud.desc}
            </p>

            <div className="mb-4">
              <div className="text-[10px] uppercase tracking-widest text-slate-600 font-bold mb-2">Best Starting Place</div>
              <div className="inline-block px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-blue-300">
                {aud.bestTab}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800/50">
               {aud.questions.map((q, i) => (
                 <div key={i} className="flex items-start gap-2 text-xs text-slate-500 italic">
                   <span className="text-blue-500/40 mt-0.5">"</span>
                   {q}
                   <span className="text-blue-500/40">"</span>
                 </div>
               ))}
            </div>
          </div>
        ))}
      </div>

      {/* How it Works & Privacy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* How Last Mile Works */}
        <div className="p-6 md:p-8 rounded-xl bg-slate-900/40 border border-slate-800">
          <h2 className="text-xl font-bold text-white mb-6">How Last Mile Works</h2>
          <div className="space-y-5">
            <div className="flex gap-4">
              <Map className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-slate-200">Validated Roadmap</h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  A timeline of proven science. Validated milestones from discovery to cure research.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Activity className="w-5 h-5 text-red-500 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-slate-200">Live Discoveries</h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Real-time updates on trials, policy, and public health news.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Search className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-slate-200">Get Help & Agents</h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Location-based resources and AI guides to help you navigate care systems.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Safety & Privacy */}
        <div className="p-6 md:p-8 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-slate-400" />
            Safety & Privacy
          </h2>
          <div className="space-y-4 flex-1">
             <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800">
               <div className="text-sm font-semibold text-slate-300 mb-1">No Login Required</div>
               <p className="text-xs text-slate-500">We do not ask for your email, name, or phone number.</p>
             </div>
             <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800">
               <div className="text-sm font-semibold text-slate-300 mb-1">Private & Anonymous</div>
               <p className="text-xs text-slate-500">No identity data is collected. You are safe to explore sensitive topics.</p>
             </div>
             <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800">
               <div className="text-sm font-semibold text-slate-300 mb-1">Local Data</div>
               <p className="text-xs text-slate-500">Optional progress tracking (if used) remains on your device.</p>
             </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800">
             <p className="text-[10px] text-slate-500 leading-relaxed">
               <strong>Disclaimer:</strong> This platform is educational. It is not a medical device and does not provide medical diagnoses. In case of emergency, contact local emergency services.
             </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default WhoThisIsFor;