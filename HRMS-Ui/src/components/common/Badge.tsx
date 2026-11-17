interface BadgeProps {
  status: 'active' | 'inactive' | 'disabled' | 'transferred' | 'returned' | string;
  className?: string;
}

export default function Badge({ status, className = "" }: BadgeProps) {
  const normalized = status.toLowerCase();

  let colorClasses = "bg-slate-100 text-slate-700 border-slate-200";

  if (normalized === "active") {
    colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (normalized === "inactive") {
    colorClasses = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (normalized === "disabled") {
    colorClasses = "bg-rose-50 text-rose-700 border-rose-200";
  } else if (normalized === "transferred") {
    colorClasses = "bg-sky-50 text-sky-700 border-sky-200";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses} ${className}`}
    >
      {status}
    </span>
  );
}
