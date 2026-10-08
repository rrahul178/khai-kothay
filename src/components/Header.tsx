import Link from "next/link";
import Flag from "./Flag";

const nav = [
  { href: "/foods", label: "খাবার খুঁজুন" },
  { href: "/near-me", label: "কোথায় খাব?" },
  { href: "/districts", label: "জেলার খাবার" },
  { href: "/map", label: "Food Map" },
  { href: "/journey", label: "My Journey" },
  { href: "/add-place", label: "Add a Place" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-brand">
          <span className="font-display text-xl">খাই কোথায়?</span> <Flag />
        </Link>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-stone-600">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-brand">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
