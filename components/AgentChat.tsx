import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AgentPersona } from '../types';
import { 
  ChevronLeft, 
  Send, 
  Loader2, 
  User, 
  Bot, 
  TestTube, 
  Pill, 
  Shield, 
  Compass,
  Activity 
} from 'lucide-react';

const IconMap: Record<string, React.ElementType> = {
  TestTube,
  Pill,
  Shield,
  Compass
};

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AgentChatProps {
  agent: AgentPersona;
  onBack: () => void;
}

const AgentChat: React.FC<AgentChatProps> = ({ agent, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getSystemInstruction = () => {
    const base = `You are a functional AI agent in an HIV/AIDS discovery platform.
    Your ID is: ${agent.id}
    Your Name is: ${agent.name}
    Your Role is: ${agent.role}

    STYLE CONSTRAINTS:
    - Calm
    - Short responses
    - No emojis
    - No motivational language
    - No assumptions
    - No medical diagnosis
    - No legal claims
    - No generic explanations; focus on guided interaction.

    ABSOLUTE RULE:
    If user input is vague, ask ONE clarifying question only.
    If user seems overwhelmed, reduce response to ONE action.

    AGENT SPECIFIC RULES:
    ${agent.id === 'testing' ? `
    Locator (Testing Guide):
    Explain test types briefly.
    Clarify testing window if relevant.
    Guide to next concrete step.
    Always end with a clear, single next step phrased conversationally.` : ''}

    ${agent.id === 'treatment' ? `
    Access (Treatment Specialist):
    Explain treatment access paths.
    Reduce fear around eligibility.
    Provide one clear next step.
    Always end with a clear, single next step phrased conversationally.` : ''}

    ${agent.id === 'prevention' ? `
    Shield (PrEP / PEP Guide):
    If exposure is ≤72h, prioritize PEP (Post-Exposure Prophylaxis).
    Else, focus on PrEP (Pre-Exposure Prophylaxis) evaluation.
    Always end with a clear, single next step phrased conversationally.` : ''}

    ${agent.id === 'navigation' ? `
    Compass (System Navigator):
    Translate system/process into plain language.
    Give step-by-step guidance.
    Never give more than ONE step at a time.
    Always end with a clear, single next step phrased conversationally.` : ''}
    `;
    return base;
  };

  const getInitialMessage = () => {
    switch (agent.id) {
      case 'testing':
        return "Hello. I’m Locator. To find the right testing site, I need to know where you are (Country and City/Region) and what prompted this test (routine check, recent exposure, or confirmation). I’ll guide you to the best nearby option.";
      case 'treatment':
        return "Hello. I’m Access. If you’ve been diagnosed or think you might be positive, we can map a treatment path that works for you. What country are you in, and what’s the biggest hurdle right now—insurance, immigration status, cost, or something else?";
      case 'prevention':
        return "Hello. I’m Shield. If you’re worried about a recent risk, timing is key. How long has it been since the potential exposure, and what kind was it? I’ll help you decide between emergency PEP or long-term PrEP.";
      case 'navigation':
        return "Hello. I’m Compass. The system can be overwhelming. Tell me what’s confusing you right now—specific forms, medical terms, appointments, or rights. We’ll break it down one step at a time.";
      default:
        return "Hello. How can I assist you with your HIV/AIDS related inquiry today?";
    }
  };

  useEffect(() => {
    const initChat = async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatRef.current = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: getSystemInstruction(),
        }
      });
      
      // Start with initial message
      setMessages([{ role: 'model', text: getInitialMessage() }]);
    };

    initChat();
  }, [agent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    try {
      const result = await chatRef.current.sendMessage({ message: userText });
      const responseText = result.text;
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Agent error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I encountered an error processing your request. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const Icon = IconMap[agent.icon] || Activity;

  return (
    <div className="flex flex-col h-[70vh] glass-panel rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-lg bg-blue-900/20 border border-blue-800/30 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">{agent.name}</h3>
            <div className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">{agent.role}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500" />
           <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Active Session</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scroll-smooth">
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                msg.role === 'user' 
                  ? 'bg-blue-600 border-blue-500 text-white' 
                  : 'bg-slate-800 border-slate-700 text-blue-400'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-800/60 text-slate-200 border border-slate-700/50 rounded-tl-none'
              }`}>
                {msg.text.split('\n').map((line, idx) => (
                  <p key={idx} className={idx > 0 ? 'mt-2' : ''}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-blue-400">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-slate-800/60 rounded-2xl rounded-tl-none border border-slate-700/50 flex items-center">
                <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/20">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            placeholder={`Message ${agent.name}...`}
            className="flex-1 bg-slate-950/50 text-slate-200 px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-500 outline-none text-sm transition-all"
          />
          <button 
            type="submit" 
            disabled={isTyping || !input.trim()}
            className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <div className="mt-2 text-[10px] text-center text-slate-600 font-mono uppercase tracking-wider">
          Private • Evidence-based • Anonymous
        </div>
      </div>
    </div>
  );
};

export default AgentChat;