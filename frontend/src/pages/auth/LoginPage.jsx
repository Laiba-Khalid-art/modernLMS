import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { HiOutlineBookOpen } from 'react-icons/hi';
import toast from 'react-hot-toast';

/* ── SVG Book Stack Illustration ─────────────────────────────── */
function BookIllustration() {
  return (
    <svg viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-sm mx-auto opacity-90">
      {/* Shelf */}
      <rect x="20" y="230" width="280" height="10" rx="5" fill="#4c1d95" opacity="0.6"/>
      <rect x="10" y="236" width="300" height="6" rx="3" fill="#3b0764" opacity="0.4"/>

      {/* Book 1 — Tall violet */}
      <rect x="44" y="140" width="36" height="90" rx="4" fill="#7c3aed"/>
      <rect x="44" y="140" width="7" height="90" rx="2" fill="#6d28d9"/>
      <rect x="55" y="160" width="18" height="2" rx="1" fill="#c4b5fd" opacity="0.7"/>
      <rect x="55" y="166" width="14" height="2" rx="1" fill="#c4b5fd" opacity="0.4"/>
      <rect x="55" y="172" width="16" height="2" rx="1" fill="#c4b5fd" opacity="0.4"/>

      {/* Book 2 — Shorter indigo */}
      <rect x="86" y="162" width="30" height="68" rx="4" fill="#4f46e5"/>
      <rect x="86" y="162" width="6" height="68" rx="2" fill="#4338ca"/>
      <rect x="96" y="180" width="13" height="2" rx="1" fill="#a5b4fc" opacity="0.7"/>
      <rect x="96" y="186" width="10" height="2" rx="1" fill="#a5b4fc" opacity="0.4"/>

      {/* Book 3 — Emerald */}
      <rect x="122" y="148" width="32" height="82" rx="4" fill="#059669"/>
      <rect x="122" y="148" width="6" height="82" rx="2" fill="#047857"/>
      <rect x="132" y="168" width="14" height="2" rx="1" fill="#6ee7b7" opacity="0.7"/>
      <rect x="132" y="174" width="11" height="2" rx="1" fill="#6ee7b7" opacity="0.4"/>
      <rect x="132" y="180" width="13" height="2" rx="1" fill="#6ee7b7" opacity="0.4"/>

      {/* Book 4 — Amber (lying flat on top of next) */}
      <rect x="160" y="200" width="58" height="30" rx="4" fill="#d97706"/>
      <rect x="160" y="200" width="58" height="7" rx="2" fill="#b45309"/>
      <rect x="170" y="212" width="30" height="2" rx="1" fill="#fde68a" opacity="0.7"/>
      <rect x="170" y="218" width="22" height="2" rx="1" fill="#fde68a" opacity="0.4"/>

      {/* Book 5 — Rose/pink tall */}
      <rect x="164" y="135" width="28" height="65" rx="4" fill="#be185d"/>
      <rect x="164" y="135" width="6" height="65" rx="2" fill="#9d174d"/>
      <rect x="174" y="152" width="11" height="2" rx="1" fill="#fbcfe8" opacity="0.7"/>
      <rect x="174" y="158" width="9" height="2" rx="1" fill="#fbcfe8" opacity="0.4"/>

      {/* Book 6 — Cyan */}
      <rect x="198" y="155" width="34" height="75" rx="4" fill="#0891b2"/>
      <rect x="198" y="155" width="7" height="75" rx="2" fill="#0e7490"/>
      <rect x="209" y="173" width="15" height="2" rx="1" fill="#a5f3fc" opacity="0.7"/>
      <rect x="209" y="179" width="12" height="2" rx="1" fill="#a5f3fc" opacity="0.4"/>

      {/* Book 7 — Violet light, short */}
      <rect x="238" y="170" width="26" height="60" rx="4" fill="#8b5cf6"/>
      <rect x="238" y="170" width="5" height="60" rx="2" fill="#7c3aed"/>
      <rect x="247" y="186" width="10" height="2" rx="1" fill="#ddd6fe" opacity="0.7"/>

      {/* Floating sparkles */}
      <circle cx="60" cy="110" r="3" fill="#a78bfa" opacity="0.6"/>
      <circle cx="180" cy="98" r="2" fill="#34d399" opacity="0.5"/>
      <circle cx="250" cy="120" r="3.5" fill="#fbbf24" opacity="0.5"/>
      <circle cx="130" cy="105" r="2" fill="#f9a8d4" opacity="0.6"/>
      <circle cx="290" cy="155" r="2.5" fill="#67e8f9" opacity="0.4"/>

      {/* Sparkle crosses */}
      <path d="M80 90 L80 80 M75 85 L85 85" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M220 95 L220 85 M215 90 L225 90" stroke="#6ee7b7" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>

      {/* Open book on top */}
      <ellipse cx="160" cy="75" rx="42" ry="8" fill="#1e1b4b" opacity="0.3"/>
      <path d="M120 72 C130 55, 148 50, 160 52 C172 50, 190 55, 200 72 L200 80 C190 68, 172 63, 160 65 C148 63, 130 68, 120 80 Z"
        fill="#2d1b69" opacity="0.8"/>
      <path d="M120 72 C130 55, 148 50, 160 52 L160 65 C148 63, 130 68, 120 80 Z" fill="#4c1d95" opacity="0.9"/>
      <path d="M200 72 C190 55, 172 50, 160 52 L160 65 C172 63, 190 68, 200 80 Z" fill="#3730a3" opacity="0.9"/>
      <line x1="160" y1="52" x2="160" y2="80" stroke="#6d28d9" strokeWidth="1" opacity="0.6"/>

      {/* Glow under books */}
      <ellipse cx="160" cy="235" rx="110" ry="6" fill="#7c3aed" opacity="0.12"/>
    </svg>
  );
}

