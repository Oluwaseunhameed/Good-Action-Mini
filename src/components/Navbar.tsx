"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <>
      <nav className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Link href="/">
              <span className="text-white font-bold text-2xl tracking-wide">
                GoodAction
              </span>
            </Link>
          </div>
          {/* Desktop Navigation */}
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
          {/* Mobile Hamburger Icon */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex flex-col items-center justify-center space-y-6">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-4 right-4 text-gray-300 hover:text-white focus:outline-none"
          >
            <X size={30} />
          </button>
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-white text-2xl font-medium hover:underline"
          >
            Home
          </Link>
          <Link
            href="/programs"
            onClick={() => setMobileMenuOpen(false)}
            className="text-white text-2xl font-medium hover:underline"
          >
            Programs
          </Link>
          {!user && (
            <>
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white text-2xl font-medium hover:underline"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white text-2xl font-medium hover:underline"
              >
                Signup
              </Link>
            </>
          )}
          {user && role === "NONPROFIT" && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white text-2xl font-medium hover:underline"
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
              className="w-full text-center bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </>
  );
}
