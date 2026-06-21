import { useState, useEffect } from 'react';
import { bookAPI } from '../../services/api';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiSearch, FiRefreshCw, FiBook } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function SearchBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    bookAPI.getCategories().then(({ data }) => setCategories(data.data)).catch(() => {});
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, search, available: availableOnly ? 'true' : undefined };
      if (category) params.category = category;
      const { data } = await bookAPI.getAll(params);
      setBooks(data.data); setPages(data.pages); setTotal(data.total);
    } catch { toast.error('Failed to load books.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBooks(); }, [page, search, category, availableOnly]);

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); setPage(1); };
  const reset = () => { setSearchInput(''); setSearch(''); setCategory(''); setAvailableOnly(false); setPage(1); };

  return (
    <div className="animate-in">
      <div className="mb-8">
        <h1 className="page-title">Browse Books</h1>
        <p className="page-subtitle">Search and explore the library catalog</p>
      </div>

      <div className="card mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
                placeholder="Search by title, author, or ISBN…"
                className="input-field pl-10" data-testid="student-book-search" />
            </div>
            <button type="submit" className="btn-primary px-6">Search</button>
            <button type="button" onClick={reset} className="btn-secondary px-4"><FiRefreshCw size={15} /></button>
          </div>
          <div className="flex gap-4 flex-wrap items-center">
            <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
              className="input-field w-auto min-w-[180px]">
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <label className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer select-none">
              <input type="checkbox" checked={availableOnly}
                onChange={e => { setAvailableOnly(e.target.checked); setPage(1); }}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="font-medium">Available only</span>
            </label>
          </div>
        </form>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="table-wrapper">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
            {books.length === 0 ? (
              <div className="col-span-3 text-center py-16 text-slate-400">
                <FiBook size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No books found</p>
              </div>
            ) : books.map(book => (
              <div key={book._id}
                className="group border border-slate-100 rounded-2xl p-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 bg-white">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)' }}>
                    <FiBook size={18} className="text-white" />
                  </div>
                  {book.availableCopies > 0
                    ? <span className="badge-green">Available</span>
                    : <span className="badge-red">Unavailable</span>}
                </div>
                <h4 className="font-semibold text-slate-900 text-sm mb-1 line-clamp-2 leading-snug">{book.title}</h4>
                <p className="text-xs text-slate-500 mb-3">{book.author}</p>
                <div className="flex items-center justify-between">
                  <span className="badge-blue">{book.category}</span>
                  <span className="text-xs text-slate-400 font-mono">{book.availableCopies}/{book.quantity} left</span>
                </div>
                {book.bookId && (
                  <p className="text-xs text-slate-400 mt-2 font-mono">ID: #{book.bookId}</p>
                )}
              </div>
            ))}
          </div>
          <Pagination page={page} pages={pages} total={total} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
