import { Check, CreditCard, ShieldCheck, Smartphone } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 49000,
    agents: 5,
    transactions: 10000,
    retention: "30 days",
    description: "For small agent networks getting started.",
    features: ["Real-time transaction monitoring", "Risk alerts", "Basic network analytics"],
  },
  {
    id: "growth",
    name: "Growth",
    price: 129000,
    agents: 25,
    transactions: 100000,
    retention: "90 days",
    description: "More coverage and insight for growing teams.",
    features: ["Everything in Starter", "Advanced detection rules", "Priority support"],
  },
  {
    id: "scale",
    name: "Scale",
    price: 299000,
    agents: 100,
    transactions: 500000,
    retention: "1 year",
    description: "Extended capacity for larger networks.",
    features: ["Everything in Growth", "Custom risk thresholds", "Extended data retention"],
  },
] as const;

export type SubscriptionPlanId = (typeof plans)[number]["id"];
type PaymentMethod = "Mobile money" | "Card";

const usage = {
  agents: 2,
  transactions: 1240,
};

function formatAmount(amount: number) {
  return `UGX ${amount.toLocaleString("en-UG")}`;
}

function getNextBillingDate() {
  const nextDate = new Date();
  const currentDay = nextDate.getDate();
  nextDate.setDate(1);
  nextDate.setMonth(nextDate.getMonth() + 1);
  const lastDayOfMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();
  nextDate.setDate(Math.min(currentDay, lastDayOfMonth));
  return nextDate.toLocaleDateString("en-UG", { day: "numeric", month: "short", year: "numeric" });
}

export function BillingPage({
  currentPlan,
  renewalDate,
  onSubscribe,
}: {
  currentPlan: SubscriptionPlanId | null;
  renewalDate: string;
  onSubscribe: (planId: SubscriptionPlanId, renewalDate: string) => void;
}) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Mobile money");
  const [notice, setNotice] = useState("");
  const activePlan = plans.find((plan) => plan.id === currentPlan);
  const agentLimit = activePlan?.agents ?? 3;
  const transactionLimit = activePlan?.transactions ?? 5000;

  const subscribe = (plan: (typeof plans)[number]) => {
    onSubscribe(plan.id, getNextBillingDate());
    setNotice(`Demo subscription selected: ${plan.name} at ${formatAmount(plan.price)} per month using ${paymentMethod}. No payment was processed.`);
  };

  return (
    <section className="grid gap-5 p-4 sm:p-6">
      <article className="flex flex-col gap-4 border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-blue-700">SUBSCRIPTION</span>
          <h2 className="mt-1 text-lg font-semibold text-slate-800">{activePlan?.name ?? "Free plan"}</h2>
          <p className="mt-1 text-xs text-slate-500">
            {activePlan
              ? `${formatAmount(activePlan.price)} / month · Renews ${renewalDate}`
              : "Limited monitoring · No monthly charge"}
          </p>
        </div>
        <span className={`inline-flex w-fit items-center gap-2 px-3 py-2 text-xs font-medium ${activePlan ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
          <i className={`h-2 w-2 rounded-full ${activePlan ? "bg-emerald-500" : "bg-slate-400"}`} />
          {activePlan ? "Active demo plan" : "Free plan"}
        </span>
      </article>

      {notice && <p className="border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800" role="status">{notice}</p>}

      <article className="border border-slate-200 bg-white p-4 sm:p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-800">Choose a monthly plan</h2>
          <p className="mt-1 text-xs text-slate-500">Sample monthly pricing in UGX for this demo. No real payment is processed.</p>
        </div>
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium text-slate-600">Payment method</span>
          {(["Mobile money", "Card"] as const).map((method) => {
            const Icon = method === "Mobile money" ? Smartphone : CreditCard;
            return (
              <button
                key={method}
                type="button"
                aria-pressed={paymentMethod === method}
                onClick={() => setPaymentMethod(method)}
                className={`inline-flex h-9 items-center gap-2 border px-3 text-xs ${paymentMethod === method ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
              >
                <Icon size={15} />{method}
              </button>
            );
          })}
          <span className="text-[10px] text-slate-400">Payment processing is not connected in this demo.</span>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            return (
              <article key={plan.id} className={`flex flex-col border p-4 ${isCurrent ? "border-blue-600 ring-1 ring-blue-600" : "border-slate-200"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">{plan.name}</h3>
                    <p className="mt-1 min-h-8 text-[11px] leading-4 text-slate-500">{plan.description}</p>
                  </div>
                  {isCurrent && <span className="bg-blue-50 px-2 py-1 text-[9px] font-semibold text-blue-700">CURRENT</span>}
                </div>
                <p className="mt-4 text-xl font-bold tracking-tight text-slate-800">{formatAmount(plan.price)}<span className="text-xs font-normal text-slate-500"> / month</span></p>
                <ul className="mt-4 grid flex-1 gap-2 border-t border-slate-100 pt-4">
                  {plan.features.map((feature) => <li key={feature} className="flex items-start gap-2 text-[11px] text-slate-600"><Check size={14} className="shrink-0 text-emerald-600" />{feature}</li>)}
                  <li className="text-[10px] text-slate-500">Up to {plan.agents} agents · {plan.transactions.toLocaleString("en-UG")} transactions / month · {plan.retention} retention</li>
                </ul>
                <button
                  type="button"
                  disabled={isCurrent}
                  onClick={() => subscribe(plan)}
                  className="mt-5 h-10 bg-blue-700 px-3 text-xs font-semibold text-white hover:bg-blue-800 disabled:cursor-default disabled:bg-slate-100 disabled:text-slate-500"
                >
                  {isCurrent ? "Current plan" : "Subscribe monthly"}
                </button>
              </article>
            );
          })}
        </div>
      </article>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="border border-slate-200 bg-white p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div><h2 className="text-sm font-semibold text-slate-800">Plan usage</h2><p className="mt-1 text-xs text-slate-500">Current monthly usage against your plan.</p></div>
            <ShieldCheck size={19} className="text-blue-700" />
          </div>
          <UsageMeter label="Registered agents" value={usage.agents} limit={agentLimit} />
          <UsageMeter label="Monitored transactions" value={usage.transactions} limit={transactionLimit} />
          <p className="mt-4 text-[10px] text-slate-400">Sample usage shown for demonstration.</p>
        </article>

        <article className="border border-slate-200 bg-white p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-slate-800">Billing history</h2>
          <p className="mt-1 text-xs text-slate-500">Invoices and subscription payments will appear here.</p>
          <div className="mt-4 border border-dashed border-slate-200 px-4 py-8 text-center">
            <CreditCard size={21} className="mx-auto text-slate-400" />
            <p className="mt-2 text-xs font-medium text-slate-600">No invoices yet</p>
            <p className="mt-1 text-[10px] text-slate-400">Invoices are unavailable until billing is connected.</p>
          </div>
        </article>
      </div>
    </section>
  );
}

function UsageMeter({ label, value, limit }: { label: string; value: number; limit: number }) {
  const percentage = Math.min((value / limit) * 100, 100);
  return (
    <div className="mb-4">
      <div className="mb-2 flex justify-between gap-2 text-[11px]">
        <span className="text-slate-600">{label}</span>
        <strong className="text-slate-700">{value.toLocaleString("en-UG")} / {limit.toLocaleString("en-UG")}</strong>
      </div>
      <div className="h-2 overflow-hidden bg-slate-100"><div className={`h-full ${percentage >= 85 ? "bg-amber-500" : "bg-blue-600"}`} style={{ width: `${percentage}%` }} /></div>
    </div>
  );
}
