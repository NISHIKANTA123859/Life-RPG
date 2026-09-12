import { useState } from "react";
import { Lock, Trophy } from "lucide-react";

type AchievementRarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

interface Achievement {
  id: number;
  icon: string;
  name: string;
  desc: string;
  rarity: AchievementRarity;
  xp: number;
  unlocked: boolean;
  progress?: number;
  progressMax?: number;
  date?: string;
}

const RARITY_COLORS: Record<AchievementRarity, string> = {
  Common: "#A0A4B8", Uncommon: "#34D399", Rare: "#22D3EE", Epic: "#8B5CF6", Legendary: "#F5B92C",
};

const ACHIEVEMENTS: Achievement[] = [
  { id: 1,  icon: "⚔️",  name: "First Blood",         desc: "Complete your very first quest.",                    rarity: "Common",    xp: 50,   unlocked: true,  date: "Sep 1, 2026" },
  { id: 2,  icon: "🔥",  name: "On Fire",              desc: "Maintain a 7-day quest streak.",                    rarity: "Uncommon",  xp: 150,  unlocked: true,  date: "Sep 8, 2026" },
  { id: 3,  icon: "🧠",  name: "Brainiac",             desc: "Reach Intellect level 50.",                         rarity: "Rare",      xp: 300,  unlocked: true,  date: "Aug 22, 2026" },
  { id: 4,  icon: "💎",  name: "Deep Work",            desc: "Complete 10 Intellect quests in a row.",            rarity: "Rare",      xp: 250,  unlocked: true,  date: "Sep 5, 2026" },
  { id: 5,  icon: "🏆",  name: "Quest Legend",         desc: "Complete 100 total quests.",                        rarity: "Epic",      xp: 500,  unlocked: true,  date: "Sep 3, 2026" },
  { id: 6,  icon: "🌟",  name: "Scholar Supreme",      desc: "Max out the Intellect skill tree.",                 rarity: "Legendary", xp: 2000, unlocked: false, progress: 7, progressMax: 9 },
  { id: 7,  icon: "💪",  name: "Iron Will",            desc: "Complete 50 Strength quests.",                      rarity: "Rare",      xp: 350,  unlocked: false, progress: 14, progressMax: 50 },
  { id: 8,  icon: "🎯",  name: "Disciplined",          desc: "Maintain a 30-day quest streak.",                   rarity: "Epic",      xp: 600,  unlocked: false, progress: 14, progressMax: 30 },
  { id: 9,  icon: "🌊",  name: "Flow State",           desc: "Unlock the Flow State skill.",                      rarity: "Rare",      xp: 300,  unlocked: false, progress: 0, progressMax: 1 },
  { id: 10, icon: "👑",  name: "Level 50",             desc: "Reach character level 50.",                         rarity: "Legendary", xp: 5000, unlocked: false, progress: 24, progressMax: 50 },
  { id: 11, icon: "🔮",  name: "Deep Learner",         desc: "Unlock the Deep Learning skill node.",              rarity: "Epic",      xp: 800,  unlocked: false, progress: 0, progressMax: 1 },
  { id: 12, icon: "🤝",  name: "Social Climber",       desc: "Reach top 500 on the leaderboard.",                 rarity: "Epic",      xp: 600,  unlocked: false, progress: 1247, progressMax: 500 },
  { id: 13, icon: "💰",  name: "Gold Hoarder",         desc: "Accumulate 10,000 gold.",                           rarity: "Rare",      xp: 400,  unlocked: false, progress: 3740, progressMax: 10000 },
  { id: 14, icon: "🧘",  name: "Inner Peace",          desc: "Complete 30 Mind quests.",                          rarity: "Uncommon",  xp: 200,  unlocked: false, progress: 12, progressMax: 30 },
  { id: 15, icon: "📚",  name: "Knowledge is Power",   desc: "Read for 100 hours total.",                         rarity: "Rare",      xp: 300,  unlocked: false, progress: 42, progressMax: 100 },
  { id: 16, icon: "⚡",  name: "Speed Runner",         desc: "Complete 5 quests in a single day.",                rarity: "Uncommon",  xp: 150,  unlocked: true,  date: "Sep 10, 2026" },
];

