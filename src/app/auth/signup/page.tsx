"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"NONPROFIT" | "CORPORATE">("NONPROFIT");
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } },
    });

    if (authError) {
      toast.error(authError.message);
      return;
    }

    if (authData.user) {
      const { error: insertError } = await supabase.from("User").insert([
        {
          id: authData.user.id,
          email: authData.user.email,
          role: authData.user.user_metadata.role || role,
          password: "placeholder",
        },
      ]);

      if (insertError) {
        console.error("Error inserting user profile:", insertError);
        toast.error("Error inserting user profile.");
        return;
      }
      toast.success(
        "Signup successful! Check your email to confirm your account."
      );
      router.push("/auth/verify"); // Redirect as needed
    }

    // Make sure we have a session and user after signup
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      toast.error("Session error: Please log in again.");
      return;
    }
  }

  return (
    <>
      <div className="max-w-md mx-auto my-10">
        <h1 className="text-2xl mb-4">Signup</h1>
        <form onSubmit={handleSignup} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "NONPROFIT" | "CORPORATE")
            }
            className="border p-2 rounded"
          >
            <option value="NONPROFIT">Nonprofit</option>
            <option value="CORPORATE">Corporate</option>
          </select>
          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded"
          >
            Signup
          </button>
        </form>
      </div>
    </>
  );
}
