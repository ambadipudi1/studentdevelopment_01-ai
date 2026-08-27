import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { aiService } from '../services/aiService.ts';
import { LoadingState } from '../components/LoadingState.tsx';
import type { Roadmap } from '../types/index.ts';
import {
  Map,
  Sparkles,
  Clock,
  CheckCircle2,
  FolderGit2,
  Award,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const RoadmapPage: React.FC = () => {
  const { profile } = useAuth();
  const [targetRole, setTargetRole] = useState(profile?.target_role || 'AI & Full Stack Engineer');
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedPhases, setExpandedPhases] = useState<number[]>([1, 2]);

  const fetchRoadmap = async (forceRegenerate = false) => {
    try {
      setLoading(true);
      setError(null);
      if (!forceRegenerate) {
        const cached = await aiService.getRoadmap();
        if (cached.roadmap) {
          setRoadmap(cached.roadmap);
          setLoading(false);
          return;
        }
      }
      const res = await aiService.generateRoadmap(targetRole);
      setRoadmap(res.roadmap);
    } catch (err: any) {
      setError(err.message || 'Failed to generate personalized roadmap');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const togglePhase = (phaseNum: number) => {
    if (expandedPhases.includes(phaseNum)) {
      setExpandedPhases(expandedPhases.filter((p) => p !== phaseNum));
    } else {
      setExpandedPhases([...expandedPhases, phaseNum]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Map className="w-4 h-4" /> AI Guided Roadmap
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Multi-Phase Career Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Custom curriculum curated by your Student Learning & Career Agent for <strong className="text-slate-800">{targetRole}</strong>.
          </p>
        </div>

        <button
          onClick={() => fetchRoadmap(true)}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 flex items-center gap-2 transition-colors disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Regenerate Roadmap
        </button>
      </div>

      {loading && (
        <LoadingState
          message="Constructing Milestone-Driven Curriculum..."
          subtext="Building multi-week progressive phases, curated topics, and practical portfolio milestones."
          icon="layers"
        />
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && roadmap && (
        <div className="space-y-6">
          {/* Roadmap Overview Card */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" /> Complete Progression Track
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                {roadmap.target_role}
              </h3>
              <p className="text-xs sm:text-sm text-indigo-100/90 mt-1 max-w-xl">
                Structured across {roadmap.phases?.length || 5} incremental phases with verifiable hands-on checkpoints.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 shrink-0">
              <span className="text-[11px] text-indigo-200 uppercase font-semibold block">Total Program Length</span>
              <div className="text-xl font-bold text-white flex items-center gap-1.5 mt-0.5">
                <Clock className="w-4 h-4 text-emerald-400" /> {roadmap.total_duration || '12-16 Weeks'}
              </div>
            </div>
          </div>

          {/* Timeline Phases */}
          <div className="space-y-4">
            {roadmap.phases?.map((phase) => {
              const isExpanded = expandedPhases.includes(phase.phase_number);
              return (
                <div
                  key={phase.phase_number}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden transition-all"
                >
                  {/* Phase Header Accordion */}
                  <div
                    onClick={() => togglePhase(phase.phase_number)}
                    className="p-6 cursor-pointer hover:bg-slate-50/50 flex items-center justify-between gap-4 select-none"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-sm shrink-0">
                        P{phase.phase_number}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-bold text-slate-900">{phase.title}</h4>
                          <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                            {phase.estimated_duration}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{phase.description}</p>
                      </div>
                    </div>

                    <button className="p-2 rounded-xl text-slate-400 hover:text-slate-700">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-5">
                      {/* Topics */}
                      <div>
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
                          Core Topics & Concept Breakdown
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                          {phase.topics?.map((topic, i) => (
                            <div
                              key={i}
                              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-800 flex items-center gap-2"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                              <span>{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mini Project & Outcomes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {/* Mini Project */}
                        <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                          <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                            <FolderGit2 className="w-4 h-4" /> Phase Hands-on Mini Project
                          </span>
                          <p className="text-xs text-slate-700 font-medium leading-relaxed">
                            {phase.hands_on_project || 'Build end-to-end prototype validating phase concepts.'}
                          </p>
                        </div>

                        {/* Outcomes */}
                        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                            <Award className="w-4 h-4" /> Target Learning Outcomes
                          </span>
                          <div className="space-y-1">
                            {phase.learning_outcomes?.map((outcome, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{outcome}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Action Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Ready to break this into daily tasks?</h4>
              <p className="text-xs text-slate-500">Generate an actionable daily & weekly schedule matched to your study hours.</p>
            </div>
            <Link
              to="/study-plan"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2"
            >
              Generate Study Plan <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
