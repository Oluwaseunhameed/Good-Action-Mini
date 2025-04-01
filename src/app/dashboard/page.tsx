"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import ProgramCard from "@/components/ProgramCard";
import { ClipLoader } from "react-spinners";
import { Program } from "@/types/program";

// Simple sanitization function
function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>?/gm, "").trim();
}

export default function Dashboard() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sdgGoal, setSdgGoal] = useState("Goal1");
  const [loading, setLoading] = useState(false);

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
      .select(
        "*, initiatives:Initiative(*), supports:Support(*, corporate:User(email, name))"
      )
      .eq("userId", user.id)
      .order("createdAt", { ascending: false }); // latest first
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
    setLoading(true);

    // Sanitize inputs
    const cleanTitle = sanitizeInput(title);
    const cleanDescription = sanitizeInput(description);
    const cleanSdgGoal = sanitizeInput(sdgGoal);

    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      toast.error("Session error: Please log in again.");
      setLoading(false);
      return;
    }
    const user = sessionData.session.user;
    if (!user) {
      toast.error("User not found. Please log in.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("Program")
      .insert([
        {
          title: cleanTitle,
          description: cleanDescription,
          sdgGoal: cleanSdgGoal,
          userId: user.id,
        },
      ])
      .select();

    if (error) {
      console.error("Insert Error:", JSON.stringify(error, null, 2));
      toast.error(`Error: ${error.message}`);
    } else {
      toast.success("Program created successfully!");
      setTitle("");
      setDescription("");
      setSdgGoal("Goal1");
      fetchPrograms();
    }
    setLoading(false);
  }

  return (
    <>
      <div className="container mx-auto my-10 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
        <div className="bg-white shadow rounded p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Create a Program</h2>
          <form
            onSubmit={handleCreateProgram}
            className="flex flex-col space-y-4"
          >
            <input
              type="text"
              placeholder="Program Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-3 rounded focus:outline-none focus:ring focus:ring-green-400"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-3 rounded focus:outline-none focus:ring focus:ring-green-400"
              required
            />
            <select
              value={sdgGoal}
              onChange={(e) => setSdgGoal(e.target.value)}
              className="border p-3 rounded focus:outline-none focus:ring focus:ring-green-400"
            >
              <option value="Goal1">Goal1</option>
              <option value="Goal2">Goal2</option>
              <option value="Goal3">Goal3</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white py-3 rounded hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              {loading ? (
                <ClipLoader size={20} color="#fff" />
              ) : (
                "Create Program"
              )}
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Programs</h2>
          {programs.length === 0 ? (
            <p className="text-center text-gray-600">No programs found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  refreshPrograms={fetchPrograms}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
