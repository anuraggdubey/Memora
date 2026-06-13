export function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  const parsedUrl = new URL(supabaseUrl);
  const normalizedUrl = parsedUrl.origin;

  if (parsedUrl.pathname !== "/" && parsedUrl.pathname !== "") {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must be the project URL, for example https://your-project.supabase.co.",
    );
  }

  return {
    supabaseUrl: normalizedUrl,
    supabaseAnonKey,
  };
}
