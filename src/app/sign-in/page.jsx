"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    setLoading(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setServerError(error.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়।");
      } else {
        router.push("/");
      }
    } catch (err) {
      setServerError("একটি ত্রুটি ঘটেছে, আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  
  const handleSocialSignIn = async (provider) => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (err) {
      setServerError(`${provider} দিয়ে সাইন ইন করতে সমস্যা হয়েছে।`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f8f5] flex flex-col justify-center items-center py-12 px-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            সাইন ইন
          </h1>
          <p className="text-xs md:text-sm text-gray-600 font-medium">
            বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
          </p>
        </div>

        {/* Card Body */}
        <div className="bg-white rounded-3xl p-8 border border-emerald-100/80 shadow-xs space-y-5">
          {serverError && (
            <div className="bg-red-50 text-red-600 border border-red-200 text-xs p-3 rounded-xl text-center font-medium">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                ইমেইল
              </label>
              <input
                required
                name="email"
                type="email"
                placeholder="ইমেইল লিখুন"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600 text-sm text-gray-800 bg-gray-50/30 transition-colors"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                পাসওয়ার্ড
              </label>
              <input
                required
                name="password"
                type="password"
                placeholder="পাসওয়ার্ড লিখুন"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600 text-sm text-gray-800 bg-gray-50/30 transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {loading ? "অপেক্ষা করুন..." : "সাইন ইন করুন"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-gray-200 w-full"></div>
            <span className="bg-white px-3 text-xs text-gray-400 font-medium absolute">
              অথবা
            </span>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={() => handleSocialSignIn("google")}
              className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 rounded-xl py-2 px-3 text-xs font-medium text-gray-700 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google দিয়ে চালিয়ে যান</span>
            </button>

            {/* GitHub OAuth Button */}
            <button
              type="button"
              onClick={() => handleSocialSignIn("github")}
              className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 rounded-xl py-2 px-3 text-xs font-medium text-gray-700 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current text-gray-800" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub দিয়ে চালিয়ে যান</span>
            </button>
          </div>

          {/* Link to Sign Up Page */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-600 font-medium">
              অ্যাকাউন্ট নেই?{" "}
              <Link
                href="/signup"
                className="text-emerald-600 hover:text-emerald-700 font-bold underline underline-offset-2"
              >
                সাইন আপ করুন
              </Link>
            </p>
          </div>
        </div>

        {/* Home Navigation */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>

      </div>
    </div>
  );
}