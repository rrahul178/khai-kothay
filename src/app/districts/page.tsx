import Link from "next/link";
import { divisions, districts } from "@/data/geo";

export const metadata = { title: "জেলার খাবার — Khai Kothay?" };

export default function DistrictsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-extrabold">জেলার খাবার</h1>
      {divisions.map((div) => (
        <section key={div.slug} id={div.slug}>
          <h2 className="mb-2 text-lg font-bold text-brand">{div.nameBn} বিভাগ · {div.nameEn}</h2>
          <div className="flex flex-wrap gap-2">
            {districts.filter((d) => d.division === div.slug).map((d) => (
              <Link key={d.slug} href={`/district/${d.slug}`} className="btn-ghost">{d.nameBn}</Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
