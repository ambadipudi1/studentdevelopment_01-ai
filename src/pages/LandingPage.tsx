import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Compass,
  GitPullRequestDraft,
  Map,
  CalendarCheck,
  FolderGit2,
  Bot,
  FileCheck2,
  TrendingUp,
  CheckCircle2,
  BrainCircuit,
  GraduationCap,
  Layers,
  Target,
  Users,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                STUDENTPATH <span className="text-indigo-600">AI</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-all flex items-center gap-1.5"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 bg-gradient-to-b from-indigo-50/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-8">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Powered by Google Gemini API & Dedicated Student Agent
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Your Personalized AI Learning & <span className="text-indigo-600">Career Guide</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Stop guessing your career trajectory. Discover the right role, identify your exact skill gaps, follow custom-paced roadmaps, and practice technical interviews with a single dedicated AI Agent.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm transition-all"
            >
              Login to Demo Account
            </Link>
          </div>

          {/* Quick Credential Hint */}
          <p className="mt-3 text-xs text-slate-500">
            Instant Demo: <span className="font-semibold text-slate-700">student@studentpath.ai</span> / <span className="font-semibold text-slate-700">password123</span>
          </p>
        </div>
      </section>

      {/* 2. The Problem vs 3. The Solution */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* The Problem */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-rose-100 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mb-4 border border-rose-200">
                The Student Dilemma
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                Generic Roadmaps & Unclear Next Steps
              </h2>
              <ul className="space-y-4 text-slate-600 text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✕</span>
                  <span>Overwhelmed by scattered YouTube tutorials and generic bootcamp curricula that ignore your actual skill level.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✕</span>
                  <span>Building copy-pasted tutorial projects that fail to impress technical recruiters on resumes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✕</span>
                  <span>Entering job interviews without personalized feedback on technical depth, clarity, and system trade-offs.</span>
                </li>
              </ul>
            </div>

            {/* The Solution */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-indigo-100 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-200">
                The StudentPath AI Solution
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                One Unified Student Learning & Career Agent
              </h2>
              <ul className="space-y-4 text-slate-600 text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                  <span><strong>Holistic Context:</strong> The AI Agent understands your degree, CGPA, existing skills, available daily hours, and preferred learning style.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                  <span><strong>Real Skill Gap Analysis:</strong> Visual comparison of your skills versus market requirements with recommended learning sequences.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                  <span><strong>End-to-End Preparation:</strong> From adaptive quizzes to resume-ready projects and live AI mock interview evaluations.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Complete Platform Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
              Comprehensive Ecosystem
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need from First Year to Tech Offer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Career Recommendation</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Discover matching roles (AI Engineer, Full Stack, Data Scientist) based on your branch, CGPA, skills, and current market demand.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mb-4">
                <GitPullRequestDraft className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Skill-Gap Analysis</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Identify Strong, Intermediate, Beginner, and Missing skills with prioritized learning orders and hour estimates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Personalized Roadmap</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Step-by-step 5-stage customized milestones with core topics, hands-on mini projects, and verifiable learning outcomes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Adaptive Study Plan</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Daily and weekly task schedules matched to your 1h, 2h, or 4h/day availability with interactive completion tracking.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Project Blueprints & Guidance</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Get full architectural breakdowns, folder structures, database designs, implementation steps, and resume bullet points.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Mock Interview Simulator</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Practice technical, scenario, and behavioral questions with instant AI scoring, model answers, and constructive feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works (Student Journey) */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
              The 5-Step Journey
            </h2>
            <p className="text-3xl font-bold text-slate-900">
              How StudentPath AI Guides Your Transformation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: '01', title: 'Complete Profile', desc: 'Enter degree, skills, study hours, and target goals.' },
              { step: '02', title: 'Take Assessment', desc: 'Identify baseline competencies and uncovered blind spots.' },
              { step: '03', title: 'Get Roadmap', desc: 'Receive structured phases and weekly study tasks.' },
              { step: '04', title: 'Build Projects', desc: 'Develop portfolio apps with AI architectural guidance.' },
              { step: '05', title: 'Ace Interviews', desc: 'Practice mock rounds and track job readiness scores.' }
            ].map((s) => (
              <div key={s.step} className="bg-white p-6 rounded-2xl border border-slate-200/80 relative">
                <div className="text-3xl font-extrabold text-indigo-600/20 mb-2">{s.step}</div>
                <h4 className="text-base font-bold text-slate-900 mb-1">{s.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Call To Action */}
      <section className="py-20 bg-indigo-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Accelerate Your Tech Career Today
          </h2>
          <p className="text-lg text-indigo-100 max-w-xl mx-auto mb-8">
            Experience your dedicated Student Learning & Career Agent powered by Google Gemini API.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-bold text-indigo-600 bg-white hover:bg-slate-100 rounded-xl shadow-lg transition-all"
            >
              Create Free Student Account
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-indigo-700/60 hover:bg-indigo-700 border border-indigo-500 rounded-xl transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="py-8 bg-slate-900 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-white">STUDENTPATH AI</span>
            <span>— "Your Personalized AI Learning & Career Guide"</span>
          </div>
          <p>© {new Date().getFullYear()} StudentPath AI. Powered by Google Gemini API.</p>
        </div>
      </footer>
    </div>
  );
};
