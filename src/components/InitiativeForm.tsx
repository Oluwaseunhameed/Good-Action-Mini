"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";

interface InitiativeFormProps {
  programId: string;
  refreshPrograms: () => void;
}

export default function InitiativeForm({
  programId,
  refreshPrograms,
}: InitiativeFormProps) {
  const [type, setType] = useState("VOLUNTEER");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("PLANNED");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase
      .from("Initiative")
      .insert([{ type, goal, startDate, endDate, status, programId }]);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Initiative added");
      setGoal("");
      setStartDate("");
      setEndDate("");
      refreshPrograms();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col space-y-2">
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="VOLUNTEER">Volunteer</option>
        <option value="FUNDRAISE">Fundraise</option>
      </select>
      <input
        type="text"
        placeholder="Initiative Goal"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="date"
        placeholder="Start Date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="date"
        placeholder="End Date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="PLANNED">Planned</option>
        <option value="ONGOING">Ongoing</option>
        <option value="COMPLETED">Completed</option>
      </select>
      <button type="submit" className="bg-blue-600 text-white py-2 rounded">
        Add Initiative
      </button>
    </form>
  );
}
