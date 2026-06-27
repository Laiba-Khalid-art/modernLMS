import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiBook, FiUsers, FiBarChart2, FiCheckCircle } from 'react-icons/fi';
import { HiOutlineBookOpen } from 'react-icons/hi';
import toast from 'react-hot-toast';

const G = {
  bg:     '#030812',
  surf:   '#060D1F',
  gold:   '#C9A84C',
  goldL:  '#E8CC6A',
  border: 'rgba(201,168,76,0.15)',
  text:   '#FFFFFF',
  muted:  '#475569',
  sub:    '#94A3B8',
};

function BookIllustration() {
  return (
    <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: 300, margin: '0 auto', display: 'block', opacity: 0.93 }}>
      <rect x="20" y="220" width="280" height="9" rx="4" fill="rgba(201,168,76,0.22)" />
      <rect x="10" y="226" width="300" height="5" rx="3" fill="rgba(201,168,76,0.1)" />
      {/* Book 1 — gold */}
      <rect x="44" y="130" width="36" height="90" rx="4" fill="#C9A84C" />
      <rect x="44" y="130" width="8" height="90" rx="3" fill="#B8960C" />
      <rect x="57" y="152" width="16" height="2" rx="1" fill="rgba(255,255,255,0.45)" />
      <rect x="57" y="159" width="12" height="2" rx="1" fill="rgba(255,255,255,0.28)" />
      <rect x="57" y="166" width="14" height="2" rx="1" fill="rgba(255,255,255,0.28)" />
      {/* Book 2 — navy blue */}
      <rect x="86" y="152" width="30" height="68" rx="4" fill="#1E40AF" />
      <rect x="86" y="152" width="6" height="68" rx="3" fill="#1E3A8A" />
      <rect x="97" y="170" width="12" height="2" rx="1" fill="rgba(147,197,253,0.65)" />
      <rect x="97" y="177" width="9" height="2" rx="1" fill="rgba(147,197,253,0.38)" />
      {/* Book 3 — emerald */}
      <rect x="122" y="140" width="32" height="80" rx="4" fill="#065F46" />
      <rect x="122" y="140" width="7" height="80" rx="3" fill="#064E3B" />
      <rect x="133" y="160" width="14" height="2" rx="1" fill="rgba(110,231,183,0.65)" />
      <rect x="133" y="167" width="11" height="2" rx="1" fill="rgba(110,231,183,0.38)" />
      {/* Book 4 — amber flat */}
      <rect x="160" y="193" width="58" height="27" rx="4" fill="#92400E" />
      <rect x="160" y="193" width="58" height="7" rx="3" fill="#78350F" />
      <rect x="170" y="205" width="28" height="2" rx="1" fill="rgba(253,230,138,0.55)" />
      {/* Book 5 — crimson */}
      <rect x="164" y="128" width="28" height="65" rx="4" fill="#9B1C1C" />
      <rect x="164" y="128" width="6" height="65" rx="3" fill="#7F1D1D" />
      <rect x="175" y="146" width="11" height="2" rx="1" fill="rgba(252,165,165,0.65)" />
      {/* Book 6 — teal */}
      <rect x="198" y="148" width="34" height="72" rx="4" fill="#0E7490" />
      <rect x="198" y="148" width="7" height="72" rx="3" fill="#0C6380" />
      <rect x="210" y="168" width="14" height="2" rx="1" fill="rgba(165,243,252,0.65)" />
      {/* Book 7 — gold light */}
      <rect x="238" y="162" width="26" height="58" rx="4" fill="#D97706" />
      <rect x="238" y="162" width="5" height="58" rx="3" fill="#B45309" />
      <rect x="247" y="180" width="10" height="2" rx="1" fill="rgba(253,230,138,0.65)" />
      {/* Open book */}
      <ellipse cx="160" cy="68" rx="46" ry="9" fill="rgba(201,168,76,0.1)" />
      <path d="M116 66 C128 46,148 42,160 44 C172 42,192 46,204 66 L204 76 C192 60,172 55,160 58 C148 55,128 60,116 76 Z" fill="rgba(10,22,40,0.95)" />
      <path d="M116 66 C128 46,148 42,160 44 L160 58 C148 55,128 60,116 76 Z" fill="rgba(201,168,76,0.18)" />
      <path d="M204 66 C192 46,172 42,160 44 L160 58 C172 55,192 60,204 76 Z" fill="rgba(201,168,76,0.1)" />
      <line x1="160" y1="44" x2="160" y2="76" stroke="rgba(201,168,76,0.38)" strokeWidth="1" />
      {/* Sparkles */}
      <circle cx="60" cy="104" r="3" fill="#E8CC6A" opacity="0.48" />
      <circle cx="178" cy="92" r="2" fill="#C9A84C" opacity="0.55" />
      <circle cx="252" cy="115" r="3" fill="#E8CC6A" opacity="0.42" />
      <path d="M80 86 L80 76 M75 81 L85 81" stroke="rgba(201,168,76,0.45)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M220 90 L220 80 M215 85 L225 85" stroke="rgba(201,168,76,0.38)" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="160" cy="226" rx="120" ry="6" fill="rgba(201,168,76,0.07)" />
    </svg>
  );
}

