// app/support/[programId].tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import { ensureUserProfile } from "@/utils/ensureUserProfile";

export default function SupportFormPage() {
  // Extract the programId from the URL parameters.
  const { programId } = useParams() as { programId: string };
  const router = useRouter();

  // State for form fields.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Log that the form submission has started.
    console.log("Submitting support form for program:", programId);

    // Fetch the session and check for a valid user.
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    console.log("Session Data:", sessionData, "Session Error:", sessionError);
    if (sessionError || !sessionData.session) {
      toast.error("You must be logged in as a corporate user.");
      return;
    }
    const user = sessionData.session.user;
    if (!user) {
      toast.error("User not found. Please log in.");
      return;
    }
    console.log("User:", user);

    // Ensure the user profile exists in the public User table
    await ensureUserProfile(user);

    // Prepare the payload.
    const payload = {
      programId,
      corporateId: user.id,
      message,
    };
    console.log("Payload for insert:", payload);

    // Insert the support record without .select() to avoid extra query parameters.
    const { data, error } = await supabase.from("Support").insert([payload]);

    console.log("Insert result:", { data, error });

    if (error) {
      console.error("Error inserting support:", JSON.stringify(error, null, 2));
      toast.error(error.message);
    } else {
      toast.success("Thank you for your support!");
      router.push("/programs"); // Redirect back to the Programs page.
    }
  }

  return (
    <>
      <div className="max-w-md mx-auto my-10">
        <h1 className="text-2xl mb-4">Support this Program</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <button type="submit" className="bg-blue-600 text-white py-2 rounded">
            Submit Support
          </button>
        </form>
      </div>
    </>
  );
}
