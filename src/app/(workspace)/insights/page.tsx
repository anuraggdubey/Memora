import { requireUser } from "@/lib/auth.server";
import Insights from "../../pages/Insights";

export default async function Page() {
  await requireUser("/insights");

  return <Insights />;
}
