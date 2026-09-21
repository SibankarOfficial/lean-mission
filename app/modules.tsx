"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Calculator, Check, ChevronRight, CircleAlert, Clock3, Droplets, Dumbbell, ExternalLink, Flame, Footprints, LockKeyhole, Moon, Plus, RotateCcw, Scale, ShieldCheck, Sparkles, Target, TimerReset, Trash2, TrendingDown, Trophy, Utensils, Waves, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { evidence, foods, skillLadder, type ProgramMonth } from "./fitness-data";
import { pushupVariations, pushupWeeks, reelVariations } from "./pushup-data";

function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => { const raw = localStorage.getItem(key); if (raw) { try { setValue(JSON.parse(raw)); } catch {} } setReady(true); }, [key]);
  useEffect(() => { if (ready) localStorage.setItem(key, JSON.stringify(value)); }, [key, ready, value]);
  return [value, setValue] as const;
}

export function SkillsView() {
  const [done, setDone] = useStored<boolean[]>("lean-skills-v1", []);
  const completed = done.filter(Boolean).length;
  return <><div className="eyebrow">CALISTHENICS · HANDSTAND ROADMAP</div><div className="page-heading"><div><h1>Build the line first.</h1><p>Wrist capacity, shoulder control and safe exits come before freestanding attempts.</p></div><span className="safe-badge"><ShieldCheck /> No headstands</span></div><section className="skill-hero"><div><span>CURRENT LEVEL</span><h2>{skillLadder[Math.min(completed, skillLadder.length - 1)][0]}</h2><p>{skillLadder[Math.min(completed, skillLadder.length - 1)][1]}</p></div><div><strong>{completed}<small> / {skillLadder.length}</small></strong><span>milestones complete</span></div></section><div className="skill-list">{skillLadder.map(([title, test], i) => { const locked = i > completed; const complete = !!done[i]; return <article key={title} className={`skill-step ${locked ? "locked" : ""} ${complete ? "complete" : ""}`}><button disabled={locked} aria-label={`Mark ${title} complete`} onClick={() => setDone(old => old.map((v, x) => x === i ? !v : v).concat(Array(Math.max(0, i + 1 - old.length)).fill(false)).map((v, x) => x === i ? !complete : v))}>{locked ? <LockKeyhole /> : complete ? <Check /> : <span>{i + 1}</span>}</button><div><small>{complete ? "COMPLETED" : locked ? "LOCKED" : "CURRENT"}</small><h3>{title}</h3><p>Unlock test: {test}</p></div>{!locked && !complete && <ChevronRight />}</article>})}</div><aside className="info-banner"><CircleAlert /><p><b>Stop the skill session</b> for neck pain spreading into an arm, tingling, weakness, dizziness, balance change or loss of coordination. A wall hold is never worth forcing.</p></aside></>;
}

type PushupState = { baseline: number; best: number; currentWeek: number; completed: string[]; variationDone: string[]; variationReps: Record<string, string> };
const pushupStart: PushupState = { baseline: 0, best: 0, currentWeek: 1, completed: [], variationDone: [], variationReps: {} };
const unlockAt = [0, 3, 3, 10, 15, 20, 25, 30, 35, 40, 50, 60];

export function PushupView() {
  const [state, setState] = useStored<PushupState>("lean-pushups-v1", pushupStart);
  const week = pushupWeeks[state.currentWeek - 1];
  const variationDone = state.variationDone ?? [];
  const variationReps = state.variationReps ?? {};
  const workingVariation = state.baseline < 5 ? "Wall / high incline" : state.baseline < 10 ? "Low incline" : state.baseline < 15 ? "Knee + standard mix" : "Standard push-up";
  const completedThisWeek = week.sessions.filter((_, i) => state.completed.includes(`${week.week}-${i}`)).length;
  const reelDone = reelVariations.filter(item => variationDone.includes(item.id)).length;
  const setNumber = (key: "baseline" | "best", value: number) => setState(old => ({ ...old, [key]: Math.max(0, Math.round(value || 0)) }));
  return <>
    <div className="eyebrow">12-WEEK PUSH-UP MISSION · GOAL: 100 CONTINUOUS</div>
    <div className="page-heading"><div><h1>Earn every rep, in order.</h1><p>Three progressive months: first clean form, then capacity, then a carefully gated 100-rep assessment.</p></div><a className="reference-link" href="https://www.facebook.com/reel/2066590050892338" target="_blank" rel="noreferrer">Reference reel <ExternalLink /></a></div>
    <section className="pushup-hero">
      <div><Target/><span>STARTING MAX</span><label><input type="number" min="0" value={state.baseline || ""} placeholder="Test reps" onChange={e => setNumber("baseline", +e.target.value)}/> clean reps</label></div>
      <div><Trophy/><span>PERSONAL BEST</span><label><input type="number" min="0" value={state.best || ""} placeholder="Best reps" onChange={e => setNumber("best", +e.target.value)}/> clean reps</label></div>
      <div><Sparkles/><span>START WITH</span><strong>{workingVariation}</strong><small>Based on your starting max</small></div>
      <div><Clock3/><span>CURRENT BLOCK</span><strong>Week {week.week} · {week.phase}</strong><small>{completedThisWeek}/{week.sessions.length} sessions done</small></div>
    </section>
    <aside className="info-banner"><ShieldCheck/><p><b>Use this as your push training—not extra daily punishment.</b> Keep at least 48 hours between hard sessions, keep the neck neutral, and stop for radiating pain, tingling, weakness, dizziness or loss of form. Reaching 100 in 12 weeks is a goal, not a guarantee.</p></aside>
    <section className="reel-circuit">
      <div className="section-title"><div><span className="reel-label">REFERENCE-SEQUENCE SKILLS</span><h2>Seven variations from your screenshots</h2></div><strong>{reelDone}/{reelVariations.length} learned</strong></div>
      <p className="reel-intro">The reel counts are technique samples, not a workout prescription. Unlock the variation in its listed week, practise it fresh, and record only clean reps.</p>
      <div className="reel-variation-grid">{reelVariations.map((item, i) => { const done = variationDone.includes(item.id); const available = state.currentWeek >= item.startWeek; return <article key={item.id} className={`${done ? "done" : ""} ${available ? "available" : "locked"}`}><div className="variation-top"><span>{String(i + 1).padStart(2, "0")}</span><small>FROM WEEK {item.startWeek}</small><button disabled={!available} aria-label={`Mark ${item.name} learned`} onClick={() => setState(old => ({ ...old, variationDone: done ? (old.variationDone ?? []).filter(x => x !== item.id) : [...(old.variationDone ?? []), item.id] }))}>{available ? done ? <Check/> : "Mark" : <LockKeyhole/>}</button></div><h3>{item.name}</h3><b>{item.focus}</b><p>{item.cue}</p><div className="variation-log"><span>Reel: {item.reelTarget}</span><label>My clean reps <input inputMode="numeric" value={variationReps[item.id] ?? ""} placeholder="0" onChange={e => setState(old => ({ ...old, variationReps: { ...(old.variationReps ?? {}), [item.id]: e.target.value } }))}/></label></div><small className="variation-safety"><ShieldCheck/> {item.safety}</small></article>})}</div>
    </section>
    <div className="pushup-layout">
      <section>
        <div className="section-title"><h2>Your 12-week path</h2><span>Tap a week to open it</span></div>
        <div className="week-selector">{pushupWeeks.map(item => <button key={item.week} className={item.week === week.week ? "active" : ""} onClick={() => setState(old => ({ ...old, currentWeek: item.week }))}><span>{item.week}</span><small>{item.phase}</small></button>)}</div>
        <article className="week-plan"><div className="week-plan-head"><div><span>WEEK {week.week} · {week.phase.toUpperCase()}</span><h2>{week.focus}</h2></div><b>{completedThisWeek}/{week.sessions.length}</b></div>{week.sessions.map((session, i) => { const id = `${week.week}-${i}`; const done = state.completed.includes(id); return <div className={`pushup-session ${done ? "done" : ""}`} key={id}><button className="check" aria-label={`Mark ${session.name} complete`} onClick={() => setState(old => ({ ...old, completed: done ? old.completed.filter(x => x !== id) : [...old.completed, id] }))}>{done && <Check/>}</button><div><h3>{session.name}</h3><strong>{session.prescription}</strong><p>{session.note}</p></div></div>})}{week.test && <div className="week-test"><Target/><p><b>Assessment:</b> {week.test}</p></div>}</article>
      </section>
      <aside className="variation-ladder"><div className="section-title"><h2>Variation ladder</h2><span>Do them in order</span></div>{pushupVariations.map((item, i) => { const open = state.best >= unlockAt[i] || i === 0; return <article key={item.name} className={open ? "unlocked" : "locked"}><span>{open ? <Check/> : <LockKeyhole/>}</span><div><small>{item.level}</small><h3>{item.name}</h3><p>{item.unlock}</p></div></article>})}</aside>
    </div>
  </>;
}

