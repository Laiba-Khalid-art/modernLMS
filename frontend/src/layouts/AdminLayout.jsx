import { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid, FiBook, FiUsers, FiArrowUpRight, FiArrowDownLeft,
  FiBarChart2, FiUserCheck, FiLogOut, FiMenu, FiX, FiBell,
  FiBookOpen, FiAlertCircle, FiChevronRight
} from 'react-icons/fi';
import { HiOutlineBookOpen } from 'react-icons/hi';
import { issueAPI } from '../services/api';
import toast from 'react-hot-toast';

const navGroups = [
  {
    label: 'Overview',
    items: [{ to: '/admin', label: 'Dashboard', icon: FiGrid, end: true }]
  },
  {
    label: 'Catalog',
    items: [
      { to: '/admin/books',    label: 'Books',    icon: FiBook },
      { to: '/admin/students', label: 'Students', icon: FiUsers },
    ]
  },
  {
    label: 'Operations',
    items: [
      { to: '/admin/issues',  label: 'All Issues',  icon: FiBookOpen },
      { to: '/admin/issue',   label: 'Issue Book',  icon: FiArrowUpRight },
      { to: '/admin/return',  label: 'Return Book', icon: FiArrowDownLeft },
      { to: '/admin/reports', label: 'Reports',     icon: FiBarChart2 },
    ]
  },
  {
    label: 'Admin',
    items: [{ to: '/admin/users', label: 'Users', icon: FiUserCheck }]
  }
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [overdueCount, setOverdueCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const fetch = () => issueAPI.getDashboardStats()
      .then(({ data }) => setOverdueCount(data.data.overdueBooks || 0))
      .catch(() => {});
    fetch();
    const t = setInterval(fetch, 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); toast.success('Logged out.'); navigate('/login'); };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#060D1F' }}>

      {/* ── Sidebar ── */}
      <aside
        className={`${collapsed ? 'w-[68px]' : 'w-60'} flex-shrink-0 flex flex-col transition-[width] duration-300 ease-in-out overflow-hidden relative`}
        style={{
          background: 'linear-gradient(180deg, #050A18 0%, #030810 100%)',
          borderRight: '1px solid rgba(201,168,76,0.08)',
        }}
      >
        {/* Sidebar ambient glow */}
        <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% -20%, rgba(201,168,76,0.06) 0%, transparent 70%)' }} />

        {/* Logo */}
        <div className={`relative flex items-center ${collapsed ? 'justify-center px-0' : 'px-4'} py-5`}
          style={{ borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #D4AF37)', boxShadow: '0 4px 16px rgba(201,168,76,0.35)' }}>
            <HiOutlineBookOpen size={18} className="text-navy-900" style={{ color: '#060D1F' }} />
          </div>
          {!collapsed && (
            <div className="ml-3 flex-1 overflow-hidden">
              <p className="font-bold text-sm leading-tight text-white whitespace-nowrap">Library LMS</p>
              <p className="text-[10px] leading-tight" style={{ color: 'rgba(201,168,76,0.6)' }}>Admin Panel</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-lg transition-colors text-slate-600 hover:text-slate-400 flex-shrink-0"
              style={{ background: 'transparent' }}>
              <FiX size={13} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="relative flex-1 overflow-y-auto py-4 space-y-5">
          {navGroups.map(({ label, items }) => (
            <div key={label}>
              {!collapsed && (
                <p className="px-4 mb-2 text-[9px] font-black uppercase tracking-[0.15em]"
                  style={{ color: 'rgba(201,168,76,0.35)' }}>{label}</p>
              )}
              <ul className="space-y-0.5">
                {items.map(({ to, label: lbl, icon: Icon, end }) => (
                  <li key={to}>
                    <NavLink to={to} end={end}
                      className={({ isActive }) =>
                        `flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative
                         ${isActive ? 'text-navy-900' : 'text-slate-500 hover:text-white'}`
                      }
                      style={({ isActive }) => isActive ? {
                        background: 'linear-gradient(135deg, #C9A84C, #D4AF37)',
                        boxShadow: '0 4px 16px rgba(201,168,76,0.3)',
                        color: '#060D1F',
                      } : {}}
                      title={collapsed ? lbl : undefined}
                    >
                      {({ isActive }) => (
                        <>
                          {!isActive && (
                            <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ background: 'rgba(201,168,76,0.06)' }} />
                          )}
                          <Icon size={16} className="flex-shrink-0 relative z-10" />
                          {!collapsed && <span className="relative z-10">{lbl}</span>}
                          {!collapsed && isActive && <FiChevronRight size={12} className="ml-auto relative z-10 opacity-70" />}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid rgba(201,168,76,0.08)' }} className="p-3 relative">
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-2 py-2.5 mb-1 rounded-xl"
              style={{ background: 'rgba(201,168,76,0.05)' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #D4AF37)', color: '#060D1F' }}>
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-white text-xs font-semibold truncate">{user?.username}</p>
                <p className="text-[10px]" style={{ color: 'rgba(201,168,76,0.5)' }}>Administrator</p>
              </div>
            </div>
          )}
          <button onClick={handleLogout}
            className={`flex items-center gap-2.5 ${collapsed ? 'justify-center w-full' : 'px-2'} py-2 rounded-xl text-slate-600 hover:text-red-400 w-full text-sm transition-colors`}
            title={collapsed ? 'Logout' : undefined}>
            <FiLogOut size={15} />
            {!collapsed && 'Logout'}
          </button>
          {collapsed && (
            <button onClick={() => setCollapsed(false)}
              className="flex items-center justify-center w-full py-2 mt-1 rounded-xl text-slate-600 hover:text-slate-400 transition-colors">
              <FiMenu size={15} />
            </button>
          )}
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="h-16 flex items-center px-6 gap-4 flex-shrink-0"
          style={{
            background: 'rgba(5,10,24,0.95)',
            borderBottom: '1px solid rgba(201,168,76,0.08)',
            backdropFilter: 'blur(12px)',
          }}>
          <div className="flex-1">
            <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(201,168,76,0.6)' }}>
              College Library Management System
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Bell */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setShowNotif(v => !v)}
                className="btn-icon relative"
                style={{ border: '1px solid rgba(201,168,76,0.12)' }}>
                <FiBell size={16} />
                {overdueCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">
                    {overdueCount > 9 ? '9+' : overdueCount}
                  </span>
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 top-11 w-72 rounded-2xl z-50 overflow-hidden"
                  style={{ background: '#050A18', border: '1px solid rgba(201,168,76,0.15)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
                  <div className="px-4 py-3 flex items-center justify-between"
                    style={{ borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
                    <p className="font-semibold text-white text-sm">Notifications</p>
                    <button onClick={() => setShowNotif(false)} className="text-slate-600 hover:text-slate-400"><FiX size={13} /></button>
                  </div>
                  {overdueCount > 0 ? (
                    <div className="p-4">
                      <div className="flex items-start gap-3 p-3 rounded-xl"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(239,68,68,0.15)' }}>
                          <FiAlertCircle size={15} className="text-red-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-red-400 text-sm">{overdueCount} Overdue Book(s)</p>
                          <p className="text-red-500/70 text-xs mt-0.5">Fine accumulating at Rs. 5/day</p>
                          <button onClick={() => { navigate('/admin/issues'); setShowNotif(false); }}
                            className="text-xs text-red-400 font-semibold mt-1.5 underline">
                            View all issues →
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-slate-600">
                      <FiBell size={22} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No overdue books</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="h-6 w-px" style={{ background: 'rgba(201,168,76,0.12)' }} />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #D4AF37)', color: '#060D1F', boxShadow: '0 2px 8px rgba(201,168,76,0.3)' }}>
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-white leading-none">{user?.username}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'rgba(201,168,76,0.5)' }}>Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 animate-in" style={{ background: '#060D1F' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
