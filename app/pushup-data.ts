export type PushupWeek = {
  week: number;
  phase: string;
  focus: string;
  test?: string;
  sessions: { name: string; prescription: string; note: string }[];
};

const phase = (week: number) => week <= 4 ? "Foundation" : week <= 8 ? "Capacity" : "100-rep preparation";

export const pushupWeeks: PushupWeek[] = [
  { week: 1, phase: phase(1), focus: "Baseline, neutral-neck form and a repeatable regression", test: "One clean max set; stop with form loss or neck/arm symptoms.", sessions: [
    { name: "A · Technique", prescription: "5 × 40% of baseline", note: "Use incline if fewer than 8 floor reps are clean." },
    { name: "B · Easy volume", prescription: "6 × 30%", note: "60–90 sec rest; every rep identical." },
    { name: "C · Density", prescription: "10 min · 2–4 reps/min", note: "Finish fresher than you started." },
  ]},
  { week: 2, phase: phase(2), focus: "Add repeatable reps without reaching failure", sessions: [
    { name: "A · Standard strength", prescription: "5 × 40–45%", note: "Add one rep to only two sets." },
    { name: "B · Incline volume", prescription: "5 × 8–12", note: "Choose a height that leaves 3 reps." },
    { name: "C · Ladder", prescription: "2–3–4–5 × 2 rounds", note: "Reset when speed slows." },
  ]},
  { week: 3, phase: phase(3), focus: "Introduce wide push-ups after standard form", sessions: [
    { name: "A · Standard", prescription: "6 × 40%", note: "2–3 reps in reserve." },
    { name: "B · Wide technique", prescription: "3 × 5 + incline volume", note: "Hands only slightly wider; elbows not flared." },
    { name: "C · Density", prescription: "12 min · 3–5 reps/min", note: "Use regression before form slips." },
  ]},
  { week: 4, phase: phase(4), focus: "Consolidate and re-test", test: "After 48 hours easy: one clean max set; stop 1 rep before breakdown.", sessions: [
    { name: "A · Easy technique", prescription: "4 × 35%", note: "Deload volume." },
    { name: "B · Variation circuit", prescription: "Standard 5 · wide 5 · incline 8 × 3", note: "No failure." },
    { name: "C · Re-test", prescription: "Warm up + one max set", note: "Update baseline only if form is clean." },
  ]},
  { week: 5, phase: phase(5), focus: "Build triceps strength with close-grip work", sessions: [
    { name: "A · Standard volume", prescription: "6 × 45%", note: "90 sec rest." },
    { name: "B · Close-grip / diamond", prescription: "4 × 4–8", note: "Use incline close-grip if wrists or elbows object." },
    { name: "C · EMOM", prescription: "12 min · 35% each minute", note: "Switch to incline as needed." },
    { name: "D · Recovery", prescription: "3 × 8 incline + scapular push-up", note: "Easy movement quality." },
  ]},
  { week: 6, phase: phase(6), focus: "Staggered stance and anti-rotation control", sessions: [
    { name: "A · Standard", prescription: "5 × 50%", note: "Keep hips and head aligned." },
    { name: "B · Staggered", prescription: "3 × 5/side", note: "Small hand offset first." },
    { name: "C · Ladder", prescription: "3–5–7 × 3 rounds", note: "Reduce rung size if grindy." },
    { name: "D · Incline flush", prescription: "40 total easy reps", note: "Break into any clean sets." },
  ]},
  { week: 7, phase: phase(7), focus: "Shoulder stability and controlled tempo", sessions: [
    { name: "A · Tempo standard", prescription: "5 × 40% · 3-sec down", note: "Do not reach the chin forward." },
    { name: "B · Push-up + shoulder tap", prescription: "4 × 4–8", note: "Widen feet; minimize torso rotation." },
    { name: "C · Density", prescription: "15 min · sustainable mini-sets", note: "Target 55–75 total depending baseline." },
    { name: "D · Easy variation", prescription: "Wide + close-grip · 3 rounds", note: "Half normal set each style." },
  ]},
  { week: 8, phase: phase(8), focus: "Deload, then assess halfway capacity", test: "One clean max set; if below Week 4, repeat Weeks 5–7 with 15% less volume.", sessions: [
    { name: "A · Deload", prescription: "4 × 30–35%", note: "Fast, easy reps." },
    { name: "B · Technique", prescription: "3 easy variation rounds", note: "No advanced work." },
    { name: "C · Re-test", prescription: "Warm up + one max set", note: "No second attempt." },
  ]},
  { week: 9, phase: phase(9), focus: "Higher total volume without daily maxing", sessions: [
    { name: "A · Volume", prescription: "8 × 40%", note: "2 min rest if needed." },
    { name: "B · Decline introduction", prescription: "3 × 4–8 + standard back-off", note: "Low foot elevation; skip if neck position changes." },
    { name: "C · 20-minute density", prescription: "Target 75–100 total", note: "Small sets; incline finish is allowed." },
    { name: "D · Easy 50", prescription: "50 total incline/standard", note: "Never to failure." },
  ]},
  { week: 10, phase: phase(10), focus: "Assisted archer control; endurance stays primary", sessions: [
    { name: "A · Standard", prescription: "6 × 50%", note: "Quality first." },
    { name: "B · Assisted archer", prescription: "4 × 3–5/side", note: "Use a high surface and short range." },
    { name: "C · Ladder", prescription: "5–10–15, repeat sustainably", note: "Regression permitted on later rounds." },
    { name: "D · Long-set practice", prescription: "1 × 70–80% max + 4 back-off sets", note: "Not a max test." },
  ]},
  { week: 11, phase: phase(11), focus: "Peak volume and optional controlled explosive work", sessions: [
    { name: "A · Volume peak", prescription: "100 total across clean sets", note: "This is not 100 unbroken." },
    { name: "B · Hand-release / pop", prescription: "5 × 3–5", note: "Only if wrists, shoulders and neck are symptom-free; no clap required." },
    { name: "C · EMOM", prescription: "20 min · sustainable reps", note: "Stop before rep speed collapses." },
    { name: "D · Easy technique", prescription: "30–40 relaxed reps", note: "Prepare for taper." },
  ]},
  { week: 12, phase: phase(12), focus: "Taper and 100-rep goal assessment", test: "Attempt 100 unbroken only if 60+ clean reps is already comfortable and there are no symptoms. Otherwise record a new clean best.", sessions: [
    { name: "A · Taper", prescription: "4 × 30%", note: "Easy and crisp." },
    { name: "B · Primer", prescription: "3 × 20% + mobility", note: "Finish 48–72 hours before test." },
    { name: "C · Goal test", prescription: "One clean max set", note: "Stop for form breakdown, pain, tingling, weakness or head-forward posture." },
  ]},
];

export const pushupVariations = [
  { name: "Wall / high incline", unlock: "Start here if floor reps are under 5", level: "Regression" },
  { name: "Low incline", unlock: "3 × 12 clean", level: "Foundation" },
  { name: "Knee push-up", unlock: "3 × 10 clean", level: "Foundation" },
  { name: "Standard / normal chest", unlock: "10 clean continuous reps", level: "Core" },
  { name: "Wide push-up", unlock: "15 clean standard reps", level: "Variation" },
  { name: "Close-grip / diamond", unlock: "20 clean standard reps", level: "Variation" },
  { name: "Staggered push-up", unlock: "25 clean standard reps", level: "Control" },
  { name: "Push-up + shoulder tap", unlock: "30 reps + steady plank", level: "Control" },
  { name: "Low decline push-up", unlock: "35 clean reps, symptom-free neck", level: "Strength" },
  { name: "Assisted archer", unlock: "40 clean reps + 10 staggered/side", level: "Advanced" },
  { name: "Hand-release / controlled pop", unlock: "50 clean reps; pain-free wrists", level: "Power" },
  { name: "100-rep test", unlock: "60+ clean max and Week 11 volume tolerated", level: "Goal" },
];
