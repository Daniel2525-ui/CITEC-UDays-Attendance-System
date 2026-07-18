import { supabase } from "@/lib/supabase";

export async function getSessionWithRole() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return { session: null, role: null };
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (profileError) {
    console.error(profileError.message);
    return { session, role: null };
  }

  return { session, role: profile.role };
}
