"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { ClipLoader } from "react-spinners";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"NONPROFIT" | "CORPORATE">("NONPROFIT");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, role },
      },
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Signup successful! Please verify your email.");
      router.push("/auth/verify");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Hidden on mobile */}
      <div className="hidden md:flex w-1/2 relative">
        <Image
          src="/login-bg.jpg" // Replace with your background image for signup
          alt="Signup Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center p-8">
          <h1 className="text-4xl font-bold flex items-center gap-2 text-white">
            GOOD
            <span className="relative inline-block">
              <AnimatedO />
            </span>
            ACTION
          </h1>
          <p className="mt-4 text-lg text-white text-center">
            Empower employees and communities to create positive impact.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-100">
        <div className="bg-white shadow-lg p-8 rounded-lg w-[400px]">
          <h2 className="text-2xl font-bold text-center">Create an account</h2>
          <div className="relative text-center my-4">
            <div className="absolute left-0 top-1/2 w-full border-t border-gray-300"></div>
            <span className="bg-white px-2 relative text-gray-500">
              With Email & Password
            </span>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700">Full Name</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0D1527]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required
            />
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
              required
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
              required
            />
            <button
              type="button"
              className="absolute right-3 top-10 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="mb-4 relative">
            <label className="block text-sm text-gray-700">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0D1527]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
          </div>

          {/* Sign Up Button */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-[#0D1527] text-white py-2 rounded-md text-lg hover:bg-[#091020] transition flex items-center justify-center"
          >
            {loading ? <ClipLoader size={20} color="#ffffff" /> : "Sign up"}
          </button>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-green-500 font-medium">
              Sign in here
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