type FoodEntry = { id: string; name: string; multiplier: number; kcal: number; protein: number; carbs: number; fat: number; fibre: number };
export function DietView() {
  const [entries, setEntries] = useStored<FoodEntry[]>("lean-foods-v1", []);
  const [custom, setCustom] = useState({ name: "", kcal: 0, protein: 0, fibre: 0 });
  const totals = entries.reduce((a, f) => ({ kcal: a.kcal + f.kcal * f.multiplier, protein: a.protein + f.protein * f.multiplier, carbs: a.carbs + f.carbs * f.multiplier, fat: a.fat + f.fat * f.multiplier, fibre: a.fibre + f.fibre * f.multiplier }), { kcal: 0, protein: 0, carbs: 0, fat: 0, fibre: 0 });
  const add = (f: typeof foods[number]) => setEntries(e => [...e, { ...f, id: crypto.randomUUID(), multiplier: 1 }]);
  return <><div className="eyebrow">BENGALI HOME FOOD · FLEXIBLE PORTIONS</div><div className="page-heading"><div><h1>Build today’s plate.</h1><p>Approximate values for planning—not lab measurements. Measure oil separately.</p></div></div><div className="nutrition-summary"><div><span>CALORIES</span><strong>{Math.round(totals.kcal)}</strong><small>/ 1,600 kcal</small><Progress value={totals.kcal / 16} /></div><div><span>PROTEIN</span><strong>{Math.round(totals.protein)} g</strong><small>/ 110 g</small><Progress value={totals.protein / 1.1} /></div><div><span>FIBRE</span><strong>{Math.round(totals.fibre)} g</strong><small>/ 25–30 g</small><Progress value={totals.fibre / .28} /></div><div><span>CARBS · FAT</span><strong>{Math.round(totals.carbs)} · {Math.round(totals.fat)} g</strong><small>Logged estimate</small></div></div><div className="two-columns"><section><div className="section-title"><h2>Today’s food</h2><span>{entries.length} items</span></div>{entries.length === 0 && <div className="empty-state"><Utensils /><b>No food logged yet</b><p>Add a common food from the right.</p></div>}{entries.map(item => <article className="food-row" key={item.id}><div><h3>{item.name}</h3><p>{Math.round(item.kcal * item.multiplier)} kcal · {Math.round(item.protein * item.multiplier)} g protein · {Math.round(item.fibre * item.multiplier)} g fibre</p></div><label><span>Serving</span><input type="number" min="0.25" step="0.25" value={item.multiplier} onChange={e => setEntries(old => old.map(x => x.id === item.id ? { ...x, multiplier: +e.target.value } : x))} /></label><button aria-label={`Remove ${item.name}`} onClick={() => setEntries(old => old.filter(x => x.id !== item.id))}><Trash2 /></button></article>)}</section><aside className="food-library"><h2>Common foods</h2><div>{foods.map(f => <button key={f.name} onClick={() => add(f)}><span><b>{f.name}</b><small>{f.kcal} kcal · {f.protein} g protein · {f.fibre} g fibre</small></span><Plus /></button>)}</div><h3>Custom food</h3><input placeholder="Food name" value={custom.name} onChange={e => setCustom({ ...custom, name: e.target.value })} /><div className="custom-food-inputs"><input type="number" placeholder="kcal" onChange={e => setCustom({ ...custom, kcal: +e.target.value })} /><input type="number" placeholder="protein g" onChange={e => setCustom({ ...custom, protein: +e.target.value })} /><input type="number" placeholder="fibre g" onChange={e => setCustom({ ...custom, fibre: +e.target.value })} /></div><button className="secondary-button" disabled={!custom.name} onClick={() => { add({ ...custom, carbs: 0, fat: 0 }); setCustom({ name: "", kcal: 0, protein: 0, fibre: 0 }); }}>Add custom food</button></aside></div></>;
}

const mobility = [
  ["90/90 breathing", "Lie with lower legs on a chair. Breathe quietly into ribs for 5 slow breaths."],
  ["Cat–cow, small range", "Move through the upper back without throwing the head up or down."],
  ["Open-book rotation", "Keep knees stacked; rotate through the chest only as far as comfortable."],
  ["Half-kneeling hip stretch", "Gently tuck the pelvis, shift forward, keep ribs and chin level."],
  ["Wall slide", "Forearms on wall; slide upward without shrugging or pushing the chin forward."],
  ["Supported child’s pose", "Rest forearms on a chair and sit hips back with a neutral neck."],
];
export function RecoveryView() {
  const [seconds, setSeconds] = useState(300); const [running, setRunning] = useState(false);
  useEffect(() => { if (!running || seconds <= 0) return; const id = setInterval(() => setSeconds(s => s - 1), 1000); return () => clearInterval(id); }, [running, seconds]);
  const setMinutes = (m: number) => { setRunning(false); setSeconds(m * 60); };
  return <><div className="eyebrow">MOBILITY · YOGA · BREATHING</div><div className="page-heading"><div><h1>Downshift without forcing.</h1><p>Short, low-risk work for a desk-heavy day and training recovery.</p></div></div><div className="recovery-grid"><section className="breathing-card"><span>SLOW PACED BREATHING</span><div className="breath-orb"><Waves /></div><strong>{String(Math.floor(seconds / 60)).padStart(2,"0")}:{String(seconds % 60).padStart(2,"0")}</strong><p>Easy nasal inhale, longer relaxed exhale. No breath holding or forceful breathing.</p><div className="timer-presets">{[2,5,10].map(m => <button key={m} onClick={() => setMinutes(m)}>{m} min</button>)}</div><button className="primary" onClick={() => setRunning(!running)}>{running ? "Pause" : seconds === 0 ? "Restart" : "Start breathing"}</button></section><section><div className="section-title"><h2>8-minute desk reset</h2><span>Comfortable range only</span></div><div className="mobility-list">{mobility.map(([name, note], i) => <article key={name}><span>{i + 1}</span><div><h3>{name}</h3><p>{note}</p></div><small>45 sec</small></article>)}</div></section></div><aside className="info-banner"><ShieldCheck /><p>Skip headstands, shoulder stands, extreme neck positions and forceful pranayama. Yoga can support wellbeing, but it is not treatment for cervical spondylosis.</p></aside></>;
}

