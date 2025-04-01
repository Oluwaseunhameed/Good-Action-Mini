import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

export async function ensureUserProfile(user: User) {
  // Check if user profile exists
  const { data: profileData } = await supabase
    .from("User")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!profileData) {
    // Insert a profile if it doesn't exist
    await supabase.from("User").insert([
      {
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role || "CORPORATE",
        password: "placeholder",
      },
    ]);
  }
}
