import { requireUser } from "@/auth/require-user";
import Settings from "./Settings";

export default async function SettingsPage() {
  const user = await requireUser("/settings");

  const email = user.email ?? "";
  const displayName =
    user.user_metadata?.display_name ?? user.user_metadata?.full_name ?? "";

  return <Settings userEmail={email} userDisplayName={displayName} />;
}
