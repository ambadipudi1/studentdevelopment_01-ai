import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { aiService } from '../services/aiService.ts';
import type { ChatMessage } from '../types/index.ts';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Lightbulb,
  CornerDownLeft,
  Code2,
  BrainCircuit,
  CheckCircle2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const PROMPT_SUGGESTIONS = [
  'What should I prioritize studying this week?',
  'Explain the difference between SQL and NoSQL for my projects',
  'How do I answer "Tell me about a challenging project" in interviews?',
  'Review my current skill gap for AI Engineering',
  'Give me 3 tips to improve my portfolio code quality'
];

export const AiCoachPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await aiService.getChatHistory();
        if (res.messages && res.messages.length > 0) {
          setMessages(res.messages);
        } else {
          // Welcome greeting
          const initialGreeting: ChatMessage = {
            id: 'init-1',
            sender: 'agent',
            content: `Hello **${user?.name?.split(' ')[0] || 'Student'}**! I am your dedicated **Student Learning & Career Agent**.\n\nI have your active profile loaded (*${profile?.branch || 'Computer Science'}, ${profile?.year_of_study || '3rd Year'}* targeting **${profile?.target_role || 'AI & Full Stack Engineer'}**).\n\nHow can I guide your learning, roadmaps, project architectures, or interview prep today?`,
            timestamp: new Date().toISOString(),
            suggestions: PROMPT_SUGGESTIONS
          };
          setMessages([initialGreeting]);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };

    loadHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    setInput('');
    const userMsg: ChatMessage = {
      id: 'temp-u-' + Date.now(),
      sender: 'user',
      content: query,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await aiService.sendChatMessage(query);
      setMessages((prev) => [...prev, res.message]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'err-' + Date.now(),
        sender: 'agent',
        content: `I ran into an issue connecting to Gemini: ${err.message || 'Please verify your network connection.'}`,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              Student Learning & Career Agent
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <p className="text-xs text-slate-500 truncate">
              Single Unified Agent • Context Aware ({profile?.target_role || 'Target Role'})
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
          <BrainCircuit className="w-3.5 h-3.5" />
          Google Gemini 3.7 Flash
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => {
          const isAgent = msg.sender === 'agent';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 ${isAgent ? 'items-start' : 'items-start flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  isAgent
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100'
                    : 'bg-slate-800 text-white'
                }`}
              >
                {isAgent ? <Sparkles className="w-4 h-4" /> : user?.name?.slice(0, 2).toUpperCase() || 'ST'}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 text-sm ${
                  isAgent
                    ? 'bg-slate-50 border border-slate-200/70 text-slate-800'
                    : 'bg-indigo-600 text-white shadow-sm'
                }`}
              >
                <div className={`prose prose-sm max-w-none ${isAgent ? 'prose-indigo text-slate-800' : 'text-white'}`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* Follow-up suggestions */}
                {isAgent && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-200/60">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      Suggested Next Questions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendMessage(s)}
                          className="px-2.5 py-1 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-xs font-medium text-slate-700 hover:text-indigo-700 transition-colors text-left"
                        >
                          → {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-50 border border-slate-200/70 rounded-3xl p-4 text-xs text-slate-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce delay-75" />
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce delay-150" />
              <span className="font-medium text-slate-600 ml-1">Agent thinking & analyzing context...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600/20 transition-all shadow-sm"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about roadmaps, project blueprints, or tech concepts..."
            className="flex-1 px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-40 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
