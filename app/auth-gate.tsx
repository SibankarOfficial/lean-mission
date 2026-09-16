"use client";

import { FormEvent, ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { CheckCircle2, CircleAlert, LockKeyhole, LogIn, Mail, Ruler, UserPlus } from "lucide-react";
import { supabase, supabaseConfigured } from "./supabase";

export type FitnessProfile = { fullName: string; age: string; sex: string; heightCm: string; weightKg: string; waistIn: string; bellyIn: string; activity: string; goal: string; experience: string; healthNote: string };
type AuthContextValue = { user: User; profile: FitnessProfile; saveProfile: (profile: FitnessProfile, completeOnboarding?: boolean) => Promise<string | null>; signOut: () => Promise<void> };
const AuthContext = createContext<AuthContextValue | null>(null);
const blankProfile: FitnessProfile = { fullName: "", age: "", sex: "", heightCm: "", weightKg: "", waistIn: "", bellyIn: "", activity: "light", goal: "fat_loss", experience: "beginner", healthNote: "" };

function profileFromUser(user: User): FitnessProfile {
  const metadata = user.user_metadata ?? {};
  return { ...blankProfile, ...Object.fromEntries(Object.keys(blankProfile).map(key => [key, String(metadata[key] ?? blankProfile[key as keyof FitnessProfile])])) } as FitnessProfile;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthGate");
  return context;
}

function Onboarding({ profile, saveProfile }: Pick<AuthContextValue, "profile" | "saveProfile">) {
  const [form, setForm] = useState(profile);
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [working, setWorking] = useState(false);
  const set = (key: keyof FitnessProfile, value: string) => setForm(current => ({ ...current, [key]: value }));
  const next = () => {
    if (!form.fullName.trim() || !form.age || !form.heightCm || !form.weightKg) { setMessage("Name, age, height, and weight দেওয়া দরকার।"); return; }
    setMessage(""); setStep(2);
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setWorking(true); setMessage("");
    const error = await saveProfile(form, true);
    setWorking(false); if (error) setMessage(error);
  };
  return <main className="onboarding-page"><section className="onboarding-card">
    <div className="auth-brand"><span className="brand-mark"><CheckCircle2 /></span><div><b>Lean Mission</b><small>Your personal fitness space</small></div></div>
    <div className="onboarding-copy"><span>FIRST, A QUICK SETUP</span><h1>Let&apos;s make this plan yours.</h1><p>These details personalize your calorie estimates and give you a useful starting point. You can edit everything later from your profile.</p></div>
    <div className="onboarding-stepper"><span className={step === 1 ? "active" : "done"}>1 <small>About you</small></span><i /><span className={step === 2 ? "active" : ""}>2 <small>Goals</small></span></div>
    <form onSubmit={submit}>{step === 1 ? <div className="onboarding-fields">
      <label>Full name<input autoFocus required value={form.fullName} onChange={e => set("fullName", e.target.value)} placeholder="Your name" /></label>
      <div className="onboarding-grid"><label>Age<input type="number" min="13" max="100" required value={form.age} onChange={e => set("age", e.target.value)} placeholder="e.g. 28" /></label><label>Sex <select value={form.sex} onChange={e => set("sex", e.target.value)}><option value="">Prefer not to say</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></label></div>
      <div className="onboarding-grid"><label>Height (cm)<div className="measure-input"><Ruler /><input type="number" min="100" max="250" required value={form.heightCm} onChange={e => set("heightCm", e.target.value)} placeholder="e.g. 170" /></div></label><label>Weight (kg)<input type="number" min="30" max="300" step=".1" required value={form.weightKg} onChange={e => set("weightKg", e.target.value)} placeholder="e.g. 75" /></label></div>
      <button type="button" className="auth-submit" onClick={next}>Continue</button>
    </div> : <div className="onboarding-fields">
      <label>Primary goal<select value={form.goal} onChange={e => set("goal", e.target.value)}><option value="fat_loss">Fat loss</option><option value="strength">Strength</option><option value="calisthenics">Calisthenics skills</option><option value="general_health">General health</option></select></label>
      <div className="onboarding-grid"><label>Waist (inches, optional)<input type="number" min="15" max="80" step=".1" value={form.waistIn} onChange={e => set("waistIn", e.target.value)} /></label><label>Belly at navel (inches, optional)<input type="number" min="15" max="80" step=".1" value={form.bellyIn} onChange={e => set("bellyIn", e.target.value)} /></label></div>
      <label>Daily activity<select value={form.activity} onChange={e => set("activity", e.target.value)}><option value="sedentary">Mostly sitting</option><option value="light">Lightly active</option><option value="moderate">Moderately active</option><option value="high">Very active</option></select></label>
      <label>Training experience<select value={form.experience} onChange={e => set("experience", e.target.value)}><option value="beginner">Beginner</option><option value="returning">Returning after a break</option><option value="intermediate">Intermediate</option></select></label>
      <label>Injury / health note (optional)<textarea value={form.healthNote} onChange={e => set("healthNote", e.target.value)} placeholder="For example: neck pain, knee issue, or anything to remember" /></label>
      <div className="onboarding-actions"><button type="button" className="secondary-button" onClick={() => setStep(1)}>Back</button><button className="auth-submit" disabled={working}>{working ? "Saving…" : "Create my plan"}</button></div>
    </div>}{message && <p className="auth-message">{message}</p>}</form>
  </section></main>;
}

export function AuthGate({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [working, setWorking] = useState(false);
  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => { setUser(data.session?.user ?? null); setLoading(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user ?? null); setLoading(false); });
    return () => listener.subscription.unsubscribe();
  }, []);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (!supabase) return;
    if (password.length < 6) { setMessage("Password কমপক্ষে 6 characters হতে হবে।"); return; }
    setWorking(true); setMessage("");
    const response = mode === "signup" ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } }) : await supabase.auth.signInWithPassword({ email, password });
    setWorking(false);
    if (response.error) { setMessage(response.error.message); return; }
    if (mode === "signup" && !response.data.session) setMessage("Verification email পাঠানো হয়েছে। Email confirm করে আবার লগ-ইন করুন।");
  };
  const profile = useMemo(() => user ? profileFromUser(user) : blankProfile, [user]);
  const saveProfile = async (nextProfile: FitnessProfile, completeOnboarding = false) => {
    if (!supabase) return "Supabase configuration পাওয়া যায়নি।";
    const { data, error } = await supabase.auth.updateUser({ data: { ...nextProfile, ...(completeOnboarding ? { onboarding_complete: true } : {}) } });
    if (error) return error.message;
    if (data.user) setUser(data.user);
    return null;
  };
  if (loading) return <main className="auth-loading"><span className="brand-mark"><CheckCircle2 /></span><p>Loading your Lean Mission…</p></main>;
  if (!supabaseConfigured) return <main className="auth-loading"><CircleAlert /><p>Supabase configuration পাওয়া যায়নি। `.env.local` file check করুন।</p></main>;
  if (!user) return <main className="auth-page"><section className="auth-card"><div className="auth-brand"><span className="brand-mark"><CheckCircle2 /></span><div><b>Lean Mission</b><small>Personal fitness, on every device</small></div></div><div className="auth-copy"><span>{mode === "login" ? "WELCOME BACK" : "START YOUR ACCOUNT"}</span><h1>{mode === "login" ? "Pick up where you left off." : "Create your fitness space."}</h1><p>{mode === "login" ? "Log in to keep your personal plan ready for cloud sync." : "Use an email and password. You will confirm your email once."}</p></div><form onSubmit={submit}><label>Email address<div><Mail /><input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></div></label><label>Password<div><LockKeyhole /><input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 6 characters" /></div></label>{message && <p className="auth-message">{message}</p>}<button className="auth-submit" disabled={working}>{mode === "login" ? <LogIn /> : <UserPlus />}{working ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}</button></form><button className="auth-switch" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage(""); }}>{mode === "login" ? "New here? Create an account" : "Already have an account? Log in"}</button></section></main>;
  if (!user.user_metadata?.onboarding_complete) return <Onboarding profile={profile} saveProfile={saveProfile} />;
  return <AuthContext.Provider value={{ user, profile, saveProfile, signOut: async () => { await supabase?.auth.signOut(); } }}>{children}</AuthContext.Provider>;
}
