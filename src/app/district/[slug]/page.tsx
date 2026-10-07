import Link from "next/link";
import { notFound } from "next/navigation";
import FoodCard from "@/components/FoodCard";
import { categories, foods } from "@/data/foods";
import { districts, getDistrict, getDivision } from "@/data/geo";
import { restaurants } from "@/data/restaurants";
import { priceLabel } from "@/lib/utils";

export function generateStaticParams() {
  return districts.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const d = getDistrict((await params).slug);
  return d ? { title: `${d.nameBn} এর খাবার — Food in ${d.nameEn} | Khai Kothay?` } : {};
}

export default async function DistrictPage({ params }: { params: Promise<{ slug: string }> }) {
  const d = getDistrict((await params).slug);
  if (!d) notFound();
  const div = getDivision(d.division);
  const local = foods.filter((f) => f.originDistrict === d.slug);
  const places = restaurants.filter((r) => r.district === d.slug);
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-stone-500">{div?.nameEn} Division</p>
        <h1 className="text-2xl font-extrabold">🍽️ {d.nameBn} এর খাবার · Food in {d.nameEn}</h1>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-bold">Popular / Local Specialties</h2>
        {local.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {local.map((f) => <FoodCard key={f.slug} food={f} />)}
          </div>
        ) : (
          <p className="card text-sm text-stone-500">এই জেলার খাবার এখনো যোগ হয়নি। <Link className="font-semibold text-brand" href="/add-place">আপনি যোগ করুন →</Link></p>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Best Places</h2>
        {places.length ? (
          <div className="space-y-3">
            {places.map((r) => (
              <Link key={r.slug} href={`/restaurant/${r.slug}`} className="card flex items-center justify-between hover:border-brand">
                <div>
                  <div className="font-semibold">{r.name} {r.demo && <span className="chip ml-1">demo</span>}</div>
                  <div className="text-sm text-stone-500">{r.address}</div>
                </div>
                <div className="text-right text-sm"><div>⭐ {r.rating}</div><div className="text-stone-500">{priceLabel(r.priceRange)}</div></div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="card text-sm text-stone-500">কোনো place নেই। <Link className="font-semibold text-brand" href="/add-place">Add a place →</Link></p>
        )}
      </section>
      <p className="text-xs text-stone-400">Categories: {categories.map((c) => c.labelEn).join(" · ")}</p>
    </div>
  );
}
