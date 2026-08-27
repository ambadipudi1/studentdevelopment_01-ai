import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { aiService } from '../services/aiService.ts';
import { progressService } from '../services/progressService.ts';
import type { ProgressData, CareerRecommendation, Roadmap, StudyPlan, Project } from '../types/index.ts';
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
  Clock,
  Flame,
  Award,
  PlayCircle,
  Check,
  Send
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [careerRec, setCareerRec] = useState<CareerRecommendation | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [coachInput, setCoachInput] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [progRes, careerRes, roadmapRes, planRes, projRes] = await Promise.allSettled([
          progressService.getProgress(),
          aiService.getCareerRecommendation(),
          aiService.getRoadmap(),
          aiService.getStudyPlan(),
          aiService.getProjects()
        ]);

        if (progRes.status === 'fulfilled') setProgress(progRes.value.progress);
        if (careerRes.status === 'fulfilled') setCareerRec(careerRes.value.recommendation);
        if (roadmapRes.status === 'fulfilled') setRoadmap(roadmapRes.value.roadmap);
        if (planRes.status === 'fulfilled') setStudyPlan(planRes.value.studyPlan);
        if (projRes.status === 'fulfilled') setProjects(projRes.value.projects);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleToggleTask = async (taskId: string) => {
    try {
      const res = await aiService.toggleStudyTask(taskId);
      setStudyPlan(res.studyPlan);
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleCoachSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachInput.trim()) return;
    navigate(`/ai-coach?initial=${encodeURIComponent(coachInput)}`);
  };

  const readinessScore = progress?.overall_readiness || 74;

  return (
    <div className="space-y-6">
      {/* 1. Top Core Grid: Career Recommendation & Skill Gap Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Career Recommendation Card (8 cols) */}
        <section className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-indigo-500 rounded-full inline-block"></span>
                Career Recommendation
              </h3>
              <Link
                to="/career"
                className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider hover:underline flex items-center gap-1"
              >
                View Full Report <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-xl font-bold text-slate-900">
                    {careerRec?.primary_career?.title || profile?.target_role || 'Artificial Intelligence Engineer'}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    Top Match
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                  {careerRec?.primary_career?.reasoning ||
                    'Based on your strong foundations in Python, Algorithms, and Data Structures, the agent suggests specializing in NLP and MLOps.'}
                </p>
                {careerRec?.primary_career?.average_salary && (
                  <div className="mt-3 flex items-center gap-4 text-xs">
                    <span className="text-slate-400 font-semibold uppercase text-[10px]">Market Band:</span>
                    <span className="font-bold text-slate-700">{careerRec.primary_career.average_salary}</span>
                  </div>
                )}
              </div>

              <div className="w-full sm:w-px h-px sm:h-20 bg-slate-100 shrink-0"></div>

              {/* Confidence Match Dial */}
              <div className="flex flex-col items-start sm:items-center justify-center shrink-0">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">Confidence Match</p>
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-slate-100"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray="125.6"
                        strokeDashoffset="12.56"
                        strokeLinecap="round"
                        className="text-indigo-600 transition-all duration-700"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-900">
                      {careerRec?.primary_career?.match_score || 92}%
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 space-y-0.5">
                    <p className="font-medium text-emerald-600">Skills Match: High</p>
                    <p className="font-medium text-indigo-600">Interest Alignment: Strong</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">Core Focus:</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">PyTorch</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">FastAPI</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">Docker / CI</span>
            </div>
            <Link to="/assessment" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              Take Readiness Quiz →
            </Link>
          </div>
        </section>

        {/* Skill Gap Analysis Card (4 cols) */}
        <section className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <GitPullRequestDraft className="w-4 h-4 text-indigo-600" />
                Skill Gap Analysis
              </h3>
              <Link to="/skill-gap" className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider hover:underline">
                Details
              </Link>
            </div>

            <div className="space-y-3">
              {/* Proficient */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-tight">Python Core & DSA</span>
                  <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-100/70 px-1.5 py-0.5 rounded">PROFICIENT</span>
                </div>
                <div className="w-full bg-emerald-200/80 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[90%] rounded-full"></div>
                </div>
              </div>

              {/* Intermediate */}
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-blue-800 uppercase tracking-tight">SQL & Databases</span>
                  <span className="text-[10px] text-blue-700 font-extrabold bg-blue-100/70 px-1.5 py-0.5 rounded">INTERMEDIATE</span>
                </div>
                <div className="w-full bg-blue-200/80 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[65%] rounded-full"></div>
                </div>
              </div>

              {/* Beginner */}
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-orange-800 uppercase tracking-tight">Neural Networks & ML</span>
                  <span className="text-[10px] text-orange-700 font-extrabold bg-orange-100/70 px-1.5 py-0.5 rounded">BEGINNER</span>
                </div>
                <div className="w-full bg-orange-200/80 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full w-[35%] rounded-full"></div>
                </div>
              </div>

              {/* Missing */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">Deployment & MLOps</span>
                  <span className="text-[10px] text-slate-600 font-extrabold bg-slate-200/70 px-1.5 py-0.5 rounded">MISSING</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-slate-400 h-full w-[8%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/profile"
            className="w-full mt-4 py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors text-center block"
          >
            Update Skill Profile +
          </Link>
        </section>
      </div>

      {/* 2. Middle Grid: Personalized Roadmap + AI Coach Session */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Personalized Learning Roadmap (8 cols) */}
        <section className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Map className="w-4 h-4 text-indigo-600" />
              Personalized Learning Roadmap
            </h3>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-slate-200">
              PHASE 02 / 06
            </span>
          </div>

          <div className="p-6 relative flex-1">
            {/* Timeline Line */}
            <div className="absolute left-10 top-7 bottom-7 w-0.5 bg-slate-100"></div>

            <div className="space-y-6 relative">
              {/* Stage 1: Completed */}
              <div className="flex items-start gap-5">
                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white ring-8 ring-white z-10 shrink-0 shadow-sm">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div className="pt-0.5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Stage 01: Foundations (Completed)
                  </h4>
                  <p className="text-sm font-semibold text-slate-400 line-through">
                    Python Programming, Linear Algebra, and Calculus for ML
                  </p>
                </div>
              </div>

              {/* Stage 2: Active */}
              <div className="flex items-start gap-5">
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white ring-8 ring-white z-10 shrink-0 font-bold text-xs shadow-sm">
                  02
                </div>
                <div className="pt-0.5 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                      Stage 02: Advanced SQL & Data Pipelines (In Progress)
                    </h4>
                  </div>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    Complex Joins, CTEs, Window Functions & Pandas Optimization
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold border border-indigo-100">
                      3 Modules Left
                    </span>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200">
                      Quiz Milestone Next
                    </span>
                  </div>
                </div>
              </div>

              {/* Stage 3: Upcoming */}
              <div className="flex items-start gap-5 opacity-60">
                <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 ring-8 ring-white z-10 shrink-0 font-bold text-xs">
                  03
                </div>
                <div className="pt-0.5">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Stage 03: Machine Learning & Scikit-Learn
                  </h4>
                  <p className="text-sm font-semibold text-slate-800">
                    Regression, Classification, Cross-validation & Feature Engineering
                  </p>
                </div>
              </div>

              {/* Stage 4: Upcoming */}
              <div className="flex items-start gap-5 opacity-40">
                <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 ring-8 ring-white z-10 shrink-0 font-bold text-xs">
                  04
                </div>
                <div className="pt-0.5">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Stage 04: Deep Learning & NLP Models
                  </h4>
                  <p className="text-sm font-semibold text-slate-800">
                    PyTorch, Transformers, LLM Fine-tuning & RAG Architectures
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Estimated completion: ~12 weeks</span>
            <Link
              to="/roadmap"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Explore Full Curriculum <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* AI Coach Live Session Card (4 cols) */}
        <section className="lg:col-span-4 bg-[#1E293B] rounded-2xl p-6 shadow-xl flex flex-col text-white border border-slate-700 justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <h3 className="font-bold text-sm text-slate-100">AI Coach Session</h3>
              </div>
              <Link to="/ai-coach" className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider hover:underline">
                Open Chat
              </Link>
            </div>

            {/* Coach Message Stream */}
            <div className="space-y-3 mb-4">
              <div className="bg-slate-800/80 p-3.5 rounded-xl rounded-tl-none border border-slate-700">
                <p className="text-xs leading-relaxed text-slate-300">
                  "You've mastered Python basics. To reach AI Engineer level, I recommend starting with NumPy vectorization and SQL window functions today. Ready for a quick concept briefing?"
                </p>
              </div>

              <div className="bg-indigo-600 self-end ml-auto p-3 rounded-xl rounded-br-none max-w-[85%] text-xs text-white shadow-sm">
                <p>Explain NumPy broadcasting with an example.</p>
              </div>
            </div>
          </div>

          {/* Direct Input */}
          <form onSubmit={handleCoachSubmit} className="relative mt-2">
            <input
              type="text"
              value={coachInput}
              onChange={(e) => setCoachInput(e.target.value)}
              placeholder="Ask your AI Career Coach anything..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-10 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500 text-white"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-300 transition-colors p-1"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </section>
      </div>

      {/* 3. Bottom Grid: Today's Tasks + Portfolio Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Study Tasks (5 cols) */}
        <section className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-indigo-600" />
                  Daily Action Tasks
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Matched to your 3h/day commitment</p>
              </div>
              <Link to="/study-plan" className="text-xs font-semibold text-indigo-600 hover:underline">
                View Week
              </Link>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 't1', day: 'Today', title: 'SQL Window Functions & Partitioning', time: '1.5h', done: false },
                { id: 't2', day: 'Today', title: 'Vectorized NumPy Matrix Operations', time: '1.0h', done: true },
                { id: 't3', day: 'Today', title: 'Mini Assessment on Data Structures', time: '0.5h', done: false },
              ].map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                    task.done
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                      : 'bg-slate-50 border-slate-200/80 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <input
                      type="checkbox"
                      defaultChecked={task.done}
                      className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                    />
                    <span className={`text-xs font-medium truncate ${task.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {task.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0 ml-2">
                    {task.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/study-plan"
            className="mt-4 text-center py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors block"
          >
            Generate Adaptive Study Schedule
          </Link>
        </section>

        {/* Recommended Projects Showcase (7 cols) */}
        <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-indigo-600" />
                  Portfolio Project Blueprints
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">High-impact engineering applications with schemas</p>
              </div>
              <Link to="/projects" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                All Projects <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-indigo-200 hover:bg-white transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[10px] border border-indigo-100">
                      INTERMEDIATE
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">~2 weeks</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">RAG Document Q&A Engine</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    FastAPI vector search backend with LangChain, ChromaDB, and hybrid retrieval.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  <span className="text-[10px] bg-white text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">FastAPI</span>
                  <span className="text-[10px] bg-white text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">ChromaDB</span>
                  <span className="text-[10px] bg-white text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">LangChain</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-indigo-200 hover:bg-white transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-100">
                      ADVANCED
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">~3 weeks</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Real-time Fraud Detection Pipeline</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    Streaming ML anomaly detection using Kafka, XGBoost, and Redis cache.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  <span className="text-[10px] bg-white text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">Kafka</span>
                  <span className="text-[10px] bg-white text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">XGBoost</span>
                  <span className="text-[10px] bg-white text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">Docker</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Includes system architecture & CV bullets</span>
            <Link to="/projects" className="font-bold text-indigo-600 hover:underline">
              Generate Custom Blueprint →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