type Profile = { age: number; height: number; weight: number; belly: number; waist: number; activity: number; deficit: number; proteinFactor: number; water: number };
const baseProfile: Profile = { age: 30, height: 162.6, weight: 65, belly: 37, waist: 34, activity: 1.2, deficit: 300, proteinFactor: 1.7, water: 2500 };
export function CalculatorView() {
  const [p, setP] = useStored<Profile>("lean-profile-v1", baseProfile);
  const bmr = Math.round(10*p.weight + 6.25*p.height - 5*p.age + 5); const tdee = Math.round(bmr*p.activity); const target = Math.max(1500, tdee-p.deficit); const bmi = p.weight/((p.height/100)**2); const whtr = (p.belly*2.54)/p.height;
  const field = (label: string, key: keyof Profile, step="1") => <label>{label}<input type="number" step={step} value={p[key]} onChange={e => setP({ ...p, [key]: +e.target.value })} /></label>;
  return <><div className="eyebrow">PERSONAL ESTIMATES · EDITABLE INPUTS</div><div className="page-heading"><div><h1>Your numbers, with context.</h1><p>Use trends and performance—not a single calculator result—to guide changes.</p></div></div><div className="calculator-layout"><section className="form-card"><h2>Profile</h2>{field("Age", "age")}{field("Height (cm)", "height", ".1")}{field("Weight (kg)", "weight", ".1")}{field("Navel circumference (in)", "belly", ".1")} {field("Lower waist (in)", "waist", ".1")}<label>Activity estimate<select value={p.activity} onChange={e => setP({...p,activity:+e.target.value})}><option value="1.2">Sedentary · 1.2</option><option value="1.375">Light · 1.375</option><option value="1.55">Moderate · 1.55</option></select></label>{field("Daily deficit (kcal)", "deficit")}{field("Protein factor (g/kg)", "proteinFactor", ".1")}</section><section className="result-grid"><article><Calculator /><span>BMR · MIFFLIN-ST JEOR</span><strong>{bmr} kcal</strong><p>10×{p.weight} + 6.25×{p.height} − 5×{p.age} + 5</p></article><article><Flame /><span>ESTIMATED TDEE</span><strong>{tdee} kcal</strong><p>BMR × {p.activity}. Real maintenance can differ.</p></article><article><TrendingDown /><span>FAT-LOSS TARGET</span><strong>{target} kcal</strong><p>{p.deficit} kcal planned deficit; adjust only after 2 weeks of trend data.</p></article><article><Scale /><span>BMI</span><strong>{bmi.toFixed(1)}</strong><p>A screening ratio; it does not measure body fat or distribution.</p></article><article><Sparkles /><span>PROTEIN</span><strong>{Math.round(p.weight*p.proteinFactor)} g/day</strong><p>{p.proteinFactor} g/kg · editable within a practical training range.</p></article><article><TargetIcon /><span>WAIST-TO-HEIGHT</span><strong>{whtr.toFixed(2)}</strong><p>Uses navel measurement; a screening aid, not a diagnosis.</p></article></section></div><aside className="adjustment-card"><Clock3 /><div><h3>Two-week adjustment rule</h3><p>Compare 7-day average weights. If the trend is flat and adherence was strong, consider ~100–150 kcal less. If loss is fast, performance falls, or recovery is poor, add ~100–150 kcal and reassess. Never auto-cut aggressively.</p></div></aside></>;
}
function TargetIcon(){return <TrendingDown/>}

type ProgressProps = { months: ProgramMonth[]; logs: Record<string, { steps: number; water: number; sleep: number; calories: number; protein: number; weight?: number; completed: string[] }> };
export function ProgressView({ months, logs }: ProgressProps) {
  const active = months[months.length-1]; const points = active.days.map(d => ({ day:d.day, steps:logs[`${active.id}-${d.day}`]?.steps||0, weight:logs[`${active.id}-${d.day}`]?.weight })).filter(p=>p.steps||p.weight);
  const avgSteps = points.length ? Math.round(points.reduce((a,p)=>a+p.steps,0)/points.length) : 0;
  const completed = active.days.filter(d => (logs[`${active.id}-${d.day}`]?.completed.length||0)>=d.exercises.length).length;
  const max = Math.max(8000,...points.map(p=>p.steps));
  return <><div className="eyebrow">TRENDS · WEEKLY CHECKPOINTS</div><div className="page-heading"><div><h1>Read the trend, not the noise.</h1><p>Daily weight can fluctuate. Review 7-day averages every two weeks.</p></div></div><div className="progress-stats"><article><Trophy/><span>WORKOUTS</span><strong>{completed}<small>/30</small></strong></article><article><Footprints/><span>AVG STEPS</span><strong>{avgSteps.toLocaleString()}</strong></article><article><Droplets/><span>WATER LOGGED</span><strong>{points.filter(p=>logs[`${active.id}-${p.day}`]?.water).length}<small> days</small></strong></article><article><Moon/><span>7H+ SLEEP</span><strong>{active.days.filter(d=>(logs[`${active.id}-${d.day}`]?.sleep||0)>=7).length}<small> days</small></strong></article></div><section className="chart-card"><div className="section-title"><h2>Daily steps</h2><span>Target builds gradually</span></div><div className="bar-chart">{active.days.map(d => { const value=logs[`${active.id}-${d.day}`]?.steps||0; return <div key={d.day} title={`Day ${d.day}: ${value} steps`}><span style={{height:`${Math.max(2,(value/max)*100)}%`}}/><small>{d.day%5===0?d.day:""}</small></div>})}</div></section><section className="checkpoint-grid">{[7,14,21,30].map(day=><article key={day}><span>DAY {day}</span><h3>{day===30?"Month review":"Weekly checkpoint"}</h3><p>Review weight average, navel and waist, adherence, strength notes, skill level, sleep and neck symptoms.</p><button onClick={()=>window.print()}>Print review</button></article>)}</section></>;
}

