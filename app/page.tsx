"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, Calculator, Check, ChevronRight, Dumbbell, Footprints, LogOut, Moon, Pause, Play, ShieldCheck, Sparkles, Target, Timer, TrendingUp, Utensils, Waves } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { createMonth, type ProgramMonth } from "./fitness-data";
import { CalculatorView, CreatePlanView, DietView, ExercisesView, getExercisesForFocus, getPlanForToday, MasteryView, type CustomPlan, ProgressView, RecoveryView, WorkoutsView, YourPlansView } from "./modules";
import { AuthGate, type FitnessProfile, useAuth } from "./auth-gate";

type SetLog = { reps: string; rir: number; tempo: string; variation: string };
type DailyLog = { steps: number; water: number; sleep: number; calories: number; protein: number; weight?: number; energy: number; submitted?: boolean; notes: string; completed: string[]; sets: Record<string, SetLog> };
type AppState = { currentDay: number; months: ProgramMonth[]; safeMode: boolean; dark: boolean; logs: Record<string, DailyLog> };
type WebTool = { name: string; title?: string; description: string; inputSchema: object; annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean }; execute: (input: unknown) => unknown };
const emptyLog = (): DailyLog => ({ steps: 0, water: 0, sleep: 0, calories: 0, protein: 0, energy: 3, submitted: false, notes: "", completed: [], sets: {} });
const initial: AppState = { currentDay: 1, months: [createMonth(1)], safeMode: true, dark: false, logs: {} };

