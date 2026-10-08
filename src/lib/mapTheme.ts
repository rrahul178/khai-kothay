import { foods } from "@/data/foods";

export type MapMode = "visited" | "foods";

export type MapTheme = {
  id: string;
  label: string;
  bg: [string, string]; // share-card background gradient
  onBg: string; // text colour on the card background
  accent: string;
  base: string; // nothing here yet
  todo: string; // foods listed, none eaten
  p1: string; // some eaten
  p2: string; // half or more eaten
  p3: string; // all eaten
  visited: string; // visited district
  border: string; // district borders
  division: string; // division borders
};

export const themes: MapTheme[] = [
  { id: "green", label: "সবুজ", bg: ["#006a4e", "#003d2c"], onBg: "#ffffff", accent: "#f42a41", base: "#e7e5e4", todo: "#fde68a", p1: "#7cc9ad", p2: "#2f9e7a", p3: "#006a4e", visited: "#006a4e", border: "#ffffff", division: "#004d38" },
  { id: "sunset", label: "সূর্যাস্ত", bg: ["#7c2d12", "#431407"], onBg: "#fff7ed", accent: "#fbbf24", base: "#f5ebe0", todo: "#fed7aa", p1: "#fdba74", p2: "#f97316", p3: "#c2410c", visited: "#ea580c", border: "#d6b9a0", division: "#7c2d12" },
  { id: "ocean", label: "সমুদ্র", bg: ["#0c4a6e", "#082f49"], onBg: "#f0f9ff", accent: "#facc15", base: "#e0f2fe", todo: "#bae6fd", p1: "#7dd3fc", p2: "#0ea5e9", p3: "#0369a1", visited: "#0284c7", border: "#7dd3fc", division: "#0c4a6e" },
  { id: "night", label: "রাত", bg: ["#18181b", "#09090b"], onBg: "#fafafa", accent: "#22d3ee", base: "#3f3f46", todo: "#52525b", p1: "#2dd4bf", p2: "#14b8a6", p3: "#0f766e", visited: "#22d3ee", border: "#18181b", division: "#a1a1aa" },
  { id: "paper", label: "সাদা-কালো", bg: ["#fafaf9", "#e7e5e4"], onBg: "#1c1917", accent: "#dc2626", base: "#ffffff", todo: "#e7e5e4", p1: "#a8a29e", p2: "#57534e", p3: "#1c1917", visited: "#1c1917", border: "#a8a29e", division: "#1c1917" },
];

export const getTheme = (id: string) => themes.find((t) => t.id === id) ?? themes[0];

export function districtFill(slug: string, mode: MapMode, theme: MapTheme, eaten: string[], visited: string[]) {
  if (mode === "visited") return visited.includes(slug) ? theme.visited : theme.base;
  const here = foods.filter((f) => f.originDistrict === slug);
  if (!here.length) return theme.base;
  const done = here.filter((f) => eaten.includes(f.slug)).length;
  if (!done) return theme.todo;
  const t = done / here.length;
  return t >= 1 ? theme.p3 : t >= 0.5 ? theme.p2 : theme.p1;
}

export function legendFor(mode: MapMode, theme: MapTheme): [string, string][] {
  return mode === "visited"
    ? [[theme.visited, "গিয়েছি"], [theme.base, "এখনো যাইনি"]]
    : [[theme.todo, "খাবার আছে, খাননি"], [theme.p1, "কিছু খেয়েছেন"], [theme.p3, "সব খেয়েছেন"], [theme.base, "শীঘ্রই আসছে"]];
}

/** Readable label colours for text drawn on top of a district fill (hex colours only). */
export function labelColors(fill: string) {
  const n = parseInt(fill.slice(1), 16);
  const lum = (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
  return lum > 0.55
    ? { fill: "#1c1917", halo: "rgba(255,255,255,0.7)" }
    : { fill: "#ffffff", halo: "rgba(0,0,0,0.5)" };
}
