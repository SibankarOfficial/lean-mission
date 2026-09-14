export type Exercise = {
  id: string;
  name: string;
  sets: number;
  repRange: string;
  rest: string;
  rir: string;
  equipment: string;
  cue: string;
  mistakes: string;
  easier: string;
  harder: string;
  safeNote?: string;
  replacement?: string;
};

export type ProgramDay = {
  day: number;
  type: string;
  focus: string;
  stepTarget: number;
  skillMinutes: number;
  recovery: string;
  exercises: Exercise[];
  checkpoint?: boolean;
};

export type ProgramMonth = {
  id: string;
  month: number;
  name: string;
  phase: string;
  days: ProgramDay[];
};

const ex = (
  id: string,
  name: string,
  sets: number,
  repRange: string,
  cue: string,
  easier: string,
  harder: string,
  safeNote?: string,
  replacement?: string,
  equipment = "Bodyweight",
  rest = "60–90 sec",
): Exercise => ({
  id, name, sets, repRange, rest, rir: "Stop with 2–3 good reps left", equipment,
  cue, mistakes: "Rushing reps, losing body position, or pushing through sharp pain.",
  easier, harder, safeNote, replacement,
});

const push = [
  ex("incline-pushup", "Incline push-up", 3, "8–12", "Brace, lower chest to the edge, keep head in line with ribs.", "Use a higher surface", "Lower the surface or add a 2-sec pause", "Keep the neck long; do not reach the chin forward."),
  ex("db-floor-press", "Dumbbell floor press", 3, "10–15", "Press both 5 kg dumbbells while keeping ribs down.", "Alternate arms", "3-sec lowering", "Support the head comfortably; stop if arm symptoms increase.", "Incline wall push-up", "2 × 5 kg dumbbells"),
  ex("scap-pushup", "Scapular push-up", 2, "8–12", "With straight elbows, let shoulder blades glide then push the floor away.", "Wall scapular push-up", "Plank scapular push-up", "Move only through a comfortable range; keep gaze between hands."),
  ex("lateral-raise", "Dumbbell lateral raise", 2, "10–15", "Raise only to a comfortable height with soft elbows.", "One arm at a time", "1.5 reps", "No shrugging or head tilt.", "Wall slide", "2 × 5 kg dumbbells"),
];

const pull = [
  ex("one-arm-row", "Supported one-arm row", 3, "10–15/side", "Support one hand, pull elbow toward hip, pause at the top.", "Shorten range", "3-sec lowering or 1.5 reps", "Keep neck neutral and torso supported.", "Towel isometric row", "1 × 5 kg dumbbell"),
  ex("db-pullover", "Dumbbell pullover on floor", 2, "8–12", "Keep ribs down and move only through pain-free shoulder range.", "Shorter range", "Slow 4-sec lowering", "Avoid forcing the arms overhead or arching the neck.", "Prone W raise", "1 × 5 kg dumbbell"),
  ex("prone-w", "Prone W raise", 3, "8–12", "Forehead on folded towel; gently lift elbows and squeeze shoulder blades.", "Standing wall W", "Add a 2-sec hold", "Do not lift the head to look forward."),
  ex("hammer-curl", "Hammer curl", 2, "10–15", "Elbows stay near ribs; control the lowering.", "Alternating curl", "Slow eccentric", "Keep shoulders relaxed.", undefined, "2 × 5 kg dumbbells"),
];

const legs = [
  ex("goblet-squat", "Goblet squat", 3, "10–15", "Sit between hips, keep full-foot pressure, stand tall.", "Chair squat", "Pause squat or 1.5 reps", "Hold weight at chest without craning the neck.", undefined, "1 × 5 kg dumbbell"),
  ex("split-squat", "Supported split squat", 3, "8–12/side", "Use a wall for balance; lower straight down.", "Shallow split squat", "Rear-foot elevated only if stable", "Keep gaze level; stop if balance or neurological symptoms change."),
  ex("db-rdl", "Dumbbell Romanian deadlift", 3, "10–15", "Push hips back with a long spine; feel hamstrings.", "Bodyweight hip hinge", "Single-leg kickstand RDL", "Neck stays in line with torso; do not look up.", undefined, "2 × 5 kg dumbbells"),
  ex("dead-bug", "Dead bug", 3, "6–10/side", "Exhale, keep ribs heavy, move opposite arm and leg slowly.", "Heel taps", "Longer lever with 3-sec exhale", "Use a small head support if comfortable; no forced chin tuck."),
];

