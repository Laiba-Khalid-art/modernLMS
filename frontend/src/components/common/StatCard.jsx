export default function StatCard({ title, value, icon: Icon, gradient, subtitle, trend }) {
  const gradients = {
    violet:  'from-violet-500 to-purple-600',
    blue:    'from-blue-500 to-indigo-600',
    emerald: 'from-emerald-500 to-teal-600',
    amber:   'from-amber-500 to-orange-500',
    red:     'from-red-500 to-rose-600',
    cyan:    'from-cyan-500 to-blue-500',
    pink:    'from-pink-500 to-rose-500',
    indigo:  'from-indigo-500 to-violet-600',
  };
  const g = gradients[gradient] || gradients.violet;

  return (
    <div className="card-hover group cursor-default">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">{title}</p>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight truncate">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1.5">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${g} flex items-center justify-center shadow-lg flex-shrink-0 ml-3
                         group-hover:scale-110 transition-transform duration-200`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
      {trend !== undefined && (
        <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          <span>{trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>
          <span className="text-slate-400 font-normal">vs last month</span>
        </div>
      )}
    </div>
  );
}
