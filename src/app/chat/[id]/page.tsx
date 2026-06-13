import ChatPage from "@/workspace/ChatPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ChatPage params={params} />;
}