const full = [push[0], pull[0], legs[0], legs[2], ex("side-plank", "Knee side plank", 2, "20–35 sec/side", "Stack shoulder over elbow and keep a straight line from knee to head.", "Shorter hold", "Straight-leg side plank", "Keep head aligned; stop for radiating symptoms.")];

const recoveryMoves = [
  ex("walk", "Comfortable walk", 1, "20–35 min", "Use a pace where short sentences are comfortable.", "Two 10-min walks", "Add 5 minutes, not speed", "Keep a relaxed, upright gaze."),
  ex("thoracic-rotation", "Open-book thoracic rotation", 2, "6/side", "Rotate through upper back while knees stay stacked.", "Smaller range", "Longer exhale at end range", "Let eyes follow only if comfortable; never force the neck."),
  ex("hip-flexor", "Half-kneeling hip-flexor stretch", 2, "30 sec/side", "Tuck pelvis gently and shift forward.", "Standing split-stance stretch", "Add overhead reach if symptom-free", "Keep chin level and ribs down."),
];

const rotations = [
  ["Push · Foundation", push], ["Pull · Posture", pull], ["Legs + Core", legs],
  ["Active recovery", recoveryMoves], ["Push · Control", [...push.slice(0, 3), ex("pike-hold", "Elevated pike hold", 3, "15–25 sec", "Push the surface away and keep ears between arms.", "Down-dog weight shift", "Feet-elevated pike hold", "Skip if overhead position causes neck or arm symptoms.", "Incline plank")]],
  ["Full body", full], ["Recovery + review", recoveryMoves.slice(1)],
] as const;

export function createMonth(month: number): ProgramMonth {
  const phase = month === 1 ? "Foundation & consistency" : month === 2 ? "Capacity & control" : "Strength & skill consolidation";
  const days = Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;
    const week = Math.floor(index / 7);
    const [type, base] = rotations[index % 7];
    const deload = day >= 27;
    const exercises = base.map((item, exerciseIndex) => ({
      ...item,
      id: `${item.id}-m${month}-d${day}`,
      sets: Math.max(1, item.sets + (month > 1 && exerciseIndex < 2 ? 1 : 0) + (week >= 2 && !deload && item.sets > 1 ? 1 : 0) - (deload && item.sets > 1 ? 1 : 0)),
      rir: deload ? "Easy technique work · leave 4 reps" : week === 0 ? "Leave 3 good reps" : week === 1 ? "Leave 2–3 good reps" : "Leave 1–2 good reps only with perfect form",
    }));
    const stepRamp = [3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000];
    const stepIndex = Math.min(stepRamp.length - 1, Math.floor((index + (month - 1) * 8) / 3));
    return {
      day, type, focus: deload ? `${type} · deload` : `${type} · week ${week + 1}`,
      stepTarget: stepRamp[stepIndex],
      skillMinutes: index % 7 === 3 || index % 7 === 6 ? 6 : 10,
      recovery: index % 7 === 3 || index % 7 === 6 ? "8-min mobility + 5-min slow breathing" : "5-min cool-down walk",
      exercises,
      checkpoint: [7, 14, 21, 30].includes(day),
    };
  });
  return { id: `month-${month}`, month, name: `Month ${month}`, phase, days };
}

