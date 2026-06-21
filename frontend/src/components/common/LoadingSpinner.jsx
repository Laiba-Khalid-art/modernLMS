export default function LoadingSpinner({ size = 'md', fullPage }) {
  const sizes = { sm: 'h-5 w-5 border-2', md: 'h-9 w-9 border-[3px]', lg: 'h-14 w-14 border-4' };
  const spinner = (
    <div className={`${sizes[size]} animate-spin rounded-full border-slate-200 border-t-brand-600`} />
  );
  if (fullPage) {
    return <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">{spinner}</div>;
  }
  return <div className="flex justify-center items-center py-12">{spinner}</div>;
}
