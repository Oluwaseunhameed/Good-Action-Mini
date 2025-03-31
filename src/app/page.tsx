// app/page.tsx
"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-[url('/hero-background.jpg')] bg-cover bg-center h-[80vh] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="relative z-10 text-center text-white px-4 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Working Together to <span className="text-green-400">Change </span>
          the World for <span className="text-green-400">Good</span>
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Where Purpose Driven Individuals, Nonprofits, and Businesses are
          uniting for impact.
        </p>
        <Link
          href="/programs"
          className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full transition-colors"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
