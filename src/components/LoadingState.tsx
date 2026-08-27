import React from 'react';
import { Sparkles, Compass, BrainCircuit, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subtext?: string;
  icon?: 'sparkles' | 'compass' | 'brain' | 'book' | 'layers';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Analyzing your profile...',
  subtext = 'Student Learning & Career Agent is generating personalized insights powered by Gemini 3.7 Flash',
  icon = 'sparkles'
}) => {
  const renderIcon = () => {
    switch (icon) {
      case 'compass':
        return <Compass className="w-8 h-8 text-indigo-600 animate-spin" />;
      case 'brain':
        return <BrainCircuit className="w-8 h-8 text-indigo-600 animate-pulse" />;
      case 'book':
        return <BookOpen className="w-8 h-8 text-indigo-600 animate-bounce" />;
      case 'layers':
        return <Layers className="w-8 h-8 text-indigo-600 animate-spin" />;
      default:
        return <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-center my-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4">
        {renderIcon()}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{message}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6">{subtext}</p>
      
      <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-600 rounded-full animate-pulse w-3/4" />
      </div>

      <div className="flex items-center gap-2 mt-4 text-xs font-medium text-indigo-700 bg-indigo-50/80 px-3 py-1 rounded-full border border-indigo-100">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Single Student Learning & Career Agent Active
      </div>
    </div>
  );
};
