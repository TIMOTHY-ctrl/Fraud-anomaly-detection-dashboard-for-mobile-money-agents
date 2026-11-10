import { ArrowDownLeft, ArrowRight, ArrowUpRight, BadgeCheck, Clock3, MapPin, ShieldAlert, ShieldCheck, Wallet, Zap } from "lucide-react";
import type { ReactNode } from "react";
import type { Alert } from "../../domain/entities/Alert";
import type { Transaction } from "../../domain/entities/Transaction";
import type { UserRole } from "../../domain/entities/User";
import { formatCurrency } from "../../domain/rules/riskCalculator";

interface RoleDashboardsProps {
  role: Exclude<UserRole, "manager">;
  view: string;
  alerts: Alert[];
  transactions: Transaction[];
  onSelect: (item: Alert | Transaction) => void;
}

const panelClass = "min-w-0 border border-slate-200 bg-white";
const headingClass = "flex min-h-16 items-center justify-between gap-3 border-b border-slate-100 px-4 py-3";

export function RoleDashboards({ role, view, alerts, transactions, onSelect }: RoleDashboardsProps) {
  return role === "agent"
    ? <AgentDashboard view={view} alerts={alerts} transactions={transactions} onSelect={onSelect} />
    : <AnalystDashboard view={view} alerts={alerts} transactions={transactions} onSelect={onSelect} />;
}

function RoleHeading({ eyebrow, title, description, trailing }: { eyebrow: string; title: string; description: string; trailing?: ReactNode }) {
  return <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><span className="text-[10px] font-bold tracking-widest text-blue-700">{eyebrow}</span><h2 className="mt-1.5 text-xl font-semibold tracking-tight text-slate-800">{title}</h2><p className="mt-1 text-xs text-slate-500">{description}</p></div>{trailing}</div>;
}

function AgentDashboard({ view, alerts, transactions, onSelect }: Omit<RoleDashboardsProps, "role">) {
  const myTransactions = transactions.filter((transaction) => transaction.agentName === "James Mwangi");
  const myAlerts = alerts.filter((alert) => alert.agentName === "James Mwangi");
  const todayVolume = myTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const location = <span className="inline-flex items-center gap-1.5 border border-slate-200 px-2.5 py-2 text-[10px] text-slate-600"><MapPin size={14} className="text-blue-600" /> Westlands, Nairobi</span>;

  if (view === "My transactions") return <div className="grid gap-4 p-4 sm:p-6"><RoleHeading eyebrow="PERSONAL ACTIVITY" title="My transactions" description="Review your recent mobile money activity." trailing={location} /><AgentTransactionList transactions={myTransactions} onSelect={onSelect} /></div>;
  if (view === "My alerts") return <div className="grid gap-4 p-4 sm:p-6"><RoleHeading eyebrow="ACCOUNT SECURITY" title="My security alerts" description="Review notifications related to your agent account." /><AgentAlertList alerts={myAlerts} onSelect={onSelect} /></div>;

  return (
    <div className="grid gap-4 p-4 sm:p-6">
      <RoleHeading eyebrow="YOUR AGENT ACCOUNT" title="Your workday, at a glance." description="Your transactions and security updates, all in one place." trailing={location} />
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <AgentMetric label="Today’s transaction volume" value={formatCurrency(todayVolume)} note={`Across ${myTransactions.length} transactions`} icon={Wallet} color="blue" />
        <AgentMetric label="Successful transactions" value={String(myTransactions.filter((transaction) => transaction.status === "Cleared").length + 28)} note="Processed successfully today" icon={BadgeCheck} color="green" />
        <AgentMetric label="Security notifications" value={String(myAlerts.length)} note={myAlerts.length ? "One needs your attention" : "You’re all caught up"} icon={ShieldAlert} color="amber" />
      </section>
      <section className="grid gap-4 lg:grid-cols-[1.4fr_.8fr]">
        <AgentTransactionList transactions={myTransactions} onSelect={onSelect} />
        <article className={`${panelClass} flex min-h-56 flex-col items-start p-5`}>
          <span className="mb-4 grid h-10 w-10 place-items-center bg-emerald-50 text-emerald-700"><ShieldCheck size={23} /></span>
          <span className="text-[10px] font-bold tracking-widest text-blue-700">ACCOUNT SECURITY</span><h3 className="mt-1 text-base font-semibold text-slate-800">You’re protected</h3>
          <p className="mt-2 text-xs leading-5 text-slate-500">Transactions are monitored for unusual activity to help keep your account and customers safe.</p>
          <div className="mt-3 flex items-center gap-2 bg-emerald-50 px-2.5 py-2 text-[10px] text-emerald-800"><i className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Monitoring is active</div>
          {myAlerts.length > 0 && <button className="mt-auto flex w-full items-center gap-2 border-t border-slate-100 pt-4 text-left text-red-700" onClick={() => onSelect(myAlerts[0])}><ShieldAlert size={16} /><span className="grid min-w-0 flex-1 gap-1"><strong className="text-[10px]">{myAlerts.length} alert needs your attention</strong><small className="truncate text-[10px] text-slate-500">{myAlerts[0].title}</small></span><ArrowRight size={16} /></button>}
        </article>
      </section>
      <RoleFootnote> Your activity is monitored to help protect your customers and your business.</RoleFootnote>
    </div>
  );
}

