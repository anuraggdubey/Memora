import Home from "../pages/Home";
import PublicHome from "../components/PublicHome";
import { createSupabaseServerClient } from "@/lib/supabase.server";

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? <Home /> : <PublicHome />;
}