function Ring({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return <div className="ring" style={{ "--p": `${pct}%` } as React.CSSProperties}><div><strong>{pct}%</strong><span>{label}</span></div></div>;
}

function Metric({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return <article className="metric-card"><div className="metric-icon">{icon}</div><div><p>{label}</p><strong>{value}</strong><span>{detail}</span></div></article>;
}

function AccountSettings({ open, onOpenChange, dark, safeMode, onDark, onSafe }: { open: boolean; onOpenChange: (open: boolean) => void; dark: boolean; safeMode: boolean; onDark: (value: boolean) => void; onSafe: (value: boolean) => void }) {
  const { user, profile, saveProfile, signOut } = useAuth();
  const [form, setForm] = useState<FitnessProfile>(profile);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => setForm(profile), [profile, open]);
  const set = (key: keyof FitnessProfile, value: string) => setForm(current => ({ ...current, [key]: value }));
  const save = async (event: React.FormEvent) => { event.preventDefault(); setSaving(true); setMessage(""); const error = await saveProfile(form); setSaving(false); setMessage(error ?? "Profile saved."); };
  const initials = (profile.fullName || user.email || "U").split(/\s|@/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();
  return <Sheet open={open} onOpenChange={onOpenChange}><SheetContent side="right" className="account-sheet"><SheetHeader><span className="account-avatar-large">{initials}</span><SheetTitle>Account settings</SheetTitle><SheetDescription>{user.email}</SheetDescription></SheetHeader><div className="account-sheet-body"><form onSubmit={save}><h3>Profile</h3><label>Full name<input required value={form.fullName} onChange={e => set("fullName", e.target.value)} /></label><div className="account-grid"><label>Age<input type="number" min="13" max="100" value={form.age} onChange={e => set("age", e.target.value)} /></label><label>Weight (kg)<input type="number" min="30" max="300" step=".1" value={form.weightKg} onChange={e => set("weightKg", e.target.value)} /></label></div><div className="account-grid"><label>Height (cm)<input type="number" min="100" max="250" value={form.heightCm} onChange={e => set("heightCm", e.target.value)} /></label><label>Waist (in)<input type="number" min="15" max="80" step=".1" value={form.waistIn} onChange={e => set("waistIn", e.target.value)} /></label></div><label>Primary goal<select value={form.goal} onChange={e => set("goal", e.target.value)}><option value="fat_loss">Fat loss</option><option value="strength">Strength</option><option value="calisthenics">Calisthenics skills</option><option value="general_health">General health</option></select></label><button className="auth-submit" disabled={saving}>{saving ? "Saving…" : "Save profile"}</button>{message && <p className="account-message">{message}</p>}</form><div className="account-preferences"><h3>App preferences</h3><div><span><b>Dark mode</b><small>Use the darker colour theme</small></span><Switch checked={dark} onCheckedChange={onDark} /></div><div><span><b>Cervical Safe</b><small>Replace higher-risk movements</small></span><Switch checked={safeMode} onCheckedChange={onSafe} /></div></div><button className="account-logout" onClick={() => void signOut()}><LogOut /> Log out</button></div></SheetContent></Sheet>;
}

function AppContent() {
  const { user, profile } = useAuth();
  const [state, setState] = useState<AppState>(initial);
  const [ready, setReady] = useState(false);
  const [calendarPlans, setCalendarPlans] = useState<CustomPlan[]>([]);
  const [tab, setTab] = useState("dashboard");
  const [accountOpen, setAccountOpen] = useState(false);
  const [timer, setTimer] = useState(90);
  const [timerRunning, setTimerRunning] = useState(false);
  useEffect(() => { const saved = localStorage.getItem("lean-mission-v1"); if (saved) { try { const parsed=JSON.parse(saved); setState({ ...initial, ...parsed, months: parsed.months?.length ? parsed.months : initial.months }); } catch {} } setReady(true); }, []);
  useEffect(() => { const loadPlans = () => { try { setCalendarPlans(JSON.parse(localStorage.getItem("lean-created-plans-v1") ?? "[]")); } catch { setCalendarPlans([]); } }; loadPlans(); window.addEventListener("lean-plans-changed", loadPlans); return () => window.removeEventListener("lean-plans-changed", loadPlans); }, []);
  useEffect(() => { if (ready) localStorage.setItem("lean-mission-v1", JSON.stringify(state)); document.documentElement.classList.toggle("dark", state.dark); }, [state, ready]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [tab]);
  useEffect(() => { if (!timerRunning || timer <= 0) return; const id=setInterval(()=>setTimer(t=>t-1),1000); return()=>clearInterval(id); },[timerRunning,timer]);
  const activeMonth = state.months[state.months.length - 1];
  const today = activeMonth.days[Math.min(state.currentDay - 1, 29)];
  const calendarDay = getPlanForToday(calendarPlans);
  const plannedFocuses = calendarDay?.focuses ?? [today.type];
  const plannedExercises = calendarDay ? getExercisesForFocus(plannedFocuses, calendarDay.plan.level ?? "beginner") : today.exercises;
  const displayWorkout = plannedFocuses.join(" + ");
  const key = `${activeMonth.id}-${today.day}`;
  const log = state.logs[key] ?? emptyLog();
  const updateLog = (patch: Partial<DailyLog>) => setState(s => ({ ...s, logs: { ...s.logs, [key]: { ...(s.logs[key] ?? emptyLog()), ...patch } } }));
  const updateQuickLog = (patch: Partial<DailyLog>) => updateLog({ ...patch, submitted: false });
  const dashboardLog = log.submitted ? log : emptyLog();
  const taskCount = plannedExercises.length + 5;
  const doneCount = dashboardLog.completed.length + [dashboardLog.steps >= today.stepTarget, dashboardLog.water >= 2500, dashboardLog.sleep >= 7, dashboardLog.calories > 0, dashboardLog.protein >= 100].filter(Boolean).length;
  const dayPct = Math.round((doneCount / taskCount) * 100);
  const completedDays = useMemo(() => activeMonth.days.filter(day => (state.logs[`${activeMonth.id}-${day.day}`]?.completed.length ?? 0) >= day.exercises.length).length, [activeMonth, state.logs]);
  useEffect(() => {
    const context = (document as unknown as { modelContext?: { registerTool: (tool: WebTool, options?: { signal: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool: WebTool) => { try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined); } catch {} };
    register({ name: "get_today_fitness_plan", title: "Read today’s fitness plan", description: "Read the active day, workout, step target and current completion without changing data.", inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false }, execute: () => ({ month: activeMonth.month, day: today.day, workout: displayWorkout, exercises: plannedExercises.map(e => ({ name:e.name, sets:e.sets, reps:e.repRange })), stepTarget: today.stepTarget, completionPercent: dayPct }) });
    register({ name: "log_today_health_metrics", title: "Log today’s health metrics", description: "Update one or more of today’s steps, water, sleep, calories or protein values in the same local fitness log shown in the app.", inputSchema: { type: "object", properties: { steps:{type:"number",minimum:0}, water:{type:"number",minimum:0}, sleep:{type:"number",minimum:0,maximum:24}, calories:{type:"number",minimum:0}, protein:{type:"number",minimum:0} }, additionalProperties:false }, annotations:{readOnlyHint:false,untrustedContentHint:false}, execute:(input) => { if (!input || typeof input!=="object") throw new Error("Metrics must be an object."); const allowed=["steps","water","sleep","calories","protein"] as const; const patch:Partial<DailyLog>={}; for(const field of allowed){const value=(input as Record<string,unknown>)[field]; if(value!==undefined){if(typeof value!=="number"||value<0) throw new Error(`${field} must be a non-negative number.`); (patch as Record<string,unknown>)[field]=value;}} updateLog(patch); return {updated:Object.keys(patch),day:today.day}; } });
    return () => lifecycle.abort();
  }, [activeMonth.month, dayPct, today.day, plannedExercises, today.stepTarget, displayWorkout]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setTab("dashboard")}><span className="brand-mark"><Activity /></span><span><b>Lean Mission</b><small>Strength · Skills · Health</small></span></button>
        <div className="header-actions"><span className="phase-pill"><Sparkles size={15} /> {activeMonth.phase}</span><button className="avatar" aria-label="Open account settings" onClick={() => setAccountOpen(true)}>{(profile.fullName || user.email || "U").split(/\s|@/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase()}</button></div>
      </header>

      <Tabs value={tab} onValueChange={setTab} className="workspace">
        <aside className="sidebar">
          <div className="month-kicker">YOUR PROGRAM</div>
          <h2>{activeMonth.name}</h2><p>{activeMonth.phase}</p>
          <Progress value={(completedDays / 30) * 100} className="month-progress" />
          <small>{completedDays} of 30 training days complete</small>
          <TabsList orientation="vertical" className="nav-list">
            <TabsTrigger value="dashboard"><Activity /> Dashboard</TabsTrigger>
            <TabsTrigger value="today"><Target /> Today</TabsTrigger>
            <TabsTrigger value="plans"><Dumbbell /> Your Plans</TabsTrigger>
            <TabsTrigger value="create-plan"><Sparkles /> Create Plan</TabsTrigger>
            <TabsTrigger value="mastery"><TrendingUp /> Mastery</TabsTrigger>
            <TabsTrigger value="workouts"><Dumbbell /> Workouts</TabsTrigger>
            <TabsTrigger value="exercises"><Target /> Exercises</TabsTrigger>
            <TabsTrigger value="diet"><Utensils /> Diet</TabsTrigger>
            <TabsTrigger value="recovery"><Waves /> Recovery</TabsTrigger>
            <TabsTrigger value="calculator"><Calculator /> Calculators</TabsTrigger>
            <TabsTrigger value="progress"><BarChart3 /> Progress</TabsTrigger>
          </TabsList>
        </aside>

        <section className="content">
          <TabsContent value="dashboard">
            <div className="eyebrow">MONDAY · DAY {today.day}</div>
            <div className="page-heading"><div><h1>Today, made simple.</h1><p>{calendarDay ? `${calendarDay.weekday} · ${displayWorkout} from ${calendarDay.plan.name}.` : today.focus} Aim for calm, clean reps—not exhaustion.</p></div><button className="primary" onClick={() => setTab("today")}>Start today <ChevronRight /></button></div>
            <div className="dashboard-grid">
              <section className="today-card"><div className="card-top"><span className="workout-label"><Dumbbell /> TODAY&apos;S TRAINING</span><span>~38 min</span></div><h2>{displayWorkout}</h2><p>{plannedExercises.length} exercises · {calendarDay ? `${calendarDay.weekday} schedule` : `${today.skillMinutes} min skill prep`} · {today.recovery}</p><div className="exercise-preview">{plannedExercises.slice(0, 3).map((e, i) => <div key={e.id}><span>{String(i + 1).padStart(2, "0")}</span><b>{e.name}</b><small>{e.sets} × {e.repRange}</small></div>)}</div><button onClick={() => setTab("today")}>Open workout <ChevronRight /></button></section>
              <section className="score-card"><div><span>DAY SCORE</span><strong>{dayPct}<small>%</small></strong><p>{doneCount} of {taskCount} daily actions</p></div><Ring value={doneCount} max={taskCount} label="complete" /></section>
            </div>
            <div className="metrics-grid">
              <Metric icon={<Footprints />} label="Steps" value={dashboardLog.steps.toLocaleString()} detail={`${today.stepTarget.toLocaleString()} target`} />
              <Metric icon={<Waves />} label="Water" value={`${(dashboardLog.water / 1000).toFixed(1)} L`} detail="2.5 L editable target" />
              <Metric icon={<Utensils />} label="Nutrition" value={`${dashboardLog.calories} kcal`} detail={`${dashboardLog.protein} / 110 g protein`} />
              <Metric icon={<Moon />} label="Sleep" value={`${dashboardLog.sleep || "—"} hr`} detail="7+ hour recovery target" />
            </div>
            <section className="milestone-strip"><div className="milestone-icon"><Target /></div><div><span>NEXT MILESTONE</span><h3>Complete your first training week</h3><p>Day {today.day} of 7 · consistency before intensity</p></div><Progress value={(Math.min(today.day, 7) / 7) * 100} /></section>
          </TabsContent>

          <TabsContent value="today">
            <div className="eyebrow">{calendarDay ? `${calendarDay.weekday.toUpperCase()} · ${calendarDay.plan.name.toUpperCase()}` : `DAY ${today.day} · ${activeMonth.name.toUpperCase()}`}</div><div className="page-heading"><div><h1>{displayWorkout}</h1><p>{calendarDay ? `Started ${calendarDay.plan.startDate} · ` : ""}target {today.stepTarget.toLocaleString()} steps</p></div><span className="safe-badge"><ShieldCheck /> Safe Mode {state.safeMode ? "on" : "off"}</span></div>
            <section className="checkin-strip"><label>Weight, kg <input type="number" step=".1" value={log.weight||""} onChange={e=>updateQuickLog({weight:+e.target.value})} placeholder="optional"/></label><label>Sleep, hr <input type="number" step=".5" value={log.sleep||""} onChange={e=>updateQuickLog({sleep:+e.target.value})}/></label><label>Energy, 1–5 <input type="number" min="1" max="5" value={log.energy} onChange={e=>updateQuickLog({energy:+e.target.value})}/></label></section>
            {log.energy<=1 && <aside className="fatigue-warning"><ShieldCheck/><p><b>Take an easier session today.</b> Reduce each exercise by one set, leave 4 reps in reserve, and use the easier variation. Stop if symptoms radiate or neurological signs appear.</p></aside>}
            <div className="timer-bar"><Timer/><span>Rest timer</span><strong>{String(Math.floor(timer/60)).padStart(2,"0")}:{String(timer%60).padStart(2,"0")}</strong><button onClick={()=>setTimerRunning(!timerRunning)}>{timerRunning?<Pause/>:<Play/>}{timerRunning?"Pause":"Start"}</button><button onClick={()=>{setTimer(90);setTimerRunning(false)}}>Reset</button></div>
            <div className="today-layout"><section><div className="section-title"><h2>Workout + overload log</h2><span>{log.completed.length}/{plannedExercises.length} done</span></div>{plannedExercises.length === 0 ? <div className="empty-state"><Waves /><b>Recovery day</b><p>Your plan has no strength exercises today. Choose easy walking, mobility or rest.</p></div> : plannedExercises.map((e, i) => { const done = log.completed.includes(e.id); const perf=log.sets?.[e.id]??{reps:"",rir:2,tempo:"2-0-2",variation:"standard"}; const priorDay=activeMonth.days.slice(0,today.day-1).reverse().find(d=>d.exercises.some(x=>x.name===e.name)); const prior=priorDay ? state.logs[`${activeMonth.id}-${priorDay.day}`]?.sets?.[priorDay.exercises.find(x=>x.name===e.name)!.id] : undefined; const suggestion=prior?.reps ? `Last: ${prior.reps}. Next: add 1 rep to the lowest set, or slow the lowering if at the top of range.` : `First session: stay inside ${e.repRange} with ${e.rir.toLowerCase()}.`; return <article className={`exercise-row workout-detail ${done ? "done" : ""}`} key={e.id}><button className="check" aria-label={`Mark ${e.name} complete`} onClick={() => updateLog({ completed: done ? log.completed.filter(x => x !== e.id) : [...log.completed, e.id] })}>{done && <Check />}</button><div><span className="exercise-number">{String(i + 1).padStart(2, "0")}</span><h3>{e.name}</h3><p>{e.cue}</p><details><summary>Technique, alternatives & progression</summary>{e.image && <img className="today-exercise-image" src={e.image} alt={`${e.name} demonstration`} />}<p><b>Common mistake:</b> {e.mistakes}</p><p><b>Easier:</b> {state.safeMode&&e.replacement?e.replacement:e.easier}</p><p><b>Harder:</b> {e.harder}</p><p><b>Equipment:</b> {e.equipment}</p></details>{state.safeMode && e.safeNote && <small className="safe-note"><ShieldCheck /> {e.safeNote}</small>}<div className="overload-log"><label>Reps by set<input value={perf.reps} placeholder="e.g. 10 / 10 / 8" onChange={ev=>updateLog({sets:{...(log.sets||{}),[e.id]:{...perf,reps:ev.target.value}}})}/></label><label>RIR<input type="number" min="0" max="5" value={perf.rir} onChange={ev=>updateLog({sets:{...(log.sets||{}),[e.id]:{...perf,rir:+ev.target.value}}})}/></label><label>Tempo<input value={perf.tempo} onChange={ev=>updateLog({sets:{...(log.sets||{}),[e.id]:{...perf,tempo:ev.target.value}}})}/></label></div><small className="suggestion"><Sparkles/> {suggestion}</small></div><div className="prescription"><b>{e.sets} × {e.repRange}</b><span>{e.rest}</span><small>{e.rir}</small></div></article>})}<label className="notes-box">Evening notes<textarea value={log.notes} onChange={e=>updateLog({notes:e.target.value})} placeholder="Energy, form, neck symptoms, wins…"/></label></section>
              <aside className="daily-log"><h2>Quick log</h2><label>Steps <input type="number" value={log.steps || ""} onChange={e => updateQuickLog({ steps: +e.target.value })} placeholder={String(today.stepTarget)} /></label><label>Water (ml) <input type="number" value={log.water || ""} onChange={e => updateQuickLog({ water: +e.target.value })} placeholder="2500" /></label><div className="quick-water"><button onClick={() => updateQuickLog({ water: log.water + 250 })}>+250</button><button onClick={() => updateQuickLog({ water: log.water + 500 })}>+500</button></div><label>Calories <input type="number" value={log.calories || ""} onChange={e => updateQuickLog({ calories: +e.target.value })} placeholder="1600" /></label><label>Protein (g) <input type="number" value={log.protein || ""} onChange={e => updateQuickLog({ protein: +e.target.value })} placeholder="110" /></label><button className="quick-log-submit" onClick={() => updateLog({ submitted: true })}>{log.submitted ? "Update dashboard & progress" : "Submit today’s log"}</button><div className="day-summary"><b>{log.submitted ? "Submitted ✓" : "Preview"}</b><p>{log.calories||0} kcal · {log.protein||0} g protein</p><p>{log.steps||0} steps · {(log.water/1000).toFixed(1)} L water</p><p>{plannedExercises.length > 0 && log.completed.length===plannedExercises.length?"Workout complete ✓":"Workout still open"}</p></div></aside></div>
          </TabsContent>

          <TabsContent value="plans"><YourPlansView onCreate={() => setTab("create-plan")} /></TabsContent>
          <TabsContent value="create-plan"><CreatePlanView onCreated={() => setTab("plans")} /></TabsContent>

          <TabsContent value="mastery"><MasteryView/></TabsContent>
          <TabsContent value="workouts"><WorkoutsView/></TabsContent>
          <TabsContent value="exercises"><ExercisesView/></TabsContent>
          <TabsContent value="diet"><DietView/></TabsContent>
          <TabsContent value="recovery"><RecoveryView/></TabsContent>
          <TabsContent value="calculator"><CalculatorView/></TabsContent>
          <TabsContent value="progress"><ProgressView months={state.months} logs={state.logs}/></TabsContent>
        </section>
      </Tabs>
      <AccountSettings open={accountOpen} onOpenChange={setAccountOpen} dark={state.dark} safeMode={state.safeMode} onDark={v => setState(s => ({ ...s, dark: v }))} onSafe={v => setState(s => ({ ...s, safeMode: v }))} />
    </main>
  );
}

export default function Home() { return <AuthGate><AppContent /></AuthGate>; }
