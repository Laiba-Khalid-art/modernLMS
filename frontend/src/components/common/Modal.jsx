import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 backdrop-blur-sm" onClick={onClose}
        style={{ background: 'rgba(3,8,16,0.85)', animation: 'fadeSlideIn 0.15s ease' }} />

      {/* Panel */}
      <div className={`relative w-full ${widths[size]} max-h-[90vh] flex flex-col overflow-hidden rounded-3xl`}
        style={{
          background: 'linear-gradient(160deg, #0A1628 0%, #0F2040 100%)',
          border: '1px solid rgba(201,168,76,0.18)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.06)',
          animation: 'fadeSlideIn 0.2s ease',
        }}>

        {/* Gold top accent line */}
        <div className="absolute top-0 left-8 right-8 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)' }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <h3 className="text-base font-bold text-white">{title}</h3>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors text-slate-500 hover:text-white"
            style={{ background: 'rgba(255,255,255,0.04)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
            <FiX size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
