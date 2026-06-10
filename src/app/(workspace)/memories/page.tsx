import { requireUser } from "@/lib/auth.server";
import Memories from "../../pages/Memories";

export default async function Page() {
  await requireUser("/memories");

  return <Memories />;
}
