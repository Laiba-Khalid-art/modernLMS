import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { issueAPI } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiBookOpen, FiClock, FiAlertCircle, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const POLL_INTERVAL = 30_000;

function LiveBadge({ lastUpdated, refreshing, onRefresh }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(0);
    const t = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [lastUpdated]);

  const label = elapsed < 5 ? 'just now'
    : elapsed < 60 ? `${elapsed}s ago`
    : `${Math.floor(elapsed / 60)}m ago`;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        Live · updated {label}
      </div>
      <button onClick={onRefresh} disabled={refreshing}
        className="btn-icon text-slate-500 hover:bg-slate-100" title="Refresh now">
        <FiRefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
      </button>
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [borrowed, setBorrowed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async (manual = false) => {
    if (!user?.studentId) { setLoading(false); return; }
    if (manual) setRefreshing(true);
    try {
      const res = await issueAPI.getAll({ studentId: user.studentId, limit: 100 });
      setBorrowed(res.data.data);
      setLastUpdated(Date.now());
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  }, [user]);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(() => fetchData(), POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [fetchData]);

  const today = new Date();
  const active = borrowed.filter(b => b.status === 'Issued');
  const overdue = active.filter(b => new Date(b.dueDate) < today);
  const returned = borrowed.filter(b => b.status === 'Returned');
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-in">
      {/* Welcome Banner */}
      <div className="rounded-3xl p-6 mb-8 flex items-center justify-between overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #0c1a3d 0%, #1e3a8a 100%)' }}>
        <div className="absolute right-0 top-0 w-64 h-64 opacity-10"
          style={{ background: 'radial-gradient(circle, #93c5fd, transparent)', transform: 'translate(30%, -30%)' }} />
        <div>
          <p className="text-blue-300 text-sm font-medium mb-1">Welcome back,</p>
          <h1 className="text-2xl font-bold text-white mb-1">{user?.username}</h1>
          <p className="text-blue-400 text-sm">Here's your library activity overview.</p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 text-center border border-white/10">
            <p className="text-2xl font-bold text-white">{active.length}</p>
            <p className="text-blue-300 text-xs mt-0.5">Active</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 text-center border border-white/10">
            <p className="text-2xl font-bold text-white">{overdue.length}</p>
            <p className="text-blue-300 text-xs mt-0.5">Overdue</p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">My Activity</h2>
        {lastUpdated && (
          <LiveBadge lastUpdated={lastUpdated} refreshing={refreshing}
            onRefresh={() => fetchData(true)} />
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Currently Borrowed" value={active.length}    icon={FiBookOpen}    gradient="blue"    />
        <StatCard title="Overdue"            value={overdue.length}   icon={FiAlertCircle} gradient="red"     />
        <StatCard title="Returned"           value={returned.length}  icon={FiCheckCircle} gradient="emerald" />
        <StatCard title="Total Borrowed"     value={borrowed.length}  icon={FiClock}       gradient="indigo"  />
      </div>

      {active.length > 0 ? (
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="section-title">Currently Borrowed</h3>
            <button onClick={() => navigate('/student/borrowed')}
              className="text-blue-600 text-sm font-semibold hover:text-blue-700">View all</button>
          </div>
          <div className="space-y-3">
            {active.slice(0, 5).map(b => {
              const od = Math.max(0, Math.floor((today - new Date(b.dueDate)) / (1000 * 60 * 60 * 24)));
              return (
                <div key={b._id} className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                  od > 0 ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      od > 0 ? 'bg-red-100' : 'bg-blue-100'}`}>
                      {od > 0
                        ? <FiAlertCircle size={16} className="text-red-500" />
                        : <FiBookOpen size={16} className="text-blue-600" />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{b.bookId?.title || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{b.bookId?.author}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Due: {fmt(b.dueDate)}</p>
                    {od > 0
                      ? <span className="badge-red mt-1">Overdue {od}d · Rs.{od * 5}</span>
                      : <span className="badge-green mt-1">On time</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="card text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <FiBookOpen size={28} className="text-blue-400" />
          </div>
          <h3 className="font-semibold text-slate-700 mb-1">No books currently borrowed</h3>
          <p className="text-slate-400 text-sm mb-5">Browse our catalog and ask the librarian to issue a book</p>
          <button onClick={() => navigate('/student/search')} className="btn-primary mx-auto">Browse Books</button>
        </div>
      )}
    </div>
  );
}