/* ── Feature chips ───────────────────────────────────────────── */
const features = [
  { icon: '📚', text: 'Full Book Catalog & CRUD' },
  { icon: '👨‍🎓', text: 'Student Management' },
  { icon: '⏱️', text: 'Auto Fine Calculation' },
  { icon: '🔐', text: 'Role-Based JWT Auth' },
];

/* ── Main Component ─────────────────────────────────────────── */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please enter email and password.'); return; }
    setLoading(true);
    try {
      const result = await login(form.email, form.password);
      if (result.success) {
        toast.success('Welcome back!');
        navigate(result.role === 'admin' ? '/admin' : '/student');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* ════════ LEFT PANEL ════════ */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0c0520 0%, #1a0533 35%, #2d1057 70%, #1e1b4b 100%)' }}>

        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

        {/* Glow orbs */}
        <div className="absolute top-[-120px] left-[-80px] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-80px] right-[-60px] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.2) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(109,40,217,0.1) 0%, transparent 70%)' }} />

        <div className="relative z-10 flex flex-col h-full p-12">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
              <HiOutlineBookOpen size={20} className="text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-lg leading-none">Library LMS</span>
              <p className="text-violet-400 text-[10px] font-medium tracking-widest uppercase">Management System</p>
            </div>
          </div>

          {/* Illustration */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-[340px]">
              <BookIllustration />
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-violet-300 text-xs font-medium tracking-wide">Re-engineered from C++ Legacy System</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white leading-tight mb-3">
              The Modern Way to<br />
              <span style={{ background: 'linear-gradient(90deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Run Your Library
              </span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Manage books, students, and borrowing records — all from one powerful, elegant dashboard.
            </p>
          </div>

          {/* Feature chips */}
          <div className="grid grid-cols-2 gap-2.5 mb-8">
            {features.map(({ icon, text }) => (
              <div key={text}
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 border"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(167,139,250,0.15)' }}>
                <span className="text-base">{icon}</span>
                <span className="text-slate-300 text-xs font-medium">{text}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <p className="text-slate-600 text-xs">
            Library LMS · Modern Full-Stack Edition · 2026
          </p>
        </div>
      </div>

      {/* ════════ RIGHT PANEL ════════ */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white relative">

        {/* Subtle top-right decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
          style={{ background: 'radial-gradient(circle at top right, rgba(124,58,237,0.05) 0%, transparent 70%)' }} />

        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
              <HiOutlineBookOpen size={18} className="text-white" />
            </div>
            <span className="font-bold text-slate-900">Library LMS</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-1.5">Welcome back</h2>
            <p className="text-slate-500 text-sm">Sign in to access your library portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative group">
                <FiMail size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                <input
                  data-testid="email-input"
                  name="email" type="email" value={form.email}
                  onChange={handleChange}
                  placeholder="admin@library.com"
                  autoFocus
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative group">
                <FiLock size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                <input
                  data-testid="password-input"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5">
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              data-testid="login-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0"
              style={{ background: loading ? '#6d28d9' : 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Sign In <FiArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-slate-400 text-xs font-medium">Demo Access</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Demo credentials */}
          <div className="rounded-2xl border border-slate-100 overflow-hidden bg-slate-50">
            <div className="px-4 py-2.5 bg-violet-50 border-b border-violet-100 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-400" />
              <p className="text-xs font-semibold text-violet-700">Admin Credentials</p>
            </div>
            <div className="p-4 space-y-2.5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-slate-500">Email</span>
                <code className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-mono cursor-pointer hover:border-violet-300 transition-colors"
                  onClick={() => setForm(p => ({ ...p, email: 'admin@library.com' }))}>
                  admin@library.com
                </code>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-slate-500">Password</span>
                <code className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-mono cursor-pointer hover:border-violet-300 transition-colors"
                  onClick={() => setForm(p => ({ ...p, password: 'Admin@1234' }))}>
                  Admin@1234
                </code>
              </div>
              <p className="text-[10px] text-slate-400 text-center pt-1">Click any credential to auto-fill</p>
            </div>
          </div>

          {/* Bottom note */}
          <p className="text-center text-xs text-slate-400 mt-6">
            Library Management System · Secure Access Portal
          </p>
        </div>
      </div>
    </div>
  );
}
