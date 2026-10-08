import { BD_MAP } from "@/data/bdmap";
import { foods } from "@/data/foods";
import { districts, getDistrict } from "@/data/geo";
import { districtFill, legendFor, type MapMode, type MapTheme } from "./mapTheme";
import type { Badge } from "./utils";

export const CARD_W = 1080;
export const CARD_H = 1350;

// ---- Fonts (Baloo Da 2 for titles/numbers, Hind Siliguri for text; both OFL, served from /public/fonts) ----
let fontsReady: Promise<void> | null = null;
export function loadCardFonts(): Promise<void> {
  if (typeof document === "undefined" || typeof FontFace === "undefined") return Promise.resolve();
  if (!fontsReady) {
    const defs: [string, string, string][] = [
      ["KKBnD", "baloo-da-2-bengali-800-normal.woff2", "800"],
      ["KKLaD", "baloo-da-2-latin-800-normal.woff2", "800"],
      ["KKBnB", "hind-siliguri-bengali-600-normal.woff2", "600"],
      ["KKLaB", "hind-siliguri-latin-600-normal.woff2", "600"],
    ];
    fontsReady = Promise.all(
      defs.map(async ([family, file, weight]) => {
        const face = new FontFace(family, `url(/fonts/${file})`, { weight });
        await face.load();
        document.fonts.add(face);
      })
    )
      .then(() => undefined)
      .catch(() => undefined); // falls back to system fonts if a file fails
  }
  return fontsReady;
}

const D = (px: number) => `800 ${px}px KKBnD, KKLaD, "Noto Sans Bengali", sans-serif`;
const B = (px: number) => `600 ${px}px KKBnB, KKLaB, "Noto Sans Bengali", sans-serif`;
const toBn = (n: number | string) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);

type Ctx = CanvasRenderingContext2D;

function rr(g: Ctx, x: number, y: number, w: number, h: number, r: number) {
  const k = Math.min(r, w / 2, h / 2);
  g.beginPath();
  g.moveTo(x + k, y);
  g.arcTo(x + w, y, x + w, y + h, k);
  g.arcTo(x + w, y + h, x, y + h, k);
  g.arcTo(x, y + h, x, y, k);
  g.arcTo(x, y, x + w, y, k);
  g.closePath();
}

// Drawn flag (the 🇧🇩 emoji does not render on Windows, it shows as "BD").
function flag(g: Ctx, x: number, y: number, w: number) {
  const h = w * 0.62;
  rr(g, x, y, w, h, w * 0.09);
  g.fillStyle = "#006a4e";
  g.fill();
  g.lineWidth = 3;
  g.strokeStyle = "rgba(255,255,255,.9)";
  g.stroke();
  g.beginPath();
  g.arc(x + w * 0.45, y + h / 2, h * 0.3, 0, Math.PI * 2);
  g.fillStyle = "#f42a41";
  g.fill();
}

function fit(g: Ctx, text: string, maxW: number, start: number, font: (n: number) => string) {
  let px = start;
  g.font = font(px);
  while (g.measureText(text).width > maxW && px > 20) {
    px -= 2;
    g.font = font(px);
  }
  return px;
}

export type CardOptions = {
  mode: MapMode;
  theme: MapTheme;
  eaten: string[];
  visited: string[];
  badges: Badge[];
  total: number;
};

