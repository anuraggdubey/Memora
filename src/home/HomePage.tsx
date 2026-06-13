import PublicHome from "./PublicHome";
import WorkspaceHome from "@/workspace/Home";
import AppLayout from "@/workspace/AppLayout";
import { createSupabaseServerClient } from "@/supabase/server-client";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <AppLayout isAuthenticated={true}>
      <WorkspaceHome />
    </AppLayout>
  ) : (
    <PublicHome />
  );
}
