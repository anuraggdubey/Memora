import type { Workspace } from "./workspace-types";

export default function WorkspaceItem({ ws }: { ws: Workspace }) {
  return (
    <button className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-white transition-all duration-200">
      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: ws.color }} />
      <span className="text-[13px] text-[#1A1A1A] truncate">{ws.name}</span>
    </button>
  );
}
