"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import SupportButton from "@/components/SupportButton";

// Define Initiative type based on the schema
type Initiative = {
  id: string;
  type: "VOLUNTEER" | "FUNDRAISE";
  goal: string;
  startDate: string;
  endDate: string;
  status: "PLANNED" | "ONGOING" | "COMPLETED";
};

// Define Support type based on the schema
type Support = {
  id: string;
  programId: string;
  corporateId: string;
  message: string;
  supportedAt: string;
};

// Define Program type using the above types
type Program = {
  id: string;
  title: string;
  description: string;
  sdgGoal: string;
  createdAt: string;
  initiatives: Initiative[];
  supports: Support[];
};

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);

  async function fetchPrograms() {
    const { data, error } = await supabase
      .from("Program")
      .select("*, initiatives:Initiative(*), supports:Support(*)");
    if (error) {
      console.error("Error fetching programs:", error);
      toast.error(error.message);
    } else {
      setPrograms((data as Program[]) || []);
    }
  }

  useEffect(() => {
    fetchPrograms();
  }, []);

  return (
    <>
      <div className="max-w-3xl mx-auto my-10">
        <h1 className="text-3xl mb-6">All Programs</h1>
        {programs.length === 0 && <p>No programs found.</p>}
        {programs.map((program) => (
          <div key={program.id} className="border p-4 rounded mb-4">
            <h3 className="text-xl font-bold">{program.title}</h3>
            <p>{program.description}</p>
            <p className="italic">SDG Goal: {program.sdgGoal}</p>
            {program.initiatives && program.initiatives.length > 0 && (
              <div className="mt-2">
                <strong>Initiatives:</strong>
                {program.initiatives.map((ini) => (
                  <p key={ini.id}>
                    - {ini.goal} ({ini.status})
                  </p>
                ))}
              </div>
            )}
            <div className="mt-2">
              <p>
                <strong>Impact Summary:</strong>{" "}
                {generateImpactSummary(program)}
              </p>
              <SupportButton
                program={program}
                refreshPrograms={fetchPrograms}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// A mock function for AI-generated summary (replace with actual OpenAI integration as needed)
function generateImpactSummary(program: Program): string {
  return `This program titled "${program.title}" is making an impact by addressing SDG Goal ${program.sdgGoal}.`;
}
