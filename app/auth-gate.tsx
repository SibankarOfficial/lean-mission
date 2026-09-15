"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { CheckCircle2, CircleAlert, LockKeyhole, LogIn, LogOut, Mail, UserPlus } from "lucide-react";
import { supabase, supabaseConfigured } from "./supabase";

type AuthGateProps = { children: ReactNode };

export function AuthGate({ children }: AuthGateProps) {
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
    event.preventDefault();
    if (!supabase) return;
    if (password.length < 6) { setMessage("Password কমপক্ষে 6 characters হতে হবে।"); return; }
    setWorking(true); setMessage("");
    const response = mode === "signup"
      ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } })
      : await supabase.auth.signInWithPassword({ email, password });
    setWorking(false);
    if (response.error) { setMessage(response.error.message); return; }
    if (mode === "signup" && !response.data.session) setMessage("Verification email পাঠানো হয়েছে। Email confirm করে আবার লগ-ইন করুন।");
    else setMessage("");
  };

  if (loading) return <main className="auth-loading"><span className="brand-mark"><CheckCircle2 /></span><p>Loading your Lean Mission…</p></main>;
  if (!supabaseConfigured) return <main className="auth-loading"><CircleAlert /><p>Supabase configuration পাওয়া যায়নি। `.env.local` file check করুন।</p></main>;
  if (!user) return <main className="auth-page"><section className="auth-card"><div className="auth-brand"><span className="brand-mark"><CheckCircle2 /></span><div><b>Lean Mission</b><small>Personal fitness, on every device</small></div></div><div className="auth-copy"><span>{mode === "login" ? "WELCOME BACK" : "START YOUR ACCOUNT"}</span><h1>{mode === "login" ? "Pick up where you left off." : "Create your fitness space."}</h1><p>{mode === "login" ? "Log in to keep your personal plan ready for cloud sync." : "Use an email and password. You will confirm your email once."}</p></div><form onSubmit={submit}><label>Email address<div><Mail /><input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></div></label><label>Password<div><LockKeyhole /><input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 6 characters" /></div></label>{message && <p className="auth-message">{message}</p>}<button className="auth-submit" disabled={working}>{mode === "login" ? <LogIn /> : <UserPlus />}{working ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}</button></form><button className="auth-switch" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage(""); }}>{mode === "login" ? "New here? Create an account" : "Already have an account? Log in"}</button></section></main>;
  return <>{children}<div className="account-chip"><Mail /><span>{user.email}</span><button aria-label="Log out" onClick={() => supabase?.auth.signOut()}><LogOut /></button></div></>;
}
