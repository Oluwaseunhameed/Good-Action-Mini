// app/layout.tsx
import Navbar from "@/components/Navbar";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-800">
        <Navbar />
        <main>{children}</main>
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
