import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, Sparkles, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  title?: string;
  subtitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileMenu,
  title = 'StudentPath AI',
  subtitle
}) => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AC';

  const academicTag = profile?.branch
    ? `${profile.branch} • ${profile.graduation_year || 'Final Year'}`
    : 'B.Tech CSE • Final Year';

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 z-30">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 truncate">
            {title === 'Student Dashboard'
              ? `Welcome back, ${user?.name || 'Alex Chen'}`
              : title}
          </h2>
          <span className="hidden sm:inline-flex px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[11px] font-medium border border-slate-200 uppercase tracking-tight whitespace-nowrap">
            {academicTag}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Gemini Active Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Gemini 3.7 Flash</span>
        </div>

        {/* Target Role summary */}
        <div className="text-right hidden sm:block">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Target Role</p>
          <p className="text-sm font-semibold text-indigo-600 truncate max-w-[180px]">
            {profile?.target_role || 'AI/ML Engineer'}
          </p>
        </div>

        {/* Avatar Profile */}
        <button
          onClick={() => navigate('/profile')}
          title="View Student Profile"
          className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-700 font-bold text-sm hover:ring-2 hover:ring-indigo-400 transition-all shrink-0"
        >
          {userInitials}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="Log out"
          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-100"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
