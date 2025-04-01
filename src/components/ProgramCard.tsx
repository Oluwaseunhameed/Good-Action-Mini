"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import InitiativeForm from "./InitiativeForm";
import { Program } from "@/types/program";

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
    <div className="border p-4 rounded mb-4 bg-white shadow">
      <h3 className="text-xl font-semibold">{program.title}</h3>
      <p className="text-gray-700">{program.description}</p>
      <p className="italic text-gray-500">SDG Goal: {program.sdgGoal}</p>

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
          <h4 className="text-lg font-semibold">Initiatives</h4>
          {program.initiatives.map((ini) => (
            <div
              key={ini.id}
              className="border p-2 rounded my-2 flex justify-between items-center"
            >
              <div>
                <p className="text-sm">Type: {ini.type}</p>
                <p className="text-sm">Goal: {ini.goal}</p>
                <p className="text-sm">Status: {ini.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {program.supports && program.supports.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold">Support Details</h4>
          {program.supports.map((support) => (
            <div key={support.id} className="border p-2 rounded my-2">
              <p className="text-sm">
                Supported by: {support.corporate.name} (
                {support.corporate.email})
              </p>
              <p className="text-sm">Message: {support.message}</p>
              <p className="text-sm text-gray-500">
                On: {new Date(support.supportedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
