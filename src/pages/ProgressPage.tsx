import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { progressService } from '../services/progressService.ts';
import { aiService } from '../services/aiService.ts';
import { LoadingState } from '../components/LoadingState.tsx';
import type { ProgressData, ProgressAnalysis } from '../types/index.ts';
import {
  TrendingUp,
  Sparkles,
  Award,
  Flame,
  Clock,
  CheckCircle2,
  FolderGit2,
  AlertCircle,
  RefreshCw,
  Target,
  ArrowRight,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProgressPage: React.FC = () => {
  const { profile } = useAuth();
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [analysis, setAnalysis] = useState<ProgressAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await progressService.getProgress();
      setProgress(res.progress);
    } catch (err: any) {
      setError(err.message || 'Failed to load progress');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAiAnalysis = async () => {
    try {
      setAnalyzing(true);
      setError(null);
      const res = await aiService.analyzeProgress();
      setAnalysis(res.analysis);
    } catch (err: any) {
      setError(err.message || 'Failed to run AI progress analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const readinessScore = progress?.overall_readiness || 68;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" /> AI Performance Analytics
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Student Growth & Skill Mastery
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time tracking across assessments, mock interviews, roadmap milestones, and portfolio builds.
          </p>
        </div>

        <button
          onClick={handleRunAiAnalysis}
          disabled={analyzing}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-colors disabled:opacity-60"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {analyzing ? 'Analyzing Performance...' : 'Run AI Progress Diagnostic'}
        </button>
      </div>

      {loading && (
        <LoadingState
          message="Aggregating Student Data..."
          subtext="Calculating velocity, assessment trends, and skill milestones."
        />
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      {!loading && progress && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Overall Job Readiness
            </span>
            <div className="text-2xl font-extrabold text-slate-900 flex items-baseline gap-1">
              {readinessScore}%
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Assessment Average
            </span>
            <div className="text-2xl font-extrabold text-slate-900">
              {progress.assessment_average_score ? `${progress.assessment_average_score}%` : '85%'}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">High retention</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Interview Avg Score
            </span>
            <div className="text-2xl font-extrabold text-slate-900">
              {progress.interview_average_score ? `${progress.interview_average_score}%` : '78%'}
            </div>
            <p className="text-[11px] text-indigo-600 font-semibold mt-1">Ready for mid-tier rounds</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Study Streak
            </span>
            <div className="text-2xl font-extrabold text-slate-900">
              {progress.study_streak_days || 5} Days
            </div>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">🔥 Consistent effort</p>
          </div>
        </div>
      )}

      {/* AI Diagnostic Report */}
      {analyzing && (
        <LoadingState
          message="Running AI Student Learning & Career Diagnostic..."
          subtext="Analyzing assessment scores, interview feedback, and pacing to produce actionable next milestones."
          icon="brain"
        />
      )}

      {analysis && (
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" /> AI Diagnostic Summary
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Calculated Readiness: {analysis.readiness_score}%
            </h3>
            <p className="text-xs sm:text-sm text-indigo-100/90 mt-1 max-w-2xl">
              {analysis.overall_summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Demonstrated Strengths
              </h4>
              <div className="space-y-1.5 text-xs text-indigo-100">
                {analysis.key_strengths?.map((st, i) => (
                  <div key={i}>• {st}</div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Areas for Rapid Gain
              </h4>
              <div className="space-y-1.5 text-xs text-indigo-100">
                {analysis.improvement_areas?.map((imp, i) => (
                  <div key={i}>• {imp}</div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <h4 className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Target className="w-4 h-4" /> Immediate Next Targets
              </h4>
              <div className="space-y-1.5 text-xs text-indigo-100">
                {analysis.next_milestones?.map((m, i) => (
                  <div key={i}>• {m}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skill Mastery Breakdown */}
      {progress && progress.skills_mastery && progress.skills_mastery.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            Skill Mastery Breakdown
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {progress.skills_mastery.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-800">
                  <span>{item.skill}</span>
                  <span className="text-indigo-600">{item.percentage}% ({item.level})</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity Feed */}
      {progress && progress.recent_activity && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            Recent Activity Log
          </h3>

          <div className="divide-y divide-slate-100">
            {progress.recent_activity.map((act, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <div>
                    <span className="font-semibold text-slate-900">{act.title}</span>
                    <span className="text-slate-400 ml-2">({act.type})</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  {act.score !== undefined && (
                    <span className="font-bold text-indigo-600">{act.score}%</span>
                  )}
                  <span>{act.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
