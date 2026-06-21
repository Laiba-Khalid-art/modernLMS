import { useState } from 'react';
import { issueAPI, studentAPI, bookAPI } from '../../services/api';
import { FiSearch, FiCheckCircle, FiBook, FiUser, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const LookupCard = ({ title, icon: Icon, gradient, children }) => (
  <div className="card">
    <h3 className="flex items-center gap-2.5 font-semibold text-slate-800 mb-4">
      <span className={`w-8 h-8 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <Icon size={15} className="text-white" />
      </span>
      {title}
    </h3>
    {children}
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between py-1.5 text-sm">
    <span className="text-slate-500 font-medium">{label}</span>
    <span className="text-slate-800 font-semibold">{value}</span>
  </div>
);

export default function IssueBookPage() {
  const [studentId, setStudentId] = useState('');
  const [bookId, setBookId] = useState('');
  const [student, setStudent] = useState(null);
  const [book, setBook] = useState(null);
  const [stuLoading, setStuLoading] = useState(false);
  const [bookLoading, setBookLoading] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [issueResult, setIssueResult] = useState(null);

  const lookupStudent = async () => {
    if (!studentId) return;
    setStuLoading(true); setStudent(null);
    try { const { data } = await studentAPI.getById(studentId); setStudent(data.data); }
    catch { toast.error('Student not found.'); }
    finally { setStuLoading(false); }
  };

  const lookupBook = async () => {
    if (!bookId) return;
    setBookLoading(true); setBook(null);
    try { const { data } = await bookAPI.checkAvailability(bookId); setBook(data.data); }
    catch { toast.error('Book not found.'); }
    finally { setBookLoading(false); }
  };

  const handleIssue = async () => {
    if (!student || !book) { toast.error('Please look up both student and book first.'); return; }
    if (!book.isAvailable) { toast.error('This book has no available copies.'); return; }
    setIssuing(true);
    try {
      const { data } = await issueAPI.issue({ studentId: student.studentId, bookId: book.bookId });
      setIssueResult(data.data);
      toast.success('Book issued successfully!');
      setStudentId(''); setBookId(''); setStudent(null); setBook(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Issue failed.');
    } finally { setIssuing(false); }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const dueDate = new Date(); dueDate.setDate(dueDate.getDate() + 14);

  return (
    <div className="animate-in">
      <div className="mb-8">
        <h1 className="page-title">Issue Book</h1>
        <p className="page-subtitle">Issue a book to a registered student — due in 14 days, Rs. 5/day fine after</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <LookupCard title="Student Lookup" icon={FiUser} gradient="from-violet-500 to-purple-600">
          <div className="flex gap-3">
            <input data-testid="issue-student-id" value={studentId}
              onChange={e => setStudentId(e.target.value)} type="number"
              placeholder="Enter Student ID (e.g. 1001)"
              className="input-field" onKeyDown={e => e.key === 'Enter' && lookupStudent()} />
            <button onClick={lookupStudent} className="btn-primary px-4 flex-shrink-0" disabled={stuLoading}>
              <FiSearch size={15} /> {stuLoading ? '…' : 'Find'}
            </button>
          </div>
          {student && (
            <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 divide-y divide-emerald-100">
              <div className="flex items-center gap-3 pb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                  {student.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{student.name}</p>
                  <p className="text-xs text-emerald-700">ID: {student.studentId}</p>
                </div>
                <FiCheckCircle className="text-emerald-500 ml-auto" size={18} />
              </div>
              <InfoRow label="Department" value={student.department} />
              {student.contactNumber && <InfoRow label="Contact" value={student.contactNumber} />}
            </div>
          )}
        </LookupCard>

        <LookupCard title="Book Lookup" icon={FiBook} gradient="from-blue-500 to-indigo-600">
          <div className="flex gap-3">
            <input data-testid="issue-book-id" value={bookId}
              onChange={e => setBookId(e.target.value)} type="number"
              placeholder="Enter Book ID (e.g. 1)"
              className="input-field" onKeyDown={e => e.key === 'Enter' && lookupBook()} />
            <button onClick={lookupBook} className="btn-primary px-4 flex-shrink-0" disabled={bookLoading}>
              <FiSearch size={15} /> {bookLoading ? '…' : 'Find'}
            </button>
          </div>
          {book && (
            <div className={`mt-4 p-4 rounded-2xl border divide-y ${
              book.isAvailable ? 'bg-emerald-50 border-emerald-200 divide-emerald-100' : 'bg-red-50 border-red-200 divide-red-100'
            }`}>
              <div className="flex items-start justify-between pb-3">
                <div>
                  <p className="font-semibold text-slate-900">{book.title}</p>
                  <p className="text-xs text-slate-500">ID: {book.bookId}</p>
                </div>
                {book.isAvailable
                  ? <span className="badge-green flex-shrink-0">Available</span>
                  : <span className="badge-red flex-shrink-0">Unavailable</span>}
              </div>
              <InfoRow label="Copies Available" value={`${book.availableCopies} / ${book.quantity}`} />
            </div>
          )}
        </LookupCard>
      </div>

      {/* Issue Summary */}
      {student && book && book.isAvailable && (
        <div className="card mb-6 border-2 border-violet-200 bg-violet-50/50">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <FiCalendar size={16} className="text-violet-600" /> Issue Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            {[
              { label: 'Student', value: student.name },
              { label: 'Book', value: book.title },
              { label: 'Issue Date', value: new Date().toLocaleDateString() },
              { label: 'Due Date', value: fmt(dueDate) }
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-2xl p-3 border border-violet-100">
                <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
                <p className="font-semibold text-slate-900 text-sm truncate">{value}</p>
              </div>
            ))}
          </div>
          <button data-testid="confirm-issue-btn" onClick={handleIssue}
            className="btn-success" disabled={issuing}>
            <FiCheckCircle size={16} />
            {issuing ? 'Processing…' : 'Confirm Issue'}
          </button>
        </div>
      )}

      {student && book && !book.isAvailable && (
        <div className="card border-2 border-red-200 bg-red-50">
          <div className="flex items-center gap-3 text-red-700">
            <FiAlertCircle size={20} />
            <p className="font-semibold">"{book.title}" is currently not available — all copies are issued.</p>
          </div>
        </div>
      )}

      {/* Success Result */}
      {issueResult && (
        <div className="card border-2 border-emerald-200 bg-emerald-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center">
              <FiCheckCircle size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-900">Book Issued Successfully!</h3>
              <p className="text-emerald-700 text-xs">Issue ID: #{issueResult.issueId}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              ['Issue Date', fmt(issueResult.issueDate)],
              ['Due Date', fmt(issueResult.dueDate)],
              ['Fine Rate', `Rs. ${issueResult.finePerDay}/day after due`],
              ['Due Period', `${issueResult.dueDays} days`]
            ].map(([k, v]) => (
              <div key={k} className="bg-white rounded-xl p-3 border border-emerald-100">
                <p className="text-xs text-slate-500">{k}</p>
                <p className="font-semibold text-slate-800 text-sm">{v}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setIssueResult(null)} className="btn-secondary text-sm">Issue Another Book</button>
        </div>
      )}
    </div>
  );
}
