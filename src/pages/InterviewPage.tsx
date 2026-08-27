import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { aiService } from '../services/aiService.ts';
import { LoadingState } from '../components/LoadingState.tsx';
import type { InterviewSession, InterviewQuestion } from '../types/index.ts';
import {
  FileCheck2,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Send,
  HelpCircle,
  Lightbulb,
  MessageSquareQuote,
  Layers
} from 'lucide-react';

export const InterviewPage: React.FC = () => {
  const { profile } = useAuth();
  const [role, setRole] = useState(profile?.target_role || 'AI & Full Stack Engineer');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [topic, setTopic] = useState('Technical & System Architecture');
  const [questionCount, setQuestionCount] = useState(3);

  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<any>(null);
  const [history, setHistory] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = async () => {
    try {
      const res = await aiService.getInterviewHistory();
      if (res.history) setHistory(res.history);
    } catch (err) {
      console.error('Failed to load interview history:', err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleStartInterview = async () => {
    try {
      setLoading(true);
      setError(null);
      setActiveSession(null);
      setCurrentEvaluation(null);
      setCurrentQIndex(0);
      setUserAnswer('');

      const res = await aiService.startInterview(role, difficulty, topic, questionCount);
      setActiveSession(res.session);
    } catch (err: any) {
      setError(err.message || 'Failed to start interview session');
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!activeSession || !userAnswer.trim()) {
      setError('Please provide an answer before submitting for evaluation.');
      return;
    }

    const currentQ = activeSession.questions[currentQIndex];

    try {
      setEvaluating(true);
      setError(null);
      const res = await aiService.evaluateInterviewAnswer({
        sessionId: activeSession.id,
        questionId: currentQ.id,
        answer: userAnswer,
        role: activeSession.role,
        difficulty: activeSession.difficulty,
        questionText: currentQ.question
      });

      setCurrentEvaluation(res.evaluation);
      // Update local session
      activeSession.questions[currentQIndex].user_answer = userAnswer;
      activeSession.questions[currentQIndex].score = res.evaluation.score;
      activeSession.questions[currentQIndex].feedback = res.evaluation.feedback;
      activeSession.questions[currentQIndex].model_answer = res.evaluation.model_answer;
      activeSession.questions[currentQIndex].strengths = res.evaluation.strengths;
      activeSession.questions[currentQIndex].weaknesses = res.evaluation.weaknesses;
      activeSession.questions[currentQIndex].suggestions = res.evaluation.suggestions;
      loadHistory();
    } catch (err: any) {
      setError(err.message || 'Failed to evaluate answer');
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (activeSession && currentQIndex < activeSession.questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setUserAnswer('');
      setCurrentEvaluation(null);
    }
  };

  const currentQuestion = activeSession?.questions?.[currentQIndex];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <FileCheck2 className="w-4 h-4" /> AI Mock Interview Simulator
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Technical & Behavioral Interview Practice
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time answer grading, scoring against hiring rubrics, and comprehensive model answer comparisons.
          </p>
        </div>

        {!activeSession && (
          <button
            onClick={handleStartInterview}
            disabled={loading}
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-colors disabled:opacity-60"
          >
            <Sparkles className="w-3.5 h-3.5" /> Start Mock Round
          </button>
        )}
      </div>

      {loading && (
        <LoadingState
          message="Generating Custom Mock Interview Questions..."
          subtext="The Student Agent is preparing technical questions matched to role requirements."
          icon="brain"
        />
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Configuration Form (when no active session) */}
      {!activeSession && !loading && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Configure Interview Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 text-xs text-slate-900 bg-white"
              >
                <option value="Entry / Junior">Entry / Junior Level</option>
                <option value="Intermediate">Intermediate / Mid-Level</option>
                <option value="Senior / FAANG">Senior / FAANG Caliber</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Interview Focus / Round</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 text-xs text-slate-900 bg-white"
              >
                <option value="Technical & System Architecture">Technical & Architecture</option>
                <option value="Data Structures & Problem Solving">Data Structures & Algorithms</option>
                <option value="Frontend & React Deep Dive">Frontend & React</option>
                <option value="Backend & Database Engineering">Backend & Databases</option>
                <option value="Behavioral & STAR Leadership">Behavioral (STAR Method)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Question Count</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 text-xs text-slate-900 bg-white"
              >
                <option value={3}>3 Questions (Quick Sprint)</option>
                <option value={5}>5 Questions (Full Round)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleStartInterview}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" /> Start Practice Interview
            </button>
          </div>
        </div>
      )}

      {/* Active Interview Session */}
      {activeSession && currentQuestion && (
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center justify-between text-xs font-semibold text-indigo-800">
            <span>
              Question {currentQIndex + 1} of {activeSession.questions.length} • {activeSession.role} ({activeSession.difficulty})
            </span>
            <button
              onClick={() => setActiveSession(null)}
              className="text-slate-500 hover:text-slate-800 underline"
            >
              Exit Session
            </button>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                Q{currentQIndex + 1}
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 inline-block mb-1.5">
                  {currentQuestion.category || 'Technical Assessment'}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {currentQuestion.question}
                </h3>
              </div>
            </div>

            {/* Answer Input Area */}
            {!currentEvaluation && (
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Your Spoken or Written Response:
                </label>
                <textarea
                  rows={5}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Explain your thought process, architecture trade-offs, and technical rationale in detail..."
                  className="w-full p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleEvaluateAnswer}
                    disabled={evaluating || !userAnswer.trim()}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {evaluating ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" /> Submit & Evaluate with AI
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Evaluation Results Card */}
            {currentEvaluation && (
              <div className="space-y-5 pt-4 border-t border-slate-100">
                {/* Score & Feedback */}
                <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                      AI Rubric Evaluation
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium">
                      {currentEvaluation.feedback}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-3xl font-black text-indigo-600">{currentEvaluation.score}%</span>
                    <span className="text-[10px] text-slate-500 block font-semibold">Answer Score</span>
                  </div>
                </div>

                {/* Model Answer */}
                <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 space-y-2">
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquareQuote className="w-4 h-4 text-indigo-400" /> Ideal Model Answer (What Top Engineers Say)
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {currentEvaluation.model_answer}
                  </p>
                </div>

                {/* Next Question Navigation */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-slate-400 font-medium">
                    Question {currentQIndex + 1} of {activeSession.questions.length} evaluated
                  </span>

                  {currentQIndex < activeSession.questions.length - 1 ? (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                    >
                      Next Question <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveSession(null)}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                    >
                      Complete Session & View Summary <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History Table */}
      {!activeSession && history.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" /> Previous Mock Interview Rounds
          </h3>
          <div className="space-y-3">
            {history.map((sess) => (
              <div
                key={sess.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{sess.role}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {sess.difficulty} • {sess.topic} • {sess.questions?.length} Questions
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-extrabold text-indigo-600 block">
                    {sess.overall_score !== undefined ? `${sess.overall_score}%` : 'In Progress'}
                  </span>
                  <span className="text-[10px] text-slate-400">Average Score</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
