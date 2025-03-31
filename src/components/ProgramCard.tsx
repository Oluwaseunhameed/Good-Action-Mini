"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import InitiativeForm from "./InitiativeForm";

type Initiative = {
  id: string;
  type: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: string;
};

type Program = {
  id: string;
  title: string;
  description: string;
  sdgGoal: string;
  createdAt: string;
  initiatives: Initiative[];
  // optionally add supports if available
};

interface ProgramCardProps {
  program: Program;
  refreshPrograms: () => void;
}

export default function ProgramCard({
  program,
  refreshPrograms,
}: ProgramCardProps) {
  const [showInitiativeForm, setShowInitiativeForm] = useState(false);

  return (
    <div className="border p-4 rounded mb-4">
      <h3 className="text-xl">{program.title}</h3>
      <p>{program.description}</p>
      <p className="italic">SDG Goal: {program.sdgGoal}</p>
      <button
        className="text-blue-500 mt-2"
        onClick={() => setShowInitiativeForm(!showInitiativeForm)}
      >
        {showInitiativeForm ? "Hide Initiative Form" : "Add Initiative"}
      </button>
      {showInitiativeForm && (
        <InitiativeForm
          programId={program.id}
          refreshPrograms={refreshPrograms}
        />
      )}
      {program.initiatives && program.initiatives.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg">Initiatives</h4>
          {program.initiatives.map((ini) => (
            <div
              key={ini.id}
              className="border p-2 rounded my-2 flex justify-between items-center"
            >
              <div>
                <p>Type: {ini.type}</p>
                <p>Goal: {ini.goal}</p>
                <p>Status: {ini.status}</p>
              </div>
              {/* <button
                onClick={() => {
                  // Trigger edit (for brevity, reusing InitiativeForm with prefill can be implemented here)
                  toast("Edit functionality coming soon!");
                }}
                className="text-yellow-500"
              >
                Edit
              </button> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
