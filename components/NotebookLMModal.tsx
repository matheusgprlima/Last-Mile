import React, { useState, useEffect } from 'react';
import { X, Copy, ExternalLink, Sparkles, Check } from 'lucide-react';

interface NotebookLMModalProps {
  isOpen: boolean;
  onClose: () => void;
  seedText: string;
  title: string;
}

const NotebookLMModal: React.FC<NotebookLMModalProps> = ({ isOpen, onClose, seedText, title }) => {
  const [copied, setCopied] = useState(false);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(seedText);
      return true;
    } catch (err) {
      // Fallback for older browsers/contexts
      const textarea = document.createElement('textarea');
      textarea.value = seedText;
      textarea.style.position = 'fixed'; // Avoid scrolling to bottom
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
      } catch (e) {
        document.body.removeChild(textarea);
        return false;
      }
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCopyAndOpen = async () => {
    await handleCopy();
    window.open('https://notebooklm.google.com/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-900/50 backdrop-blur-md rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Study in NotebookLM
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Prepare evidence from <span className="text-slate-200 font-medium">"{title}"</span> for analysis.
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 text-slate-500 hover:text-white hover:bg-slate-800 rounded transition-colors" 
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          <div className="p-4 rounded-lg bg-blue-950/20 border border-blue-900/30">
            <h3 className="text-sm font-semibold text-blue-200 mb-1">Why use NotebookLM?</h3>
            <p className="text-xs text-blue-300/80 leading-relaxed">
              Google's NotebookLM can digest this structured evidence ("Seed") to answer questions, summarize findings, and connect it with your other documents.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notebook Seed (Markdown)</label>
              <button 
                onClick={handleCopy} 
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied to clipboard" : "Copy text"}
              </button>
            </div>
            <div className="relative group">
              <pre className="w-full h-48 p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 font-mono overflow-auto whitespace-pre-wrap selection:bg-blue-500/30 selection:text-blue-200">
                {seedText}
              </pre>
              <div className="absolute inset-0 pointer-events-none rounded-lg ring-1 ring-inset ring-slate-800/50 group-hover:ring-slate-700 transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button 
              onClick={handleCopyAndOpen}
              className="md:col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-semibold text-sm transition-all shadow-lg shadow-blue-900/20"
            >
              <Copy className="w-4 h-4" />
              Copy & Open NotebookLM
            </button>
            
            <button 
               onClick={() => window.open('https://notebooklm.google.com/', '_blank', 'noopener,noreferrer')}
               className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium text-sm border border-slate-700 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              Open Only
            </button>
          </div>

          <div className="pt-6 border-t border-slate-800">
             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">How to use</h4>
             <ol className="space-y-3">
               <li className="flex gap-3 text-sm text-slate-400">
                 <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-500 flex items-center justify-center text-xs font-mono">1</span>
                 <span>Open NotebookLM and create a new notebook.</span>
               </li>
               <li className="flex gap-3 text-sm text-slate-400">
                 <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-500 flex items-center justify-center text-xs font-mono">2</span>
                 <span>Click <strong>"Add source"</strong> and choose "Copied text" or paste into a new note.</span>
               </li>
               <li className="flex gap-3 text-sm text-slate-400">
                 <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-500 flex items-center justify-center text-xs font-mono">3</span>
                 <span>Paste the <strong>Notebook Seed</strong>. You can now chat with this evidence.</span>
               </li>
             </ol>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NotebookLMModal;