export function drawShareCard(canvas: HTMLCanvasElement, o: CardOptions) {
  const g = canvas.getContext("2d")!;
  const { mode, theme, eaten, visited, badges, total } = o;
  const isVisited = mode === "visited";
  const accentText = ["sunset", "night", "ocean"].includes(theme.id) ? "#111" : "#fff";
  g.textAlign = "center";
  g.textBaseline = "alphabetic";

  // background + soft decoration
  const bg = g.createLinearGradient(0, 0, 0, CARD_H);
  bg.addColorStop(0, theme.bg[0]);
  bg.addColorStop(1, theme.bg[1]);
  g.fillStyle = bg;
  g.fillRect(0, 0, CARD_W, CARD_H);

  g.strokeStyle = theme.onBg;
  g.lineWidth = 2;
  g.globalAlpha = 0.07;
  for (const [cx, cy] of [[1000, 80], [60, 1290]] as const)
    for (const r of [120, 190, 260, 330]) {
      g.beginPath();
      g.arc(cx, cy, r, 0, Math.PI * 2);
      g.stroke();
    }
  g.globalAlpha = 1;

  // header: flag + brand
  g.font = D(42);
  const brand = "খাই কোথায়?";
  const bw = g.measureText(brand).width;
  const fw = 58;
  const startX = (CARD_W - (fw + 16 + bw)) / 2;
  flag(g, startX, 52, fw);
  g.textAlign = "left";
  g.fillStyle = theme.onBg;
  g.fillText(brand, startX + fw + 16, 98);
  g.textAlign = "center";

  // title + subtitle
  const title = isVisited ? "আমার দেখা বাংলাদেশ" : "আমার খাবারের বাংলাদেশ";
  fit(g, title, 940, 96, D);
  g.fillStyle = theme.onBg;
  g.fillText(title, CARD_W / 2, 205);
  const sub = isVisited
    ? `${toBn(districts.length)}টি জেলার মধ্যে ${toBn(visited.length)}টি ঘুরে দেখেছি`
    : `${toBn(total)}টি খাবারের মধ্যে ${toBn(eaten.length)}টি চেখে দেখেছি`;
  g.globalAlpha = 0.88;
  fit(g, sub, 920, 40, D);
  g.fillText(sub, CARD_W / 2, 262);
  g.globalAlpha = 1;

  // map
  const s = 0.88;
  const mapX = 50;
  const mapY = 296;
  const mw = BD_MAP.width * s;
  const mh = BD_MAP.height * s;
  const glow = g.createRadialGradient(mapX + mw / 2, mapY + mh / 2, 40, mapX + mw / 2, mapY + mh / 2, 470);
  glow.addColorStop(0, "rgba(255,255,255,.16)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = glow;
  g.fillRect(0, 0, CARD_W, CARD_H);

  g.save();
  g.translate(mapX, mapY);
  g.scale(s, s);
  const paths = BD_MAP.districts.map((d) => ({ slug: d.slug, p: new Path2D(d.d) }));
  g.shadowColor = "rgba(0,0,0,.45)";
  g.shadowBlur = 22;
  g.shadowOffsetY = 10;
  g.fillStyle = theme.bg[1];
  for (const { p } of paths) g.fill(p);
  g.shadowColor = "transparent";
  g.shadowBlur = 0;
  g.shadowOffsetY = 0;
  for (const { slug, p } of paths) {
    g.fillStyle = districtFill(slug, mode, theme, eaten, visited);
    g.fill(p);
    g.strokeStyle = theme.border;
    g.lineWidth = 0.8;
    g.stroke(p);
  }
  g.strokeStyle = theme.division;
  g.lineWidth = 1.8;
  g.lineJoin = "round";
  for (const d of BD_MAP.divisions) g.stroke(new Path2D(d.d));
  g.restore();

  // right column: big stat
  const cx = 830;
  const bigNum = isVisited ? visited.length : eaten.length;
  const bigDen = isVisited ? districts.length : total;
  g.fillStyle = theme.accent;
  g.beginPath();
  g.arc(cx, 420, 128, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = theme.onBg;
  g.globalAlpha = 0.35;
  g.lineWidth = 4;
  g.beginPath();
  g.arc(cx, 420, 142, 0, Math.PI * 2);
  g.stroke();
  g.globalAlpha = 1;
  g.fillStyle = accentText;
  fit(g, toBn(bigNum), 190, 104, D);
  g.fillText(toBn(bigNum), cx, 432);
  g.font = B(36);
  g.fillText(`/ ${toBn(bigDen)}`, cx, 486);
  g.fillStyle = theme.onBg;
  g.font = D(42);
  g.fillText(isVisited ? "জেলা ভ্রমণ" : "খাবার চেখেছি", cx, 618);

  // secondary stat pill
  const subNum = isVisited ? eaten.length : visited.length;
  const subDen = isVisited ? total : districts.length;
  rr(g, cx - 190, 650, 380, 118, 28);
  g.fillStyle = theme.onBg;
  g.globalAlpha = 0.12;
  g.fill();
  g.globalAlpha = 1;
  g.fillStyle = theme.onBg;
  g.font = D(54);
  g.fillText(`${toBn(subNum)}/${toBn(subDen)}`, cx, 710);
  g.font = B(28);
  g.globalAlpha = 0.85;
  g.fillText(isVisited ? "খাবার চেখেছি" : "জেলা ঘুরেছি", cx, 750);
  g.globalAlpha = 1;

  // badges
  g.font = D(36);
  g.fillStyle = theme.onBg;
  g.fillText(badges.length ? `অর্জিত ব্যাজ · ${toBn(badges.length)}টি` : "অর্জিত ব্যাজ", cx, 830);
  const shown = badges.slice(-3).reverse();
  if (shown.length === 0) {
    g.font = D(30);
    g.globalAlpha = 0.8;
    g.fillText("১০টি খাবারে প্রথম ব্যাজ!", cx, 890);
    g.globalAlpha = 1;
  }
  shown.forEach((b, i) => {
    const y = 852 + i * 64;
    rr(g, cx - 190, y, 380, 56, 28);
    g.fillStyle = theme.accent;
    g.fill();
    g.fillStyle = accentText;
    g.beginPath();
    g.arc(cx - 190 + 28, y + 28, 8, 0, Math.PI * 2);
    g.fill();
    fit(g, b.labelBn, 300, 30, B);
    g.fillText(b.labelBn, cx + 12, y + 38);
  });
  // legend (centred)
  const legend = legendFor(mode, theme);
  g.font = B(26);
  const gap = 34;
  const widths = legend.map(([, l]) => 30 + 10 + g.measureText(l).width);
  const total_w = widths.reduce((a, b) => a + b, 0) + gap * (legend.length - 1);
  let lx = (CARD_W - total_w) / 2;
  const ly = mapY + mh + 52;
  g.textAlign = "left";
  legend.forEach(([col, label], i) => {
    rr(g, lx, ly - 24, 30, 30, 8);
    g.fillStyle = col;
    g.fill();
    g.strokeStyle = theme.onBg;
    g.globalAlpha = 0.4;
    g.lineWidth = 2;
    g.stroke();
    g.globalAlpha = 1;
    g.fillStyle = theme.onBg;
    g.fillText(label, lx + 40, ly);
    lx += widths[i] + gap;
  });
  g.textAlign = "center";

  // chips: places visited / foods eaten
  const names = isVisited
    ? visited.map((v) => getDistrict(v)?.nameBn).filter(Boolean)
    : eaten.map((e) => foods.find((f) => f.slug === e)?.nameBn).filter(Boolean);
  const chips = (names.length ? (names as string[]) : [isVisited ? "মানচিত্রে ক্লিক করে শুরু করুন" : "খাবারে টিক দিয়ে শুরু করুন"]).slice();
  const chipFont = (t: string) => (/[০-৯]/.test(t) ? D(28) : B(28));
  const chipH = 54;
  const maxRowW = 940;
  const layout = (list: string[]) => {
    const rows: { t: string; w: number }[][] = [[]];
    let cur = 0;
    for (const t of list) {
      g.font = chipFont(t);
      const w = g.measureText(t).width + 44;
      if (cur + w > maxRowW && rows[rows.length - 1].length) {
        rows.push([]);
        cur = 0;
      }
      rows[rows.length - 1].push({ t, w });
      cur += w + 12;
    }
    return rows;
  };
  let rows = layout(chips);
  let hidden = 0;
  while (rows.length > 2) {
    chips.pop();
    hidden++;
    rows = layout([...chips, `+${toBn(hidden)} আরও`]);
  }
  if (hidden) chips.push(`+${toBn(hidden)} আরও`);
  rows = layout(chips);
  const chipY0 = ly + 32;
  rows.forEach((row, r) => {
    const rw = row.reduce((a, c) => a + c.w, 0) + 12 * (row.length - 1);
    let x = (CARD_W - rw) / 2;
    const y = chipY0 + r * (chipH + 12);
    for (const c of row) {
      rr(g, x, y, c.w, chipH, 27);
      g.fillStyle = theme.onBg;
      g.globalAlpha = 0.16;
      g.fill();
      g.globalAlpha = 1;
      g.fillStyle = theme.onBg;
      g.font = chipFont(c.t);
      g.fillText(c.t, x + c.w / 2, y + 37);
      x += c.w + 12;
    }
  });

  // footer
  g.fillStyle = theme.onBg;
  g.font = D(34);
  g.fillText("আপনার বাংলাদেশ ভ্রমণও শুরু করুন", CARD_W / 2, CARD_H - 62);
  g.font = B(28);
  g.globalAlpha = 0.85;
  g.fillText("khai-kothay.vercel.app", CARD_W / 2, CARD_H - 26);
  g.globalAlpha = 0.5;
  g.font = B(15);
  g.textAlign = "right";
  g.fillText("মানচিত্র: geoBoundaries (CC BY 4.0)", CARD_W - 22, CARD_H - 8);
  g.globalAlpha = 1;
  g.textAlign = "center";
}
