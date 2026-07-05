import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  HelpCircle, 
  Building2, 
  Bot, 
  User, 
  ShieldAlert, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { DbState, ChatMessage } from '../types';

interface AIAssistantTabProps {
  state: DbState;
  onSendMessage: (message: string) => Promise<void>;
}

export default function AIAssistantTab({ state, onSendMessage }: AIAssistantTabProps) {
  const { chats } = state;
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const presetQuestions = [
    { label: 'Which machine pollutes the most?', query: 'Which of our installed machines pollutes the most today? Tell me its health score and how to optimize it.' },
    { label: 'How to save $10,000?', query: 'Explain how we can save $10,000 in grid electricity costs using off-peak shifts and solar microgrid offsets.' },
    { label: 'Explain our sustainability score', query: 'What is our current Sustainability Score? Detail how it is calculated and what factors are hurting it.' },
    { label: 'Generate sustainability report', query: 'Compile a short sustainability report summary outlining our target limits, monthly cumulative status, and top 3 recommended actions.' }
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;
    setLoading(true);
    setInput('');
    try {
      await onSendMessage(textToSend);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  // Clean custom text-to-html renderer supporting bullet points, bold tags, and paragraphs
  const renderMessageContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let content = line.trim();
      if (!content) return <div key={idx} className="h-2" />;
      
      // Check for bullet points
      if (content.startsWith('-') || content.startsWith('*')) {
        const cleanText = content.slice(1).trim();
        return (
          <ul key={idx} className="list-disc pl-5 my-1 text-xs leading-relaxed text-neutral-300">
            <li>{renderFormattedText(cleanText)}</li>
          </ul>
        );
      }
      
      // Check for headings
      if (content.startsWith('###')) {
        return <h5 key={idx} className="text-xs font-bold text-white mt-3 mb-1 font-mono">{content.slice(3).trim()}</h5>;
      }
      if (content.startsWith('##')) {
        return <h4 key={idx} className="text-sm font-semibold text-emerald-400 mt-4 mb-1.5 font-sans">{content.slice(2).trim()}</h4>;
      }

      return <p key={idx} className="text-xs text-neutral-300 leading-relaxed my-1.5">{renderFormattedText(content)}</p>;
    });
  };

  const renderFormattedText = (raw: string) => {
    // Handle simple markdown bold tags **bold text**
    const parts = raw.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
      
      {/* Left rail: preset prompts */}
      <div className="lg:col-span-1 bg-neutral-950/60 border border-neutral-900 rounded-2xl p-5 flex flex-col justify-between h-full">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">Diagnostic Presets</span>
          </div>
          <p className="text-[11px] text-neutral-500 leading-relaxed font-sans">
            Click any premium industrial sustainability prompt below to query our AI engine using live factory dataset feeds.
          </p>
          
          <div className="space-y-2 pt-2">
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q.query)}
                disabled={loading}
                className="w-full p-3 bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 rounded-xl text-[10px] text-neutral-300 hover:text-white text-left font-mono leading-relaxed transition-all flex items-start gap-1.5 cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{q.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-3.5 bg-neutral-900/40 border border-neutral-900 rounded-xl text-[10px] text-neutral-500 font-mono flex items-center gap-2">
          <Bot className="w-4 h-4 text-cyan-400" />
          <span>Active model: gemini-3.5-flash</span>
        </div>
      </div>

      {/* Right column: Conversational screen */}
      <div className="lg:col-span-3 bg-neutral-950/60 border border-neutral-900 rounded-2xl flex flex-col h-full overflow-hidden shadow-xl">
        
        {/* Chat header */}
        <div className="p-4 border-b border-neutral-900 bg-neutral-950 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white">EcoCarbon AI Specialist</h3>
              <p className="text-[9px] font-mono text-emerald-400">Online &middot; Smart Telemetry Integrations Active</p>
            </div>
          </div>
        </div>

        {/* Chats History Pane */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {chats.map((c) => (
            <div 
              key={c.id} 
              className={`flex gap-3 max-w-3xl ${c.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${c.sender === 'user' ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
                {c.sender === 'user' ? <User className="w-4.5 h-4.5" /> : <Bot className="w-4.5 h-4.5" />}
              </div>

              {/* Chat Bubble */}
              <div className={`p-4 rounded-xl border max-w-xl shadow-md ${c.sender === 'user' ? 'bg-neutral-900 border-cyan-500/10 text-white rounded-tr-none' : 'bg-neutral-950/80 border-neutral-900 text-neutral-300 rounded-tl-none'}`}>
                {renderMessageContent(c.text)}
                <span className="text-[8px] font-mono text-neutral-600 block text-right mt-2">
                  {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-3xl">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Bot className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div className="p-4 rounded-xl border bg-neutral-950/80 border-neutral-900 text-neutral-500 rounded-tl-none text-xs font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                <span>AI Specialist is formulating responses...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input area form */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="p-4 border-t border-neutral-900 bg-neutral-950 flex gap-3"
        >
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask questions about power peaks, motor health, or solar utilization..."
            className="flex-1 px-4 py-3 bg-neutral-900/60 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500/50"
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg transition-colors flex items-center justify-center disabled:opacity-40 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
