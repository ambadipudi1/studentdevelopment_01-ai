import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { assessmentService } from '../services/assessmentService.ts';
import { LoadingState } from '../components/LoadingState.tsx';
import type { Assessment, AssessmentQuestion } from '../types/index.ts';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Award,
  BookOpen,
  Layers,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AssessmentPage: React.FC = () => {
  const { profile } = useAuth();
  const [assessmentType, setAssessmentType] = useState(
    `${profile?.target_role || 'AI & Full Stack'} Core Assessment`
  );
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submittedResult, setSubmittedResult] = useState<Assessment | null>(null);
  const [history, setHistory] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startNewAssessment = async () => {
    try {
      setLoading(true);
      setError(null);
      setSubmittedResult(null);
      setAnswers({});
      const res = await assessmentService.generateAssessment(assessmentType, 5);
      if (res.assessment && res.assessment.questions) {
        setQuestions(res.assessment.questions);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate assessment');
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await assessmentService.getHistory();
      if (res.history) setHistory(res.history);
    } catch (err) {
      console.error('Failed to load assessment history:', err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSelectOption = (qId: number, optionKey: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: optionKey
    }));
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(answers).length < questions.length) {
      setError('Please answer all questions before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const res = await assessmentService.submitAssessment(questions, answers, assessmentType);
      setSubmittedResult(res.assessment);
      loadHistory();
    } catch (err: any) {
      setError(err.message || 'Failed to evaluate assessment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" /> AI Technical Evaluation
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Skills & Competency Assessment
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Test your domain depth, uncover conceptual blind spots, and receive AI-curated remediation paths.
          </p>
        </div>

        {questions.length === 0 && !submittedResult && (
          <button
            onClick={startNewAssessment}
            disabled={loading}
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-colors disabled:opacity-60"
          >
            <Sparkles className="w-3.5 h-3.5" /> Start Assessment
          </button>
        )}
      </div>

      {loading && (
        <LoadingState
          message="Generating Technical Assessment Questions..."
          subtext="The Student Agent is preparing domain questions across data structures, architecture, and core frameworks."
          icon="brain"
        />
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Assessment Question Interface */}
      {!loading && questions.length > 0 && !submittedResult && (
        <div className="space-y-6">
          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center justify-between text-xs font-semibold text-indigo-800">
            <span>5 Questions • {assessmentType}</span>
            <span>{Object.keys(answers).length} / {questions.length} Answered</span>
          </div>

          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4"
              >
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 inline-block mb-1.5">
                      {q.topic || 'Concept'}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {q.question}
                    </h3>
                  </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {Object.entries(q.options || {}).map(([key, optText]: [string, any]) => {
                    const isSelected = answers[q.id] === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectOption(q.id, key)}
                        className={`p-3.5 rounded-2xl text-left text-xs sm:text-sm font-medium border transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100/70 hover:border-slate-300'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-600 border border-slate-200'
                          }`}
                        >
                          {key}
                        </span>
                        <span className="flex-1">{String(optText)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Action */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting || Object.keys(answers).length < questions.length}
              className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Submit Assessment & Evaluate with AI <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Submitted Result Screen */}
      {submittedResult && (
        <div className="space-y-6">
          {/* Hero Score Banner */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" /> Assessment Result
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Score: {submittedResult.score}%
              </h3>
              <p className="text-xs sm:text-sm text-indigo-100/90 mt-2 max-w-xl">
                {submittedResult.feedback}
              </p>
            </div>

            <button
              onClick={startNewAssessment}
              className="px-5 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs shadow-sm hover:bg-slate-100 transition-colors shrink-0"
            >
              Take Another Assessment
            </button>
          </div>

          {/* Strengths & Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
              <h4 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Strengths Identified
              </h4>
              <div className="space-y-2">
                {submittedResult.strengths?.map((s, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-slate-700 flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weaknesses / Missing Concepts */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
              <h4 className="text-sm font-bold text-rose-800 mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-600" /> Conceptual Blind Spots & Gaps
              </h4>
              <div className="space-y-2">
                {submittedResult.weaknesses?.map((w, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 text-xs text-slate-700 flex items-start gap-2">
                    <span className="text-rose-600 font-bold">!</span>
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Topics */}
          {submittedResult.recommended_topics && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" /> Recommended Remediation Topics
              </h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {submittedResult.recommended_topics.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <Link
                  to="/study-plan"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  Add to Study Plan <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/ai-coach"
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1.5"
                >
                  Discuss Gaps with AI Mentor <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State / Previous Assessments History */}
      {questions.length === 0 && !submittedResult && history.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" /> Previous Assessment History
          </h3>
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.assessment_type}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.feedback}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-extrabold text-indigo-600 block">{item.score}%</span>
                  <span className="text-[10px] text-slate-400">Score</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
