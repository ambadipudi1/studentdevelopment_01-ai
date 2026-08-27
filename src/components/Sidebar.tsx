import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Compass,
  GitPullRequestDraft,
  Map,
  CalendarCheck,
  FolderGit2,
  Bot,
  FileCheck2,
  TrendingUp,
  Settings,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { user, profile } = useAuth();

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Career Roadmap', path: '/roadmap', icon: Map },
    { name: 'Skill Assessment', path: '/assessment', icon: GraduationCap },
    { name: 'AI Learning Coach', path: '/ai-coach', icon: Bot, highlight: true },
    { name: 'Project Lab', path: '/projects', icon: FolderGit2 },
    { name: 'Interview Prep', path: '/interview', icon: FileCheck2 },
    { name: 'Career Recommendations', path: '/career', icon: Compass },
    { name: 'Skill-Gap Analysis', path: '/skill-gap', icon: GitPullRequestDraft },
    { name: 'Daily Study Plan', path: '/study-plan', icon: CalendarCheck },
    { name: 'Progress & Analytics', path: '/progress', icon: TrendingUp },
    { name: 'Student Profile', path: '/profile', icon: User },
    { name: 'Platform Settings', path: '/settings', icon: Settings },
  ];

  const readinessScore = 74;

  return (
    <aside className="w-64 h-full bg-[#0F172A] text-white flex flex-col border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-6 mb-2">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl italic text-white shadow-sm">
            S
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            STUDENTPATH<span className="text-indigo-400">AI</span>
          </h1>
        </div>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
          Career Learning Agent
        </p>
      </div>

      {/* Student Role Subcard */}
      {profile && (
        <div className="mx-4 mb-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-200 truncate">{profile.target_role || 'Target Role'}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              {profile.experience_level || 'Active'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">
            {profile.branch || 'B.Tech CSE'} • {profile.college || 'University'}
          </p>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* AI Readiness Score Bottom Card */}
      <div className="p-4 mt-auto border-t border-slate-800/80 space-y-3">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <p className="text-xs text-slate-400 mb-2">AI Readiness Score</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400">{readinessScore}</span>
            <span className="text-[10px] text-slate-500">/ 100</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-400 h-full transition-all duration-500"
              style={{ width: `${readinessScore}%` }}
            />
          </div>
        </div>

        {/* User profile snippet */}
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AC'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Alex Chen'}</p>
            <p className="text-[10px] text-slate-400 truncate">{profile?.target_role || 'AI/ML Engineer'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
