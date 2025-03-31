"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import Link from "next/link";

// Basic sanitization function
function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>?/gm, "").trim();
}

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"NONPROFIT" | "CORPORATE">("NONPROFIT");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const cleanEmail = sanitizeInput(email);
    const cleanPassword = sanitizeInput(password);

    // Sign up using Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password: cleanPassword,
      options: { data: { role } },
    });

    if (authError) {
      setLoading(false);
      toast.error(authError.message);
      return;
    }

    if (authData.user) {
      // Insert the user profile into your public "User" table with a dummy password.
      const { error: insertError } = await supabase.from("User").insert([
        {
          id: authData.user.id,
          email: authData.user.email,
          role: authData.user.user_metadata.role || role,
          password: "placeholder",
        },
      ]);
      if (insertError) {
        setLoading(false);
        console.error("Error inserting user profile:", insertError);
        toast.error("Error inserting user profile.");
        return;
      }
      toast.success(
        "Signup successful! Check your email to confirm your account."
      );
      router.push("/auth/verify");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Signup
        </h1>
        <form onSubmit={handleSignup} className="space-y-4">
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
          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "NONPROFIT" | "CORPORATE")
            }
            className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring focus:ring-green-400"
          >
            <option value="NONPROFIT">Nonprofit</option>
            <option value="CORPORATE">Corporate</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold p-3 rounded transition-colors flex items-center justify-center"
          >
            {loading ? <ClipLoader size={20} color="#ffffff" /> : "Signup"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-green-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
