import { requireUser } from "@/auth/require-user";
import Decisions from "./Decisions";

export default async function DecisionsPage() {
  await requireUser("/decisions");

  return <Decisions />;
}
