import { requireUser } from "@/auth/require-user";
import Memories from "./Memories";

export default async function MemoriesPage() {
  await requireUser("/memories");

  return <Memories />;
}
