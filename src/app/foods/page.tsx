import Link from "next/link";
import FoodCard from "@/components/FoodCard";
import { categories, foods } from "@/data/foods";

export const metadata = { title: "খাবার খুঁজুন — Khai Kothay?" };

export default async function FoodsPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const list = cat ? foods.filter((f) => f.category === cat) : foods;
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold">খাবার খুঁজুন</h1>
      <div className="flex flex-wrap gap-2">
        <Link href="/foods" className={!cat ? "btn" : "btn-ghost"}>সব</Link>
        {categories.map((c) => (
          <Link key={c.id} href={`/foods?cat=${c.id}`} className={cat === c.id ? "btn" : "btn-ghost"}>
            {c.emoji} {c.labelBn}
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {list.map((f) => <FoodCard key={f.slug} food={f} />)}
      </div>
      {list.length === 0 && <p className="text-stone-500">এই category তে এখনো কিছু নেই।</p>}
    </div>
  );
}
