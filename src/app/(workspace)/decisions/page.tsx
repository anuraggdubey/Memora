import { requireUser } from "@/lib/auth.server";
import Decisions from "../../pages/Decisions";

export default async function Page() {
  await requireUser("/decisions");

  return <Decisions />;
}
