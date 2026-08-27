import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { aiService } from '../services/aiService.ts';
import { LoadingState } from '../components/LoadingState.tsx';
import type { Project, ProjectGuidanceDetails } from '../types/index.ts';
import {
  FolderGit2,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertCircle,
  FileCode,
  Database,
  ListOrdered,
  FileText,
  X,
  ArrowRight,
  Code
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Guidance modal state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [guidance, setGuidance] = useState<ProjectGuidanceDetails | null>(null);
  const [guidanceLoading, setGuidanceLoading] = useState(false);

  const fetchProjects = async (forceRegenerate = false) => {
    try {
      setLoading(true);
      setError(null);
      if (!forceRegenerate) {
        const cached = await aiService.getProjects();
        if (cached.projects && cached.projects.length > 0) {
          setProjects(cached.projects);
          setLoading(false);
          return;
        }
      }
      const res = await aiService.generateProjects(selectedDifficulty === 'All' ? undefined : selectedDifficulty);
      setProjects(res.projects);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenGuidance = async (project: Project) => {
    setSelectedProject(project);
    if (project.guidance) {
      setGuidance(project.guidance);
      return;
    }

    try {
      setGuidanceLoading(true);
      const res = await aiService.getProjectGuidance(project.id);
      setGuidance(res.guidance);
    } catch (err: any) {
      console.error('Failed to get guidance:', err);
    } finally {
      setGuidanceLoading(false);
    }
  };

  const handleStatusChange = async (projectId: string, status: 'Not Started' | 'In Progress' | 'Completed') => {
    try {
      const res = await aiService.updateProjectStatus(projectId, status);
      setProjects(projects.map((p) => (p.id === projectId ? res.project : p)));
    } catch (err) {
      console.error('Failed to update project status:', err);
    }
  };

  const filteredProjects = selectedDifficulty === 'All'
    ? projects
    : projects.filter((p) => p.difficulty === selectedDifficulty);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <FolderGit2 className="w-4 h-4" /> AI Project Blueprint Generator
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Resume-Ready Portfolio Projects
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            High-leverage engineering projects tailored for <strong className="text-slate-800">{profile?.target_role || 'AI & Full Stack'}</strong> with full architectural blueprints.
          </p>
        </div>

        <button
          onClick={() => fetchProjects(true)}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 flex items-center gap-2 transition-colors disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Generate New Projects
        </button>
      </div>

      {/* Difficulty Filter Tabs */}
      <div className="flex gap-2">
        {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
          <button
            key={diff}
            onClick={() => setSelectedDifficulty(diff)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              selectedDifficulty === diff
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {diff}
          </button>
        ))}
      </div>

      {loading && (
        <LoadingState
          message="Architecting Portfolio Projects..."
          subtext="Creating production-level application specs with databases, APIs, and recruiter impact bullet points."
          icon="layers"
        />
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Projects Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    proj.difficulty === 'Beginner'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : proj.difficulty === 'Intermediate'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {proj.difficulty}
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {proj.estimated_time}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {proj.title}
                </h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed line-clamp-3">
                  {proj.description}
                </p>

                {/* Tech Stack Pills */}
                <div className="mb-4">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Tech Stack
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {proj.tech_stack?.map((t, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Resume Impact */}
                {proj.resume_impact && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4 text-[11px] text-slate-600">
                    <strong className="text-slate-800 font-semibold block mb-0.5">Resume Impact:</strong>
                    {proj.resume_impact}
                  </div>
                )}
              </div>

              {/* Status Selector & Blueprint CTA */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <select
                  value={proj.status || 'Not Started'}
                  onChange={(e) => handleStatusChange(proj.id, e.target.value as any)}
                  className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border focus:outline-none ${
                    proj.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : proj.status === 'In Progress'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleOpenGuidance(proj)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Blueprint
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Architectural Guidance Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                  AI Architectural Blueprint & Guide
                </span>
                <h3 className="text-xl font-bold text-slate-900">{selectedProject.title}</h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {guidanceLoading ? (
              <LoadingState
                message="Generating Detailed Engineering Specification..."
                subtext="Compiling folder structures, schema definitions, and resume statements."
              />
            ) : guidance ? (
              <div className="space-y-6">
                {/* 1. Architecture Overview */}
                <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                  <h4 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" /> Architecture Overview
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {guidance.architecture_overview}
                  </p>
                </div>

                {/* 2. Folder Structure */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-indigo-600" /> Recommended Folder Structure
                  </h4>
                  <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto">
                    {guidance.folder_structure}
                  </pre>
                </div>

                {/* 3. Database Schema */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-600" /> Database Schema & Entity Relationships
                  </h4>
                  <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-300 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                    {guidance.database_schema}
                  </pre>
                </div>

                {/* 4. Step-by-Step Implementation */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <ListOrdered className="w-4 h-4 text-indigo-600" /> Step-by-Step Implementation Flow
                  </h4>
                  <div className="space-y-2">
                    {guidance.step_by_step_guide?.map((step: any, idx: number) => {
                      const stepText = typeof step === 'string' ? step : `${step.title || ''}: ${step.explanation || ''}`;
                      return (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700 flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{stepText}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Resume Bullet Points */}
                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                  <h4 className="text-sm font-bold text-emerald-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-700" /> Resume Bullet Points (Copy & Paste)
                  </h4>
                  <div className="space-y-1.5">
                    {(guidance.resume_bullets || guidance.resume_bullet_points || [])?.map((b: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