export const foods = [
  { name: "Sattu drink (40 g, water)", kcal: 150, protein: 8, carbs: 25, fat: 2, fibre: 7 },
  { name: "Eggs, boiled (2)", kcal: 156, protein: 13, carbs: 1, fat: 11, fibre: 0 },
  { name: "Cooked rice (150 g)", kcal: 195, protein: 4, carbs: 42, fat: 1, fibre: 1 },
  { name: "Dal (1 cup)", kcal: 190, protein: 12, carbs: 31, fat: 3, fibre: 8 },
  { name: "Mixed sabzi (1 cup)", kcal: 120, protein: 4, carbs: 18, fat: 5, fibre: 6 },
  { name: "Fish curry (120 g fish)", kcal: 230, protein: 27, carbs: 5, fat: 11, fibre: 1 },
  { name: "Chicken curry (120 g cooked)", kcal: 250, protein: 32, carbs: 6, fat: 11, fibre: 1 },
  { name: "Soy chilla (2 medium)", kcal: 280, protein: 20, carbs: 30, fat: 9, fibre: 7 },
  { name: "Boiled chola (1 cup)", kcal: 269, protein: 15, carbs: 45, fat: 4, fibre: 12 },
  { name: "Roti (2 medium)", kcal: 220, protein: 7, carbs: 44, fat: 3, fibre: 6 },
  { name: "Cooking oil (1 tsp / 5 ml)", kcal: 45, protein: 0, carbs: 0, fat: 5, fibre: 0 },
  { name: "Soyabean curry (1 cup, oil separate)", kcal: 220, protein: 16, carbs: 22, fat: 8, fibre: 7 },
  { name: "Paneer curry (1 cup, home-style)", kcal: 360, protein: 18, carbs: 14, fat: 26, fibre: 2 },
  { name: "Chicken + soy + mixed-veg stew (25 g each, no oil)", kcal: 140, protein: 15, carbs: 11, fat: 4, fibre: 3 },
  { name: "Milk tea with sugar (1 cup)", kcal: 95, protein: 3, carbs: 14, fat: 3, fibre: 0 },
  { name: "Black coffee, unsweetened (1 cup)", kcal: 3, protein: 0, carbs: 1, fat: 0, fibre: 0 },
  { name: "Banana (1 medium)", kcal: 105, protein: 1, carbs: 27, fat: 0, fibre: 3 },
  { name: "Guava (1 medium / ~100 g)", kcal: 68, protein: 3, carbs: 14, fat: 1, fibre: 5 },
  { name: "Fresh fruit (1 serving)", kcal: 80, protein: 1, carbs: 20, fat: 0, fibre: 3 },
  { name: "Toned milk (250 ml)", kcal: 145, protein: 8, carbs: 12, fat: 8, fibre: 0 },
  { name: "Plain dahi (100 g)", kcal: 61, protein: 4, carbs: 5, fat: 3, fibre: 0 },
  { name: "Isabgol (1 tsp with warm water)", kcal: 20, protein: 0, carbs: 5, fat: 0, fibre: 5 },
];

export const skillLadder = [
  ["Wrist + shoulder prep", "Pain-free wrist rocks + wall slides, 2 × 10"],
  ["Plank line", "3 × 30 sec with steady breathing"],
  ["Pike support", "3 × 25 sec, shoulders actively pushed tall"],
  ["Wall walk introduction", "3 controlled partial walks with safe exit"],
  ["Chest-to-wall hold", "3 × 20 sec, neutral head and stacked line"],
  ["Wall handstand milestone", "3 × 30 sec without symptom increase"],
  ["Heel/toe balance pulls", "5 controlled releases per side"],
  ["Controlled kick-up", "10 low-fatigue attempts with safe bail"],
  ["Freestanding hold", "3–10 sec repeatable balance"],
  ["Wall HSPU negative", "Future phase only after professional clearance"],
];

export const evidence = [
  { title: "WHO physical activity guidance", note: "Build toward 150–300 min/week and strengthen major muscle groups at least twice weekly.", url: "https://www.who.int/publications/i/item/9789240014886" },
  { title: "ACSM resistance training update", note: "Consistency, individualization and gradual progression matter more than complex programming.", url: "https://acsm.org/resistance-training-guidelines-update-2026/" },
  { title: "CDC gradual weight loss", note: "Steady loss is more sustainable; this app avoids promised 30-day outcomes.", url: "https://www.cdc.gov/healthy-weight-growth/losing-weight/index.html" },
  { title: "ISSN protein position stand", note: "Exercising adults commonly use 1.4–2.0 g/kg/day; your editable target begins at 110 g.", url: "https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8" },
  { title: "Lancet daily-steps meta-analysis", note: "Benefits rise well below 10,000 steps; targets progress from your ~3,000 baseline.", url: "https://pubmed.ncbi.nlm.nih.gov/35247352/" },
  { title: "NHS cervical spondylosis", note: "Red flags include new weakness, numbness, coordination or balance changes.", url: "https://www.nhs.uk/conditions/cervical-spondylosis/" },
  { title: "National Academies: total water", note: "Adequate intake includes food water and varies with heat, sweat and activity.", url: "https://nap.nationalacademies.org/read/10925/chapter/2" },
  { title: "NCCIH yoga safety", note: "Gentle yoga can support wellbeing; beginners should avoid extreme poses and forceful breathing.", url: "https://www.nccih.nih.gov/health/yoga-effectiveness-and-safety" },
  { title: "CDC sleep guidance", note: "Adults aged 18–60 are generally advised to get 7 or more hours.", url: "https://www.cdc.gov/sleep/about/index.html" },
  { title: "Gymnastics Canada handstand foundations", note: "Prerequisites, safe exits, wall-supported entry and aligned head position guide the skill ladder.", url: "https://manitobagymnastics.ca/wp-content/uploads/2022/12/GF_20Trampoline_20manual_20v2013_rev14juillet2016.pdf" },
];
