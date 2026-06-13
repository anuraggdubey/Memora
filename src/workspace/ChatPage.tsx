import Chat from "./Chat";
import { Suspense } from "react";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
      <Chat id={id} />
    </Suspense>
  );
}
