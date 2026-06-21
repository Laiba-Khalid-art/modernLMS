import { useState, useEffect, useCallback } from 'react';
import { bookAPI } from '../../services/api';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiRefreshCw, FiBook } from 'react-icons/fi';
import toast from 'react-hot-toast';

const emptyForm = { title: '', author: '', category: '', isbn: '', quantity: '' };

const FormField = ({ label, name, type = 'text', placeholder, value, onChange, min, testId }) => (
  <div>
    <label className="input-label">{label}</label>
    <input type={type} value={value} onChange={e => onChange(name, e.target.value)}
      placeholder={placeholder} className="input-field" min={min}
      data-testid={testId} />
  </div>
);

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await bookAPI.getAll({ page, limit: 10, search });
      setBooks(data.data); setPages(data.pages); setTotal(data.total);
    } catch { toast.error('Failed to load books.'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const setField = (name, val) => setForm(p => ({ ...p, [name]: val }));

  const openAdd  = () => { setEditBook(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (book) => {
    setEditBook(book);
    setForm({ title: book.title, author: book.author, category: book.category, isbn: book.isbn || '', quantity: String(book.quantity) });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.category || !form.quantity) {
      toast.error('Please fill all required fields.'); return;
    }
    setSaving(true);
    try {
      if (editBook) {
        await bookAPI.update(editBook.bookId, { ...form, quantity: Number(form.quantity) });
        toast.success('Book updated successfully.');
      } else {
        await bookAPI.add({ ...form, quantity: Number(form.quantity) });
        toast.success('Book added successfully.');
      }
      setShowModal(false); fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed.');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await bookAPI.delete(deleteTarget.bookId);
      toast.success('Book deleted.'); setDeleteTarget(null); fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    } finally { setDeleting(false); }
  };

  return (
    <div className="animate-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="page-title">Books</h1>
          <p className="page-subtitle">Manage the library book catalog</p>
        </div>
        <button data-testid="add-book-btn" onClick={openAdd} className="btn-primary">
          <FiPlus size={16} /> Add Book
        </button>
      </div>

      {/* Search Bar */}
      <div className="card mb-5">
        <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); setPage(1); }}
          className="flex gap-3">
          <div className="relative flex-1">
            <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
              placeholder="Search books by title, author, or ISBN…"
              className="input-field pl-10" data-testid="book-search-input" />
          </div>
          <button type="submit" className="btn-primary px-6">Search</button>
          <button type="button" onClick={() => { setSearchInput(''); setSearch(''); setPage(1); }}
            className="btn-secondary px-4" title="Clear">
            <FiRefreshCw size={15} />
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        {loading ? <LoadingSpinner /> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="books-table">
                <thead className="table-head">
                  <tr>
                    {['ID', 'Title', 'Author', 'Category', 'Qty', 'Available', 'Status', 'Actions'].map(h => (
                      <th key={h} className="th">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {books.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-16 text-slate-400">
                        <FiBook size={36} className="mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No books found</p>
                      </td>
                    </tr>
                  ) : books.map(book => (
                    <tr key={book._id} className="tr-hover tr-divider">
                      <td className="td font-mono text-xs text-slate-400">#{book.bookId}</td>
                      <td className="td">
                        <p className="font-semibold text-slate-900 max-w-[180px] truncate">{book.title}</p>
                      </td>
                      <td className="td text-slate-600">{book.author}</td>
                      <td className="td"><span className="badge-purple">{book.category}</span></td>
                      <td className="td font-medium">{book.quantity}</td>
                      <td className="td font-medium">{book.availableCopies}</td>
                      <td className="td">
                        {book.availableCopies > 0
                          ? <span className="badge-green">Available</span>
                          : <span className="badge-red">Out of Stock</span>}
                      </td>
                      <td className="td">
                        <div className="flex items-center gap-1">
                          <button data-testid={`edit-book-${book.bookId}`} onClick={() => openEdit(book)}
                            className="btn-icon text-blue-600 hover:bg-blue-50 focus:ring-blue-400" title="Edit">
                            <FiEdit2 size={14} />
                          </button>
                          <button data-testid={`delete-book-${book.bookId}`} onClick={() => setDeleteTarget(book)}
                            className="btn-icon text-red-500 hover:bg-red-50 focus:ring-red-400" title="Delete">
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} pages={pages} total={total} onPageChange={setPage} />
          </>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editBook ? `Edit Book — #${editBook.bookId}` : 'Add New Book'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Title *" name="title" placeholder="Introduction to Algorithms"
            value={form.title} onChange={setField} testId="book-title-input" />
          <FormField label="Author *" name="author" placeholder="Thomas H. Cormen"
            value={form.author} onChange={setField} testId="book-author-input" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Category *" name="category" placeholder="Computer Science"
              value={form.category} onChange={setField} testId="book-category-input" />
            <FormField label="ISBN" name="isbn" placeholder="978-0-262-03384-8"
              value={form.isbn} onChange={setField} testId="book-isbn-input" />
          </div>
          <FormField label="Quantity *" name="quantity" type="number" placeholder="5" min="1"
            value={form.quantity} onChange={setField} testId="book-quantity-input" />

          <div className="flex gap-3 pt-2 justify-end border-t border-slate-100 mt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving} data-testid="save-book-btn">
              {saving ? 'Saving…' : editBook ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={deleting} title="Delete Book"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`} />
    </div>
  );
}