export function SafetyView() {
  return <><div className="eyebrow">CERVICAL SAFE MODE · EVIDENCE</div><div className="page-heading"><div><h1>Know what to feel—and when to stop.</h1><p>This program supports training decisions. It is not medical treatment or diagnosis.</p></div></div><div className="safety-grid"><article className="normal"><Check/><h2>Normal fatigue</h2><p>Working-muscle burn, symmetrical tiredness, mild next-day soreness that settles, and effort that stops when the set ends.</p></article><article className="modify"><TimerReset/><h2>Modify today</h2><p>Local discomfort, form breaking, rising neck ache, headache, dizziness, or symptoms that worsen with a movement. Reduce range or use the listed replacement.</p></article><article className="stop"><CircleAlert/><h2>Stop + seek advice</h2><p>New or worsening arm/leg weakness, numbness or tingling, severe radiating pain, balance trouble, clumsy hands, coordination change, or bowel/bladder change.</p></article></div><section className="rules-card"><h2>Non-negotiables</h2><div>{["Keep a neutral, comfortable neck where appropriate.","Never force neck range or use jerky movements.","No neck bridges, unsupported headstands, or head-loaded inversions.","Progress wall handstands only if the overhead position is symptom-free.","When in doubt, stop and ask a qualified clinician or physiotherapist."].map(x=><p key={x}><Check/> {x}</p>)}</div></section><div className="section-title sources-title"><h2>Sources & evidence</h2><span>Open the original guidance</span></div><div className="source-grid">{evidence.map((source,i)=><a key={source.title} href={source.url} target="_blank" rel="noreferrer"><span>{String(i+1).padStart(2,"0")}</span><div><h3>{source.title}</h3><p>{source.note}</p></div><ChevronRight/></a>)}</div></>;
}

type SettingsProps = { dark: boolean; safeMode: boolean; monthCount: number; onDark: (v:boolean)=>void; onSafe: (v:boolean)=>void; onBuildMonth:()=>void; onReset:()=>void };
export function SettingsView({dark,safeMode,monthCount,onDark,onSafe,onBuildMonth,onReset}:SettingsProps){
  return <><div className="eyebrow">PROGRAM CONTROL</div><div className="page-heading"><div><h1>Settings & future months.</h1><p>Your plan is local-first and stays on this browser.</p></div></div><div className="settings-grid"><article><div><Moon/><span><h3>Dark mode</h3><p>Use the darker training view.</p></span></div><Switch checked={dark} onCheckedChange={onDark}/></article><article><div><ShieldCheck/><span><h3>Cervical Safe Mode</h3><p>Show cautions and safe replacements.</p></span></div><Switch checked={safeMode} onCheckedChange={onSafe}/></article></div><section className="month-builder"><div><span>NEXT PHASE</span><h2>Build Month {monthCount+1}</h2><p>Creates a fresh 30-day phase from the same Push/Pull/Legs system. It carries the safety rules, raises capacity conservatively, preserves all previous logs, and ends with a deload.</p><ul><li>Same reusable exercise data model</li><li>Progressive sets, leverage and tempo—not weight alone</li><li>Step targets continue from the previous month</li><li>Separate history for every phase</li></ul></div><button className="primary" onClick={onBuildMonth}><Sparkles/> Create Month {monthCount+1}</button></section><section className="danger-zone"><div><h2>Reset all local data</h2><p>Deletes workouts, meals, skills and every generated month from this browser.</p></div><Dialog><DialogTrigger asChild><button><RotateCcw/> Reset program</button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Reset your entire program?</DialogTitle><DialogDescription>This cannot be undone. Your plan returns to Month 1, Day 1.</DialogDescription></DialogHeader><DialogFooter><DialogClose asChild><button className="secondary-button">Cancel</button></DialogClose><DialogClose asChild><button className="danger-button" onClick={onReset}>Yes, reset everything</button></DialogClose></DialogFooter></DialogContent></Dialog></section></>;
}

type PlanMode = "template" | "custom";
export type TrainingLevel = "beginner" | "intermediate" | "active" | "proactive" | "expert";
export type CustomPlan = { id: string; name: string; duration: 1 | 2 | 3; level: TrainingLevel; startDate: string; mode: PlanMode; template?: string; schedule: string[][]; createdAt: string };
export type PlanExercise = { id: string; name: string; sets: number; repRange: string; rest: string; rir: string; cue: string; mistakes: string; easier: string; harder: string; equipment: string; replacement?: string; safeNote?: string };
const planTemplates = [
  ["ppl", "Push · Pull · Legs", "Three workouts distributed across the week"],
  ["fat-loss", "Fat-loss plan", "Strength, steps and bodyweight cardio"],
  ["muscle-gain", "Muscle-gain plan", "Dumbbell and bodyweight strength"],
] as const;
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const workoutOptions = ["Full upper body", "Chest", "Back", "Shoulders", "Arms", "Forearms", "Core", "Full lower body", "Quads", "Hamstrings", "Glutes", "Calves", "Full body", "Cardio", "Stretching"];
const defaultSchedule = [["Full upper body"], ["Full lower body"], ["Cardio"], ["Back"], ["Chest"], ["Full body"], []];
const preplanSchedules: Record<string, string[][]> = { ppl: [["Push"], ["Pull"], ["Legs"], [], ["Push"], ["Pull"], ["Legs"]], "fat-loss": [["Full body"], ["Cardio"], ["Full upper body"], ["Cardio"], ["Full lower body"], ["Cardio"], []], "muscle-gain": [["Push"], ["Pull"], ["Legs"], [], ["Full upper body"], ["Full lower body"], []] };

