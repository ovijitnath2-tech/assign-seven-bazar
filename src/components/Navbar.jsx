'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

// Default categories matching Figma for instant UI rendering
const defaultCategories = [
  { id: "chal", name: "চাল", emoji: "🍚" },
  { id: "dal", name: "ডাল", emoji: "🫘" },
  { id: "tel", name: "তেল", emoji: "🫙" },
  { id: "sobji", name: "সবজি", emoji: "🥬" },
  { id: "mach", name: "মাছ", emoji: "🐟" },
  { id: "mangso", name: "মাংস", emoji: "🍗" },
  { id: "dim-dudh", name: "ডিম-দুধ", emoji: "🥛" },
  { id: "mosla", name: "মসলা", emoji: "🌶️" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [categories, setCategories] = useState(defaultCategories);

  const banglaDate = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/bazardor/categories");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCategories(data);
          }
        }
      } catch (error) {
        console.error("Using default categories fallback:", error);
      }
    }
    loadCategories();
  }, []);

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-xl">
            🛒
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">
              বাজার দর
            </h1>
            <p className="text-xs text-gray-500 mt-1">{banglaDate}</p>
          </div>
        </Link>

        {/* Right Auth Buttons */}
        <div className="flex items-center gap-4">
          {isPending ? (
            <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          ) : session?.user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700 font-medium">
                {session.user.name}
              </span>
              <button
                onClick={() => signOut()}
                className="text-xs px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 font-medium transition-colors"
              >
                সাইন আউট
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="text-sm font-medium text-gray-700 hover:text-emerald-600 px-2 py-1"
              >
                সাইন ইন
              </Link>
              <Link
                href="/sign-up"
                className="text-sm bg-emerald-600 text-white font-medium hover:bg-emerald-700 px-4 py-2 rounded-md transition-colors"
              >
                সাইন আপ
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Category Links Row */}
      <div className="border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-8 overflow-x-auto py-2.5 text-sm no-scrollbar">
          {categories.map((cat) => {
            const slug = cat.id || cat.slug || cat.name;
            const isActive = pathname === `/category/${slug}`;
            return (
              <Link
                key={slug}
                href={`/category/${slug}`}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm transition-all shrink-0 ${
                  isActive
                    ? "bg-emerald-100 text-emerald-800 font-semibold"
                    : "text-gray-600 hover:text-emerald-600 hover:bg-gray-100"
                }`}
              >
                <span>{cat.emoji || "📦"}</span>
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}