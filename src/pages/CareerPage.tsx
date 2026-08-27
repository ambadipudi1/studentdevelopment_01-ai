import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { aiService } from '../services/aiService.ts';
import { LoadingState } from '../components/LoadingState.tsx';
import type { CareerRecommendation } from '../types/index.ts';
import {
  Compass,
  Sparkles,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Briefcase,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CareerPage: React.FC = () => {
  const { profile } = useAuth();
  const [recommendation, setRecommendation] = useState<CareerRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendation = async (forceRegenerate = false) => {
    try {
      setLoading(true);
      setError(null);
      if (!forceRegenerate) {
        const cached = await aiService.getCareerRecommendation();
        if (cached.recommendation) {
          setRecommendation(cached.recommendation);
          setLoading(false);
          return;
        }
      }
      const res = await aiService.generateCareerRecommendation();
      setRecommendation(res.recommendation);
    } catch (err: any) {
      setError(err.message || 'Failed to generate career recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendation();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" /> AI Career Guidance
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Intelligent Career Role Matching
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Personalized role alignment based on your academic branch ({profile?.branch || 'CS'}), skills, and industry market demands.
          </p>
        </div>

        <button
          onClick={() => fetchRecommendation(true)}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 flex items-center gap-2 transition-colors disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Regenerate with AI
        </button>
      </div>

      {loading && (
        <LoadingState
          message="Analyzing Student Profile & Market Trends..."
          subtext="The Student Learning & Career Agent is matching your competencies with high-growth industry roles."
          icon="compass"
        />
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && recommendation && (
        <div className="space-y-6">
          {/* Top Hero Card for Recommended Role */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-300" /> Primary AI Recommendation
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {recommendation.recommended_role}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-indigo-100/90 max-w-2xl leading-relaxed">
                  {recommendation.reasoning}
                </p>
              </div>

              {/* Demand & Salary Metrics */}
              <div className="flex flex-wrap lg:flex-col gap-3 shrink-0">
                <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 min-w-[140px]">
                  <span className="text-[11px] text-indigo-200 uppercase font-semibold block">Market Demand</span>
                  <div className="text-lg font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-4 h-4" /> {recommendation.market_demand || 'High / Exponential'}
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 min-w-[140px]">
                  <span className="text-[11px] text-indigo-200 uppercase font-semibold block">Avg. Entry Salary</span>
                  <div className="text-lg font-bold text-white flex items-center gap-1 mt-0.5">
                    <DollarSign className="w-4 h-4 text-emerald-400" /> {recommendation.salary_range || '$85k - $125k / ₹12-24 LPA'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alternative Career Paths */}
          {recommendation.career_paths && recommendation.career_paths.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                Alternative Matched Career Paths
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendation.career_paths.map((path, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-sm transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-slate-900">{path.title}</h4>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {path.fit_score}% Fit
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-3 leading-relaxed">{path.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Key Required Skills
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {path.key_skills?.map((sk, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 font-medium"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skill Breakdown: Existing vs Missing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Existing Skills */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <h3 className="text-base font-bold text-emerald-800 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Skills You Already Have ({recommendation.existing_skills?.length || 0})
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Found in your active profile that directly apply to {recommendation.recommended_role}.
              </p>

              <div className="flex flex-wrap gap-2">
                {recommendation.existing_skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <h3 className="text-base font-bold text-amber-800 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Skills To Acquire ({recommendation.missing_skills?.length || 0})
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Critical industry competencies needed to be 100% job-ready for this role.
              </p>

              <div className="flex flex-wrap gap-2">
                {recommendation.missing_skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold"
                  >
                    + {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actionable Next Steps */}
          {recommendation.next_steps && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Recommended Action Sequence
              </h3>

              <div className="space-y-3">
                {recommendation.next_steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs sm:text-sm font-medium text-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                <Link
                  to="/skill-gap"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  View Detailed Skill-Gap Analysis <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/roadmap"
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  Generate Custom Roadmap <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
