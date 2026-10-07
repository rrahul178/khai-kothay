import Link from "next/link";
import { notFound } from "next/navigation";
import { EatenButton, SaveButton } from "@/components/EatenButton";
import { categories, foods, getFood } from "@/data/foods";
import { getDistrict } from "@/data/geo";
import { restaurants } from "@/data/restaurants";
import { directionsUrl, taka } from "@/lib/utils";

export function generateStaticParams() {
  return foods.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const f = getFood((await params).slug);
  return f ? { title: `${f.nameBn} (${f.nameEn}) — কোথায় পাবেন? | Khai Kothay?`, description: f.description } : {};
}

export default async function FoodPage({ params }: { params: Promise<{ slug: string }> }) {
  const food = getFood((await params).slug);
  if (!food) notFound();
  const cat = categories.find((c) => c.id === food.category);
  const d = getDistrict(food.originDistrict);
  const where = restaurants
    .map((r) => ({ r, item: r.menu.find((m) => m.foodSlug === food.slug) }))
    .filter((x) => x.item);
  return (
    <div className="space-y-6">
      <div>
        <div className="text-4xl">{cat?.emoji}</div>
        <h1 className="mt-1 text-2xl font-extrabold">{food.nameBn} <span className="text-stone-400">· {food.nameEn}</span></h1>
        <p className="mt-2 text-stone-700">{food.description}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <span className="chip">{cat?.labelEn}</span>
          {d && <Link href={`/district/${d.slug}`} className="chip">📍 {d.nameEn}</Link>}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <EatenButton slug={food.slug} />
        <SaveButton slug={food.slug} />
      </div>

      <section>
        <h2 className="mb-2 text-lg font-bold">Where to eat</h2>
        {where.length ? (
          <div className="card overflow-x-auto p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-100 text-stone-600">
                <tr><th className="p-3">Place</th><th className="p-3">Area</th><th className="p-3">Price</th><th className="p-3">Rating</th><th className="p-3"></th></tr>
              </thead>
              <tbody>
                {where.map(({ r, item }) => (
                  <tr key={r.slug} className="border-t border-stone-100">
                    <td className="p-3"><Link href={`/restaurant/${r.slug}`} className="font-semibold text-brand">{r.name}</Link> {r.demo && <span className="chip">demo</span>}</td>
                    <td className="p-3">{getDistrict(r.district)?.nameEn}</td>
                    <td className="p-3">{taka(item!.price)}</td>
                    <td className="p-3">⭐ {r.rating}</td>
                    <td className="p-3"><a href={directionsUrl(r.lat, r.lng)} target="_blank" rel="noreferrer" className="text-brand">📍 Directions</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="card text-sm text-stone-500">এই খাবারের জন্য এখনো কোনো place নেই। <Link className="font-semibold text-brand" href="/add-place">যোগ করুন →</Link></p>
        )}
      </section>
    </div>
  );
}
