import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ page, pages, total, onPageChange }) {
  if (pages <= 1) return null;

  const getPages = () => {
    const all = [];
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= page - 1 && i <= page + 1)) all.push(i);
      else if (i === page - 2 || i === page + 2) all.push('…');
    }
    return [...new Set(all)];
  };

  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
      <p className="text-xs text-slate-500">
        Showing <span className="font-semibold text-slate-700">{Math.min((page - 1) * 10 + 1, total)}</span>–<span className="font-semibold text-slate-700">{Math.min(page * 10, total)}</span> of <span className="font-semibold text-slate-700">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
          className="btn-icon text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed">
          <FiChevronLeft size={16} />
        </button>
        {getPages().map((p, i) => (
          p === '…'
            ? <span key={`ellipsis-${i}`} className="w-8 text-center text-slate-400 text-sm">…</span>
            : <button key={p} onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? 'bg-brand-gradient text-white shadow-btn'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}>
                {p}
              </button>
        ))}
        <button onClick={() => onPageChange(page + 1)} disabled={page === pages}
          className="btn-icon text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed">
          <FiChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