function AnalystDashboard({ view, alerts, transactions, onSelect }: Omit<RoleDashboardsProps, "role">) {
  const flaggedTransactions = transactions.filter((transaction) => transaction.status !== "Cleared");
  const shift = <span className="inline-flex items-center gap-1.5 border border-slate-200 px-2.5 py-2 text-[10px] text-slate-600"><Clock3 size={14} className="text-blue-600" /> Day shift · On duty</span>;

  if (view === "Flagged transactions") return (
    <div className="grid gap-4 p-4 sm:p-6">
      <RoleHeading eyebrow="FRAUD OPERATIONS · REVIEW" title="Flagged transactions" description="Review transactions that require additional investigation." trailing={shift} />
      <article className={panelClass}><PanelHeading title="Transactions requiring review" description="Open a transaction to review its risk context" /><div className="overflow-auto"><table className="w-full min-w-[700px] border-collapse text-left text-xs"><AnalystTableHead columns={["TRANSACTION", "AGENT", "LOCATION", "AMOUNT", "RISK SCORE", "STATUS"]} /><tbody>{flaggedTransactions.map((transaction) => <tr key={transaction.id} className="cursor-pointer border-b border-slate-100 hover:bg-blue-50" onClick={() => onSelect(transaction)} tabIndex={0} onKeyDown={(event) => event.key === "Enter" && onSelect(transaction)}><td className="px-3 py-4 font-semibold text-blue-700">{transaction.id}</td><td className="px-3 py-4">{transaction.agentName}</td><td className="px-3 py-4">{transaction.location}</td><td className="px-3 py-4">{formatCurrency(transaction.amount)}</td><td className="px-3 py-4"><RiskTag label={`${transaction.riskScore} / 100`} level="high" /></td><td className="px-3 py-4">{transaction.status}</td></tr>)}</tbody></table></div></article>
    </div>
  );

  return (
    <div className="grid gap-4 p-4 sm:p-6">
      <RoleHeading eyebrow="FRAUD OPERATIONS · LIVE QUEUE" title="Investigation workspace" description="Review suspicious activity and decide what needs attention next." trailing={shift} />
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <AgentMetric label="Open alerts" value={String(alerts.length)} note="Across your monitoring queue" icon={ShieldAlert} color="red" />
        <AgentMetric label="High-priority cases" value={String(alerts.filter((alert) => alert.severity === "Critical" || alert.severity === "High").length)} note="Prioritised for review" icon={Zap} color="amber" />
        <AgentMetric label="Resolved this shift" value="12" note="Cases closed today" icon={BadgeCheck} color="green" />
      </section>
      <article className={`${panelClass} overflow-hidden`}>
        <PanelHeading title="Investigation queue" description="Review flagged transactions and linked risk signals" trailing={<span className="bg-red-50 px-2 py-1 text-[10px] font-bold text-red-700">{alerts.length} OPEN</span>} />
        <div className="overflow-auto"><table className="w-full min-w-[770px] border-collapse text-left text-xs"><AnalystTableHead columns={["CASE", "RISK SIGNAL", "AGENT", "AMOUNT", "SEVERITY", "DETECTED", ""]} /><tbody>
          {alerts.map((alert) => <tr key={alert.id} className="cursor-pointer border-b border-slate-100 hover:bg-blue-50" onClick={() => onSelect(alert)} tabIndex={0} onKeyDown={(event) => event.key === "Enter" && onSelect(alert)}>
            <td className="px-3 py-3.5 font-semibold text-blue-700">{alert.id}</td><td className="px-3 py-3.5">{alert.title}<small className="mt-1 block text-[10px] text-slate-500">{alert.description}</small></td><td className="px-3 py-3.5">{alert.agentName}</td><td className="px-3 py-3.5">{alert.amount ? formatCurrency(alert.amount) : "—"}</td><td className="px-3 py-3.5"><RiskTag label={alert.severity} level={alert.severity.toLowerCase()} /></td><td className="px-3 py-3.5 text-slate-500">{alert.time}</td><td className="px-3 py-3.5 text-blue-700"><ArrowRight size={16} /></td>
          </tr>)}
          {!alerts.length && <tr><td colSpan={7} className="p-8 text-center text-slate-500">No open alerts. Your queue is clear.</td></tr>}
        </tbody></table></div>
        <div className="flex flex-col gap-2 border-t border-slate-100 px-4 py-3 text-[10px] text-slate-500 sm:flex-row sm:justify-between"><span>Also monitoring <strong className="text-slate-700">{flaggedTransactions.length}</strong> flagged or reviewing transactions</span><span className="flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Rules engine active</span></div>
      </article>
      <RoleFootnote> Review context and risk scores before taking action on an alert.</RoleFootnote>
    </div>
  );
}

