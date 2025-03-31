"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import ProgramCard from "@/components/ProgramCard";

type Initiative = {
  id: string;
  type: "VOLUNTEER" | "FUNDRAISE";
  goal: string;
  startDate: string;
  endDate: string;
  status: "PLANNED" | "ONGOING" | "COMPLETED";
};

type Program = {
  id: string;
  title: string;
  description: string;
  sdgGoal: string;
  createdAt: string;
  initiatives: Initiative[];
};

export default function Dashboard() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sdgGoal, setSdgGoal] = useState("Goal1");

  // Fetch programs created by the current nonprofit user
  async function fetchPrograms() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) {
      console.error("No user session found in fetchPrograms");
      return;
    }
    const { data, error } = await supabase
      .from("Program")
      // Use the relationship name "Initiative" instead of "initiatives"
      .select("*, Initiative(*)")
      .eq("userId", user.id);
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

  async function handleCreateProgram(e: React.FormEvent) {
    e.preventDefault();

    // Fetch the session & user correctly
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      toast.error("Session error: Please log in again.");
      return;
    }

    const user = sessionData.session.user;
    if (!user) {
      toast.error("User not found. Please log in.");
      return;
    }

    // Insert the program
    const { data, error } = await supabase
      .from("Program") // Make sure the table name matches your database
      .insert([
        { title, description, sdgGoal, userId: user.id }, // ✅ Do NOT include "id"
      ])

      .select(); // Add this to return the inserted row

    if (error) {
      console.error("Insert Error:", JSON.stringify(error, null, 2)); // Log detailed error
      toast.error(`Error: ${error.message}`);
    } else {
      toast.success("Program created successfully!");
      setTitle("");
      setDescription("");
      setSdgGoal("Goal1");
      fetchPrograms();
    }
  }

  return (
    <>
      {/* <Navbar /> */}
      <div className="max-w-3xl mx-auto my-10">
        <h1 className="text-3xl mb-6">Dashboard</h1>
        <div className="border p-4 rounded mb-6">
          <h2 className="text-xl mb-2">Create a Program</h2>
          <form
            onSubmit={handleCreateProgram}
            className="flex flex-col space-y-4"
          >
            <input
              type="text"
              placeholder="Program Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <select
              value={sdgGoal}
              onChange={(e) => setSdgGoal(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="Goal1">Goal1</option>
              <option value="Goal2">Goal2</option>
              <option value="Goal3">Goal3</option>
            </select>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 rounded"
            >
              Create Program
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-2xl mb-4">Your Programs</h2>
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              refreshPrograms={fetchPrograms}
            />
          ))}
        </div>
      </div>
    </>
  );
}