const focusExercises: Record<string, PlanExercise[]> = {
  "Chest": [{id:"push-up",name:"Push-up",sets:3,repRange:"8–15",rest:"75 sec",rir:"2 RIR",cue:"Keep ribs down and body in one line.",mistakes:"Flaring elbows or sagging hips.",easier:"Incline push-up",harder:"Feet-elevated push-up",equipment:"Floor or bench"},{id:"dumbbell-press",name:"Dumbbell floor press",sets:3,repRange:"8–12",rest:"90 sec",rir:"2 RIR",cue:"Press smoothly with shoulders packed.",mistakes:"Bouncing elbows off the floor.",easier:"Lighter dumbbells",harder:"Slow 3-second lower",equipment:"Dumbbells"},{id:"dumbbell-fly",name:"Dumbbell fly",sets:2,repRange:"10–15",rest:"75 sec",rir:"3 RIR",cue:"Keep a soft elbow and controlled stretch.",mistakes:"Going too deep or shrugging.",easier:"Floor fly, smaller range",harder:"Longer lowering phase",equipment:"Dumbbells"}],
  "Back": [{id:"row",name:"One-arm dumbbell row",sets:3,repRange:"8–12 / side",rest:"75 sec",rir:"2 RIR",cue:"Pull elbow toward hip.",mistakes:"Twisting the torso.",easier:"Supported row",harder:"Pause at the top",equipment:"Dumbbell"},{id:"reverse-fly",name:"Reverse fly",sets:2,repRange:"12–15",rest:"60 sec",rir:"3 RIR",cue:"Move from upper back, neck relaxed.",mistakes:"Shrugging shoulders.",easier:"Lighter dumbbells",harder:"Slow lowering",equipment:"Dumbbells"}],
  "Shoulders": [{id:"shoulder-press",name:"Dumbbell shoulder press",sets:3,repRange:"8–12",rest:"90 sec",rir:"2 RIR",cue:"Keep ribs stacked over hips.",mistakes:"Overarching the lower back.",easier:"Seated press",harder:"Half-kneeling press",equipment:"Dumbbells"},{id:"lateral-raise",name:"Lateral raise",sets:2,repRange:"12–15",rest:"60 sec",rir:"3 RIR",cue:"Lift smoothly to shoulder height.",mistakes:"Swinging the body.",easier:"One arm at a time",harder:"Pause at the top",equipment:"Dumbbells"}],
  "Arms": [{id:"curl",name:"Dumbbell curl",sets:3,repRange:"10–15",rest:"60 sec",rir:"2 RIR",cue:"Keep elbows still.",mistakes:"Swinging weight.",easier:"Lighter dumbbells",harder:"Slow lowering",equipment:"Dumbbells"},{id:"triceps-extension",name:"Overhead triceps extension",sets:3,repRange:"10–15",rest:"60 sec",rir:"2 RIR",cue:"Keep upper arms close to head.",mistakes:"Flaring ribs.",easier:"Single dumbbell",harder:"Pause in stretch",equipment:"Dumbbell"}],
  "Core": [{id:"plank",name:"Forearm plank",sets:3,repRange:"20–40 sec",rest:"45 sec",rir:"Stop before form breaks",cue:"Brace abs and breathe quietly.",mistakes:"Hips sagging or chin poking.",easier:"Knee plank",harder:"Long-lever plank",equipment:"Floor"},{id:"dead-bug",name:"Dead bug",sets:3,repRange:"8–12 / side",rest:"45 sec",rir:"2 RIR",cue:"Keep lower back gently supported.",mistakes:"Rushing the reps.",easier:"Arms only",harder:"Longer lever",equipment:"Floor"}],
  "Full lower body": [{id:"squat",name:"Goblet squat",sets:3,repRange:"8–15",rest:"90 sec",rir:"2 RIR",cue:"Sit between hips with whole foot down.",mistakes:"Knees collapsing inward.",easier:"Bodyweight box squat",harder:"Slow 3-second lower",equipment:"Dumbbell optional"},{id:"rdl",name:"Dumbbell Romanian deadlift",sets:3,repRange:"8–12",rest:"90 sec",rir:"2 RIR",cue:"Hinge hips back, neutral spine.",mistakes:"Turning it into a squat.",easier:"Bodyweight hip hinge",harder:"Single-leg RDL",equipment:"Dumbbells"}],
  "Cardio": [{id:"walk",name:"Brisk walk",sets:1,repRange:"20–35 min",rest:"As needed",rir:"Conversational pace",cue:"Walk tall with relaxed shoulders.",mistakes:"Starting too fast.",easier:"Shorter intervals",harder:"Hills or longer duration",equipment:"None"}],
  "Stretching": [{id:"mobility",name:"Full-body mobility flow",sets:1,repRange:"8–12 min",rest:"Easy breathing",rir:"Comfortable range",cue:"Move slowly; no forced range.",mistakes:"Pushing through pain.",easier:"Shorter range",harder:"Longer holds",equipment:"Mat"}],
};
export function getWorkoutExercises(focus: string) {
  if (focus === "Push") return pushWorkoutIds.map(id => exerciseCatalog.find(exercise => exercise.id === id)!).filter(Boolean);
  const normalized = focus === "Pull" ? ["Back", "Forearms", "Arms"] : focus === "Legs" ? ["Full lower body", "Core"] : focus === "Full upper body" ? ["Chest", "Back", "Shoulders", "Arms"] : focus === "Full body" ? ["Chest", "Back", "Full lower body", "Core"] : [focus];
  const seen = new Set<string>();
  return normalized.flatMap(item => exerciseCatalog.filter(exercise => exercise.focuses.includes(item))).filter(exercise => !seen.has(exercise.id) && !!seen.add(exercise.id));
}
const levelExerciseCount: Record<TrainingLevel, number> = { beginner: 4, intermediate: 6, active: 8, proactive: 11, expert: 15 };
export function getExercisesForFocus(focuses: string[], level: TrainingLevel = "beginner") {
  if (focuses.includes("Push")) return getWorkoutExercises("Push").slice(0, levelExerciseCount[level]);
  const normalized = focuses.flatMap(focus => focus === "Push" ? ["Chest", "Shoulders", "Arms"] : focus === "Pull" ? ["Back", "Forearms", "Arms"] : focus === "Legs" ? ["Full lower body", "Core"] : focus === "Full upper body" ? ["Chest", "Back", "Shoulders", "Arms"] : focus === "Full body" ? ["Chest", "Back", "Full lower body", "Core"] : focus === "Quads" || focus === "Hamstrings" || focus === "Glutes" || focus === "Calves" ? ["Full lower body"] : [focus]);
  const seen = new Set<string>();
  return normalized.flatMap(focus => exerciseCatalog.filter(exercise => exercise.focuses.includes(focus))).filter(exercise => !seen.has(exercise.id) && !!seen.add(exercise.id)).slice(0, focuses.includes("Stretching") ? 9 : Math.min(levelExerciseCount[level], 8));
}
export function getPlanForToday(plans: CustomPlan[], date = new Date()) {
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const matching = plans.filter(plan => { const start = new Date(`${plan.startDate}T00:00:00`).getTime(); return Number.isFinite(start) && start <= today && today - start < plan.duration * 31 * 86400000; }).sort((a, b) => b.startDate.localeCompare(a.startDate))[0];
  if (!matching) return null;
  const weekdayIndex = (date.getDay() + 6) % 7;
  const raw = matching.schedule[weekdayIndex] ?? [];
  return { plan: matching, weekday: weekdays[weekdayIndex], focuses: Array.isArray(raw) ? raw : [raw] };
}

