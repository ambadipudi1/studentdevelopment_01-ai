import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { progressService } from '../services/progressService.ts';
import {
  Settings,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  User,
  LogOut,
  RefreshCw,
  Trash2,
  Server
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await progressService.getSystemStatus();
        setSystemStatus(res);
      } catch (err) {
        console.error('Failed to get system status:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4" /> System & Account Settings
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Platform Configuration & AI Diagnostics
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Verify backend health, Google Gemini API operational state, and profile settings.
        </p>
      </div>

      {/* AI & Infrastructure Health */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 font-bold text-slate-900">
          <Cpu className="w-5 h-5 text-indigo-600" />
          <h3>AI Engine & Single Agent Diagnostics</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Architecture</span>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Student Learning & Career Agent
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Single unified agent handling all features</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Gemini Model</span>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              {systemStatus?.gemini_model || 'gemini-3.7-flash'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Official @google/genai SDK on Server</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
            <span className="text-xs text-slate-400 font-semibold block mb-1">Backend Server</span>
            <div className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-emerald-600" />
              Operational (Port 3000)
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Secure server-side API proxy</p>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 font-bold text-slate-900">
          <User className="w-5 h-5 text-indigo-600" />
          <h3>Account Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Student Name</label>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800">
              {user?.name}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800">
              {user?.email}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigate('/profile')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            Edit Academic Profile
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
