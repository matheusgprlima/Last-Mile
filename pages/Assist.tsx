import React, { useState } from 'react';
import { AGENTS } from '../services/agentService';
import { AgentPersona } from '../types';
import { TestTube, Pill, Shield, Compass, ArrowRight, Activity } from 'lucide-react';
import AgentChat from '../components/AgentChat';

// Icon mapper helper since we store icon names as strings
const IconMap: Record<string, React.ElementType> = {
  TestTube,
  Pill,
  Shield,
  Compass
};

interface AssistProps {
  onSelectAgent?: (agent: AgentPersona) => void;
}

const Assist: React.FC<AssistProps> = ({ onSelectAgent }) => {
  const [activeAgent, setActiveAgent] = useState<AgentPersona | null>(null);

  const handleSelect = (agent: AgentPersona) => {
    setActiveAgent(agent);
    if (onSelectAgent) onSelectAgent(agent);
  };

  if (activeAgent) {
    return (
      <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
        <AgentChat 
          agent={activeAgent} 
          onBack={() => setActiveAgent(null)} 
        />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-bold text-white mb-3">Help Agents</h2>
        <p className="text-slate-400 max-w-2xl leading-relaxed">
          Select a specialized guide to navigate the next steps of your journey. 
          All interactions are private, anonymous, and evidence-based.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {AGENTS.map((agent) => {
          const Icon = IconMap[agent.icon] || Activity;
          return (
            <div 
              key={agent.id}
              className="group glass-card rounded-xl p-6 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/40 transition-all cursor-pointer relative overflow-hidden"
              onClick={() => handleSelect(agent)}
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-lg bg-blue-900/20 border border-blue-800/30 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:border-blue-500 transition-colors">
                  <Icon className="w-6 h-6 text-blue-400 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100 mb-1 group-hover:text-blue-200">{agent.name}</h3>
                  <div className="text-xs font-mono text-blue-400 mb-2 uppercase tracking-wider">{agent.role}</div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">{agent.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {agent.capabilities.map((cap, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-900 text-slate-500 px-2 py-1 rounded border border-slate-800">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
                <ArrowRight className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Assist;