type ExerciseEntry = PlanExercise & { focuses: string[]; videoPlaceholder: string };
const extraExercise = (id: string, name: string, focuses: string[], equipment: string, cue: string): ExerciseEntry => ({ id, name, focuses, equipment, sets: 3, repRange: "8–15", rest: "60–90 sec", rir: "2–3 RIR", cue, mistakes: "Rushing the rep or losing a stable body position.", easier: "Use less range, lighter dumbbells, or an easier bodyweight variation.", harder: "Slow the lowering phase or add a controlled pause.", videoPlaceholder: "YouTube technique video — link to be added" });
const exerciseCatalog: ExerciseEntry[] = [
  ...Object.entries(focusExercises).flatMap(([focus, exercises]) => exercises.map(exercise => ({ ...exercise, focuses: [focus], videoPlaceholder: "YouTube technique video — link to be added" }))),
  extraExercise("incline-push-up", "Incline push-up", ["Chest"], "Bodyweight", "Hands elevated; keep your body in one straight line."),
  extraExercise("incline-db-press", "Incline dumbbell press", ["Chest"], "Dumbbells", "Press up and slightly in while keeping shoulders down and back."),
  extraExercise("flat-db-press", "Flat dumbbell press", ["Chest"], "Dumbbells", "Lower with control and press from a stable shoulder position."),
  extraExercise("close-grip-db-press", "Close-grip dumbbell press", ["Chest", "Arms"], "Dumbbells", "Keep dumbbells close together and elbows controlled by the ribs."),
  extraExercise("incline-db-fly", "Incline dumbbell fly", ["Chest"], "Dumbbells", "Use a soft elbow and stop the stretch before shoulders roll forward."),
  extraExercise("overhead-db-extension", "Overhead dumbbell triceps extension", ["Arms"], "Dumbbell", "Keep elbows pointing forward and ribs stacked."),
  extraExercise("diamond-push-up", "Diamond push-up", ["Chest", "Arms"], "Bodyweight", "Keep hands close under the chest; control the elbows."),
  extraExercise("pike-push-up", "Pike push-up", ["Shoulders"], "Bodyweight", "Hips high; lower the crown toward the floor without collapsing."),
  extraExercise("front-raise", "Dumbbell front raise", ["Shoulders"], "Dumbbells", "Raise with soft elbows and a steady torso."),
  extraExercise("rear-delt-fly", "Dumbbell rear-delt fly", ["Shoulders", "Back"], "Dumbbells", "Hinge lightly and sweep arms wide without shrugging."),
  extraExercise("hammer-curl", "Hammer curl", ["Arms", "Forearms"], "Dumbbells", "Keep palms facing in and elbows near the ribs."),
  extraExercise("triceps-kickback", "Dumbbell triceps kickback", ["Arms"], "Dumbbells", "Hold upper arm still and fully extend the elbow."),
  extraExercise("wrist-curl", "Dumbbell wrist curl", ["Forearms"], "Dumbbells", "Move only at the wrist with the forearm supported."),
  extraExercise("reverse-wrist-curl", "Reverse wrist curl", ["Forearms"], "Dumbbells", "Use a small controlled range with palms down."),
  extraExercise("bodyweight-squat", "Bodyweight squat", ["Full lower body", "Quads"], "Bodyweight", "Keep whole foot grounded and knees tracking comfortably."),
  extraExercise("reverse-lunge", "Reverse lunge", ["Full lower body", "Quads", "Glutes"], "Bodyweight or dumbbells", "Step back softly and keep front knee stable."),
  extraExercise("glute-bridge", "Glute bridge", ["Full lower body", "Glutes"], "Bodyweight or dumbbell", "Drive through heels and pause when hips are level."),
  extraExercise("calf-raise", "Standing calf raise", ["Full lower body", "Calves"], "Bodyweight or dumbbells", "Pause at the top and lower fully with control."),
  extraExercise("wall-sit", "Wall sit", ["Full lower body", "Quads"], "Bodyweight", "Keep back supported and knees comfortable."),
  extraExercise("superman", "Prone Superman hold", ["Back"], "Bodyweight", "Lift gently from upper back and glutes; keep neck long."),
  extraExercise("bird-dog", "Bird dog", ["Core", "Back"], "Bodyweight", "Reach long without twisting the hips."),
  extraExercise("mountain-climber", "Mountain climber", ["Core", "Cardio"], "Bodyweight", "Keep shoulders over hands and move under control."),
  extraExercise("bear-crawl", "Bear crawl", ["Core", "Full body"], "Bodyweight", "Keep knees low and take slow, quiet steps."),
  extraExercise("jumping-jack", "Jumping jack", ["Cardio"], "Bodyweight", "Land softly and maintain a relaxed rhythm."),
  extraExercise("high-knees", "High knees", ["Cardio"], "Bodyweight", "Stay tall and use a pace you can control."),
  extraExercise("burpee", "Step-back burpee", ["Cardio", "Full body"], "Bodyweight", "Step back instead of jumping if impact is uncomfortable."),
  extraExercise("suitcase-carry", "Dumbbell suitcase carry", ["Core", "Forearms"], "Dumbbell", "Stand tall and resist leaning toward the weight."),
  extraExercise("cobra-pose", "Cobra pose", ["Stretching"], "Bodyweight", "Lift the chest gently with shoulders relaxed; stop before neck compression."),
  extraExercise("child-pose", "Child’s pose", ["Stretching"], "Bodyweight", "Reach forward comfortably and breathe into the ribs."),
  extraExercise("cat-cow", "Cat–cow", ["Stretching"], "Bodyweight", "Move smoothly through the spine without throwing the head back."),
  extraExercise("worlds-greatest-stretch", "World’s Greatest Stretch", ["Stretching"], "Bodyweight", "Use a controlled lunge and rotate through the upper back."),
  extraExercise("butterfly-stretch", "Butterfly stretch", ["Stretching"], "Bodyweight", "Sit tall and let knees lower without forcing them."),
  extraExercise("hip-rotation", "90/90 hip rotation", ["Stretching"], "Bodyweight", "Rotate hips slowly while keeping the movement comfortable."),
  extraExercise("open-book", "Open-book thoracic rotation", ["Stretching"], "Bodyweight", "Keep knees stacked and rotate through the upper back."),
  extraExercise("wall-slide", "Wall slide", ["Stretching"], "Bodyweight", "Slide forearms upward without shrugging or pushing the chin forward."),
  extraExercise("chin-tuck", "Gentle chin tuck", ["Stretching"], "Bodyweight", "Make a small, pain-free nod; do not force your neck range."),
];
const pushWorkoutIds = ["incline-db-press", "flat-db-press", "dumbbell-press", "push-up", "close-grip-db-press", "incline-db-fly", "dumbbell-fly", "lateral-raise", "shoulder-press", "pike-push-up", "front-raise", "diamond-push-up", "overhead-db-extension", "triceps-extension", "triceps-kickback"];

