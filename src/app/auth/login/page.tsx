"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Login successful!");
      router.push("/programs");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Side */}
      <div className="w-1/2 bg-[#0D1527] text-white flex flex-col justify-center items-center px-10">
        <h1 className="text-4xl font-bold flex items-center gap-2">
          GOOD
          <span className="relative inline-block">
            <AnimatedO />
          </span>
          ACTION
        </h1>
        <p className="mt-4 text-lg">
          Empower employees and communities to create positive impact.
        </p>
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex justify-center items-center">
        <div className="bg-white shadow-lg p-8 rounded-lg w-[400px]">
          <h2 className="text-2xl font-bold text-center">Sign In</h2>

          {/* Social Login Buttons */}

          <div className="relative text-center my-4">
            <div className="absolute left-0 top-1/2 w-full border-t border-gray-300"></div>
            <span className="bg-white px-2 relative text-gray-500">
              With Email & Password
            </span>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700">Email</label>
            <input
              type="email"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0D1527]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label className="block text-sm text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0D1527]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button
              type="button"
              className="absolute right-3 top-10 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* <div className="text-right text-green-500 text-sm mb-4">
            <Link href="/forgot-password">Forgot Password?</Link>
          </div> */}

          {/* Sign In Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#0D1527] text-white py-2 rounded-md text-lg hover:bg-[#091020] transition"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {/* Signup Link */}
          <p className="text-center text-gray-600 mt-4">
            Don’t have an account?{" "}
            <Link href="/auth/signup" className="text-green-500 font-medium">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Animated "O" in GOODACTION
const AnimatedO = () => {
  return (
    <svg
      className="w-6 h-6 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path d="M12 8v4l2 2" strokeWidth="2" />
    </svg>
  );
};
