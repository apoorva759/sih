import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import { DEMO_USERS } from '../../data/authData';
import { User, UserRole } from '../../types';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  Train,
  ArrowRight,
  Briefcase,
  Zap,
  Info,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authMode,
    setAuthMode,
    login,
    currentUser,
  } = useRailway();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign up fields
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('OPERATIONS_CONTROLLER');
  const [employeeIdOrPnr, setEmployeeIdOrPnr] = useState('');
  const [division, setDivision] = useState('Jhansi Division (NCR)');
  const [phone, setPhone] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!authModalOpen) return null;

  const handleQuickLogin = (demoUser: User) => {
    login(demoUser);
    setSuccessMsg(`Welcome, ${demoUser.name} (${demoUser.roleTitle})`);
    setTimeout(() => {
      setSuccessMsg('');
      setAuthModalOpen(false);
    }, 800);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both Email/Employee ID and Password.');
      return;
    }

    // Check if matches demo users or create dynamic session
    const matched = DEMO_USERS.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() ||
        u.employeeIdOrPnr.toLowerCase() === email.toLowerCase()
    );

    if (matched) {
      handleQuickLogin(matched);
    } else {
      const isPassenger = email.includes('pnr') || email.includes('passenger');
      const newUser: User = {
        id: `USR-${Date.now()}`,
        name: email.split('@')[0] || 'Railway Official',
        email,
        role: isPassenger ? 'PASSENGER' : 'OPERATIONS_CONTROLLER',
        roleTitle: isPassenger ? 'Passenger' : 'Section Controller',
        division: 'NCR Division',
        employeeIdOrPnr: isPassenger ? 'PNR: 2458910234' : 'CRIS-NCR-9912',
        avatarInitials: email.substring(0, 2).toUpperCase(),
        avatarBg: 'bg-indigo-600',
      };
      handleQuickLogin(newUser);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('Please accept the CRIS Operational Security Terms.');
      return;
    }

    const roleTitles: Record<UserRole, string> = {
      OPERATIONS_CONTROLLER: 'Chief Section Controller',
      TRACK_ENGINEER: 'Senior P-Way Track Engineer',
      PASSENGER: 'Verified Passenger',
    };

    const newUser: User = {
      id: `USR-${Date.now()}`,
      name: fullName,
      email,
      role,
      roleTitle: roleTitles[role],
      division: division || 'North Central Railway',
      employeeIdOrPnr: employeeIdOrPnr || (role === 'PASSENGER' ? 'PNR: 2458910234' : 'CRIS-NCR-7740'),
      avatarInitials: fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'IR',
      avatarBg: role === 'PASSENGER' ? 'bg-blue-600' : role === 'TRACK_ENGINEER' ? 'bg-purple-600' : 'bg-indigo-600',
      phone,
      subscribedTrainNumber: role === 'PASSENGER' ? '12806' : undefined,
    };

    handleQuickLogin(newUser);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-900 dark:text-white transition-colors duration-200">
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-md flex items-center justify-center">
            <div className="h-full w-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Train className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
                RAILETA AI
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20">
                CRIS SECURE GATEWAY
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ministry of Railways • Dynamic ETA Forecasting System (SIH26028)
            </p>
          </div>
        </div>

        {/* 1-Click Fast Demo Logins for Judges */}
        <div className="mb-6 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              1-Click Demo Profiles (For SIH Presentation)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Instant Sign-In</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {DEMO_USERS.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickLogin(u)}
                className="text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-sm transition group"
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-lg ${u.avatarBg} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                    {u.avatarInitials}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                      {u.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {u.roleTitle.split(' ')[0]}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mode Switcher Tabs (Login vs Sign Up) */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setAuthMode('LOGIN');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              authMode === 'LOGIN'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Sign In to Terminal
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('SIGNUP');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              authMode === 'SIGNUP'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Register New Account
          </button>
        </div>

        {/* Feedback Message */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center space-x-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form: LOGIN */}
        {authMode === 'LOGIN' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                CRIS Employee ID / Work Email / Passenger PNR
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rajesh.sharma@ncr.railnet.gov.in or CRIS-NCR-8841"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password / Terminal Passcode
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    setErrorMsg('Password reset code dispatched to authorized Indian Railways personnel phone.');
                  }}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot passcode?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember this terminal session</span>
              </label>
              <span className="font-mono text-[10px] text-slate-400">256-Bit SSL</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition transform active:scale-[0.99] flex items-center justify-center space-x-2 mt-2"
            >
              <span>Authenticate & Enter System</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Form: SIGNUP */
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            {/* Role Selector Pills */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Select Your Role in the Railway Network
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'OPERATIONS_CONTROLLER', label: 'Section Controller', icon: Train },
                  { id: 'TRACK_ENGINEER', label: 'P-Way Engineer', icon: Briefcase },
                  { id: 'PASSENGER', label: 'Passenger', icon: UserIcon },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = role === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRole(item.id as UserRole)}
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                        isSelected
                          ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 font-bold shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px] leading-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sumanth Rao"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {role === 'PASSENGER' ? '10-Digit PNR / Mobile' : 'CRIS Employee ID'}
                </label>
                <input
                  type="text"
                  value={employeeIdOrPnr}
                  onChange={(e) => setEmployeeIdOrPnr(e.target.value)}
                  placeholder={role === 'PASSENGER' ? 'e.g. 2458910234' : 'e.g. CRIS-NCR-5521'}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Work Email / Contact Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@railnet.gov.in"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Railway Division / Zone
                </label>
                <input
                  type="text"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  placeholder="e.g. Jhansi Division (NCR)"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Create Secure Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 pr-10 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Dynamic strength indicator */}
              {password.length > 0 && (
                <div className="mt-1.5 flex items-center space-x-2">
                  <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full transition-all ${
                        password.length > 8
                          ? 'bg-emerald-500 w-full'
                          : password.length > 5
                          ? 'bg-amber-500 w-2/3'
                          : 'bg-rose-500 w-1/3'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {password.length > 8 ? 'Strong' : password.length > 5 ? 'Medium' : 'Weak'}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-1">
              <label className="flex items-start space-x-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 mt-0.5"
                />
                <span className="text-[11px] leading-relaxed">
                  I agree to adhere to Ministry of Railways CRIS Cybersecurity Protocols & Smart India Hackathon operational safety compliance.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition transform active:scale-[0.99] flex items-center justify-center space-x-2 mt-2"
            >
              <span>Create Account & Authorize Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
