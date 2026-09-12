import { useState } from "react";
import type { Page } from "../App";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import QuestCard from "../components/QuestCard";
import LevelUpModal from "../components/LevelUpModal";
import StreakWidget from "../components/StreakWidget";
import CharacterStats from "../components/CharacterStats";
import QuestBoard from "./QuestBoard";
import CharacterProfile from "./CharacterProfile";
import SkillTree from "./SkillTree";
import QuestIntelligence from "./QuestIntelligence";
import Achievements from "./Achievements";
import Shop from "./Shop";
import Inventory from "./Inventory";
import ActivityHistory from "./ActivityHistory";
import Leaderboard from "./Leaderboard";
import Profile from "./Profile";
import SettingsPage from "./Settings";
import { Zap, Plus, Filter, CheckCircle2 } from "lucide-react";
import { CHARACTER, QUESTS_DATA } from "../data/gameData";
export { CHARACTER, QUESTS_DATA };

interface Props {
  currentPage: Page;
  onNavigate: (p: Page) => void;
}

function DashboardHome({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  const [quests, setQuests] = useState(QUESTS_DATA);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [floatingRewards, setFloatingRewards] = useState<
    { id: number; text: string; x: number; y: number }[]
  >([]);

  const completedCount = quests.filter((q) => q.completed).length;
  const xpPercent = Math.round((CHARACTER.currentXP / CHARACTER.maxXP) * 100);

  const handleCompleteQuest = (id: number, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const quest = quests.find((q) => q.id === id);
    if (!quest || quest.completed) return;
    setQuests((prev) => prev.map((q) => (q.id === id ? { ...q, completed: true } : q)));
    const rewardId = Date.now();
    setFloatingRewards((prev) => [
      ...prev,
      { id: rewardId, text: `+${quest.xp} XP  +${quest.gold} 🪙`, x: rect.left + rect.width / 2, y: rect.top },
    ]);
    setTimeout(() => setFloatingRewards((prev) => prev.filter((r) => r.id !== rewardId)), 1600);
    if (quest.difficulty === "Epic") setTimeout(() => setShowLevelUp(true), 800);
  };

  return (
    <>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Welcome header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="font-display text-xs uppercase tracking-[0.25em] text-violet-400 mb-1">Welcome Back, Hero</div>
            <h1 className="font-display font-bold text-white mb-2" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
              {CHARACTER.name}
            </h1>
            <div className="flex items-center gap-3">
              <span className="font-display text-xs uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "rgba(34,211,238,0.15)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.3)" }}>
                {CHARACTER.class}
              </span>
              <span className="font-display text-xs px-3 py-1 rounded-full" style={{ background: "rgba(139,92,246,0.15)", color: "#8B5CF6", border: "1px solid rgba(139,92,246,0.3)" }}>
                Lv. {CHARACTER.level}
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate("quests")}
            className="flex items-center gap-2 grad-primary text-white font-semibold px-5 py-3 rounded-xl glow-primary hover:opacity-90 transition-opacity text-sm self-start md:self-auto"
          >
            <Plus size={16} />
            New Quest
          </button>
        </div>

        {/* Progress bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="glass-card rounded-2xl p-5 border border-white/8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-violet-400" />
                <span className="font-display text-sm font-semibold text-white">Experience Points</span>
              </div>
              <span className="font-display text-xs text-[#A0A4B8]">
                {CHARACTER.currentXP.toLocaleString()} / {CHARACTER.maxXP.toLocaleString()} XP
              </span>
            </div>
            <div className="h-3 rounded-full bg-white/5 overflow-hidden mb-2">
              <div className="h-full rounded-full xp-bar-fill" style={{ background: "linear-gradient(90deg, #8B5CF6, #22D3EE)", width: `${xpPercent}%`, boxShadow: "0 0 12px rgba(139,92,246,0.6)" }} />
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#A0A4B8]">Level {CHARACTER.level}</span>
              <span className="text-xs text-violet-400 font-semibold">{xpPercent}% to Level {CHARACTER.level + 1}</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span className="font-display text-sm font-semibold text-white">Daily Progress</span>
              </div>
              <span className="font-display text-xs text-[#A0A4B8]">{completedCount}/{CHARACTER.dailyQuestsTotal} Quests</span>
            </div>
            <div className="h-3 rounded-full bg-white/5 overflow-hidden mb-2">
              <div className="h-full rounded-full transition-all duration-700" style={{ background: "linear-gradient(90deg, #34D399, #22D3EE)", width: `${(completedCount / CHARACTER.dailyQuestsTotal) * 100}%`, boxShadow: "0 0 12px rgba(52,211,153,0.5)" }} />
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-[#A0A4B8]">{CHARACTER.dailyQuestsTotal - completedCount} remaining</span>
              <span className="text-xs text-emerald-400 font-semibold">{Math.round((completedCount / CHARACTER.dailyQuestsTotal) * 100)}% complete</span>
            </div>
          </div>
        </div>

        {/* Quest board */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-white text-lg">Active Quests</h2>
            <button
              onClick={() => onNavigate("quests")}
              className="flex items-center gap-1.5 text-xs text-[#A0A4B8] hover:text-white transition-colors glass-card px-3 py-1.5 rounded-lg border border-white/8"
            >
              <Filter size={12} />
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {quests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} onComplete={handleCompleteQuest} />
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <StreakWidget streak={CHARACTER.streak} />
          <CharacterStats />
        </div>
      </div>

      {floatingRewards.map((r) => (
        <div
          key={r.id}
          className="fixed z-50 pointer-events-none font-display font-bold text-sm text-yellow-400 float-reward"
          style={{ left: r.x, top: r.y, transform: "translateX(-50%)", textShadow: "0 0 10px rgba(245,185,44,0.8)" }}
        >
          {r.text}
        </div>
      ))}

      {showLevelUp && <LevelUpModal level={CHARACTER.level + 1} onClose={() => setShowLevelUp(false)} />}
    </>
  );
}

export default function Dashboard({ currentPage, onNavigate }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case "quests":      return <QuestBoard />;
      case "character":   return <CharacterProfile onNavigate={onNavigate} />;
      case "skills":      return <SkillTree />;
      case "ai-intel":    return <QuestIntelligence />;
      case "achievements":return <Achievements />;
      case "shop":        return <Shop character={CHARACTER} />;
      case "inventory":   return <Inventory />;
      case "activity":    return <ActivityHistory />;
      case "leaderboard": return <Leaderboard />;
      case "profile":     return <Profile character={CHARACTER} onNavigate={onNavigate} />;
      case "settings":    return <SettingsPage />;
      default:            return <DashboardHome onNavigate={onNavigate} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0B0D14" }}>
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar character={CHARACTER} onMenuClick={() => setSidebarOpen(true)} onNavigate={onNavigate} />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
