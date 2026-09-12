import type { Page } from "../App";
import { CHARACTER } from "../data/gameData";
import { Edit3, Zap, Trophy, Flame, Target, Star, ChevronRight } from "lucide-react";

interface Props {
  character: typeof CHARACTER;
  onNavigate: (p: Page) => void;
}

export default function Profile({ character, onNavigate }: Props) {
  const xpPercent = Math.round((character.currentXP / character.maxXP) * 100);

  const STATS = [
    { label: "Quests Completed", value: "247",   color: "#34D399", icon: <Target size={14} /> },
    { label: "Total XP",         value: "84,200", color: "#8B5CF6", icon: <Zap size={14} /> },
    { label: "Achievements",     value: "38",     color: "#F5B92C", icon: <Trophy size={14} /> },
    { label: "Best Streak",      value: "31d",    color: "#FF7A45", icon: <Flame size={14} /> },
    { label: "Global Rank",      value: "#1,247", color: "#22D3EE", icon: <Star size={14} /> },
    { label: "Gold Earned",      value: "12,450", color: "#F5B92C", icon: <span className="text-yellow-400 text-xs font-bold">G</span> },
  ];

  const QUICK_LINKS: { label: string; page: Page; color: string }[] = [
    { label: "View Character Profile",  page: "character",    color: "#22D3EE" },
    { label: "Browse Skill Tree",       page: "skills",       color: "#8B5CF6" },
    { label: "Check Achievements",      page: "achievements", color: "#F5B92C" },
    { label: "Open Inventory",          page: "inventory",    color: "#34D399" },
    { label: "Visit Leaderboard",       page: "leaderboard",  color: "#F0466B" },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="font-display text-xs uppercase tracking-[0.25em] text-violet-400 mb-1">Account</div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-white text-3xl">Profile</h1>
        <button className="flex items-center gap-2 glass-card px-4 py-2 rounded-xl border border-white/8 text-sm text-[#A0A4B8] hover:text-white transition-colors">
          <Edit3 size={14} /> Edit Profile
        </button>
      </div>

      {/* Hero card */}
      <div
        className="glass-card rounded-2xl p-6 border border-white/8 mb-6 text-center relative overflow-hidden"
        style={{ boxShadow: "0 0 40px rgba(139,92,246,0.1)" }}
      >
        <div className="absolute inset-0 opacity-5" style={{ background: "radial-gradient(ellipse at 50% 0%, #8B5CF6, transparent)" }} />
        <div
          className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-5xl mb-4"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(34,211,238,0.3))", border: "2px solid rgba(139,92,246,0.4)", boxShadow: "0 0 24px rgba(139,92,246,0.3)" }}
        >
          🧙‍♀️
        </div>
        <h2 className="font-display font-bold text-white text-2xl mb-1">{character.name}</h2>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="font-display text-xs uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "rgba(34,211,238,0.15)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.3)" }}>
            {character.class}
          </span>
          <span className="font-display text-xs px-3 py-1 rounded-full" style={{ background: "rgba(139,92,246,0.15)", color: "#8B5CF6", border: "1px solid rgba(139,92,246,0.3)" }}>
            Level {character.level}
          </span>
        </div>

        {/* XP bar */}
        <div className="max-w-xs mx-auto">
          <div className="flex justify-between text-xs text-[#A0A4B8] mb-1.5">
            <span>XP Progress</span>
            <span>{xpPercent}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden mb-1">
            <div className="h-full rounded-full" style={{ width: `${xpPercent}%`, background: "linear-gradient(90deg, #8B5CF6, #22D3EE)", boxShadow: "0 0 8px rgba(139,92,246,0.5)" }} />
          </div>
          <div className="text-xs text-[#A0A4B8]">{character.currentXP.toLocaleString()} / {character.maxXP.toLocaleString()} XP to Level {character.level + 1}</div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {STATS.map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4 border border-white/8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}15`, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <div className="font-display font-bold text-white">{s.value}</div>
              <div className="text-[#A0A4B8] text-xs">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="glass-card rounded-2xl border border-white/8 overflow-hidden">
        <div className="px-5 py-3 border-b border-white/5">
          <span className="font-display text-xs uppercase tracking-wider text-[#A0A4B8]">Quick Navigation</span>
        </div>
        {QUICK_LINKS.map(({ label, page, color }, i) => (
          <button
            key={label}
            onClick={() => onNavigate(page)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors text-left"
            style={{ borderBottom: i < QUICK_LINKS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : undefined }}
          >
            <span className="text-sm text-white font-medium">{label}</span>
            <ChevronRight size={16} style={{ color }} />
          </button>
        ))}
      </div>
    </div>
  );
}
