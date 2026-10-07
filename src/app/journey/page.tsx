"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import BangladeshMap from "@/components/BangladeshMap";
import FoodImage from "@/components/FoodImage";
import { BD_MAP } from "@/data/bdmap";
import { categories, foods, type Food } from "@/data/foods";
import { districts, getDistrict } from "@/data/geo";
import { useLocalList } from "@/lib/useLocalList";
import { districtFill, getTheme, legendFor, themes, type MapMode } from "@/lib/mapTheme";
import { badgesFor } from "@/lib/utils";

const CARD_W = 1080;
const CARD_H = 1350;

function FoodTick({ food, on, toggle }: { food: Food; on: boolean; toggle: () => void }) {
  const cat = categories.find((c) => c.id === food.category);
  return (
    <div className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${on ? "border-brand ring-2 ring-brand/30" : "border-stone-200"}`}>
      <div className="relative">
        <FoodImage food={food} className="h-24 w-full" />
        {on && <span className="absolute right-2 top-2 rounded-full bg-brand px-2 py-0.5 text-xs font-bold text-white">✓ খেয়েছি</span>}
      </div>
      <div className="p-3">
        <Link href={`/food/${food.slug}`} className="block text-sm font-semibold hover:text-brand">{food.nameBn}</Link>
        <div className="text-xs text-stone-500">{food.nameEn} · {cat?.emoji}</div>
        <button onClick={toggle} className={`mt-2 w-full ${on ? "btn-ghost" : "btn"} justify-center`}>
          {on ? "বাদ দিন" : "🍴 আমি খেয়েছি"}
        </button>
      </div>
    </div>
  );
}

export default function Journey() {
  const { items: eaten, toggle: toggleEaten } = useLocalList("kk:eaten");
  const { items: visited, toggle: toggleVisited } = useLocalList("kk:visited");
  const canvas = useRef<HTMLCanvasElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [mode, setMode] = useState<MapMode>("visited");
  const [themeId, setThemeId] = useState("green");
  const theme = getTheme(themeId);

  // remember mode + theme on this device
  useEffect(() => {
    try {
      const m = localStorage.getItem("kk:mapmode") as MapMode | null;
      const t = localStorage.getItem("kk:maptheme");
      if (m === "visited" || m === "foods") setMode(m);
      if (t) setThemeId(t);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("kk:mapmode", mode);
      localStorage.setItem("kk:maptheme", themeId);
    } catch {}
  }, [mode, themeId]);

  const total = foods.length; // grows as you add more foods (long-term goal: 100)
  const badges = useMemo(() => badgesFor(eaten), [eaten]);
  const foodDistricts = useMemo(
    () => new Set(eaten.map((s) => foods.find((f) => f.slug === s)?.originDistrict).filter(Boolean) as string[]),
    [eaten]
  );
  const pct = Math.round((eaten.length / total) * 100);

  const sel = selected ? getDistrict(selected) : null;
  const selFoods = selected ? foods.filter((f) => f.originDistrict === selected) : [];
  const shown = filter === "all" ? foods : foods.filter((f) => f.category === filter);

  const onSelect = (slug: string) => {
    setSelected(slug);
    if (mode === "visited") toggleVisited(slug); // click-to-mark, like a scratch map
  };

  // Export card: same real district shapes, coloured with the chosen theme.
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const g = c.getContext("2d")!;
    const bg = g.createLinearGradient(0, 0, 0, CARD_H);
    bg.addColorStop(0, theme.bg[0]);
    bg.addColorStop(1, theme.bg[1]);
    g.fillStyle = bg;
    g.fillRect(0, 0, CARD_W, CARD_H);

    const isVisited = mode === "visited";
    g.textAlign = "center";
    g.fillStyle = theme.onBg;
    g.font = "bold 60px sans-serif";
    g.fillText(isVisited ? "MY BANGLADESH" : "MY BANGLADESH FOOD JOURNEY", CARD_W / 2, 100);
    g.globalAlpha = 0.75;
    g.font = "30px sans-serif";
    g.fillText(isVisited ? "আমার দেখা বাংলাদেশ" : "আমার বাংলাদেশের খাবারের ভ্রমণ", CARD_W / 2, 148);
    g.globalAlpha = 1;

    const s = 1.2;
    const mw = BD_MAP.width * s;
    const mh = BD_MAP.height * s;
    const mx = 40;
    const my = 190;
    g.save();
    g.translate(mx, my + 10);
    g.scale(s, s);
    for (const d of BD_MAP.districts) {
      const p = new Path2D(d.d);
      g.fillStyle = districtFill(d.slug, mode, theme, eaten, visited);
      g.fill(p);
      g.strokeStyle = theme.border;
      g.lineWidth = 0.7;
      g.stroke(p);
    }
    g.strokeStyle = theme.division;
    g.lineWidth = 1.6;
    for (const d of BD_MAP.divisions) g.stroke(new Path2D(d.d));
    g.restore();

    const cx = mx + mw + 60 + (CARD_W - (mx + mw + 60) - 40) / 2;
    const bigNum = isVisited ? `${visited.length}/${districts.length}` : `${eaten.length}/${total}`;
    const bigLabel = isVisited ? "districts visited" : "foods tasted";
    const subNum = isVisited ? `${eaten.length}/${total}` : `${foodDistricts.size}/${districts.length}`;
    const subLabel = isVisited ? "foods tasted" : "districts explored";
    g.fillStyle = theme.accent;
    g.beginPath();
    g.arc(cx, 330, 120, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = theme.id === "paper" || theme.id === "sunset" || theme.id === "night" ? "#111" : "#fff";
    g.font = "bold 78px sans-serif";
    g.fillText(bigNum, cx, 352);
    g.fillStyle = theme.onBg;
    g.font = "26px sans-serif";
    g.fillText(bigLabel, cx, 468);
    g.font = "bold 54px sans-serif";
    g.fillText(subNum, cx, 560);
    g.font = "26px sans-serif";
    g.fillText(subLabel, cx, 596);

    g.font = "bold 28px sans-serif";
    g.fillText("Badges", cx, 670);
    g.font = "30px sans-serif";
    const list = badges.length ? badges.slice(0, 6).map((b) => `${b.emoji} ${b.label}`) : ["🍴 শুরু করুন!"];
    list.forEach((t, i) => g.fillText(t, cx, 716 + i * 46));

    const ly = my + mh + 40;
    g.font = "24px sans-serif";
    g.textAlign = "left";
    let lx = 90;
    for (const [col, label] of legendFor(mode, theme)) {
      g.fillStyle = col;
      g.fillRect(lx, ly - 20, 26, 26);
      g.strokeStyle = theme.onBg;
      g.globalAlpha = 0.35;
      g.strokeRect(lx, ly - 20, 26, 26);
      g.globalAlpha = 1;
      g.fillStyle = theme.onBg;
      g.fillText(label, lx + 36, ly);
      lx += 36 + g.measureText(label).width + 40;
    }

    g.textAlign = "center";
    g.fillStyle = theme.onBg;
    g.font = "bold 52px sans-serif";
    g.fillText("Khai Kothay? 🇧🇩", CARD_W / 2, CARD_H - 70);
    g.globalAlpha = 0.75;
    g.font = "24px sans-serif";
    g.fillText("khai-kothay.vercel.app", CARD_W / 2, CARD_H - 30);
    g.globalAlpha = 0.5;
    g.font = "16px sans-serif";
    g.textAlign = "right";
    g.fillText("Map: geoBoundaries (CC BY 4.0)", CARD_W - 24, CARD_H - 8);
    g.globalAlpha = 1;
  }, [eaten, visited, badges, total, foodDistricts, mode, theme]);

  const save = (href: string, ext: string) => {
    const a = document.createElement("a");
    a.download = `my-bangladesh-${mode === "visited" ? "map" : "food-journey"}.${ext}`;
    a.href = href;
    a.click();
  };
  const exportImg = (type: "png" | "jpg") => {
    const url = canvas.current!.toDataURL(type === "png" ? "image/png" : "image/jpeg", 0.92);
    save(url, type);
  };
  const exportPdf = async () => {
    const { jsPDF } = await import("jspdf"); // loaded only when needed
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [CARD_W, CARD_H], hotfixes: ["px_scaling"] });
    pdf.addImage(canvas.current!.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, CARD_W, CARD_H);
    save(pdf.output("bloburl").toString(), "pdf");
  };

  const legend = legendFor(mode, theme);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">🇧🇩 My Bangladesh Journey</h1>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-stone-200">
            <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-sm font-semibold">{eaten.length}/{total} খাবার · {visited.length}/{districts.length} জেলা</div>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {badges.length ? badges.map((b) => <span key={b.id} className="chip">{b.emoji} {b.label}</span>) : <span className="text-sm text-stone-500">১০টি খাবারে টিক দিলে প্রথম badge পাবেন।</span>}
        </div>
      </div>

      {/* Map + district panel */}
      <section className="grid gap-6 md:grid-cols-[1fr_340px]">
        <div className="card">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-full bg-stone-100 p-1 text-sm font-semibold">
              <button onClick={() => setMode("visited")} className={`rounded-full px-4 py-1.5 ${mode === "visited" ? "bg-brand text-white" : "text-stone-600"}`}>📍 ভ্রমণ</button>
              <button onClick={() => setMode("foods")} className={`rounded-full px-4 py-1.5 ${mode === "foods" ? "bg-brand text-white" : "text-stone-600"}`}>🍛 খাবার</button>
            </div>
            <div className="flex items-center gap-1.5" role="group" aria-label="Map theme">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setThemeId(t.id)}
                  title={t.label}
                  aria-label={`Theme ${t.label}`}
                  aria-pressed={themeId === t.id}
                  className={`h-7 w-7 rounded-full border-2 ${themeId === t.id ? "border-stone-900" : "border-white"} shadow`}
                  style={{ background: `linear-gradient(135deg, ${t.bg[0]} 50%, ${t.p2} 50%)` }}
                />
              ))}
            </div>
          </div>
          <p className="mb-2 text-center text-xs text-stone-500">
            {mode === "visited" ? "যে জেলায় গিয়েছেন তাতে ক্লিক করুন, আবার ক্লিক করলে বাদ যাবে।" : "জেলায় ক্লিক করে সেখানকার খাবার দেখুন ও টিক দিন।"}
          </p>
          <BangladeshMap eaten={eaten} visited={visited} mode={mode} theme={theme} selected={selected} onSelect={onSelect} />
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-stone-600">
            {legend.map(([c, l]) => (
              <span key={l} className="inline-flex items-center gap-1"><i className="inline-block h-3 w-3 rounded-sm border border-stone-300" style={{ background: c }} />{l}</span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <button onClick={() => exportImg("png")} className="btn">⬇️ PNG</button>
            <button onClick={() => exportImg("jpg")} className="btn-ghost">⬇️ JPG</button>
            <button onClick={exportPdf} className="btn-ghost">⬇️ PDF</button>
          </div>
          <p className="mt-2 text-center text-[11px] text-stone-400">Map data: geoBoundaries (CC BY 4.0)</p>
        </div>

        <aside className="space-y-3 md:sticky md:top-20 md:self-start">
          {sel ? (
            <div className="card space-y-3">
              <div>
                <div className="text-lg font-bold">📍 {sel.nameBn}</div>
                <div className="text-sm text-stone-500">{sel.nameEn}</div>
              </div>
              <button onClick={() => toggleVisited(sel.slug)} className={`${visited.includes(sel.slug) ? "btn" : "btn-ghost"} justify-center`}>
                {visited.includes(sel.slug) ? "✅ আমি গিয়েছি" : "📍 আমি এখানে গিয়েছি"}
              </button>
              {selFoods.length ? (
                <div className="grid grid-cols-2 gap-2">
                  {selFoods.map((f) => (
                    <FoodTick key={f.slug} food={f} on={eaten.includes(f.slug)} toggle={() => toggleEaten(f.slug)} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-500">এই জেলার খাবার এখনো যোগ হয়নি।</p>
              )}
              <Link href={`/district/${sel.slug}`} className="btn-ghost">জেলার পাতা →</Link>
            </div>
          ) : (
            <div className="card text-sm text-stone-600">👆 map এ যেকোনো জেলায় ক্লিক করুন।</div>
          )}
        </aside>
      </section>

      {/* All foods with pictures */}
      <section>
        <h2 className="mb-3 text-lg font-bold">আমি এগুলো খেয়েছি ({eaten.length}/{total})</h2>
        <div className="mb-3 flex flex-wrap gap-2">
          <button onClick={() => setFilter("all")} className={filter === "all" ? "btn" : "btn-ghost"}>সব</button>
          {categories.map((c) => (
            <button key={c.id} onClick={() => setFilter(c.id)} className={filter === c.id ? "btn" : "btn-ghost"}>{c.emoji} {c.labelBn}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {shown.map((f) => (
            <FoodTick key={f.slug} food={f} on={eaten.includes(f.slug)} toggle={() => toggleEaten(f.slug)} />
          ))}
        </div>
      </section>

      {/* Export preview */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Share card</h2>
        <canvas ref={canvas} width={CARD_W} height={CARD_H} className="mx-auto w-full max-w-sm rounded-2xl shadow" />
        <p className="text-center text-xs text-stone-500">উপরের PNG / JPG / PDF বোতাম দিয়ে এই card নামান। অগ্রগতি এই device এই সংরক্ষিত থাকে।</p>
      </section>
    </div>
  );
}
