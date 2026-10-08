import Link from "next/link";
import Flag from "@/components/Flag";
import SearchBox from "@/components/SearchBox";
import FoodCard from "@/components/FoodCard";
import { categories, foods } from "@/data/foods";
import { divisions, districts } from "@/data/geo";

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-brand-light p-6 sm:p-10">
        <h1 className="font-display text-4xl font-extrabold text-brand sm:text-5xl">আজ কী খাবেন?</h1>
        <p className="mt-1 text-stone-700">আপনার এলাকার সেরা খাবার খুঁজে নিন।</p>
        <div className="mt-5"><SearchBox /></div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/near-me" className="btn">📍 Near Me</Link>
          <Link href="/districts" className="btn-ghost">🗺️ Explore Bangladesh</Link>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">কী খাবেন?</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link key={c.id} href={`/foods?cat=${c.id}`} className="btn-ghost">
              {c.emoji} {c.labelBn}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">জনপ্রিয় খাবার</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {foods.slice(0, 6).map((f) => <FoodCard key={f.slug} food={f} />)}
        </div>
        <Link href="/foods" className="mt-3 inline-block text-sm font-semibold text-brand">সব খাবার দেখুন →</Link>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">বিভাগ ({divisions.length}) · জেলা ({districts.length})</h2>
        <div className="flex flex-wrap gap-2">
          {divisions.map((d) => (
            <Link key={d.slug} href={`/districts#${d.slug}`} className="chip">{d.nameBn}</Link>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="text-xl font-bold"><Flag /> Bangladesh Food Challenge</h2>
        <p className="mt-1 text-sm text-stone-600">খাবারে টিক দিন, badge জিতুন, আর আপনার food journey card শেয়ার করুন।</p>
        <Link href="/journey" className="btn mt-3">My Journey দেখুন</Link>
      </section>
    </div>
  );
}