function usePlans() { return useStored<CustomPlan[]>("lean-created-plans-v1", []); }
function formatDate(date: string) { return date ? new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${date}T00:00:00`)) : "Start date not set"; }

export function YourPlansView({ onCreate }: { onCreate: () => void }) {
  const [plans, setPlans] = usePlans();
  return <><div className="eyebrow">YOUR TRAINING LIBRARY</div><div className="page-heading"><div><h1>Your plans.</h1><p>Create up to three months at a time. Each plan starts on the date you choose.</p></div><button className="primary" onClick={onCreate}><Plus /> Create plan</button></div>{plans.length === 0 ? <section className="plans-empty"><Dumbbell /><h2>Your first plan starts here.</h2><p>Choose a proven template or map your own weekly workout split. Exercises come in the next step.</p><button className="primary" onClick={onCreate}>Create a plan <ChevronRight /></button></section> : <div className="created-plan-list">{plans.map(plan => <article key={plan.id}><div className="plan-card-icon"><CalendarDays /></div><div><span>{plan.mode === "template" ? "PRE-PLANNED" : "CUSTOM WORKOUT SPLIT"}</span><h2>{plan.name}</h2><p>Starts {formatDate(plan.startDate)} · {plan.duration} {plan.duration === 1 ? "month" : "months"} · {plan.level ?? "beginner"}</p><div className="plan-mini-schedule">{plan.schedule.map((focus, i) => <small key={`${plan.id}-${i}`}><b>{weekdays[i].slice(0, 3)}</b><em>{(Array.isArray(focus) ? focus : [focus]).join(" · ") || "Rest day"}</em></small>)}</div></div><button className="delete-plan" aria-label={`Delete ${plan.name}`} onClick={() => setPlans(current => current.filter(item => item.id !== plan.id))}><Trash2 /></button></article>)}</div>}</>;
}

export function CreatePlanView({ onCreated }: { onCreated: () => void }) {
  const [, setPlans] = usePlans();
  const [mode, setMode] = useState<PlanMode>("template");
  const [duration, setDuration] = useState<1 | 2 | 3>(1);
  const [level, setLevel] = useState<TrainingLevel>("beginner");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [template, setTemplate] = useState<string>(planTemplates[0][0]);
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState(defaultSchedule);
  const selectedTemplate = planTemplates.find(item => item[0] === template)!;
  const save = () => {
    const plan: CustomPlan = { id: crypto.randomUUID(), name: name.trim() || (mode === "template" ? selectedTemplate[1] : "My custom training plan"), duration, level, startDate, mode, template: mode === "template" ? template : undefined, schedule: mode === "template" ? preplanSchedules[template] : schedule, createdAt: new Date().toISOString() };
    let current: CustomPlan[] = []; try { current = JSON.parse(localStorage.getItem("lean-created-plans-v1") ?? "[]"); } catch {} const next = [plan, ...current]; localStorage.setItem("lean-created-plans-v1", JSON.stringify(next)); setPlans(next); window.dispatchEvent(new Event("lean-plans-changed")); onCreated();
  };
  const addFocus = (dayIndex: number, focus: string) => { if (!focus || schedule[dayIndex].includes(focus)) return; setSchedule(current => current.map((day, index) => index === dayIndex ? [...day, focus] : day)); };
  const removeFocus = (dayIndex: number, focus: string) => setSchedule(current => current.map((day, index) => index === dayIndex ? day.filter(item => item !== focus) : day));
  return <><div className="eyebrow">PLAN BUILDER · STEP 1 OF 2</div><div className="page-heading"><div><h1>Create a training plan.</h1><p>Pre-plans distribute workouts for you; custom plans let you choose workouts for each day.</p></div></div><section className="plan-builder"><div className="plan-mode-toggle"><button className={mode === "template" ? "active" : ""} onClick={() => setMode("template")}><Sparkles /><span><b>Use a pre-planned path</b><small>Push/Pull/Legs, fat loss or muscle gain</small></span></button><button className={mode === "custom" ? "active" : ""} onClick={() => setMode("custom")}><CalendarDays /><span><b>Customize my week</b><small>Choose one or more workouts for every day</small></span></button></div><div className="plan-basics"><label>Plan name <input value={name} onChange={e => setName(e.target.value)} placeholder={mode === "template" ? selectedTemplate[1] : "e.g. My strength block"} /></label><label>Duration <select value={duration} onChange={e => setDuration(+e.target.value as 1 | 2 | 3)}><option value="1">1 month</option><option value="2">2 months</option><option value="3">3 months</option></select></label><label>Start date <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></label><label>Training level <select value={level} onChange={e => setLevel(e.target.value as TrainingLevel)}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="active">Active</option><option value="proactive">Proactive</option><option value="expert">Expert</option></select></label></div>{mode === "template" ? <div className="template-picker"><h2>Choose a pre-planned path</h2><p>Mastery paths stay separate in the Mastery section.</p><div>{planTemplates.map(item => <button key={item[0]} className={template === item[0] ? "selected" : ""} onClick={() => setTemplate(item[0])}><span><b>{item[1]}</b><small>{item[2]}</small></span>{template === item[0] && <Check />}</button>)}</div></div> : <div className="weekly-customizer"><div className="section-title"><div><h2>Build your weekly split</h2><span>Add one or more workouts to a day. No tag means rest day.</span></div></div>{weekdays.map((day, index) => <div className="custom-day" key={day}><b>{day}</b><div><div className="focus-tags">{schedule[index].map(focus => <span key={focus}>{focus}<button aria-label={`Remove ${focus} from ${day}`} onClick={() => removeFocus(index, focus)}><X /></button></span>)}</div><div className="focus-add"><select defaultValue=""><option value="" disabled>Select workout</option>{workoutOptions.filter(focus => !schedule[index].includes(focus)).map(focus => <option key={focus}>{focus}</option>)}</select><button onClick={event => { const select = event.currentTarget.previousElementSibling as HTMLSelectElement; addFocus(index, select.value); select.value = ""; }}><Plus /> Add</button></div></div></div>)}</div>}<div className="plan-builder-footer"><span><CalendarDays /> Starts {formatDate(startDate)} · {duration} {duration === 1 ? "month" : "months"} · {level}</span><button className="primary" onClick={save}>Create plan <ChevronRight /></button></div></section></>;
}

const masteryPlans = [
  { id: "ppl-bodyweight", name: "Push · Pull · Legs", detail: "Bodyweight strength foundation", rhythm: ["Push", "Pull", "Legs", "Recovery", "Push", "Pull", "Rest"] },
  { id: "ppl-dumbbell", name: "Dumbbell PPL", detail: "Balanced strength with dumbbells", rhythm: ["Push", "Pull", "Legs", "Recovery", "Push", "Pull", "Rest"] },
  { id: "fat-loss", name: "Fat-loss foundation", detail: "Strength, steps and sustainable cardio", rhythm: ["Full body", "Cardio", "Upper", "Recovery", "Lower", "Cardio", "Rest"] },
  { id: "calisthenics", name: "Calisthenics mastery", detail: "Skills, strength and body control", rhythm: ["Push", "Pull", "Legs", "Skills", "Upper", "Full body", "Rest"] },
  { id: "pushup", name: "Push-up mastery", detail: "Progress toward one high-rep set", rhythm: ["Technique", "Rest", "Volume", "Rest", "Strength", "Recovery", "Rest"] },
];

function PlanDetail({ name, detail, rhythm, onBack }: { name: string; detail: string; rhythm: string[]; onBack: () => void }) {
  return <><button className="back-button" onClick={onBack}>← Back to library</button><div className="skill-hero"><div><span>PROGRAM OVERVIEW</span><h2>{name}</h2><p>{detail}. Choose this programme when you are ready; exercises and daily prescriptions are added in the next step.</p></div><div><strong>7<small> days</small></strong><span>weekly rhythm</span></div></div><section className="program-week"><div className="section-title"><h2>Weekly rhythm</h2><span>Repeat and progress</span></div>{rhythm.map((focus, index) => <article key={`${focus}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{weekdays[index].toUpperCase()}</small><h3>{focus}</h3><p>Exercise choices and progression will appear here.</p></div><ChevronRight /></article>)}</section></>;
}

