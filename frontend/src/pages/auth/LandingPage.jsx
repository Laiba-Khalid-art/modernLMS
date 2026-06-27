import { useNavigate } from 'react-router-dom';
import { HiOutlineBookOpen } from 'react-icons/hi';
import { FiArrowRight, FiBook, FiUsers, FiClock, FiShield, FiBarChart2, FiZap, FiCheckCircle } from 'react-icons/fi';

const G = {
  bg:     '#030812',
  surf:   '#060D1F',
  card:   'rgba(10,22,40,0.85)',
  gold:   '#C9A84C',
  goldL:  '#E8CC6A',
  goldD:  '#B8960C',
  border: 'rgba(201,168,76,0.15)',
  borderH:'rgba(201,168,76,0.3)',
  text:   '#FFFFFF',
  muted:  '#64748B',
  sub:    '#94A3B8',
};

const features = [
  { icon: FiBook,      color: '#C9A84C', bg: 'rgba(201,168,76,0.1)',   title: 'Book Catalog',        desc: 'Add, search, and manage your full book collection with CRUD and availability tracking.' },
  { icon: FiUsers,     color: '#3B82F6', bg: 'rgba(59,130,246,0.1)',   title: 'Student Management',  desc: 'Register students, manage profiles, and track their complete borrowing history.' },
  { icon: FiClock,     color: '#10B981', bg: 'rgba(16,185,129,0.1)',   title: 'Issue & Return',      desc: 'Issue books instantly and process returns with automatic fine calculation per day.' },
  { icon: FiShield,    color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)',   title: 'JWT Authentication',  desc: 'Secure role-based access with Admin and Student portals and protected routes.' },
  { icon: FiBarChart2, color: '#EF4444', bg: 'rgba(239,68,68,0.1)',    title: 'Reports & Analytics', desc: 'Visual dashboards with fine reports, borrow trends, and library performance data.' },
  { icon: FiZap,       color: '#06B6D4', bg: 'rgba(6,182,212,0.1)',    title: 'Fast & Responsive',   desc: 'Built with React and Vite for lightning-fast performance on any device.' },
];

const stats = [
  { value: 'React 18',  label: 'Frontend'  },
  { value: 'Node.js',   label: 'Backend'   },
  { value: 'MongoDB',   label: 'Database'  },
  { value: 'JWT Auth',  label: 'Security'  },
];

const checklist = [
  'Add & Search Books', 'Register Students', 'Issue Books', 'Return Books',
  'Fine Calculation',   'Availability Check', 'Borrow History', 'Fine Reports',
  'Role-Based Access',  'Secure JWT Auth',    'Admin Dashboard', 'Student Portal',
];

