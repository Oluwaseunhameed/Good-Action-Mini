"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import SupportButton from "@/components/SupportButton";
import { ClipLoader } from "react-spinners";

type Initiative = {
  id: string;
  type: "VOLUNTEER" | "FUNDRAISE";
  goal: string;
  startDate: string;
  endDate: string;
  status: "PLANNED" | "ONGOING" | "COMPLETED";
};

type Support = {
  id: string;
  programId: string;
  corporateId: string;
  message: string;
  supportedAt: string;
};

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
  const [loading, setLoading] = useState(false);

  async function fetchPrograms() {
    setLoading(true);
    const { data, error } = await supabase
      .from("Program")
      .select("*, initiatives:Initiative(*), supports:Support(*)");
    if (error) {
      console.error("Error fetching programs:", error);
      toast.error(error.message);
    } else {
      setPrograms((data as Program[]) || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchPrograms();
  }, []);

  return (
    <>
      <div className="container mx-auto my-10 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">All Programs</h1>
        {loading ? (
          <div className="flex justify-center items-center">
            <ClipLoader size={40} color="#10B981" />
          </div>
        ) : programs.length === 0 ? (
          <p className="text-center text-gray-600">No programs found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div
                key={program.id}
                className="border rounded-lg p-6 shadow-md bg-white flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-2xl font-semibold mb-2">
                    {program.title}
                  </h3>
                  <p className="text-gray-700 mb-2">{program.description}</p>
                  <p className="italic text-gray-500 mb-4">
                    SDG Goal: {program.sdgGoal}
                  </p>
                  {program.initiatives && program.initiatives.length > 0 && (
                    <div className="mb-4">
                      <strong className="block text-gray-800 mb-1">
                        Initiatives:
                      </strong>
                      {program.initiatives.map((ini) => (
                        <p key={ini.id} className="text-gray-600">
                          - {ini.goal} ({ini.status})
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <div className="border-t pt-4">
                  <p className="mb-2 font-medium text-gray-800">
                    Impact Summary:
                  </p>
                  <p className="text-gray-600 mb-4">
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
        )}
      </div>
    </>
  );
}

// A mock function for AI-generated summary (replace with actual OpenAI integration as needed)
function generateImpactSummary(program: Program): string {
  return `This program titled "${program.title}" is making an impact by addressing SDG Goal ${program.sdgGoal}.`;
}
