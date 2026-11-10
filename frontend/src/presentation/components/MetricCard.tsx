import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  comparison: string;
  icon: LucideIcon;
  tone: "blue" | "green" | "amber" | "violet";
  positive?: boolean;
}

export function MetricCard({ label, value, change, comparison, icon: Icon, tone, positive = true }: MetricCardProps) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <article className="relative min-h-32 rounded-lg border border-slate-200 bg-white p-4 shadow-panel">
      <div className={`mb-3 grid h-8 w-8 place-items-center rounded-lg ${tones[tone]}`}><Icon size={18} strokeWidth={2} /></div>
      <p className="mb-1 text-xs text-slate-500">{label}</p>
      <div className="flex items-center gap-2">
        <strong className="text-2xl font-bold tracking-tight text-slate-800">{value}</strong>
        <span className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold ${positive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </span>
      </div>
      <p className="mt-1 text-[11px] text-slate-400">{comparison}</p>
    </article>
  );
}
