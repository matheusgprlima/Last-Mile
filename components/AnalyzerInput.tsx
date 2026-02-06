import React, { useState } from 'react';
import { Loader2, ArrowUpRight, FileText } from 'lucide-react';
import { EXAMPLE_ABSTRACT } from '../constants/exampleAbstract';

interface AnalyzerInputProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
  onCancel?: () => void;
  title?: string;
  description?: string;
  placeholder?: string;
}

const AnalyzerInput: React.FC<AnalyzerInputProps> = ({ 
  onAnalyze, 
  isAnalyzing, 
  onCancel,
  title = "New Scientific Evidence",
  description = "Paste a research abstract, clinical trial summary (NCT), or guideline excerpt. The system will validate relevance to HIV/AIDS and extract structured milestones.",
  placeholder = "Paste text here..."
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  return (
    <div className="glass-panel rounded-xl p-6 md:p-8 animate-in zoom-in-95 duration-300">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
             <label htmlFor="evidence-input" className="block text-sm font-semibold text-slate-200">
               {title}
             </label>
             {onCancel && (
               <button type="button" onClick={onCancel} className="text-xs text-slate-500 hover:text-slate-300">
                 Cancel
               </button>
             )}
          </div>
          
          <p className="text-xs text-slate-400 mb-4 font-mono leading-relaxed">
            {description}
          </p>
          
          <div className="relative group">
            <textarea
              id="evidence-input"
              rows={6}
              className="w-full bg-slate-950/50 text-slate-200 px-4 py-4 rounded-lg border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all resize-y text-sm font-mono placeholder:text-slate-600"
              placeholder={placeholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isAnalyzing}
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity" />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
           <div className="text-[10px] text-slate-500 flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
             Secure analysis pipeline
           </div>
           <div className="flex items-center gap-2">
             <button
               type="button"
               onClick={() => setText(EXAMPLE_ABSTRACT)}
               disabled={isAnalyzing}
               className="inline-flex items-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-slate-600"
             >
               <FileText className="w-4 h-4" />
               Example
             </button>
             <button
              type="submit"
              disabled={isAnalyzing || !text.trim()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-900/20"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Analyze
                  <ArrowUpRight className="w-4 h-4" />
                </>
              )}
            </button>
           </div>
        </div>
      </form>
    </div>
  );
};

export default AnalyzerInput;