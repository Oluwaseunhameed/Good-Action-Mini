"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

// Define types for Support and Program
interface Support {
  id: string;
  programId: string;
  corporateId: string;
  message: string;
  supportedAt: string;
}

interface Program {
  id: string;
  title: string;
  description: string;
  sdgGoal: string;
  createdAt: string;
  initiatives: unknown[]; // Replace with a more specific type if needed
  supports: Support[];
}

interface SupportButtonProps {
  program: Program;
  refreshPrograms: () => void;
}

export default function SupportButton({
  program,
  refreshPrograms,
}: SupportButtonProps) {
  const [user, setUser] = useState<User | null>(null);
  const [hasSupported, setHasSupported] = useState(false);
  const [supportDetails, setSupportDetails] = useState<Support | null>(null);

  useEffect(() => {
    async function getUserSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        const support = program.supports.find(
          (s: Support) => s.corporateId === currentUser.id
        );
        if (support) {
          setHasSupported(true);
          setSupportDetails(support);
        }
      }
    }
    getUserSession();
  }, [program]);

  if (!user || user.user_metadata?.role !== "CORPORATE") {
    return null;
  }

  if (hasSupported && supportDetails) {
    return (
      <div className="mt-2 text-green-600">
        Supported by you on{" "}
        {new Date(supportDetails.supportedAt).toLocaleString()}
      </div>
    );
  }

  return (
    <Link href={`/support/${program.id}`}>
      <button className="bg-blue-600 text-white py-2 px-4 rounded mt-2">
        Support this Program
      </button>
    </Link>
  );
}
