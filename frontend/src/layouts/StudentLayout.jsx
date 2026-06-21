import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiGrid, FiSearch, FiBookOpen, FiUser, FiLogOut, FiBell } from 'react-icons/fi';
import { HiOutlineBookOpen } from 'react-icons/hi';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/student',          label: 'Dashboard',    icon: FiGrid,     end: true },
  { to: '/student/search',   label: 'Search Books', icon: FiSearch },
  { to: '/student/borrowed', label: 'My Books',     icon: FiBookOpen },
  { to: '/student/profile',  label: 'Profile',      icon: FiUser }
];

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* ── Sidebar ── */}
      <aside className="w-64 flex-shrink-0 flex flex-col"
        style={{ background: 'linear-gradient(180deg, #0c1a3d 0%, #060e24 100%)' }}>

        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            <HiOutlineBookOpen size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Library LMS</p>
            <p className="text-blue-400 text-[11px] leading-tight">Student Portal</p>
          </div>
        </div>

        <nav className="flex-1 py-5 space-y-0.5">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'text-white shadow-sm'
                    : 'text-white/50 hover:text-white hover:bg-white/8'
                }`
              }
              style={({ isActive }) => isActive ? { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' } : {}}
            >
              <Icon size={17} className="flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/5 p-3">
          <div className="flex items-center gap-2.5 px-2 py-2 mb-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-white text-xs font-semibold truncate">{user?.username}</p>
              <p className="text-white/35 text-[10px]">Student</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-2 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors text-sm w-full">
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-4 flex-shrink-0 shadow-sm">
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-slate-800">College Library Management System</h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-icon text-slate-500 hover:bg-slate-100 hover:text-slate-700">
              <FiBell size={18} />
            </button>
            <div className="h-7 w-px bg-slate-200" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-800 leading-none">{user?.username}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Student</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 animate-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
