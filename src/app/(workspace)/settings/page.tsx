import { requireUser } from "@/lib/auth.server";
import Settings from "../../pages/Settings";

export default async function Page() {
  await requireUser("/settings");

  return <Settings />;
}
