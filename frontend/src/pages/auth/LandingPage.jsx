import { useNavigate } from 'react-router-dom';
import { HiOutlineBookOpen } from 'react-icons/hi';
import { FiBook, FiUsers, FiClock, FiShield, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const features = [
  { icon: FiBook,   color: 'from-violet-500 to-purple-600',   title: 'Book Catalog',       desc: 'Add, search, and manage your entire book collection with full CRUD operations.' },
  { icon: FiUsers,  color: 'from-blue-500 to-indigo-600',     title: 'Student Records',    desc: 'Register students and track their complete borrowing history.' },
  { icon: FiClock,  color: 'from-emerald-500 to-teal-600',    title: 'Issue & Return',     desc: 'Issue books instantly and process returns with automatic fine calculation.' },
  { icon: FiShield, color: 'from-amber-500 to-orange-600',    title: 'Secure & Role-Based', desc: 'JWT auth with separate Admin and Student portals and protected routes.' }
];

const stats = [
  { value: 'React', label: 'Frontend' },
  { value: 'Node.js', label: 'Backend' },
  { value: 'MongoDB', label: 'Database' },
  { value: 'Playwright', label: 'Testing' }
];

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(145deg, #1a0533 0%, #2d1057 50%, #4c1d95 100%)' }}>

      {/* Nav */}
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
            <HiOutlineBookOpen size={20} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg">Library LMS</span>
        </div>
        <button onClick={() => navigate('/login')}
          className="flex items-center gap-2 bg-white text-violet-900 font-semibold px-5 py-2.5 rounded-xl hover:bg-violet-50 transition-colors text-sm shadow-lg">
          Sign In <FiArrowRight size={14} />
        </button>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto text-center px-6 pt-16 pb-24">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-300 animate-pulse" />
          <span className="text-violet-200 text-xs font-medium">Re-engineered from C++ Legacy System</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
          Modern Library<br />
          <span style={{ background: 'linear-gradient(135deg, #c4b5fd, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Management System
          </span>
        </h1>

        <p className="text-violet-300 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          A full-stack web application built with React, Node.js & MongoDB — completely replacing a legacy C++ console application.
        </p>

        <button onClick={() => navigate('/login')}
          className="inline-flex items-center gap-2.5 bg-white text-violet-900 font-bold px-8 py-4 rounded-2xl hover:bg-violet-50 transition-all shadow-2xl text-base hover:-translate-y-0.5">
          Get Started <FiArrowRight size={18} />
        </button>

        {/* Tech Stack */}
        <div className="flex items-center justify-center gap-8 mt-16 flex-wrap">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-violet-400 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, color, title, desc }) => (
            <div key={title}
              className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/12 transition-colors">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-violet-300 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Feature checklist */}
        <div className="mt-8 bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4 text-center">All Legacy Features Preserved & Enhanced</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Add & Search Books', 'Register Students', 'Issue Books', 'Return Books',
              'Fine Calculation', 'Availability Check', 'Borrow History', 'Fine Reports'].map(f => (
              <div key={f} className="flex items-center gap-2 text-violet-200 text-sm">
                <FiCheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center pb-10 text-violet-600 text-xs">
        Modern Library LMS — Re-engineered from C++ Legacy System using React + Node.js + MongoDB
      </footer>
    </div>
  );
}
