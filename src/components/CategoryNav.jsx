"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  { slug: "chal", name: "চাল", icon: "🍚" },
  { slug: "dal", name: "ডাল", icon: "🫘" },
  { slug: "oil", name: "তেল", icon: "🍾" },
  { slug: "sobji", name: "সবজি", icon: "🥦" },
  { slug: "mach", name: "মাছ", icon: "🐟" },
  { slug: "mangsho", name: "মাংস", icon: "🍗" },
  { slug: "dim_dudh", name: "ডিম-দুধ", icon: "🥛" },
  { slug: "moshla", name: "মসলা", icon: "🌶️" },
];

export default function CategoryNav({ activeSlug }) {
  const pathname = usePathname();

  return (
    <div className="w-full bg-white border-b border-gray-100 py-3 px-4">
      <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar justify-start md:justify-center">
        {categories.map((cat) => {
          // Check if current route matches /categories/:slug
          const isActive =
            activeSlug === cat.slug || pathname === `/categories/${cat.slug}`;

          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-emerald-700"
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}