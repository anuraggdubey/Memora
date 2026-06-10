import type { ReactNode } from "react";
import { createSupabaseServerClient } from "@/lib/supabase.server";
import AppLayout from "../layout/AppLayout";

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AppLayout isAuthenticated={Boolean(user)}>{children}</AppLayout>;
}
