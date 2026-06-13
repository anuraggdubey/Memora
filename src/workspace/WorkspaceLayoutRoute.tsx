import type { ReactNode } from "react";
import { createSupabaseServerClient } from "@/supabase/server-client";
import AppLayout from "./AppLayout";

export default async function WorkspaceLayoutRoute({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AppLayout isAuthenticated={Boolean(user)}>{children}</AppLayout>;
}
