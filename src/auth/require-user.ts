import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/supabase/server-client";

export async function requireUser(nextPath: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  return user;
}