function AgentMetric({ label, value, note, icon: Icon, color }: { label: string; value: string; note: string; icon: typeof Wallet; color: "blue" | "green" | "amber" | "red" }) {
  const tones = { blue: "bg-blue-50 text-blue-700", green: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700", red: "bg-red-50 text-red-700" };
  return <article className="grid min-h-32 content-start gap-1.5 border border-slate-200 bg-white p-4 shadow-panel"><span className={`mb-1 grid h-8 w-8 place-items-center ${tones[color]}`}><Icon size={19} /></span><span className="text-[11px] text-slate-500">{label}</span><strong className="text-2xl font-semibold text-slate-800">{value}</strong><small className="text-[10px] text-slate-500">{note}</small></article>;
}

function AgentTransactionList({ transactions, onSelect }: { transactions: Transaction[]; onSelect: (transaction: Transaction) => void }) {
  return <article className={panelClass}><PanelHeading title="Transaction history" description="Your recent mobile money activity" trailing={<span className="flex items-center gap-1.5 text-[10px] text-emerald-700"><i className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> LIVE</span>} /><div>{transactions.length ? transactions.map((transaction) => <button key={transaction.id} className="flex min-h-16 w-full items-center gap-3 border-b border-slate-100 px-4 py-2 text-left hover:bg-blue-50" onClick={() => onSelect(transaction)}><span className={`grid h-9 w-9 place-items-center ${transaction.type === "Cash in" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>{transaction.type === "Cash in" ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}</span><span className="grid min-w-0 flex-1 gap-1"><strong className="text-xs font-semibold text-slate-700">{transaction.type}</strong><small className="truncate text-[10px] text-slate-500">{transaction.id} · {transaction.time}</small></span><span className="grid gap-1 text-right text-xs font-semibold text-slate-700">{formatCurrency(transaction.amount)}<small className={`justify-self-end px-1.5 py-0.5 text-[9px] ${transaction.status === "Flagged" ? "bg-red-50 text-red-700" : transaction.status === "Reviewing" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{transaction.status}</small></span></button>) : <p className="p-6 text-center text-xs text-slate-500">Your transactions will show here.</p>}</div></article>;
}

function AgentAlertList({ alerts, onSelect }: { alerts: Alert[]; onSelect: (alert: Alert) => void }) {
  return <article className={panelClass}><PanelHeading title="Security notifications" description="Alerts related to your agent account" trailing={<span className="bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-700">{alerts.length} OPEN</span>} /><div>{alerts.length ? alerts.map((alert) => <button key={alert.id} className="flex min-h-16 w-full items-center gap-3 border-b border-slate-100 px-4 py-2 text-left hover:bg-blue-50" onClick={() => onSelect(alert)}><span className="grid h-9 w-9 place-items-center bg-red-50 text-red-700"><ShieldAlert size={18} /></span><span className="grid min-w-0 flex-1 gap-1"><strong className="truncate text-xs font-semibold text-slate-700">{alert.title}</strong><small className="truncate text-[10px] text-slate-500">{alert.description} · {alert.time}</small></span><span className="grid gap-1 text-right text-xs font-semibold text-slate-700">{alert.amount ? formatCurrency(alert.amount) : "—"}<small className="text-[9px] font-medium text-red-700">{alert.severity}</small></span></button>) : <p className="p-6 text-center text-xs text-slate-500">No active alerts. Your account is all caught up.</p>}</div></article>;
}

function PanelHeading({ title, description, trailing }: { title: string; description: string; trailing?: ReactNode }) {
  return <div className={headingClass}><div><h3 className="text-xs font-semibold text-slate-800">{title}</h3><p className="mt-1 text-[10px] text-slate-500">{description}</p></div>{trailing}</div>;
}

function AnalystTableHead({ columns }: { columns: string[] }) {
  return <thead className="bg-slate-50"><tr>{columns.map((column, index) => <th key={`${column}-${index}`} className="h-10 border-b border-slate-200 px-3 text-[10px] font-semibold tracking-wide text-slate-500">{column}</th>)}</tr></thead>;
}

function RiskTag({ label, level }: { label: string; level: string }) {
  const style = level === "critical" || level === "high" ? "bg-red-50 text-red-700" : level === "medium" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-800";
  return <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-[10px] ${style}`}><i className={`h-1.5 w-1.5 rounded-full ${level === "critical" || level === "high" ? "bg-red-500" : level === "medium" ? "bg-blue-500" : "bg-amber-500"}`} />{label}</span>;
}

function RoleFootnote({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-2 text-[10px] text-slate-500"><ShieldCheck size={14} className="text-blue-700" />{children}</div>;
}
