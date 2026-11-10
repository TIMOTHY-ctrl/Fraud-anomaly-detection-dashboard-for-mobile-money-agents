import { useState, type FormEvent, type ReactNode } from "react";
import { BarChart3, Plus, UserRound, UserRoundCheck, UserRoundX } from "lucide-react";
import type { Agent } from "../../domain/entities/Agent";
import type { Transaction } from "../../domain/entities/Transaction";
import { formatCurrency } from "../../domain/rules/riskCalculator";

type TransactionDraft = Pick<Transaction, "agentName" | "location" | "amount" | "type">;

interface TransactionFormProps {
  agents: Agent[];
  onClose: () => void;
  onSubmit: (draft: TransactionDraft) => void;
}

export function TransactionForm({ agents, onClose, onSubmit }: TransactionFormProps) {
  const [agentName, setAgentName] = useState(agents[0]?.name ?? "");
  const [location, setLocation] = useState(agents[0]?.location ?? "");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<Transaction["type"]>("Transfer");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0 || !agentName || !location) return;
    onSubmit({ agentName, location: location.trim(), amount: parsedAmount, type });
  };

  return (
    <Modal title="Add transaction" onClose={onClose}>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-1 text-xs font-medium text-slate-700">
          Agent
          <select
            className="h-10 rounded border border-slate-300 bg-white px-3 text-sm"
            value={agentName}
            onChange={(event) => {
              const nextAgent = agents.find((agent) => agent.name === event.target.value);
              setAgentName(event.target.value);
              if (nextAgent) setLocation(nextAgent.location);
            }}
            required
          >
            {agents.map((agent) => <option key={agent.id} value={agent.name}>{agent.name}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-medium text-slate-700">
          Location
          <input className="h-10 rounded border border-slate-300 px-3 text-sm" value={location} onChange={(event) => setLocation(event.target.value)} required />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1 text-xs font-medium text-slate-700">
            Transaction type
            <select className="h-10 rounded border border-slate-300 bg-white px-3 text-sm" value={type} onChange={(event) => setType(event.target.value as Transaction["type"])}>
              <option>Cash in</option>
              <option>Cash out</option>
              <option>Transfer</option>
            </select>
          </label>
          <label className="grid gap-1 text-xs font-medium text-slate-700">
            Amount (UGX)
            <input className="h-10 rounded border border-slate-300 px-3 text-sm" type="number" min="1" step="1" value={amount} onChange={(event) => setAmount(event.target.value)} required />
          </label>
        </div>
        <FormActions onCancel={onClose} submitLabel="Add transaction" />
      </form>
    </Modal>
  );
}

interface AgentManagementProps {
  agents: Agent[];
  inactiveAgentIds: Set<string>;
  onAddAgent: (name: string, location: string) => void;
  onToggleAgent: (agentId: string) => void;
}

export function AgentManagement({ agents, inactiveAgentIds, onAddAgent, onToggleAgent }: AgentManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedLocation = location.trim();
    if (!trimmedName || !trimmedLocation) return;
    onAddAgent(trimmedName, trimmedLocation);
    setName("");
    setLocation("");
    setShowForm(false);
  };

  return (
    <section className="border-b border-slate-300 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Agent directory</h2>
          <p className="mt-1 text-xs text-slate-500">Add demo agents or change their network status.</p>
        </div>
        <button className="flex items-center gap-2 rounded bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800" onClick={() => setShowForm((value) => !value)}>
          <Plus size={15} /> Add agent
        </button>
      </div>
      {showForm && (
        <form className="grid gap-3 border-b border-blue-100 bg-blue-50 p-4 sm:grid-cols-[1fr_1fr_auto_auto]" onSubmit={handleSubmit}>
          <input className="h-10 rounded border border-slate-300 px-3 text-sm" placeholder="Agent name" value={name} onChange={(event) => setName(event.target.value)} required />
          <input className="h-10 rounded border border-slate-300 px-3 text-sm" placeholder="Operating location" value={location} onChange={(event) => setLocation(event.target.value)} required />
          <button className="h-10 rounded bg-blue-700 px-4 text-xs font-semibold text-white hover:bg-blue-800" type="submit">Save agent</button>
          <button className="h-10 rounded border border-slate-300 bg-white px-4 text-xs text-slate-700" type="button" onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}
      <div className="overflow-auto">
        <table className="w-full min-w-[700px] text-left">
          <thead className="bg-slate-100 text-xs text-slate-600">
            <tr>{["Agent ID", "Agent", "Location", "Transactions", "Risk", "Network status", "Action"].map((heading) => <th className="px-4 py-3 font-medium" key={heading}>{heading}</th>)}</tr>
          </thead>
          <tbody>
            {agents.map((agent) => {
              const isActive = !inactiveAgentIds.has(agent.id);
              return (
                <tr className="border-t border-slate-100 text-xs text-slate-700" key={agent.id}>
                  <td className="px-4 py-3 font-mono text-slate-500">{agent.id}</td>
                  <td className="px-4 py-3"><span className="flex items-center gap-2"><UserRound size={15} className="text-blue-700" />{agent.name}</span></td>
                  <td className="px-4 py-3">{agent.location}</td>
                  <td className="px-4 py-3">{agent.transactions}</td>
                  <td className="px-4 py-3">{agent.risk}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 ${isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{isActive ? "Active" : "Inactive"}</span></td>
                  <td className="px-4 py-3">
                    <button className="flex items-center gap-1 text-blue-700 hover:text-blue-900" onClick={() => onToggleAgent(agent.id)}>
                      {isActive ? <UserRoundX size={14} /> : <UserRoundCheck size={14} />}
                      {isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              );
            })}
            {agents.length === 0 && <tr><td className="px-4 py-8 text-center text-sm text-slate-500" colSpan={7}>No agents yet. Add an agent to begin.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function AnalyticsPanel({ transactions }: { transactions: Transaction[] }) {
  const totalVolume = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const averageRisk = transactions.length
    ? Math.round(transactions.reduce((sum, transaction) => sum + transaction.riskScore, 0) / transactions.length)
    : 0;
  const flaggedCount = transactions.filter((transaction) => transaction.status === "Flagged").length;
  const types = ["Cash in", "Cash out", "Transfer"] as const;
  const statuses = ["Flagged", "Reviewing", "Cleared"] as const;

  return (
    <section className="space-y-4 p-4 sm:p-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total transactions" value={transactions.length.toLocaleString()} />
        <Metric label="Transaction volume" value={formatCurrency(totalVolume)} />
        <Metric label="Average risk score" value={`${averageRisk} / 100`} />
        <Metric label="Flagged transactions" value={flaggedCount.toLocaleString()} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Transactions by type">
          {types.map((type) => {
            const count = transactions.filter((transaction) => transaction.type === type).length;
            return <Bar key={type} label={type} count={count} total={transactions.length} />;
          })}
        </ChartCard>
        <ChartCard title="Transactions by status">
          {statuses.map((status) => {
            const count = transactions.filter((transaction) => transaction.status === status).length;
            return <Bar key={status} label={status} count={count} total={transactions.length} />;
          })}
        </ChartCard>
      </div>
      <p className="flex items-center gap-2 text-xs text-slate-500"><BarChart3 size={15} /> Analytics are calculated from the sample and demo transactions currently loaded in this browser.</p>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <article className="border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">{label}</p><strong className="mt-2 block text-xl font-semibold text-slate-800">{value}</strong></article>;
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return <article className="border border-slate-200 bg-white p-4"><h2 className="mb-5 text-sm font-semibold text-slate-800">{title}</h2><div className="grid gap-4">{children}</div></article>;
}

function Bar({ label, count, total }: { label: string; count: number; total: number }) {
  const percent = total ? (count / total) * 100 : 0;
  return (
    <div className="grid grid-cols-[90px_1fr_36px] items-center gap-3 text-xs">
      <span className="text-slate-600">{label}</span>
      <span className="h-2 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-blue-600" style={{ width: `${percent}%` }} /></span>
      <strong className="text-right text-slate-700">{count}</strong>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" onClick={onClose}>
      <section className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="feature-modal-title" onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-800" id="feature-modal-title">{title}</h2><button className="text-sm text-slate-500 hover:text-slate-800" type="button" onClick={onClose}>Close</button></div>
        {children}
      </section>
    </div>
  );
}

function FormActions({ onCancel, submitLabel }: { onCancel: () => void; submitLabel: string }) {
  return <div className="flex justify-end gap-2 pt-2"><button className="h-10 rounded border border-slate-300 px-4 text-xs text-slate-700" type="button" onClick={onCancel}>Cancel</button><button className="h-10 rounded bg-blue-700 px-4 text-xs font-semibold text-white hover:bg-blue-800" type="submit">{submitLabel}</button></div>;
}