const steps = [
  { n: '01', title: 'Add Your Collection',  desc: 'Import books from CSV or add manually with full metadata and quantity tracking.' },
  { n: '02', title: 'Onboard Students',     desc: 'Register students with unique IDs, departments, and contact information.' },
  { n: '03', title: 'Manage Everything',    desc: 'Issue, return, and track books with automatic fines and detailed reports.' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: G.bg, minHeight: '100vh', overflowX: 'hidden', color: G.text }}>

      {/* ── Ambient orbs ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: -200, left: -100, width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', top: '35%', right: -150, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', bottom: -100, left: '30%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 65%)' }} />
      </div>

      {/* ── Navbar ── */}
      <nav style={{ position: 'relative', zIndex: 10, maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: `1px solid ${G.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${G.gold}, ${G.goldL})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 20px rgba(201,168,76,0.35)` }}>
            <HiOutlineBookOpen size={20} color={G.bg} />
          </div>
          <div>
            <div style={{ color: G.text, fontWeight: 800, fontSize: 15, lineHeight: 1.2 }}>Library LMS</div>
            <div style={{ color: G.gold, fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.7 }}>Management System</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/login')}
            style={{ color: G.sub, fontSize: 14, fontWeight: 500, padding: '8px 16px', borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer' }}>
            Sign In
          </button>
          <button onClick={() => navigate('/login')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, padding: '10px 22px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg, ${G.gold}, ${G.goldL})`, color: G.bg, cursor: 'pointer', boxShadow: `0 4px 20px rgba(201,168,76,0.3)` }}>
            Get Started <FiArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 99, border: `1px solid ${G.border}`, background: 'rgba(201,168,76,0.06)', marginBottom: 32 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 8px #10B981' }} />
          <span style={{ color: G.sub, fontSize: 12, fontWeight: 500 }}>Re-engineered from C++ Legacy · Now Live on Web</span>
        </div>

        <h1 style={{ fontSize: 'clamp(42px, 7vw, 76px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 24, color: G.text }}>
          The Modern Way to<br />
          <span style={{ background: `linear-gradient(135deg, ${G.gold}, ${G.goldL}, ${G.gold})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Run Your Library
          </span>
        </h1>

        <p style={{ color: G.sub, fontSize: 18, lineHeight: 1.7, maxWidth: 600, margin: '0 auto 40px' }}>
          A complete full-stack web application replacing a legacy C++ console system —
          built with <span style={{ color: G.goldL }}>React</span>, <span style={{ color: G.goldL }}>Node.js</span> &amp; <span style={{ color: G.goldL }}>MongoDB</span>.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 70 }}>
          <button onClick={() => navigate('/login')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 700, padding: '14px 32px', borderRadius: 14, border: 'none', background: `linear-gradient(135deg, ${G.gold}, ${G.goldL})`, color: G.bg, cursor: 'pointer', boxShadow: `0 8px 32px rgba(201,168,76,0.35)` }}>
            Access Dashboard <FiArrowRight size={18} />
          </button>
          <button onClick={() => navigate('/login')}
            style={{ fontSize: 15, fontWeight: 600, padding: '14px 32px', borderRadius: 14, border: `1px solid ${G.border}`, background: 'rgba(255,255,255,0.03)', color: G.sub, cursor: 'pointer' }}>
            View Demo
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {stats.map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: G.text }}>{value}</div>
              <div style={{ fontSize: 11, color: G.muted, marginTop: 4, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mock Dashboard Preview ── */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ borderRadius: 24, border: `1px solid ${G.border}`, background: G.card, boxShadow: '0 40px 100px rgba(0,0,0,0.6)', overflow: 'hidden', backdropFilter: 'blur(12px)' }}>
          {/* Browser chrome */}
          <div style={{ padding: '12px 20px', borderBottom: `1px solid rgba(255,255,255,0.05)`, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(3,8,18,0.5)' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['#EF4444','#F59E0B','#10B981'].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
            </div>
            <div style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '5px 0', fontSize: 11, color: G.muted, fontFamily: 'monospace' }}>
              library-lms.app/admin/dashboard
            </div>
          </div>
          {/* Dashboard content */}
          <div style={{ padding: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
              {[
                { l: 'Total Books',    v: '20',      c: G.gold   },
                { l: 'Students',       v: '16',      c: '#3B82F6' },
                { l: 'Active Issues',  v: '8',       c: '#10B981' },
                { l: 'Fines Collected',v: 'Rs. 450', c: '#EF4444' },
              ].map(({ l, v, c }) => (
                <div key={l} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 16 }}>
                  <div style={{ fontSize: 10, color: G.muted, marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{l}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: c }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14, padding: 16, height: 80, display: 'flex', alignItems: 'flex-end', gap: 6 }}>
                {[60,85,45,90,70,55,80].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '4px 4px 0 0', background: `linear-gradient(180deg, ${G.goldL}, ${G.gold})`, opacity: 0.7 + i * 0.04 }} />
                ))}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14, padding: 16 }}>
                {[{ l: 'Available', c: G.gold, w: '65%' }, { l: 'Issued', c: '#3B82F6', w: '35%' }].map(({ l, c, w }) => (
                  <div key={l} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: G.muted }}>{l}</span>
                      <span style={{ fontSize: 10, color: G.sub }}>{w}</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
                      <div style={{ height: '100%', width: w, background: c, borderRadius: 99 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: G.gold, marginBottom: 12 }}>Features</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: G.text, marginBottom: 16 }}>Everything You Need</h2>
          <p style={{ color: G.sub, fontSize: 16, maxWidth: 500, margin: '0 auto' }}>All the tools to run a modern library — from book management to fine reporting.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {features.map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 20, padding: 28, backdropFilter: 'blur(12px)', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = G.borderH; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = G.border; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Icon size={22} color={color} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, color: G.text, marginBottom: 10 }}>{title}</div>
              <div style={{ color: G.muted, fontSize: 14, lineHeight: 1.65 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: G.gold, marginBottom: 12 }}>How It Works</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: G.text }}>Up & Running in Minutes</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {steps.map(({ n, title, desc }) => (
            <div key={n} style={{ background: G.card, border: `1px solid ${G.border}`, borderRadius: 20, padding: 32, backdropFilter: 'blur(12px)' }}>
              <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1, marginBottom: 20, background: `linear-gradient(135deg, rgba(201,168,76,0.4), rgba(201,168,76,0.08))`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{n}</div>
              <div style={{ fontWeight: 700, fontSize: 17, color: G.text, marginBottom: 10 }}>{title}</div>
              <div style={{ color: G.muted, fontSize: 14, lineHeight: 1.65 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Checklist ── */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ background: 'rgba(201,168,76,0.04)', border: `1px solid ${G.border}`, borderRadius: 28, padding: '48px 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: G.gold, marginBottom: 12 }}>Capabilities</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: G.text }}>All Legacy Features Preserved & Enhanced</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {checklist.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FiCheckCircle size={15} color='#10B981' style={{ flexShrink: 0 }} />
                <span style={{ color: G.sub, fontSize: 14 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: 900, margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{ borderRadius: 28, padding: '64px 48px', textAlign: 'center', overflow: 'hidden', position: 'relative', background: `linear-gradient(135deg, #0A1628, #0F2040)`, border: `1px solid ${G.borderH}` }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${G.gold}, transparent)` }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% -10%, rgba(201,168,76,0.12) 0%, transparent 60%)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: G.gold, marginBottom: 16 }}>Ready to Begin</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: G.text, marginBottom: 16 }}>Start Managing Your Library Today</h2>
            <p style={{ color: G.sub, fontSize: 16, marginBottom: 36, maxWidth: 440, margin: '0 auto 36px' }}>Sign in with the admin credentials and explore the full library management suite.</p>
            <button onClick={() => navigate('/login')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 700, padding: '14px 36px', borderRadius: 14, border: 'none', background: `linear-gradient(135deg, ${G.gold}, ${G.goldL})`, color: G.bg, cursor: 'pointer', boxShadow: `0 8px 32px rgba(201,168,76,0.35)` }}>
              Access Dashboard <FiArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ position: 'relative', zIndex: 10, borderTop: `1px solid ${G.border}`, padding: '32px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${G.gold}, ${G.goldL})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HiOutlineBookOpen size={16} color={G.bg} />
            </div>
            <span style={{ color: G.muted, fontSize: 13 }}>Library LMS — Modern Full-Stack Edition</span>
          </div>
          <div style={{ color: G.muted, fontSize: 12, display: 'flex', gap: 20 }}>
            <span>React + Node.js + MongoDB</span>
            <span>·</span>
            <span>Re-engineered from C++ Legacy</span>
            <span>·</span>
            <span>2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
