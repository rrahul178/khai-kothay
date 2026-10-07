import Link from "next/link";
import { notFound } from "next/navigation";
import { SaveButton } from "@/components/EatenButton";
import { getFood } from "@/data/foods";
import { getDistrict } from "@/data/geo";
import { getRestaurant, restaurants } from "@/data/restaurants";
import { directionsUrl, priceLabel, taka } from "@/lib/utils";

export function generateStaticParams() {
  return restaurants.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const r = getRestaurant((await params).slug);
  return r ? { title: `${r.name} | Khai Kothay?` } : {};
}

export default async function RestaurantPage({ params }: { params: Promise<{ slug: string }> }) {
  const r = getRestaurant((await params).slug);
  if (!r) notFound();
  const d = getDistrict(r.district);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">🍽️ {r.name}</h1>
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          {r.verified ? <span className="chip">Verified Business ✓</span> : <span className="chip">Unverified</span>}
          {r.demo && <span className="chip">Demo listing, not a real business</span>}
          <span className="chip">⭐ {r.rating}</span>
          <span className="chip">{priceLabel(r.priceRange)}</span>
        </div>
        <p className="mt-3 text-stone-700">📍 {r.address}{d ? `, ${d.nameEn}` : ""}</p>
        {r.phone && <p className="text-stone-700">📞 {r.phone}</p>}
      </div>

      <div className="flex flex-wrap gap-2">
        <a className="btn" target="_blank" rel="noreferrer" href={directionsUrl(r.lat, r.lng)}>📍 Directions</a>
        {r.phone && <a className="btn-ghost" href={`tel:${r.phone}`}>📞 Call</a>}
        <SaveButton slug={`r:${r.slug}`} />
      </div>

      <section>
        <h2 className="mb-2 text-lg font-bold">Menu</h2>
        <div className="card p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-100 text-stone-600"><tr><th className="p-3">Item</th><th className="p-3">Price</th></tr></thead>
            <tbody>
              {r.menu.map((m) => {
                const f = getFood(m.foodSlug);
                return (
                  <tr key={m.foodSlug} className="border-t border-stone-100">
                    <td className="p-3"><Link href={`/food/${m.foodSlug}`} className="text-brand">{f?.nameBn} · {f?.nameEn}</Link></td>
                    <td className="p-3">{taka(m.price)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
