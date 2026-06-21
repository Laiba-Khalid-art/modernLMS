import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { issueAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiBookOpen, FiClock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const filterOptions = [['all', 'All'], ['issued', 'Active'], ['returned', 'Returned']];

export default function BorrowedBooksPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    issueAPI.getAll({ studentId: user?.studentId, limit: 100 })
      .then(({ data }) => setRecords(data.data))
      .catch(() => toast.error('Failed to load records.'))
      .finally(() => setLoading(false));
  }, [user]);

  const today = new Date();
  const filtered = filter === 'all' ? records
    : filter === 'issued' ? records.filter(r => r.status === 'Issued')
    : records.filter(r => r.status === 'Returned');

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="animate-in">
      <div className="mb-8">
        <h1 className="page-title">My Borrowed Books</h1>
        <p className="page-subtitle">Your complete borrow history and fine status</p>
      </div>

      {/* Filter Tabs */}
      <div className="card p-1.5 mb-6 inline-flex gap-1">
        {filterOptions.map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              filter === val ? 'text-white shadow-btn' : 'text-slate-500 hover:text-slate-700'
            }`}
            style={filter === val ? { background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)' } : {}}>
            {label}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="card text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <FiBookOpen size={24} className="text-blue-400" />
              </div>
              <p className="font-semibold text-slate-600">No records found</p>
            </div>
          ) : filtered.map(r => {
            const od = r.status === 'Issued'
              ? Math.max(0, Math.floor((today - new Date(r.dueDate)) / (1000 * 60 * 60 * 24))) : 0;
            const fine = od * 5;
            const isOverdue = od > 0;
            const isReturned = r.status === 'Returned';

            return (
              <div key={r._id} className={`card border-l-4 ${
                isOverdue ? 'border-l-red-500' : isReturned ? 'border-l-emerald-500' : 'border-l-blue-500'
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isOverdue ? 'bg-red-100' : isReturned ? 'bg-emerald-100' : 'bg-blue-100'
                    }`}>
                      {isOverdue
                        ? <FiAlertCircle size={18} className="text-red-500" />
                        : isReturned
                        ? <FiCheckCircle size={18} className="text-emerald-600" />
                        : <FiClock size={18} className="text-blue-600" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{r.bookId?.title || 'Unknown Book'}</h4>
                      <p className="text-sm text-slate-500">{r.bookId?.author}</p>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="text-xs text-slate-400">Issued: {fmt(r.issueDate)}</span>
                        <span className="text-xs text-slate-400">Due: {fmt(r.dueDate)}</span>
                        {r.returnDate && <span className="text-xs text-slate-400">Returned: {fmt(r.returnDate)}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 space-y-1">
                    {isReturned ? (
                      <>
                        <span className="badge-green"><FiCheckCircle size={9} /> Returned</span>
                        {r.fineAmount > 0 && (
                          <p className="text-xs text-red-600 font-semibold">Fine paid: Rs. {r.fineAmount}</p>
                        )}
                      </>
                    ) : isOverdue ? (
                      <>
                        <span className="badge-red"><FiAlertCircle size={9} /> Overdue</span>
                        <p className="text-xs text-red-600 font-semibold">{od}d overdue · Rs. {fine}</p>
                      </>
                    ) : (
                      <span className="badge-blue"><FiClock size={9} /> Active</span>
                    )}
                    <p className="text-xs text-slate-400 font-mono">#{r.issueId}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
