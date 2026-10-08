import type { Metadata } from "next";
import "@fontsource/hind-siliguri/400.css";
import "@fontsource/hind-siliguri/500.css";
import "@fontsource/hind-siliguri/600.css";
import "@fontsource/hind-siliguri/700.css";
import "@fontsource/baloo-da-2/600.css";
import "@fontsource/baloo-da-2/700.css";
import "@fontsource/baloo-da-2/800.css";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Khai Kothay? — বাংলাদেশের খাবার, কোথায় পাবেন?",
  description: "Bangladesh-first food discovery: find regional foods, where to eat them, and share your food journey.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <body>
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-8 text-center text-xs text-stone-500">
          Khai Kothay? · MVP · Sample restaurant listings are demo data.
        </footer>
      </body>
    </html>
  );
}
