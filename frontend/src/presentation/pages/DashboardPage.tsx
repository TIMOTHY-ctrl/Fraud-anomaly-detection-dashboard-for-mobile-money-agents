import { Activity, Bell, ChevronDown, ChevronLeft, ChevronRight, Columns3, CreditCard, Download, Filter, LayoutGrid, Menu, Plus, Printer, RefreshCw, Search, Settings2, ShieldAlert, ShieldCheck, Table2, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Alert } from "../../domain/entities/Alert";
import type { Transaction } from "../../domain/entities/Transaction";
import type { Agent } from "../../domain/entities/Agent";
import { demoUsers, type UserRole } from "../../domain/entities/User";
import { useDashboardData } from "../../application/hooks/useDashboardData";
import { dashboardApi } from "../../infrastructure/api/dashboardApi";
import { formatCurrency } from "../../domain/rules/riskCalculator";
import { DataGrid, type GridRow } from "../components/DataGrid";
import { RoleDashboards } from "../components/RoleDashboards";

const tables = [
  { name: "Transactions", icon: CreditCard },
  { name: "Risk alerts", icon: ShieldAlert },
  { name: "Agents", icon: Users },
  { name: "Detection rules", icon: Settings2 },
] as const;

type TableName = (typeof tables)[number]["name"];
type WorkspaceView = TableName | "My overview" | "My transactions" | "My alerts" | "Investigation queue" | "Flagged transactions";

const ruleRows: GridRow[] = [
  { id: "RUL-001", cells: ["RUL-001", "Unusual transaction velocity", "Rapid repeat transactions", "10+ in 5 min", "Active", "8"] },
  { id: "RUL-002", cells: ["RUL-002", "High-value transaction", "Amount exceeds agent baseline", "3× agent average", "Active", "14"] },
  { id: "RUL-003", cells: ["RUL-003", "Unusual location", "Outside normal operating radius", "Over 25 km", "Active", "6"] },
  { id: "RUL-004", cells: ["RUL-004", "Suspicious cash out", "Multiple consecutive cash outs", "5 in 10 min", "Active", "10"] },
];

