export default function StatCard({ title, value, icon: Icon, gradient, subtitle }) {
  const configs = {
    violet:  { from: '#7C3AED', to: '#6D28D9', glow: 'rgba(124,58,237,0.25)' },
    blue:    { from: '#3B82F6', to: '#2563EB', glow: 'rgba(59,130,246,0.25)' },
    emerald: { from: '#10B981', to: '#059669', glow: 'rgba(16,185,129,0.25)' },
    amber:   { from: '#C9A84C', to: '#D4AF37', glow: 'rgba(201,168,76,0.35)' },
    red:     { from: '#EF4444', to: '#DC2626', glow: 'rgba(239,68,68,0.25)' },
    cyan:    { from: '#06B6D4', to: '#0891B2', glow: 'rgba(6,182,212,0.25)' },
    pink:    { from: '#EC4899', to: '#DB2777', glow: 'rgba(236,72,153,0.25)' },
    indigo:  { from: '#6366F1', to: '#4F46E5', glow: 'rgba(99,102,241,0.25)' },
    gold:    { from: '#C9A84C', to: '#E8CC6A', glow: 'rgba(201,168,76,0.4)' },
  };
  const c = configs[gradient] || configs.gold;

  return (
    <div className="card-hover group relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse at top right, ${c.glow} 0%, transparent 60%)` }} />

      <div className="relative flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(201,168,76,0.6)' }}>{title}</p>
          <p className="text-3xl font-black tracking-tight text-white truncate">{value}</p>
          {subtitle && <p className="text-xs mt-2" style={{ color: '#475569' }}>{subtitle}</p>}
        </div>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ml-4
                        group-hover:scale-110 transition-transform duration-300"
          style={{
            background: `linear-gradient(135deg, ${c.from}, ${c.to})`,
            boxShadow: `0 4px 16px ${c.glow}`,
          }}>
          <Icon size={21} className="text-white" />
        </div>
      </div>
    </div>
  );
}
