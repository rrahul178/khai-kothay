"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import BangladeshMap, { districtFill } from "@/components/BangladeshMap";
import FoodImage from "@/components/FoodImage";
import { BD_MAP } from "@/data/bdmap";
import { categories, foods, type Food } from "@/data/foods";
import { districts, getDistrict } from "@/data/geo";
import { useLocalList } from "@/lib/useLocalList";
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
  const { items: eaten, toggle } = useLocalList("kk:eaten");
  const canvas = useRef<HTMLCanvasElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const total = foods.length; // grows as you add more foods (long-term goal: 100)
  const badges = useMemo(() => badgesFor(eaten), [eaten]);
  const exploredSlugs = useMemo(
    () => new Set(eaten.map((s) => foods.find((f) => f.slug === s)?.originDistrict).filter(Boolean) as string[]),
    [eaten]
  );
  const explored = exploredSlugs.size;
  const pct = Math.round((eaten.length / total) * 100);

  const sel = selected ? getDistrict(selected) : null;
  const selFoods = selected ? foods.filter((f) => f.originDistrict === selected) : [];
  const shown = filter === "all" ? foods : foods.filter((f) => f.category === filter);

  // Share card: draws the same map (real district shapes) coloured by progress.
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const g = c.getContext("2d")!;
    const bg = g.createLinearGradient(0, 0, 0, CARD_H);
    bg.addColorStop(0, "#006a4e");
    bg.addColorStop(1, "#003d2c");
    g.fillStyle = bg;
    g.fillRect(0, 0, CARD_W, CARD_H);

    g.textAlign = "center";
    g.fillStyle = "#fff";
    g.font = "bold 60px sans-serif";
    g.fillText("MY BANGLADESH FOOD JOURNEY", CARD_W / 2, 100);
    g.font = "30px sans-serif";
    g.fillStyle = "#bbf7d0";
    g.fillText("আমার বাংলাদেশের খাবারের ভ্রমণ", CARD_W / 2, 148);

    // map panel
    const s = 1.2;
    const mw = BD_MAP.width * s;
    const mh = BD_MAP.height * s;
    const mx = 40;
    const my = 190;
    g.fillStyle = "rgba(255,255,255,0.08)";
    g.beginPath();
    g.roundRect(mx - 20, my - 10, mw + 40, mh + 30, 28);
    g.fill();
    g.save();
    g.translate(mx, my + 10);
    g.scale(s, s);
    for (const d of BD_MAP.districts) {
      g.fillStyle = districtFill(d.slug, eaten);
      g.fill(new Path2D(d.d));
      g.strokeStyle = "#ffffff";
      g.lineWidth = 0.7;
      g.stroke(new Path2D(d.d));
    }
    g.strokeStyle = "#003d2c";
    g.lineWidth = 1.6;
    for (const d of BD_MAP.divisions) g.stroke(new Path2D(d.d));
    g.restore();

    // stats column
    const cx = mx + mw + 60 + (CARD_W - (mx + mw + 60) - 40) / 2;
    g.fillStyle = "#f42a41";
    g.beginPath();
    g.arc(cx, 330, 120, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#fff";
    g.font = "bold 84px sans-serif";
    g.fillText(`${eaten.length}/${total}`, cx, 355);
    g.font = "26px sans-serif";
    g.fillText("foods tasted", cx, 468);
    g.font = "bold 54px sans-serif";
    g.fillText(`${explored}/${districts.length}`, cx, 560);
    g.font = "26px sans-serif";
    g.fillText("districts explored", cx, 596);

    g.font = "bold 28px sans-serif";
    g.fillText("Badges", cx, 670);
    g.font = "30px sans-serif";
    const list = badges.length ? badges.slice(0, 6).map((b) => `${b.emoji} ${b.label}`) : ["🍴 শুরু করুন!"];
    list.forEach((t, i) => g.fillText(t, cx, 716 + i * 46));

    // legend
    const ly = my + mh + 40;
    const items: [string, string][] = [["#fde68a", "To try"], ["#7cc9ad", "Started"], ["#006a4e", "Complete"], ["#e7e5e4", "Coming soon"]];
    g.font = "24px sans-serif";
    g.textAlign = "left";
    let lx = 90;
    for (const [col, label] of items) {
      g.fillStyle = col;
      g.fillRect(lx, ly - 20, 26, 26);
      g.fillStyle = "#fff";
      g.fillText(label, lx + 36, ly);
      lx += 36 + g.measureText(label).width + 40;
    }

    g.textAlign = "center";
    g.fillStyle = "#fff";
    g.font = "bold 52px sans-serif";
    g.fillText("Khai Kothay? 🇧🇩", CARD_W / 2, CARD_H - 70);
    g.font = "24px sans-serif";
    g.fillStyle = "#bbf7d0";
    g.fillText("khai-kothay.vercel.app", CARD_W / 2, CARD_H - 30);
    g.font = "16px sans-serif";
    g.fillStyle = "rgba(255,255,255,.55)";
    g.textAlign = "right";
    g.fillText("Map: geoBoundaries (CC BY 4.0)", CARD_W - 24, CARD_H - 8);
  }, [eaten, badges, total, explored]);

  const download = () => {
    const a = document.createElement("a");
    a.download = "my-bangladesh-food-journey.png";
    a.href = canvas.current!.toDataURL("image/png");
    a.click();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">🇧🇩 My Bangladesh Food Journey</h1>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-stone-200">
            <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-sm font-semibold">{eaten.length}/{total} · {explored} জেলা</div>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {badges.length ? badges.map((b) => <span key={b.id} className="chip">{b.emoji} {b.label}</span>) : <span className="text-sm text-stone-500">১০টি খাবারে টিক দিলে প্রথম badge পাবেন।</span>}
        </div>
      </div>

      {/* Map + district panel */}
      <section className="grid gap-6 md:grid-cols-[1fr_340px]">
        <div className="card">
          <BangladeshMap eaten={eaten} selected={selected} onSelect={setSelected} />
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-stone-600">
            {[["#fde68a", "খাবার আছে, খাননি"], ["#7cc9ad", "কিছু খেয়েছেন"], ["#006a4e", "সব খেয়েছেন"], ["#e7e5e4", "শীঘ্রই আসছে"]].map(([c, l]) => (
              <span key={l} className="inline-flex items-center gap-1"><i className="inline-block h-3 w-3 rounded-sm" style={{ background: c }} />{l}</span>
            ))}
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
              {selFoods.length ? (
                <div className="grid grid-cols-2 gap-2">
                  {selFoods.map((f) => (
                    <FoodTick key={f.slug} food={f} on={eaten.includes(f.slug)} toggle={() => toggle(f.slug)} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-500">এই জেলার খাবার এখনো যোগ হয়নি।</p>
              )}
              <Link href={`/district/${sel.slug}`} className="btn-ghost">জেলার পাতা →</Link>
            </div>
          ) : (
            <div className="card text-sm text-stone-600">👆 map এ যেকোনো জেলায় ক্লিক করুন, সেখানকার বিখ্যাত খাবার দেখুন এবং টিক দিন।</div>
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
            <FoodTick key={f.slug} food={f} on={eaten.includes(f.slug)} toggle={() => toggle(f.slug)} />
          ))}
        </div>
      </section>

      {/* Share card */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Share your food journey</h2>
        <canvas ref={canvas} width={CARD_W} height={CARD_H} className="mx-auto w-full max-w-sm rounded-2xl shadow" />
        <div className="text-center"><button onClick={download} className="btn">⬇️ Download as image</button></div>
        <p className="text-center text-xs text-stone-500">অগ্রগতি এই device এই সংরক্ষিত থাকে।</p>
      </section>
    </div>
  );
}