export function DashboardPage({ role: initialRole }: { role: UserRole }) {
  const { alerts, transactions, isLoading, error } = useDashboardData(dashboardApi);
  const [role, setRole] = useState(initialRole);
  const [activeTable, setActiveTable] = useState<WorkspaceView>(initialRole === "manager" ? "Transactions" : initialRole === "agent" ? "My overview" : "Investigation queue");
  const [selectedItem, setSelectedItem] = useState<Alert | Transaction | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarQuery, setSidebarQuery] = useState("");
  const [query, setQuery] = useState("");
  const [showLastColumn, setShowLastColumn] = useState(true);
  const [compact, setCompact] = useState(false);
  const [refreshTime, setRefreshTime] = useState("just now");
  const [notice, setNotice] = useState("");

  const agents = useMemo<Agent[]>(() => {
    const seen = new Map<string, Agent>();
    transactions.forEach((transaction) => {
      const current = seen.get(transaction.agentName);
      if (current) {
        current.transactions += 1;
        if (transaction.riskScore >= 85) current.risk = "High";
        else if (transaction.riskScore >= 60 && current.risk === "Low") current.risk = "Elevated";
      } else {
        seen.set(transaction.agentName, {
          id: `AGT-${transaction.id.slice(-4)}`,
          name: transaction.agentName,
          initials: transaction.agentInitials,
          location: transaction.location,
          transactions: 1,
          risk: transaction.riskScore >= 85 ? "High" : transaction.riskScore >= 60 ? "Elevated" : "Low",
        });
      }
    });
    return [...seen.values()];
  }, [transactions]);

  const tableData = useMemo((): { headers: string[]; rows: GridRow[] } => {
    if (activeTable === "Risk alerts") {
      return {
        headers: ["Alert ID", "Detection event", "Agent", "Amount (UGX)", "Severity", "Detected"],
        rows: alerts.map((alert) => ({
          id: alert.id,
          detail: alert,
          cells: [alert.id, alert.title, alert.agentName, alert.amount?.toLocaleString("en-UG") ?? "—", alert.severity, alert.time],
        })),
      };
    }
    if (activeTable === "Agents") {
      return {
        headers: ["Agent ID", "Agent name", "Location", "Transactions", "Risk level", "Network status"],
        rows: agents.map((agent) => ({ id: agent.id, cells: [agent.id, agent.name, agent.location, String(agent.transactions), agent.risk, "Active"] })),
      };
    }
    if (activeTable === "Detection rules") return { headers: ["Rule ID", "Detection rule", "Signal", "Threshold", "Model status", "Triggered today"], rows: ruleRows };
    return {
      headers: ["Transaction ID", "Agent", "Location", "Type", "Amount (UGX)", "Risk score", "Status", "Time"],
      rows: transactions.map((transaction) => ({
        id: transaction.id,
        detail: transaction,
        cells: [transaction.id, transaction.agentName, transaction.location, transaction.type, transaction.amount.toLocaleString("en-UG"), `${transaction.riskScore} / 100`, transaction.status, transaction.time],
      })),
    };
  }, [activeTable, agents, alerts, transactions]);

  const filteredTables = tables.filter(({ name }) => name.toLowerCase().includes(sidebarQuery.toLowerCase()));
  const roleViews: WorkspaceView[] = role === "agent"
    ? ["My overview", "My transactions", "My alerts"]
    : role === "analyst"
      ? ["Investigation queue", "Flagged transactions"]
      : tables.map(({ name }) => name);
  const user = demoUsers[role];
  const isManager = role === "manager";
  const workspaceTitle = activeTable === "My overview" ? "My dashboard"
    : activeTable === "My transactions" ? "My transactions"
      : activeTable === "My alerts" ? "My security alerts"
        : activeTable === "Investigation queue" ? "Investigation queue"
          : activeTable === "Flagged transactions" ? "Flagged transactions"
            : `${activeTable} List`;

  const changeRole = (nextRole: UserRole) => {
    setRole(nextRole);
    setActiveTable(nextRole === "manager" ? "Transactions" : nextRole === "agent" ? "My overview" : "Investigation queue");
    setQuery("");
    setSelectedItem(null);
  };

  const handleExport = () => {
    const lines = [tableData.headers, ...tableData.rows.map((row) => row.cells)]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([lines], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeTable.toLowerCase().replace(/ /g, "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice(`${activeTable} exported as CSV`);
    window.setTimeout(() => setNotice(""), 3000);
  };

  const roleMenu = isManager
    ? filteredTables.map(({ name, icon }) => ({ name, icon }))
    : roleViews.map((name) => ({
      name,
      icon: name.toLowerCase().includes("alert") || name.toLowerCase().includes("flagged") ? ShieldAlert : name.toLowerCase().includes("transaction") ? CreditCard : role === "agent" ? Users : Activity,
    }));

  return (
    <div className="min-h-screen bg-zinc-200">
      {mobileNavOpen && <button className="fixed inset-0 z-20 bg-slate-950/50 md:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" />}

      <aside className={`fixed inset-y-0 left-0 z-30 flex w-[270px] -translate-x-full flex-col border-r border-slate-300 bg-zinc-100 pt-4 transition-transform print:hidden md:translate-x-0 ${mobileNavOpen ? "translate-x-0" : ""}`}>
        <div className="flex h-[57px] shrink-0 items-center gap-3 border-b border-slate-300 px-4">
          <span className="grid h-11 w-11 place-items-center bg-blue-700 text-white"><ShieldCheck size={21} /></span>
          <span className="flex-1 text-[19px] font-bold text-slate-800">NexaGuard<small className="mt-0.5 block text-[10px] font-normal text-slate-500">Fraud monitoring workspace</small></span>
          <button className="grid h-7 w-7 place-items-center text-slate-600 md:hidden" onClick={() => setMobileNavOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>
        <div className="mt-5 flex items-center justify-between px-4 pb-3 text-lg text-slate-700"><span>{isManager ? "All monitoring objects" : role === "agent" ? "My workspace" : "Fraud operations"}</span><ChevronLeft size={17} /></div>
        {isManager && <label className="mx-3 mb-4 flex h-9 items-center gap-2 border border-slate-300 bg-white px-2.5 text-slate-500"><input className="min-w-0 flex-1 text-xs outline-none placeholder:text-slate-400" value={sidebarQuery} onChange={(event) => setSidebarQuery(event.target.value)} placeholder="Search objects…" aria-label="Search monitoring objects" /><Search size={16} /></label>}
        <div className="flex h-8 items-center gap-2 px-4 text-slate-600"><strong className="flex-1 text-[11px]">{isManager ? "TABLES" : role === "agent" ? "MY ACTIVITY" : "INVESTIGATIONS"}</strong><span className="text-[10px]">{roleViews.length}</span><ChevronDown size={14} /></div>
        <nav className="grid" aria-label="Monitoring objects">
          {roleMenu.map(({ name, icon: Icon }) => (
            <button key={name} className={`flex min-h-[43px] items-center gap-3 border-l-[3px] px-5 text-left text-xs ${activeTable === name ? "border-blue-600 bg-blue-700 text-white" : "border-transparent text-slate-700 hover:bg-slate-200"}`} onClick={() => { setActiveTable(name); setMobileNavOpen(false); setQuery(""); }}>
              <Icon size={18} /><span className="flex-1">{name}</span>{name === "Risk alerts" && <span className="rounded-full bg-blue-800 px-1.5 py-0.5 text-[9px]">{alerts.length}</span>}
            </button>
          ))}
          {isManager && filteredTables.length === 0 && <p className="px-5 py-3 text-xs text-slate-500">No matching objects</p>}
          {isManager && <button className="flex items-center gap-2 px-6 py-3 text-left text-xs text-blue-700 hover:text-blue-900" onClick={() => setNotice("Contact your workspace administrator to add a monitoring table.")}><Plus size={17} /> New table</button>}
        </nav>
        {isManager && <><div className="mt-6 flex h-8 items-center gap-2 px-4 text-slate-600"><strong className="flex-1 text-[11px]">WORKSPACE</strong><span className="text-[10px]">2</span><ChevronDown size={14} /></div><nav className="grid"><button className="flex h-10 items-center gap-3 px-5 text-xs text-slate-700 hover:bg-slate-200" onClick={() => setNotice("Model settings are managed by your workspace administrator.")}><Settings2 size={17} className="text-blue-700" /> Model settings</button><button className="flex h-10 items-center gap-3 px-5 text-xs text-slate-700 hover:bg-slate-200" onClick={() => setNotice("Monitoring is active across your agent network.")}><Activity size={17} className="text-blue-700" /> Network health</button></nav></>}
        <div className="mt-auto">
          <div className="mx-3 mb-2 flex items-center gap-2 border border-slate-300 bg-white p-2.5"><span className="grid h-8 w-8 place-items-center bg-blue-50 text-blue-700"><ShieldCheck size={16} /></span><span className="grid flex-1 gap-0.5"><strong className="text-[10px]">Fraud engine</strong><small className="text-[9px] text-slate-500">Connected and monitoring</small></span><i className="h-2 w-2 rounded-full bg-emerald-500" /></div>
          <label className="relative mx-3 mb-2 grid gap-1 border border-slate-300 bg-white px-2.5 py-2"><span className="text-[9px] font-bold tracking-wider text-slate-500">DEMO PERSONA</span><select className="w-full appearance-none bg-transparent text-[11px] font-semibold text-blue-900 outline-none" value={role} onChange={(event) => { if (event.target.value === "manager" || event.target.value === "agent" || event.target.value === "analyst") changeRole(event.target.value); }} aria-label="Switch demo user role"><option value="manager">Network manager</option><option value="agent">Mobile money agent</option><option value="analyst">Fraud analyst</option></select><ChevronDown className="absolute bottom-2.5 right-2.5 text-slate-500" size={13} /></label>
          <div className="flex items-center gap-2 border-t border-slate-300 bg-zinc-200 px-4 py-3"><span className="grid h-8 w-8 place-items-center bg-blue-700 text-[10px] font-bold text-white">{user.initials}</span><span className="grid flex-1 gap-0.5"><strong className="text-[11px]">{user.name}</strong><small className="text-[9px] text-slate-500">{user.title}</small></span><ChevronDown size={14} className="text-slate-500" /></div>
        </div>
      </aside>

      <main className="min-h-screen md:ml-[270px]">
        <header className="sticky top-0 z-10 flex h-12 items-end border-b border-slate-300 bg-zinc-200 print:hidden">
          <div className="flex h-full items-center gap-1 md:items-end"><button className="grid h-10 w-10 place-items-center text-blue-700 md:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Open menu"><Menu size={20} /></button><button className="flex h-[45px] items-center gap-2.5 border border-slate-300 border-b-0 border-t-[3px] border-t-blue-700 bg-white px-4 text-xs font-semibold text-slate-800"><Table2 size={17} className="text-blue-700" /><span>{workspaceTitle}</span></button></div>
          <div className="ml-auto flex items-center gap-3 px-4 pb-2"><span className="hidden items-center gap-2 text-[10px] text-slate-600 sm:flex"><i className="h-2 w-2 rounded-full bg-emerald-500" /> Live monitoring</span><button className="relative grid h-8 w-8 place-items-center text-blue-700" aria-label={`${alerts.length} priority alerts`}><Bell size={18} /><i className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border border-zinc-200 bg-red-500" /></button></div>
        </header>

        <section className="flex min-h-[127px] flex-col items-start justify-center gap-4 bg-blue-700 px-5 py-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div><div className="text-[10px] font-bold tracking-widest text-blue-100">{role === "agent" ? "MOBILE MONEY AGENT" : role === "analyst" ? "FRAUD OPERATIONS · LIVE QUEUE" : "FRAUD & ANOMALY DETECTION"}</div><h1 className="mt-2 text-3xl font-light tracking-tight sm:text-4xl">{workspaceTitle}</h1><p className="hidden text-xs text-blue-100">{role === "agent" ? "Your transactions and security updates, all in one place." : role === "analyst" ? "Investigate suspicious activity and assess risk across the network." : "Review and manage activity across your mobile money agent network."}</p></div>
          {isManager && <div className="flex w-full items-center gap-4 sm:w-auto"><label className="flex h-10 min-w-0 flex-1 items-center gap-2 border border-blue-100 bg-white px-3 text-slate-500 sm:w-72 sm:flex-none"><Search size={17} /><input className="min-w-0 flex-1 text-xs text-slate-700 outline-none placeholder:text-slate-400" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${activeTable.toLowerCase()}…`} aria-label={`Search ${activeTable.toLowerCase()}`} /></label><button className="flex items-center gap-2 text-xs text-white" onClick={() => window.print()}><Printer size={19} /><span>Print list</span></button></div>}
        </section>

        {isManager && <section className="flex min-h-[54px] items-stretch overflow-x-auto border-b border-slate-300 bg-zinc-50 px-2 print:hidden sm:px-4" aria-label="Table actions">
          <button className="flex shrink-0 items-center gap-2 border-b-[3px] border-blue-700 px-3 text-xs text-slate-700" onClick={() => {
            const firstRecord = tableData.rows.find((row) => row.detail)?.detail;
            if (firstRecord) setSelectedItem(firstRecord);
            else setNotice("There are no records to review in this table.");
          }}><Plus size={20} className="text-blue-700" /><span>New review</span></button>
          <button className={`flex shrink-0 items-center gap-2 px-3 text-xs text-slate-700 hover:bg-blue-50 ${compact ? "bg-blue-50" : ""}`} onClick={() => setCompact((value) => !value)}><LayoutGrid size={18} className="text-blue-700" /><span>{compact ? "Comfortable view" : "Table view"}</span></button>
          <button className="flex shrink-0 items-center gap-2 px-3 text-xs text-slate-700 hover:bg-blue-50" onClick={() => { setRefreshTime("just now"); setNotice("Table refreshed"); window.setTimeout(() => setNotice(""), 2500); }}><RefreshCw size={18} className="text-blue-700" /><span>Refresh</span></button>
          <button className="hidden shrink-0 items-center gap-2 px-3 text-xs text-slate-700 hover:bg-blue-50 sm:flex" onClick={handleExport}><Download size={18} className="text-blue-700" /><span>Export CSV</span></button>
          <button className="flex shrink-0 items-center gap-2 px-3 text-xs text-slate-700 hover:bg-blue-50" onClick={() => setShowLastColumn((value) => !value)}><Columns3 size={18} className="text-blue-700" /><span>Show/hide fields</span></button>
          <button className="grid w-9 shrink-0 place-items-center text-blue-700 hover:bg-blue-50" aria-label="Clear search" onClick={() => setQuery("")}><Filter size={17} /></button>
          <span className="ml-auto hidden items-center text-[10px] text-slate-500 sm:flex">Datasheet view</span>
        </section>}

        {error && <div className="m-3 border border-red-200 bg-red-50 p-3 text-xs text-red-700" role="alert">{error}</div>}
        {notice && <div className="m-3 flex items-center justify-between border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss message"><X size={14} /></button></div>}
        {isLoading ? <div className="flex min-h-72 items-center justify-center gap-3 text-sm text-slate-500"><span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" /> Loading monitoring data…</div>
          : !isManager ? <RoleDashboards role={role} view={activeTable} alerts={alerts} transactions={transactions} onSelect={setSelectedItem} />
            : <DataGrid headers={tableData.headers} rows={tableData.rows} query={query} onSelect={setSelectedItem} showLastColumn={showLastColumn} compact={compact} />}
        <footer className="flex justify-between px-4 py-3 text-[10px] text-slate-500 print:hidden"><span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-blue-700" /> NexaGuard fraud intelligence</span><span className="flex items-center gap-1.5">Last synced {refreshTime}<i className="h-1.5 w-1.5 rounded-full bg-emerald-500" /></span></footer>
      </main>

      {selectedItem && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-5 backdrop-blur-sm" onClick={() => setSelectedItem(null)}><section className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="detail-title" onClick={(event) => event.stopPropagation()}>
        <button className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded text-slate-500 hover:bg-slate-100" onClick={() => setSelectedItem(null)} aria-label="Close details"><X size={18} /></button>
        <span className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-red-50 text-red-600"><ShieldAlert size={21} /></span>
        <span className="text-[10px] font-bold tracking-widest text-slate-500">RISK EVENT · {selectedItem.id}</span>
        <h2 id="detail-title" className="mt-2 text-xl font-semibold text-slate-800">{"title" in selectedItem ? selectedItem.title : `${selectedItem.type} transaction`}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{"description" in selectedItem ? selectedItem.description : `Transaction recorded at ${selectedItem.time} in ${selectedItem.location}.`}</p>
        <div className="my-4 grid grid-cols-3 gap-3 border-y border-slate-200 py-4 text-[11px]"><span className="grid gap-1 text-slate-500">Agent<strong className="text-slate-700">{selectedItem.agentName}</strong></span><span className="grid gap-1 text-slate-500">Amount<strong className="text-slate-700">{selectedItem.amount === undefined ? "—" : formatCurrency(selectedItem.amount, "UGX")}</strong></span><span className="grid gap-1 text-slate-500">Risk<strong className="text-slate-700">{"riskScore" in selectedItem ? `${selectedItem.riskScore} / 100` : selectedItem.severity}</strong></span></div>
        <button className="flex h-10 w-full items-center justify-center gap-2 rounded bg-blue-700 text-sm font-semibold text-white hover:bg-blue-800" onClick={() => setSelectedItem(null)}>Mark as reviewed <ChevronRight size={16} /></button>
      </section></div>}
    </div>
  );
}
