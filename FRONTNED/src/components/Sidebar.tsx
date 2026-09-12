import type { Page } from "../App";
import {
  LayoutDashboard, Swords, User, Sparkles, Brain, Trophy, ShoppingBag,
  Backpack, Activity, Users, Settings, LogOut, X
} from "lucide-react";

interface Props {
  currentPage: Page;
  onNavigate: (p: Page) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const NAV_ITEMS: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; page: Page }[] = [
  { icon: LayoutDashboard, label: "Dashboard",   page: "dashboard" },
  { icon: Swords,          label: "Quests",       page: "quests" },
  { icon: User,            label: "Character",    page: "character" },
  { icon: Sparkles,        label: "Skills",       page: "skills" },
  { icon: Brain,           label: "AI Intel",     page: "ai-intel" },
  { icon: Trophy,          label: "Achievements", page: "achievements" },
  { icon: ShoppingBag,     label: "Shop",         page: "shop" },
  { icon: Backpack,        label: "Inventory",    page: "inventory" },
  { icon: Activity,        label: "Activity",     page: "activity" },
  { icon: Users,           label: "Leaderboard",  page: "leaderboard" },
  { icon: Settings,        label: "Settings",     page: "settings" },
];

export default function Sidebar({ currentPage, onNavigate, mobileOpen, onMobileClose }: Props) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[72px] flex flex-col shrink-0
          transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          background: "#0D0F18",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          minHeight: "100vh",
        }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-white/5 relative shrink-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center grad-primary cursor-pointer"
            style={{ boxShadow: "0 0 20px rgba(139,92,246,0.5)" }}
            onClick={() => { onNavigate("dashboard"); onMobileClose(); }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
              <path d="M13 19l6-6" />
              <path d="M16 16l4 4" />
              <path d="M19 21l2-2" />
            </svg>
          </div>
          {mobileOpen && (
            <button
              className="absolute right-3 text-[#A0A4B8] hover:text-white lg:hidden"
              onClick={onMobileClose}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto">
          {NAV_ITEMS.map(({ icon: Icon, label, page }) => {
            const active = currentPage === page;
            return (
              <button
                key={label}
                onClick={() => { onNavigate(page); onMobileClose(); }}
                className={`group relative w-full h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  active
                    ? "nav-active text-violet-400"
                    : "text-[#A0A4B8] hover:text-white hover:bg-white/5"
                }`}
                title={label}
              >
                <Icon size={18} className={active ? "text-violet-400" : ""} />
                <span
                  className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
                  style={{ background: "#1B1E2B", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Profile + Logout */}
        <div className="p-2 border-t border-white/5 flex flex-col gap-1">
          <button
            onClick={() => { onNavigate("profile"); onMobileClose(); }}
            className={`group relative w-full h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
              currentPage === "profile" ? "nav-active text-violet-400" : "text-[#A0A4B8] hover:text-white hover:bg-white/5"
            }`}
            title="Profile"
          >
            <div className="w-7 h-7 rounded-full grad-primary flex items-center justify-center text-white text-xs font-bold font-display">
              A
            </div>
            <span className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50" style={{ background: "#1B1E2B", border: "1px solid rgba(255,255,255,0.1)" }}>
              Profile
            </span>
          </button>
          <button
            className="w-full h-11 rounded-xl flex items-center justify-center text-[#A0A4B8] hover:text-[#F0466B] hover:bg-[#F0466B]/10 transition-all"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
}
