import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { aiService } from '../services/aiService.ts';
import { LoadingState } from '../components/LoadingState.tsx';
import type { StudyPlan } from '../types/index.ts';
import {
  CalendarCheck,
  Sparkles,
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertCircle,
  Award,
  ChevronRight,
  ListTodo,
  Calendar
} from 'lucide-react';

export const StudyPlanPage: React.FC = () => {
  const { profile } = useAuth();
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  const fetchStudyPlan = async (forceRegenerate = false) => {
    try {
      setLoading(true);
      setError(null);
      if (!forceRegenerate) {
        const cached = await aiService.getStudyPlan();
        if (cached.studyPlan) {
          setStudyPlan(cached.studyPlan);
          setLoading(false);
          return;
        }
      }
      const res = await aiService.generateStudyPlan();
      setStudyPlan(res.studyPlan);
    } catch (err: any) {
      setError(err.message || 'Failed to generate personalized study plan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudyPlan();
  }, []);

  const handleToggleTask = async (taskId: string) => {
    try {
      const res = await aiService.toggleStudyTask(taskId);
      setStudyPlan(res.studyPlan);
    } catch (err: any) {
      console.error('Failed to toggle task:', err);
    }
  };

  const currentWeekData = studyPlan?.weekly_plan?.find((w) => w.week_number === selectedWeek) || studyPlan?.weekly_plan?.[0];

  const totalTasksInPlan = studyPlan?.weekly_plan?.reduce((acc, w) => acc + (w.daily_tasks?.length || 0), 0) || 0;
  const completedTasksCount = studyPlan?.completed_items?.length || 0;
  const progressPercent = totalTasksInPlan > 0 ? Math.round((completedTasksCount / totalTasksInPlan) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <CalendarCheck className="w-4 h-4" /> Adaptive Study Schedule
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Personalized Daily & Weekly Study Plan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Optimized for <strong className="text-slate-800">{profile?.available_hours_per_day || 3} hours/day</strong> based on your active Roadmap and target deadlines.
          </p>
        </div>

        <button
          onClick={() => fetchStudyPlan(true)}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 flex items-center gap-2 transition-colors disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Rebalance Plan
        </button>
      </div>

      {loading && (
        <LoadingState
          message="Synthesizing Adaptive Schedule..."
          subtext="Calculating optimal study slots, practice intervals, and milestone checkpoints."
          icon="book"
        />
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && studyPlan && (
        <div className="space-y-6">
          {/* Plan Meta Banner */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" /> Dynamic Schedule
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                {studyPlan.total_weeks || 8}-Week Mastery Sprint
              </h3>
              <p className="text-xs sm:text-sm text-indigo-100/90 mt-1">
                {studyPlan.hours_per_day || 3} Hours / Day • {studyPlan.weekly_plan?.length || 4} Active Sprints
              </p>
            </div>

            {/* Task Completion Progress */}
            <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10 shrink-0 min-w-[200px]">
              <div className="flex justify-between text-xs text-indigo-200 mb-1.5 font-semibold">
                <span>Task Completion</span>
                <span>{completedTasksCount}/{totalTasksInPlan} Done</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[11px] text-emerald-300 font-semibold block mt-1">
                {progressPercent}% Tasks Completed
              </span>
            </div>
          </div>

          {/* Week Selector Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {studyPlan.weekly_plan?.map((w) => (
              <button
                key={w.week_number}
                onClick={() => setSelectedWeek(w.week_number)}
                className={`px-5 py-2.5 rounded-2xl font-bold text-xs shrink-0 transition-all border ${
                  selectedWeek === w.week_number
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                Week {w.week_number}: {w.theme}
              </button>
            ))}
          </div>

          {/* Current Selected Week Card */}
          {currentWeekData && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              {/* Week Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Week {currentWeekData.week_number}: {currentWeekData.theme}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Target Goal: <span className="font-semibold text-indigo-700">{currentWeekData.weekly_goal}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  {currentWeekData.daily_tasks?.length || 0} Daily Schedules
                </div>
              </div>

              {/* Daily Task List */}
              <div className="space-y-4">
                {currentWeekData.daily_tasks?.map((task) => {
                  const isChecked = task.completed;
                  return (
                    <div
                      key={task.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isChecked
                          ? 'bg-emerald-50/40 border-emerald-200 text-slate-500'
                          : 'bg-slate-50/60 border-slate-200/80 hover:bg-white hover:border-indigo-200 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Interactive Checkbox */}
                        <button
                          type="button"
                          onClick={() => handleToggleTask(task.id)}
                          className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                            isChecked
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-white border-slate-300 hover:border-indigo-600'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-4 h-4" />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                            <h4 className={`text-sm font-bold ${isChecked ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                              {task.day} — {task.focus}
                            </h4>
                            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {task.duration_hours} Hours
                            </span>
                          </div>

                          {/* Action items */}
                          <div className="space-y-1.5 mt-2">
                            {task.action_items?.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
