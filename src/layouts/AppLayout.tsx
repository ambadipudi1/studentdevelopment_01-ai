import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar.tsx';
import { Navbar } from '../components/Navbar.tsx';
import { X } from 'lucide-react';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: 'Student Dashboard',
    subtitle: 'Track your personalized career trajectory, readiness, and active roadmap'
  },
  '/profile': {
    title: 'Student Profile',
    subtitle: 'Academic background, skills, interests, and target career goals'
  },
  '/assessment': {
    title: 'AI Assessment',
    subtitle: 'Evaluate your technical competencies and uncover missing concepts'
  },
  '/career': {
    title: 'Career Recommendations',
    subtitle: 'AI-guided role matching, market demand analysis, and career paths'
  },
  '/skill-gap': {
    title: 'Skill-Gap Analysis',
    subtitle: 'Compare current skills vs target market requirements and prioritize learning'
  },
  '/roadmap': {
    title: 'Personalized Roadmap',
    subtitle: 'Step-by-step multi-phase curriculum customized to your target role'
  },
  '/study-plan': {
    title: 'Personalized Study Plan',
    subtitle: 'Daily and weekly actionable task schedules matched to your study hours'
  },
  '/projects': {
    title: 'Recommended Projects',
    subtitle: 'Resume-worthy portfolio applications with detailed engineering blueprints'
  },
  '/ai-coach': {
    title: 'AI Career Coach',
    subtitle: 'Ask your Student Learning & Career Agent anything about your learning journey'
  },
  '/interview': {
    title: 'Interview Preparation',
    subtitle: 'Technical and behavioral mock interviews with AI rubric scoring and feedback'
  },
  '/progress': {
    title: 'Progress & Analytics',
    subtitle: 'Holistic performance tracking, skill mastery, and AI progress analysis'
  },
  '/settings': {
    title: 'Platform Settings',
    subtitle: 'Account preferences, diagnostics, and Google Gemini API integration status'
  }
};

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const currentInfo = PAGE_TITLES[location.pathname] || {
    title: 'StudentPath AI',
    subtitle: 'Your Personalized AI Learning & Career Guide'
  };

  return (
    <div className="flex h-screen bg-[#F1F5F9] overflow-hidden font-sans text-[#1E293B]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#0F172A] z-10 shadow-2xl">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
          title={currentInfo.title}
          subtitle={currentInfo.subtitle}
        />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto pb-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