const features = [
  { icon: FiBook,        text: 'Full Book Catalog & CRUD',   color: '#C9A84C' },
  { icon: FiUsers,       text: 'Student Management',          color: '#3B82F6' },
  { icon: FiCheckCircle, text: 'Auto Fine Calculation',       color: '#10B981' },
  { icon: FiBarChart2,   text: 'Role-Based JWT Auth',         color: '#8B5CF6' },
];

export default function LoginPage() {
  const { login }             = useAuth();
  const navigate              = useNavigate();
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

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    paddingLeft: 46, paddingRight: 16, paddingTop: 13, paddingBottom: 13,
    borderRadius: 13, border: `1px solid ${G.border}`,
    background: 'rgba(10,22,40,0.75)', color: G.text,
    fontSize: 14, outline: 'none', fontFamily: 'inherit',
  };

  return (
    <div className="min-h-screen flex" style={{ background: G.bg, color: G.text, position: 'relative', overflow: 'hidden' }}>

      {/* Ambient orbs */}
      <div className="pointer-events-none" style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', top: -200, left: -100, width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', bottom: -100, right: -100, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 60%)' }} />
      </div>

      {/* ══════════════════════ LEFT PANEL ══════════════════════ */}
      {/* Using Tailwind hidden/lg:flex — display is NOT set in inline style */}
      <div className="hidden lg:flex flex-col relative z-10 overflow-hidden"
        style={{ width: '55%', padding: 48, background: 'linear-gradient(145deg, #040B1C 0%, #060D1F 40%, #0A1628 100%)', borderRight: `1px solid ${G.border}` }}>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0.025, backgroundImage: `linear-gradient(rgba(201,168,76,1) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,1) 1px,transparent 1px)`, backgroundSize: '44px 44px' }} />

        {/* Glow orbs */}
        <div className="absolute pointer-events-none" style={{ top: -80, right: -60, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.09) 0%, transparent 65%)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: 0, left: 0, width: 400, height: 300, background: 'radial-gradient(circle at bottom left, rgba(201,168,76,0.05) 0%, transparent 70%)' }} />

        {/* Gold top accent line */}
        <div className="absolute top-0 left-0 right-0" style={{ height: 1, background: `linear-gradient(90deg, transparent, ${G.gold}, transparent)` }} />

        <div className="relative flex flex-col h-full" style={{ zIndex: 2 }}>

          {/* Logo — clicks back to landing */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="flex items-center justify-center group-hover:scale-105 transition-transform"
              style={{ width: 42, height: 42, borderRadius: 13, background: `linear-gradient(135deg, ${G.gold}, ${G.goldL})`, boxShadow: '0 4px 20px rgba(201,168,76,0.28)' }}>
              <HiOutlineBookOpen size={21} color={G.bg} />
            </div>
            <div>
              <div style={{ color: G.text, fontWeight: 800, fontSize: 16, lineHeight: 1.2 }}>Library LMS</div>
              <div style={{ color: G.gold, fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.65 }}>Management System</div>
            </div>
          </div>

          {/* Illustration */}
          <div className="flex flex-1 items-center justify-center">
            <BookIllustration />
          </div>

          {/* Tag + headline */}
          <div style={{ marginBottom: 28 }}>
            <div className="inline-flex items-center gap-2" style={{ padding: '5px 14px', borderRadius: 99, border: `1px solid ${G.border}`, background: 'rgba(201,168,76,0.06)', marginBottom: 16 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 6px #10B981' }} />
              <span style={{ color: G.sub, fontSize: 11, fontWeight: 500 }}>Re-engineered from C++ Legacy System</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: G.text, lineHeight: 1.15, marginBottom: 10 }}>
              The Modern Way to<br />
              <span style={{ background: `linear-gradient(90deg, ${G.gold}, ${G.goldL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Run Your Library
              </span>
            </h1>
            <p style={{ color: G.muted, fontSize: 14, lineHeight: 1.65, maxWidth: 340 }}>
              Manage books, students, and borrowing records — all from one elegant dashboard.
            </p>
          </div>

          {/* Feature chips */}
          <div className="grid grid-cols-2 gap-2.5" style={{ marginBottom: 28 }}>
            {features.map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-2.5" style={{ padding: '10px 14px', borderRadius: 13, border: `1px solid ${G.border}`, background: 'rgba(255,255,255,0.02)' }}>
                <Icon size={14} style={{ color, flexShrink: 0 }} />
                <span style={{ color: G.sub, fontSize: 12, fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>

          <p style={{ color: G.muted, fontSize: 11 }}>Library LMS · Modern Full-Stack Edition · 2026</p>
        </div>
      </div>

      {/* ══════════════════════ RIGHT PANEL ══════════════════════ */}
      <div className="flex-1 flex items-center justify-center relative z-10" style={{ padding: '32px 24px' }}>

        {/* Corner glow */}
        <div className="absolute top-0 right-0 pointer-events-none" style={{ width: 300, height: 300, background: 'radial-gradient(circle at top right, rgba(201,168,76,0.05) 0%, transparent 65%)' }} />

        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Mobile logo (visible only below lg) */}
          <div className="flex lg:hidden items-center gap-3 cursor-pointer" style={{ marginBottom: 32 }} onClick={() => navigate('/')}>
            <div className="flex items-center justify-center" style={{ width: 38, height: 38, borderRadius: 11, background: `linear-gradient(135deg, ${G.gold}, ${G.goldL})`, boxShadow: '0 4px 16px rgba(201,168,76,0.28)' }}>
              <HiOutlineBookOpen size={19} color={G.bg} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: G.text }}>Library LMS</div>
              <div style={{ fontSize: 9, color: G.gold, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.65 }}>Management System</div>
            </div>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: G.text, marginBottom: 6 }}>Welcome back</h2>
            <p style={{ color: G.muted, fontSize: 14 }}>Sign in to access your library portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
                Email Address
              </label>
              <div className="relative">
                <FiMail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: G.muted }} />
                <input data-testid="email-input" name="email" type="email" value={form.email}
                  onChange={handleChange} placeholder="admin@library.com" autoFocus
                  style={{ ...inputStyle }}
                  onFocus={e => e.target.style.borderColor = G.gold}
                  onBlur={e => e.target.style.borderColor = G.border} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
                Password
              </label>
              <div className="relative">
                <FiLock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: G.muted }} />
                <input data-testid="password-input" name="password"
                  type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={handleChange} placeholder="Enter your password"
                  style={{ ...inputStyle, paddingRight: 48 }}
                  onFocus={e => e.target.style.borderColor = G.gold}
                  onBlur={e => e.target.style.borderColor = G.border} />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: G.muted, padding: 4 }}>
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button data-testid="login-btn" type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2"
              style={{
                padding: '14px 0', borderRadius: 13, border: 'none',
                background: `linear-gradient(135deg, ${G.gold}, ${G.goldL})`,
                color: G.bg, fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 28px rgba(201,168,76,0.28)',
                opacity: loading ? 0.72 : 1, fontFamily: 'inherit',
              }}>
              {loading ? (
                <>
                  <svg className="animate-spin" style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
                    <circle opacity="0.25" cx="12" cy="12" r="10" stroke={G.bg} strokeWidth="4" />
                    <path opacity="0.75" fill={G.bg} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <> Sign In <FiArrowRight size={15} /> </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3" style={{ margin: '24px 0' }}>
            <div className="flex-1" style={{ height: 1, background: G.border }} />
            <span style={{ color: G.muted, fontSize: 11, fontWeight: 500 }}>Demo Access</span>
            <div className="flex-1" style={{ height: 1, background: G.border }} />
          </div>

          {/* Credentials card */}
          <div style={{ borderRadius: 16, border: `1px solid ${G.border}`, overflow: 'hidden', background: 'rgba(10,22,40,0.6)' }}>
            <div className="flex items-center gap-2" style={{ padding: '10px 16px', borderBottom: `1px solid ${G.border}`, background: 'rgba(201,168,76,0.05)' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: G.gold, boxShadow: `0 0 8px ${G.gold}` }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: G.gold }}>Admin Credentials</span>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Email',    value: 'admin@library.com', action: () => setForm(p => ({ ...p, email:    'admin@library.com' })) },
                { label: 'Password', value: 'Admin@1234',         action: () => setForm(p => ({ ...p, password: 'Admin@1234' })) },
              ].map(({ label, value, action }) => (
                <div key={label} className="flex items-center justify-between gap-3">
                  <span style={{ fontSize: 11, color: G.muted, fontWeight: 600 }}>{label}</span>
                  <code onClick={action}
                    style={{ fontSize: 11, background: 'rgba(201,168,76,0.07)', border: `1px solid ${G.border}`, borderRadius: 8, padding: '5px 12px', color: G.goldL, fontFamily: 'monospace', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = G.gold}
                    onMouseLeave={e => e.currentTarget.style.borderColor = G.border}>
                    {value}
                  </code>
                </div>
              ))}
              <p style={{ fontSize: 10, color: G.muted, textAlign: 'center', marginTop: 4 }}>Click any credential to auto-fill</p>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: 11, color: G.muted, marginTop: 24 }}>
            Library Management System · Secure Access Portal
          </p>
        </div>
      </div>
    </div>
  );
}