function MasteryDetail({ plan, onBack }: { plan: typeof masteryPlans[number]; onBack: () => void }) {
  const [done, setDone] = useStored<string[]>(`lean-mastery-${plan.id}-v1`, []);
  const stages = getExercisesForFocus(plan.id === "pushup" ? ["Chest"] : plan.id === "fat-loss" ? ["Full body", "Cardio"] : ["Chest", "Back", "Full lower body", "Core"]);
  const completed = stages.filter(stage => done.includes(stage.id)).length;
  return <><button className="back-button" onClick={onBack}>← Back to Mastery</button><section className="skill-hero"><div><span>MASTERY PATH</span><h2>{plan.name}</h2><p>{plan.detail}. Complete each stage in order to unlock the next one.</p></div><div><strong>{completed}<small> / {stages.length}</small></strong><span>steps unlocked</span></div></section><section className="program-week"><div className="section-title"><h2>Build step by step</h2><span>Clean form first</span></div>{stages.map((stage, index) => { const complete = done.includes(stage.id); const locked = index > completed; return <article className={locked ? "locked-step" : ""} key={stage.id}><button className="check" disabled={locked} aria-label={`Mark ${stage.name} complete`} onClick={() => setDone(current => complete ? current.filter(id => id !== stage.id) : [...current, stage.id])}>{complete ? <Check /> : locked ? <LockKeyhole /> : index + 1}</button><div><small>STEP {index + 1} {complete ? "· COMPLETE" : locked ? "· LOCKED" : "· CURRENT"}</small><h3>{stage.name}</h3><p>{stage.sets} sets · {stage.repRange} · {stage.cue}</p></div><ChevronRight /></article>})}</section></>;
}

export function MasteryView() {
  const [selected, setSelected] = useState<string | null>(null);
  const plan = masteryPlans.find(item => item.id === selected);
  if (plan) return <MasteryDetail plan={plan} onBack={() => setSelected(null)} />;
  return <><div className="eyebrow">PRE-BUILT PROGRAMS</div><div className="page-heading"><div><h1>Mastery paths.</h1><p>Choose a proven structure when you want the app to guide the weekly rhythm.</p></div></div><div className="mastery-grid">{masteryPlans.map((item, index) => <button key={item.id} onClick={() => setSelected(item.id)}><span>{String(index + 1).padStart(2, "0")}</span><h2>{item.name}</h2><p>{item.detail}</p><small>Open programme <ChevronRight /></small></button>)}</div></>;
}

export function WorkoutsView() {
  const [selected, setSelected] = useState<string | null>(null);
  const focuses = ["Push", "Pull", "Legs", ...workoutOptions];
  const exercises = selected ? getWorkoutExercises(selected) : [];
  if (selected) return <><button className="back-button" onClick={() => setSelected(null)}>← Back to workouts</button><div className="skill-hero"><div><span>CUSTOM WORKOUT</span><h2>{selected}</h2><p>These exercises are available for this focus. The next build step will let you choose, order and prescribe them inside a plan day.</p></div><div><strong>{exercises.length}<small> moves</small></strong><span>exercise options</span></div></div><section className="program-week"><div className="section-title"><h2>Exercise options</h2><span>Pick later when building the day</span></div>{exercises.length ? exercises.map((exercise, index) => <article key={exercise.id}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{exercise.equipment.toUpperCase()}</small><h3>{exercise.name}</h3><p>{exercise.sets} sets · {exercise.repRange} · {exercise.cue}</p></div><ChevronRight /></article>) : <p className="empty-copy">No exercise list is set for this focus yet.</p>}</section></>;
  return <><div className="eyebrow">WORKOUT LIBRARY</div><div className="page-heading"><div><h1>Workouts.</h1><p>Use these cards in a custom plan. Push, Pull and Legs are built from the smaller muscle-focused workouts below.</p></div></div><div className="mastery-grid">{focuses.map((focus, index) => <button key={focus} onClick={() => setSelected(focus)}><span>{String(index + 1).padStart(2, "0")}</span><h2>{focus}</h2><p>{getWorkoutExercises(focus).length} available exercise options</p><small>Open workout <ChevronRight /></small></button>)}</div></>;
}

const exerciseLibrary = [
  ["Push-up", "Chest · triceps · shoulders", "Used in Push-up Mastery, Push days and chest-focused custom workouts."],
  ["Row", "Back · biceps", "Used in Pull days and back-focused custom workouts."],
  ["Squat", "Quads · glutes · core", "Used in Legs, lower-body and full-body workouts."],
  ["Plank", "Core · shoulder control", "Used across full-body, calisthenics and core-focused workouts."],
  ["Walking / cardio", "Heart health · conditioning", "Used in Fat-loss Foundation and cardio days."],
];
export function ExercisesView() {
  const [selectedFocus, setSelectedFocus] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const focuses = ["All", ...workoutOptions];
  const visible = selectedFocus === "All" ? exerciseCatalog : exerciseCatalog.filter(exercise => exercise.focuses.includes(selectedFocus) || (selectedFocus === "Full upper body" && exercise.focuses.some(focus => ["Chest", "Back", "Shoulders", "Arms"].includes(focus))) || (selectedFocus === "Full body" && exercise.focuses.some(focus => ["Chest", "Back", "Full lower body", "Core"].includes(focus))));
  const selected = exerciseCatalog.find(exercise => exercise.id === selectedId);
  return <><div className="eyebrow">BODYWEIGHT + DUMBBELL EXERCISE LIBRARY</div><div className="page-heading"><div><h1>Exercises.</h1><p>These are the building blocks. Workouts combine exercises; pre-plans distribute workouts across the week.</p></div></div><div className="exercise-filter" role="tablist" aria-label="Exercise focus">{focuses.map(focus => <button key={focus} className={selectedFocus === focus ? "active" : ""} onClick={() => setSelectedFocus(focus)}>{focus}</button>)}</div><div className="exercise-card-grid">{visible.map(exercise => <article className="exercise-library-card" key={exercise.id}><div><span>{exercise.equipment}</span><h2>{exercise.name}</h2><p>{exercise.focuses.join(" · ")}</p></div><button onClick={() => setSelectedId(exercise.id)}>Technique <ChevronRight /></button></article>)}</div><Dialog open={!!selected} onOpenChange={open => !open && setSelectedId(null)}>{selected && <DialogContent className="exercise-modal"><DialogHeader><span className="exercise-modal-kicker">{selected.equipment} · {selected.focuses.join(" · ")}</span><DialogTitle>{selected.name}</DialogTitle><DialogDescription>{selected.cue}</DialogDescription></DialogHeader><div className="technique-details"><section><b>How to do it</b><p>{selected.cue}</p></section><section><b>Common mistake</b><p>{selected.mistakes}</p></section><section><b>Make it easier</b><p>{selected.easier}</p></section><section><b>Progress it</b><p>{selected.harder}</p></section></div><div className="video-placeholder"><ExternalLink /><div><b>{selected.videoPlaceholder}</b><small>You can add the verified YouTube URL later.</small></div></div><DialogFooter><DialogClose asChild><button className="secondary-button">Close</button></DialogClose></DialogFooter></DialogContent>}</Dialog></>;
}
