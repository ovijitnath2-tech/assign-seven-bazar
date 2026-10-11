"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    async function loadSession() {
      try {
        const { data } = await authClient.getSession();
        if (data?.user) {
          setSession(data.user);
          setName(data.user.name || "");
        } else {
          router.push("/signin");
        }
      } catch (err) {
        console.error("Failed to load session:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/signin");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setUpdating(true);

    try {
      const { error } = await authClient.updateUser({ name });
      if (error) {
        setMessage({ text: "আপডেট করতে ব্যর্থ হয়েছে।", type: "error" });
      } else {
        setMessage({ text: "তথ্য সফলভাবে আপডেট করা হয়েছে!", type: "success" });
        setSession((prev) => (prev ? { ...prev, name } : null));
      }
    } catch (err) {
      setMessage({ text: "একটি ত্রুটি ঘটেছে, আবার চেষ্টা করুন।", type: "error" });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f8f5] flex justify-center items-center">
        <p className="text-sm font-medium text-gray-600">লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f8f5] py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* Header Title */}
        <div className="text-left space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            আমার প্রোফাইল
          </h1>
          <p className="text-xs md:text-sm text-gray-500 font-medium">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-emerald-100 flex-shrink-0 border border-emerald-200">
              {session?.image ? (
                <Image
                  src={session.image}
                  alt={session.name || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-emerald-800 text-xl font-bold uppercase">
                  {session?.name ? session.name[0] : "U"}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {session?.name || "ব্যবহারকারী"}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {session?.email || "user@example.com"}
              </p>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>↳</span>
            <span>সাইন আউট</span>
          </button>
        </div>

        {/* Update Form Card */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-gray-800">
            তথ্য
          </h3>

          {message.text && (
            <div
              className={`text-xs p-3 rounded-xl text-center font-medium ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-red-50 text-red-600 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                নাম
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600 text-sm text-gray-800 bg-gray-50/30 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {updating ? "অপেক্ষা করুন..." : "আপডেট"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}