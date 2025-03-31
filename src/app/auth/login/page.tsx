"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import Link from "next/link";

// Basic sanitization function (for demo purposes)
function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>?/gm, "").trim();
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const cleanEmail = sanitizeInput(email);
    const cleanPassword = sanitizeInput(password);

    const { error, data } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Login successful");
      const role = data.user?.user_metadata?.role;
      router.push(role === "NONPROFIT" ? "/dashboard" : "/programs");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-green-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-green-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold p-3 rounded transition-colors flex items-center justify-center"
          >
            {loading ? <ClipLoader size={20} color="#ffffff" /> : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-green-600 hover:underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
