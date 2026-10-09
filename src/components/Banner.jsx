'use client';

import Link from "next/link";
import Image from "next/image";

export default function Banner() {
  const banglaDate = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-[#f2f8f5] border border-emerald-100/80 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
        
        {/* Left Side: Content */}
        <div className="flex-1 space-y-4 text-left">
          {/* Pill Date Badge */}
          <div className="inline-block bg-emerald-100/70 border border-emerald-200/60 px-4 py-1 rounded-full text-xs md:text-sm font-medium text-emerald-800">
            {banglaDate}
          </div>

          {/* Main Title */}
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            আজকের বাজারের দাম এক নজরে
          </h1>

          {/* Subtitle / Description */}
          <p className="text-xs md:text-sm text-gray-600 max-w-xl leading-relaxed">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          {/* Green Call-to-Action Button */}
          <div className="pt-2">
            <Link
              href="#products"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <span>সব পণ্য দেখুন</span>
              <span className="text-base">→</span>
            </Link>
          </div>
        </div>

        {/* Right Side: Next.js Image Component */}
        <div className="w-48 md:w-64 shrink-0 flex justify-center items-center">
          <Image
            src="/bazar-hero.png"
            alt="বাজারের ঝুড়ি"
            width={256}
            height={224}
            priority
            className="w-full h-auto object-contain"
          />
        </div>

      </div>
    </div>
  );
}