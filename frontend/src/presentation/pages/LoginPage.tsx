import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, CreditCard, Eye, EyeOff, Fingerprint, LockKeyhole, Mail, ShieldAlert, ShieldCheck, Sparkles, Users } from "lucide-react";
import type { UserRole } from "../../domain/entities/User";
import logo from "../assets/logo.png";

type AuthMode = "login" | "forgot-password";

interface LoginPageProps {
  mode: AuthMode;
  onNavigate: (route: "login" | "forgot-password") => void;
  onEnterDemo: (role: UserRole) => void;
}

const demoRoles: { role: UserRole; title: string; description: string; icon: typeof Users }[] = [
  { role: "manager", title: "Network manager", description: "Monitor your agent network", icon: Users },
  { role: "agent", title: "Money agent", description: "View your activity and alerts", icon: CreditCard },
  { role: "analyst", title: "Fraud analyst", description: "Investigate suspicious activity", icon: ShieldAlert },
];

const fieldClass = "h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

export function LoginPage({ mode, onNavigate, onEnterDemo }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("manager");

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    onEnterDemo(selectedRole);
  };

  const isForgotPassword = mode === "forgot-password";

  return (
    <main className="min-h-screen bg-slate-100 px-3 sm:px-5 lg:px-10">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between border-b border-slate-200">
        <button className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-800" onClick={() => onNavigate("login")} aria-label="NexaGuard sign in">
          <img className="h-9 w-9 object-contain" src={logo} alt="" />NexaGuard
        </button>
        <span className="text-[10px] font-semibold tracking-widest text-slate-500">DEMO WORKSPACE ACCESS</span>
      </header>

      <div className="mx-auto my-4 grid min-h-[min(690px,calc(100vh-112px))] max-w-6xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 md:grid-cols-2">
        <section className="relative flex min-h-64 flex-col justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-[#142f52] to-blue-900 px-7 py-8 text-white sm:px-10 md:min-h-[620px] md:px-12">
          <div className="absolute -right-36 top-12 h-80 w-80 rounded-full border border-blue-200/10" />
          <div className="absolute -right-24 top-24 h-60 w-60 rounded-full border border-blue-200/10" />
          <div className="relative my-auto">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/20 bg-blue-300/10 px-3 py-2 text-[10px] font-semibold tracking-wide text-blue-100"><Sparkles size={14} /> SMARTER FRAUD PROTECTION</span>
            <h1 className="mt-5 text-3xl font-medium leading-tight tracking-tight sm:text-4xl">Every transaction.<br />A little more <span className="text-blue-300">secure.</span></h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-blue-100/80">One clear view of your agent network. Intelligent signals to help you catch unusual activity sooner.</p>
            <div className="relative mx-auto my-6 hidden h-52 max-w-sm place-items-center sm:grid" aria-hidden="true">
              <span className="absolute h-48 w-48 rounded-full border border-blue-100/15" />
              <span className="absolute h-36 w-36 rounded-full border border-blue-100/20" />
              <span className="z-10 grid h-20 w-20 place-items-center rounded-2xl border border-blue-200/40 bg-gradient-to-br from-blue-500 to-blue-800 shadow-xl shadow-blue-950/40"><ShieldCheck size={34} /></span>
              <span className="absolute left-[22%] top-8 grid h-10 w-10 place-items-center rounded-xl border border-blue-100/20 bg-slate-700"><CreditCard size={18} /></span>
              <span className="absolute right-[20%] top-10 grid h-10 w-10 place-items-center rounded-xl border border-blue-100/20 bg-slate-700"><Users size={18} /></span>
              <span className="absolute bottom-4 grid h-10 w-10 place-items-center rounded-xl border border-blue-100/20 bg-slate-700 text-amber-300"><ShieldAlert size={18} /></span>
              <span className="absolute bottom-0 text-[9px] font-semibold tracking-[.2em] text-blue-100/60">NETWORK PROTECTED</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-5 text-[11px] text-blue-100/90 sm:mt-0"><span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-300" /> Real-time monitoring</span><span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-300" /> Actionable risk alerts</span></div>
          </div>
          <div className="absolute bottom-5 left-8 hidden items-center justify-center gap-3 text-[9px] font-semibold tracking-widest text-blue-100/60 md:flex"><span>BUILT FOR TRUST</span><span className="h-1 w-1 rounded-full bg-blue-200/70" /><span>MADE FOR FINTECH</span></div>
        </section>

        <section className="flex min-w-0 flex-col justify-center px-6 py-7 sm:px-10 md:px-12">
          <div className="mx-auto w-full max-w-sm">
            <span className="mb-5 grid h-11 w-11 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700"><LockKeyhole size={21} /></span>
            {isForgotPassword ? (
              <>
                <span className="text-[10px] font-bold tracking-widest text-blue-700">ACCOUNT RECOVERY</span>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-800">Reset your password</h2>
                <p className="mb-6 mt-2 text-sm leading-6 text-slate-500">Enter the email linked to your workspace and we’ll help you get back in.</p>
                <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); setMessage("Password reset delivery is not configured yet. Contact your workspace administrator for help."); }}>
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="reset-email">Work email</label>
                  <div className="relative"><Mail className="absolute left-3 top-3 text-slate-400" size={18} /><input className={`${fieldClass} pl-10`} id="reset-email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
                  {message && <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800" role="status">{message}</p>}
                  <button className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-700 text-sm font-semibold text-white hover:bg-blue-800" type="submit">Continue <ArrowRight size={17} /></button>
                </form>
                <button className="mt-5 flex items-center gap-2 text-xs font-semibold text-blue-700 hover:text-blue-900" onClick={() => { setMessage(""); onNavigate("login"); }}><ArrowLeft size={15} /> Back to sign in</button>
              </>
            ) : (
              <>
                <span className="text-[10px] font-bold tracking-widest text-blue-700">PROJECT DEMO</span>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-800">Enter the workspace</h2>
                <p className="mb-5 mt-2 text-sm leading-6 text-slate-500">Enter any email and password, choose a role, and continue to the dashboard.</p>
                <form className="space-y-3" onSubmit={handleLogin}>
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="login-email">Work email</label>
                  <div className="relative"><Mail className="absolute left-3 top-3 text-slate-400" size={18} /><input className={`${fieldClass} pl-10`} id="login-email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
                  <div className="flex items-center justify-between"><label className="text-xs font-semibold text-slate-700" htmlFor="login-password">Password</label><button type="button" className="text-[11px] font-semibold text-blue-700 hover:text-blue-900" onClick={() => { setMessage(""); onNavigate("forgot-password"); }}>Forgot password?</button></div>
                  <div className="relative"><LockKeyhole className="absolute left-3 top-3 text-slate-400" size={18} /><input className={`${fieldClass} px-10`} id="login-password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required /><button className="absolute right-2 top-1.5 grid h-8 w-8 place-items-center rounded text-slate-500 hover:bg-slate-100" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
                  {message && <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800" role="alert">{message}</p>}
                  <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">Demo access only: credentials are not verified or saved. Do not enter a real password.</p>
                  <button className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-blue-700 text-sm font-semibold text-white shadow-md shadow-blue-900/10 hover:bg-blue-800" type="submit">Continue to dashboard <ArrowRight size={17} /></button>
                </form>
                <div className="my-4 flex items-center gap-3 text-[9px] font-semibold tracking-widest text-slate-400"><span className="h-px flex-1 bg-slate-200" /> CHOOSE A DEMO ROLE <span className="h-px flex-1 bg-slate-200" /></div>
                <div className="grid gap-2">
                  {demoRoles.map(({ role, title, description, icon: Icon }) => (
                    <button key={role} type="button" className={`flex min-h-12 items-center gap-3 rounded-md border px-3 py-2 text-left transition ${selectedRole === role ? "border-blue-400 bg-blue-50/70 ring-1 ring-blue-100" : "border-slate-200 hover:bg-slate-50"}`} onClick={() => { setSelectedRole(role); setMessage(""); }} aria-pressed={selectedRole === role}>
                      <span className="grid h-8 w-8 place-items-center rounded-md bg-blue-100 text-blue-700"><Icon size={16} /></span><span className="min-w-0 flex-1"><strong className="block text-xs font-semibold text-slate-700">{title}</strong><small className="text-[10px] text-slate-500">{description}</small></span><span className={`grid h-4 w-4 place-items-center rounded-full border ${selectedRole === role ? "border-[5px] border-blue-700" : "border-slate-300"}`} />
                    </button>
                  ))}
                </div>
                <button className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50" onClick={() => onEnterDemo(selectedRole)}><Fingerprint size={17} className="text-blue-700" /> Explore as {demoRoles.find(({ role }) => role === selectedRole)?.title} <ArrowRight size={15} /></button>
                <p className="mt-2 text-center text-[10px] text-slate-400">Sample data only · No account required · Authentication will be added later</p>
              </>
            )}
          </div>
          <footer className="mx-auto mt-5 flex w-full max-w-sm justify-between text-[10px] text-slate-400"><span className="flex items-center gap-1"><ShieldCheck size={14} className="text-blue-600" /> Demo data only</span><span>© {new Date().getFullYear()} NexaGuard</span></footer>
        </section>
      </div>
    </main>
  );
}
