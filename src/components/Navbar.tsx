"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const role = user?.user_metadata?.role;

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        {/* Brand */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center">
            <span className="text-white font-bold text-2xl tracking-wide">
              GoodAction
            </span>
          </Link>
        </div>
        {/* Nav Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-gray-300 hover:text-white transition-colors font-medium"
          >
            Home
          </Link>
          <Link
            href="/programs"
            className="text-gray-300 hover:text-white transition-colors font-medium"
          >
            Programs
          </Link>
          {!user && (
            <>
              <Link
                href="/auth/login"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Signup
              </Link>
            </>
          )}
          {user && role === "NONPROFIT" && (
            <Link
              href="/dashboard"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Dashboard
            </Link>
          )}
          {user && (
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/";
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded transition-colors"
            >
              Logout
            </button>
          )}
        </div>
        {/* Mobile Menu Placeholder */}
        <div className="md:hidden">
          <button className="text-gray-300 hover:text-white focus:outline-none focus:text-white">
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
