import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { aiService } from '../services/aiService.ts';
import { LoadingState } from '../components/LoadingState.tsx';
import type { SkillGapAnalysis } from '../types/index.ts';
import {
  GitPullRequestDraft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SkillGapPage: React.FC = () => {
  const { profile } = useAuth();
  const [targetRole, setTargetRole] = useState(profile?.target_role || 'AI & Full Stack Engineer');
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSkillGap = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await aiService.analyzeSkillGap(targetRole);
      setAnalysis(res.analysis);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze skill gaps');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillGap();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <GitPullRequestDraft className="w-4 h-4" /> AI Competency Gap Analysis
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Skill-Gap & Market Alignment Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Comparing your existing skills ({profile?.skills?.join(', ') || 'General'}) against modern job description requirements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="Target role..."
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 w-44"
          />
          <button
            onClick={fetchSkillGap}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Analyze
          </button>
        </div>
      </div>

      {loading && (
        <LoadingState
          message="Running Multi-Dimensional Skill Gap Analysis..."
          subtext="Calculating industry benchmark parity, estimated mastery hours, and optimal learning sequence."
          icon="brain"
        />
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && analysis && (
        <div className="space-y-6">
          {/* Match Score Hero */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                <Sparkles className="w-3.5 h-3.5" /> Target Role: {analysis.target_role}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Overall Market Readiness: {analysis.overall_match_percentage}%
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
                Estimated study commitment: <strong className="text-slate-800">~{analysis.estimated_hours_to_bridge || 80} total hours</strong> to bridge critical gaps and reach interview readiness.
              </p>
            </div>

            <div className="w-28 h-28 rounded-full border-8 border-indigo-100 flex items-center justify-center relative shrink-0">
              <div
                className="absolute inset-0 rounded-full border-8 border-indigo-600"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${analysis.overall_match_percentage > 50 ? '100% 0%, 100% 100%, 0% 100%, 0% 0%' : '100% 0%, 100% 100%'})`
                }}
              />
              <span className="text-2xl font-extrabold text-slate-900 z-10">
                {analysis.overall_match_percentage}%
              </span>
            </div>
          </div>

          {/* 4 Skill Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Strong */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 mb-3">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Strong Skills
                </span>
                <span className="bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {analysis.strong_skills?.length || 0}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysis.strong_skills?.map((s, i) => (
                  <span key={i} className="text-xs font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-100">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Moderate */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-blue-800 mb-3">
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-600" /> Intermediate
                </span>
                <span className="bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  {analysis.moderate_skills?.length || 0}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysis.moderate_skills?.map((s, i) => (
                  <span key={i} className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-100">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Beginner */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-amber-800 mb-3">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Beginner
                </span>
                <span className="bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {analysis.weak_skills?.length || 0}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysis.weak_skills?.map((s, i) => (
                  <span key={i} className="text-xs font-medium bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-100">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-rose-800 mb-3">
                <span className="flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600" /> Missing Critical
                </span>
                <span className="bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  {analysis.missing_skills?.length || 0}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysis.missing_skills?.map((s, i) => (
                  <span key={i} className="text-xs font-medium bg-rose-50 text-rose-700 px-2.5 py-1 rounded-lg border border-rose-100">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Prioritized Learning Order Table */}
          {analysis.prioritized_learning_order && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Prioritized Sequence to Bridge Skill Gaps
                </h3>
                <span className="text-xs text-slate-400 font-medium">Ranked by Market ROI</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Priority</th>
                      <th className="pb-3 font-semibold">Skill Name</th>
                      <th className="pb-3 font-semibold">Current Level</th>
                      <th className="pb-3 font-semibold">Target Level</th>
                      <th className="pb-3 font-semibold">Est. Time</th>
                      <th className="pb-3 font-semibold">Recommended Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {analysis.prioritized_learning_order.map((item) => (
                      <tr key={item.priority} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 font-bold text-indigo-600">
                          #{item.priority}
                        </td>
                        <td className="py-3.5 font-semibold text-slate-900">
                          {item.skill}
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            item.current_level === 'None' || item.current_level === 'Missing'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {item.current_level}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                            {item.target_level}
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-600 font-medium">
                          {item.estimated_hours} hrs
                        </td>
                        <td className="py-3.5 text-slate-600 text-xs">
                          {item.recommended_action}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                <Link
                  to="/roadmap"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  Generate Step-by-Step Roadmap <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/study-plan"
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  Create Daily Study Plan <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
