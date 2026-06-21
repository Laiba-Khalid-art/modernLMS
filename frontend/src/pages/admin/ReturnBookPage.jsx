import { useState } from 'react';
import { issueAPI } from '../../services/api';
import { FiSearch, FiCheckCircle, FiAlertCircle, FiArrowDownLeft, FiClock, FiDollarSign, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

function FinePaymentPanel({ issue, overdueDays, onConfirm, onCancel, loading }) {
  const fine = overdueDays * 5;
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="mt-4 rounded-2xl border-2 border-red-300 bg-red-50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <FiDollarSign size={18} className="text-red-600" />
        <h4 className="font-bold text-red-800">Fine Payment Required</h4>
      </div>

      <div className="bg-white rounded-xl border border-red-200 p-4 mb-4 text-center">
        <p className="text-xs text-slate-500 mb-1">Total Fine to Collect</p>
        <p className="text-4xl font-extrabold text-red-700">Rs. {fine}</p>
        <p className="text-xs text-red-500 mt-1">Rs. 5 × {overdueDays} overdue day(s)</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
        {[
          ['Book', issue.bookId?.title],
          ['Student', issue.studentId?.name],
          ['Due Date', fmt(issue.dueDate)],
          ['Today', fmt(new Date())],
        ].map(([k, v]) => (
          <div key={k} className="bg-white rounded-xl p-2.5 border border-red-100">
            <p className="text-slate-400">{k}</p>
            <p className="font-semibold text-slate-800 truncate">{v}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-red-700 bg-red-100 rounded-xl px-3 py-2 mb-4 font-medium">
        Collect <strong>Rs. {fine}</strong> cash from the student before confirming return.
      </p>

      <div className="flex gap-2">
        <button onClick={onCancel} className="btn-secondary flex-1" disabled={loading}>
          <FiX size={14} /> Cancel
        </button>
        <button onClick={onConfirm} className="btn-success flex-1" disabled={loading}
          data-testid={`confirm-fine-return-${issue.issueId}`}>
          <FiCheckCircle size={14} />
          {loading ? 'Processing…' : 'Fine Paid — Confirm Return'}
        </button>
      </div>
    </div>
  );
}

export default function ReturnBookPage() {
  const [studentId, setStudentId] = useState('');
  const [activeIssues, setActiveIssues] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [payingIssueId, setPayingIssueId] = useState(null);
  const [returningId, setReturningId]   = useState(null);
  const [result, setResult] = useState(null);

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const today = new Date();

  const overdueDays = (dueDate) =>
    Math.max(0, Math.floor((today - new Date(dueDate)) / (1000 * 60 * 60 * 24)));

  const search = async (e) => {
    e.preventDefault();
    if (!studentId) return;
    setSearching(true); setActiveIssues([]); setSearched(false);
    setResult(null); setPayingIssueId(null);
    try {
      const { data } = await issueAPI.getAll({ studentId, status: 'Issued', limit: 50 });
      setActiveIssues(data.data);
      setSearched(true);
      if (data.data.length === 0) toast('No active borrowed books for this student.', { icon: 'ℹ️' });
    } catch {
      toast.error('Student not found or error fetching records.');
    } finally { setSearching(false); }
  };

  const initiateReturn = (issue) => {
    const od = overdueDays(issue.dueDate);
    if (od > 0) {
      // Fine exists — show payment panel first
      setPayingIssueId(issue.issueId);
    } else {
      // No fine — return directly
      processReturn(issue);
    }
  };

  const processReturn = async (issue) => {
    setReturningId(issue.issueId);
    try {
      const { data } = await issueAPI.return(issue.issueId);
      setResult(data.data);
      setActiveIssues(prev => prev.filter(i => i.issueId !== issue.issueId));
      setPayingIssueId(null);
      toast.success('Book returned successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Return failed.');
    } finally { setReturningId(null); }
  };

  return (
    <div className="animate-in max-w-2xl">
      <div className="mb-8">
        <h1 className="page-title">Return Book</h1>
        <p className="page-subtitle">Search by Student ID — overdue books require fine payment before return</p>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <h3 className="flex items-center gap-2.5 font-semibold text-slate-800 mb-4">
          <span className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
            <FiSearch size={15} className="text-white" />
          </span>
          Find Student's Borrowed Books
        </h3>
        <form onSubmit={search} className="flex gap-3">
          <input data-testid="return-student-id" value={studentId}
            onChange={e => setStudentId(e.target.value)} type="number"
            placeholder="Enter Student ID (e.g. 1001)" className="input-field" />
          <button type="submit" className="btn-primary px-5 flex-shrink-0" disabled={searching}>
            <FiSearch size={15} /> {searching ? 'Searching…' : 'Search'}
          </button>
        </form>
      </div>

      {/* Active Issues */}
      {searched && activeIssues.length > 0 && (
        <div className="space-y-3 mb-6">
          <p className="text-sm font-semibold text-slate-600 px-1">
            {activeIssues[0]?.studentId?.name} — {activeIssues.length} book(s) currently borrowed
          </p>

          {activeIssues.map(issue => {
            const od = overdueDays(issue.dueDate);
            const isProcessing = returningId === issue.issueId;
            const showPayment = payingIssueId === issue.issueId;

            return (
              <div key={issue._id}
                className={`card border-l-4 ${od > 0 ? 'border-l-red-500' : 'border-l-blue-500'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      od > 0 ? 'bg-red-100' : 'bg-blue-100'}`}>
                      {od > 0
                        ? <FiAlertCircle size={18} className="text-red-500" />
                        : <FiClock size={18} className="text-blue-600" />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{issue.bookId?.title}</p>
                      <p className="text-xs text-slate-500 mb-2">{issue.bookId?.author}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                        <span>ID: <span className="font-mono font-semibold text-slate-600">#{issue.issueId}</span></span>
                        <span>Issued: {fmt(issue.issueDate)}</span>
                        <span>Due: {fmt(issue.dueDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {od > 0 ? (
                      <div className="text-right">
                        <span className="badge-red">Overdue {od}d</span>
                        <p className="text-xs font-bold text-red-700 mt-1">Fine: Rs. {od * 5}</p>
                      </div>
                    ) : (
                      <span className="badge-blue">On time</span>
                    )}

                    {!showPayment && (
                      <button
                        onClick={() => initiateReturn(issue)}
                        className={od > 0 ? 'btn-danger text-sm' : 'btn-success text-sm'}
                        disabled={isProcessing || payingIssueId !== null}
                        data-testid={`return-btn-${issue.issueId}`}>
                        {od > 0 ? <FiDollarSign size={14} /> : <FiArrowDownLeft size={14} />}
                        {isProcessing ? 'Processing…' : od > 0 ? 'Collect Fine & Return' : 'Return'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Fine Payment Panel — expands inline */}
                {showPayment && (
                  <FinePaymentPanel
                    issue={issue}
                    overdueDays={od}
                    loading={isProcessing}
                    onConfirm={() => processReturn(issue)}
                    onCancel={() => setPayingIssueId(null)}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {searched && activeIssues.length === 0 && !result && (
        <div className="card border border-slate-200 text-center py-10">
          <FiCheckCircle size={36} className="text-emerald-400 mx-auto mb-3" />
          <p className="font-semibold text-slate-700">No active borrowings</p>
          <p className="text-slate-400 text-sm mt-1">This student has no books currently issued.</p>
        </div>
      )}

      {/* Success Receipt */}
      {result && (
        <div className={`card border-2 ${result.fineAmount > 0 ? 'border-emerald-200 bg-emerald-50' : 'border-emerald-200 bg-emerald-50'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center">
              <FiCheckCircle size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-900">Return Complete!</h3>
              <p className="text-xs text-slate-500">Issue ID: #{result.issueId}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              ['Book', result.bookId?.title],
              ['Student', result.studentId?.name],
              ['Return Date', fmt(result.returnDate)],
              ['Overdue Days', result.overdueDays || 0],
            ].map(([k, v]) => (
              <div key={k} className="bg-white rounded-xl p-3 border border-slate-100">
                <p className="text-xs text-slate-500">{k}</p>
                <p className="font-semibold text-slate-900 text-sm">{v}</p>
              </div>
            ))}
          </div>

          {result.fineAmount > 0 ? (
            <div className="text-center bg-white rounded-2xl p-5 border border-emerald-200 mb-4">
              <p className="text-xs text-slate-500 mb-1">Fine Collected</p>
              <p className="text-4xl font-extrabold text-emerald-700">Rs. {result.fineAmount}</p>
              <p className="text-xs text-emerald-600 mt-1">Payment received and recorded</p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-4">
              <FiCheckCircle /> No fine — returned on time!
            </div>
          )}

          <button onClick={() => { setResult(null); }} className="btn-secondary text-sm">
            Process Another Return
          </button>
        </div>
      )}
    </div>
  );
}
