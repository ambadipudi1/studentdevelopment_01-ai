import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { profileService } from '../services/profileService.ts';
import {
  User,
  GraduationCap,
  Sparkles,
  BookOpen,
  Clock,
  Building,
  Target,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Save,
  Layers
} from 'lucide-react';

const COMMON_SKILLS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express',
  'SQL', 'PostgreSQL', 'MongoDB', 'Git', 'Docker', 'FastAPI',
  'Tailwind CSS', 'Machine Learning', 'Data Structures & Algorithms',
  'System Design', 'AWS', 'Linux', 'PyTorch', 'TensorFlow'
];

const COMMON_INTERESTS = [
  'Artificial Intelligence & ML', 'Full Stack Web Development',
  'Cloud & DevOps Engineering', 'Data Science & Analytics',
  'Cybersecurity & Networking', 'Mobile App Development', 'System Architecture'
];

const TARGET_ROLES = [
  'AI & Full Stack Engineer',
  'Full Stack Developer',
  'AI / Machine Learning Engineer',
  'Frontend Engineer',
  'Backend Engineer',
  'Data Scientist',
  'DevOps & Cloud Engineer'
];

export const ProfilePage: React.FC = () => {
  const { profile, user, refreshProfile, updateProfileState } = useAuth();

  const [college, setCollege] = useState(profile?.college || '');
  const [degree, setDegree] = useState(profile?.degree || 'B.Tech');
  const [branch, setBranch] = useState(profile?.branch || 'Computer Science & Engineering');
  const [yearOfStudy, setYearOfStudy] = useState(profile?.year_of_study || '3rd Year');
  const [cgpa, setCgpa] = useState<number>(typeof profile?.cgpa === 'number' ? profile.cgpa : Number(profile?.cgpa || 8.6));
  const [experienceLevel, setExperienceLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(profile?.experience_level || 'Intermediate');
  const [skills, setSkills] = useState<string[]>(profile?.skills || ['Python', 'JavaScript', 'React', 'Git']);
  const [newSkill, setNewSkill] = useState('');
  const [interests, setInterests] = useState<string[]>(profile?.interests || ['Artificial Intelligence & ML', 'Full Stack Web Development']);
  const [targetRole, setTargetRole] = useState(profile?.target_role || 'AI & Full Stack Engineer');
  const [targetCompanies, setTargetCompanies] = useState(profile?.target_companies || 'Product Tech Companies & AI Startups');
  const [availableHours, setAvailableHours] = useState<number>(profile?.available_hours_per_day || 3);
  const [learningStyle, setLearningStyle] = useState(profile?.learning_style || 'Hands-on Projects & Step-by-Step Code Walkthroughs');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setCollege(profile.college || '');
      setDegree(profile.degree || 'B.Tech');
      setBranch(profile.branch || 'Computer Science & Engineering');
      setYearOfStudy(profile.year_of_study || '3rd Year');
      setCgpa(typeof profile.cgpa === 'number' ? profile.cgpa : Number(profile.cgpa || 8.6));
      setExperienceLevel(profile.experience_level || 'Intermediate');
      setSkills(profile.skills || ['Python', 'JavaScript', 'React', 'Git']);
      setInterests(profile.interests || ['Artificial Intelligence & ML', 'Full Stack Web Development']);
      setTargetRole(profile.target_role || 'AI & Full Stack Engineer');
      setTargetCompanies(profile.target_companies || 'Product Tech Companies & AI Startups');
      setAvailableHours(profile.available_hours_per_day || 3);
      setLearningStyle(profile.learning_style || 'Hands-on Projects & Step-by-Step Code Walkthroughs');
    }
  }, [profile]);

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleToggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!college || !targetRole) {
      setError('Please provide at least your College/University and Target Role');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSaveSuccess(false);

      const profilePayload = {
        college,
        degree,
        branch,
        year_of_study: yearOfStudy,
        cgpa: Number(cgpa),
        experience_level: experienceLevel,
        skills,
        interests,
        target_role: targetRole,
        target_companies: targetCompanies,
        available_hours_per_day: Number(availableHours),
        learning_style: learningStyle
      };

      const res = await profileService.saveProfile(profilePayload);
      updateProfileState(res.profile);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to save student profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-indigo-100 shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ST'}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {user?.name || 'Student Profile'}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {user?.email} • Single Agent Memory Engine
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Sparkles className="w-3 h-3" />
                  Gemini Agent Ready
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Target: <strong className="text-slate-800">{targetRole || 'Not Set'}</strong>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm flex items-center gap-2 transition-all disabled:opacity-60"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Profile
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Profile saved successfully! Your Student Learning & Career Agent now has your latest background.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Formats */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Academic Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2.5 mb-6 text-slate-900 font-bold text-lg border-b border-slate-100 pb-3">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h3>Academic Background</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                College / University Name
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. Stanford University, UC Berkeley, IIT Bombay"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Degree Program
              </label>
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm text-slate-900 bg-white"
              >
                <option value="B.Tech">B.Tech / B.E.</option>
                <option value="B.S.">B.S. in Computer Science</option>
                <option value="BCA">BCA / MCA</option>
                <option value="M.S.">M.S. / M.Tech</option>
                <option value="Other">Other Undergraduate / Graduate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Major / Branch
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Current Year of Study
              </label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm text-slate-900 bg-white"
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior)</option>
                <option value="Graduate / Final Year">Graduate / Final Year</option>
                <option value="Recent Graduate">Recent Graduate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Cumulative CGPA / GPA (out of 10.0 or 4.0)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={cgpa}
                onChange={(e) => setCgpa(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* 2. Skills & Proficiency */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
              <Layers className="w-5 h-5 text-indigo-600" />
              <h3>Current Skills & Proficiency</h3>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setExperienceLevel(lvl)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    experienceLevel === lvl
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Active Skills Pills */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Your Active Skills ({skills.length})
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/60 min-h-[52px] items-center">
              {skills.length === 0 ? (
                <span className="text-xs text-slate-400">No skills added yet. Select from common skills below or type your own.</span>
              ) : (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-indigo-900 focus:outline-none"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Add Custom Skill */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(newSkill);
                }
              }}
              placeholder="Add custom skill (e.g. Next.js, GraphQL, Kubernetes)"
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-xs text-slate-900"
            />
            <button
              type="button"
              onClick={() => handleAddSkill(newSkill)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          {/* Common Suggestions */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Click to quickly add common skills:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SKILLS.filter((s) => !skills.includes(s)).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleAddSkill(skill)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium transition-colors"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Career Goals & Target Preferences */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2.5 mb-6 text-slate-900 font-bold text-lg border-b border-slate-100 pb-3">
            <Target className="w-5 h-5 text-indigo-600" />
            <h3>Target Goals & Career Aspirations</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Primary Target Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm text-slate-900 bg-white"
              >
                {TARGET_ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Company Types / Dream Companies
              </label>
              <input
                type="text"
                value={targetCompanies}
                onChange={(e) => setTargetCompanies(e.target.value)}
                placeholder="e.g. Google, Microsoft, Seed Stage Startups"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Available Daily Study Hours ({availableHours} hrs/day)
              </label>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={availableHours}
                onChange={(e) => setAvailableHours(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                <span>1 hr (Part-time)</span>
                <span>3-4 hrs (Dedicated)</span>
                <span>8 hrs (Full-time)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Learning Style
              </label>
              <select
                value={learningStyle}
                onChange={(e) => setLearningStyle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm text-slate-900 bg-white"
              >
                <option value="Hands-on Projects & Code Walkthroughs">Hands-on Projects & Code Walkthroughs</option>
                <option value="Structured Theory & Problem Solving">Structured Theory & Problem Solving</option>
                <option value="Video Lessons & Visual Explanations">Video Lessons & Visual Explanations</option>
                <option value="Documentation & Deep Architecture">Documentation & Deep Architecture</option>
              </select>
            </div>
          </div>

          {/* Interests selector */}
          <div className="mt-6">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Career & Tech Domains of Interest
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_INTERESTS.map((interest) => {
                const selected = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleToggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      selected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '}
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Save Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 flex items-center gap-2 transition-all disabled:opacity-60"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Student Profile
          </button>
        </div>
      </form>
    </div>
  );
};
