import { requireUser } from "@/auth/require-user";
import Insights from "./Insights";

export default async function InsightsPage() {
  await requireUser("/insights");

  return <Insights />;
}