type Filter = "All" | "Unlocked" | "Locked" | AchievementRarity;

export default function Achievements() {
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = ACHIEVEMENTS.filter((a) => {
    if (filter === "Unlocked") return a.unlocked;
    if (filter === "Locked") return !a.unlocked;
    if (["Common", "Uncommon", "Rare", "Epic", "Legendary"].includes(filter)) return a.rarity === filter;
    return true;
  });

  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;
  const totalXP = ACHIEVEMENTS.filter((a) => a.unlocked).reduce((sum, a) => sum + a.xp, 0);

  const FILTERS: Filter[] = ["All", "Unlocked", "Locked", "Common", "Uncommon", "Rare", "Epic", "Legendary"];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="font-display text-xs uppercase tracking-[0.25em] text-violet-400 mb-1">Hall of Fame</div>
      <h1 className="font-display font-bold text-white text-3xl mb-6">Achievements</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Unlocked", value: `${unlockedCount}/${ACHIEVEMENTS.length}`, color: "#34D399", icon: "🏆" },
          { label: "Total XP", value: totalXP.toLocaleString(), color: "#8B5CF6", icon: "⚡" },
          { label: "Completion", value: `${Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)}%`, color: "#F5B92C", icon: "📊" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4 border border-white/8 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="font-display font-bold text-white text-xl">{s.value}</div>
            <div className="text-[#A0A4B8] text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map((f) => {
          const color = ["Common", "Uncommon", "Rare", "Epic", "Legendary"].includes(f)
            ? RARITY_COLORS[f as AchievementRarity]
            : "#8B5CF6";
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-display font-semibold uppercase tracking-wider transition-all"
              style={
                filter === f
                  ? { background: `${color}20`, color, border: `1px solid ${color}50` }
                  : { background: "rgba(255,255,255,0.05)", color: "#A0A4B8", border: "1px solid rgba(255,255,255,0.08)" }
              }
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Achievement grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map((a) => {
          const rarityColor = RARITY_COLORS[a.rarity];
          return (
            <div
              key={a.id}
              className="glass-card rounded-2xl p-4 text-center border transition-all group hover:scale-105"
              style={{
                borderColor: a.unlocked ? `${rarityColor}40` : "rgba(255,255,255,0.06)",
                opacity: a.unlocked ? 1 : 0.6,
                boxShadow: a.unlocked ? `0 0 16px ${rarityColor}15` : undefined,
              }}
              title={a.desc}
            >
              <div className="relative inline-block mb-3">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mx-auto"
                  style={{ background: a.unlocked ? `${rarityColor}15` : "rgba(255,255,255,0.04)", border: `1px solid ${a.unlocked ? rarityColor + "40" : "rgba(255,255,255,0.08)"}` }}
                >
                  {a.unlocked ? a.icon : <Lock size={20} className="text-[#A0A4B8]" />}
                </div>
              </div>
              <div className="font-display font-bold text-white text-xs mb-1 leading-tight">{a.name}</div>
              <div className="text-[10px] uppercase font-display font-semibold mb-2" style={{ color: rarityColor }}>{a.rarity}</div>

              {/* Progress bar for locked */}
              {!a.unlocked && a.progress !== undefined && a.progressMax && (
                <div className="mt-2">
                  <div className="h-1 rounded-full bg-white/8 overflow-hidden mb-1">
                    <div className="h-full rounded-full" style={{ width: `${Math.min((a.progress / a.progressMax) * 100, 100)}%`, background: rarityColor }} />
                  </div>
                  <div className="text-[9px] text-[#A0A4B8]">{Math.min(a.progress, a.progressMax)}/{a.progressMax}</div>
                </div>
              )}

              {a.unlocked && (
                <div className="text-[9px] text-[#A0A4B8]">{a.date}</div>
              )}

              <div className="mt-1.5 text-[10px] font-display font-bold" style={{ color: "#8B5CF6" }}>+{a.xp} XP</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
