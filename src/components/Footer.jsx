export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-gray-600">
        {/* Left Side Text */}
        <div>
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </div>

        {/* Right Side Text */}
        <div>
          সকল দাম সম্ভাব্য; বাজার অবস্থার উপর নির্ভর করে পরিবর্তিত হয়।
        </div>
      </div>
    </footer>
  );
}