import { useApp } from "../context";
import Sidebar from "./Sidebar";

export default function MobileDrawer() {
  const { drawerOpen, setDrawerOpen } = useApp();
  return (
    <>
      <div
        onClick={() => setDrawerOpen(false)}
        className={`md:hidden fixed inset-0 bg-black/30 z-40 transition-opacity duration-200 ${
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-[280px] bg-[#F4F4F4] border-r border-[#E8E8E8] z-50 transition-transform duration-200 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onNavigate={() => setDrawerOpen(false)} />
      </div>
    </>
  );
}
