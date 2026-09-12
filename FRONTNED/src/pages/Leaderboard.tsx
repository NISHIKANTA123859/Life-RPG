import { useState } from "react";
import { Trophy, Flame, Zap, TrendingUp, Medal } from "lucide-react";

type Period = "Weekly" | "Monthly" | "All Time";

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  class: string;
  level: number;
  xp: number;
  streak: number;
  isYou?: boolean;
}

const makeEntry = (rank: number, name: string, avatar: string, cls: string, level: number, xp: number, streak: number, isYou = false): LeaderboardEntry =>
  ({ rank, name, avatar, class: cls, level, xp, streak, isYou });

const WEEKLY: LeaderboardEntry[] = [
  makeEntry(1, "ZeroX_Nova",      "⚡", "Warrior",  52, 4_820, 21),
  makeEntry(2, "SilverPath",      "🌙", "Scholar",  48, 4_310, 18),
  makeEntry(3, "IronMind_VII",    "🔱", "Monk",     45, 3_990, 30),
  makeEntry(4, "CodeDragon",      "🐉", "Scholar",  41, 3_680, 14),
  makeEntry(5, "Aria Thornwood",  "🧙‍♀️","Scholar", 24, 3_420, 14, true),
  makeEntry(6, "RunnerPrime",     "🏃", "Ranger",   38, 3_100, 12),
  makeEntry(7, "PhoenixWill",     "🦅", "Warrior",  35, 2_980, 9),
  makeEntry(8, "LightningStar",   "🌟", "Monk",     33, 2_750, 22),
  makeEntry(9, "ShadowCoder",     "💻", "Scholar",  30, 2_540, 7),
  makeEntry(10, "ForgeHammer",    "🔨", "Warrior",  28, 2_390, 5),
];

const MONTHLY: LeaderboardEntry[] = [
  makeEntry(1, "ZeroX_Nova",      "⚡", "Warrior",  52, 18_200, 21),
  makeEntry(2, "IronMind_VII",    "🔱", "Monk",     45, 16_800, 30),
  makeEntry(3, "SilverPath",      "🌙", "Scholar",  48, 15_300, 18),
  makeEntry(4, "RunnerPrime",     "🏃", "Ranger",   38, 13_400, 12),
  makeEntry(5, "LightningStar",   "🌟", "Monk",     33, 12_100, 22),
  makeEntry(6, "PhoenixWill",     "🦅", "Warrior",  35, 11_900, 9),
  makeEntry(7, "CodeDragon",      "🐉", "Scholar",  41, 11_400, 14),
  makeEntry(8, "ShadowCoder",     "💻", "Scholar",  30, 10_800, 7),
  makeEntry(9, "Aria Thornwood",  "🧙‍♀️","Scholar",  24, 10_200, 14, true),
  makeEntry(10, "ForgeHammer",    "🔨", "Warrior",  28, 9_500, 5),
];

const ALL_TIME = WEEKLY.map((e, i) => ({ ...e, xp: e.xp * 20 + i * 1000 }));

const PERIOD_DATA: Record<Period, LeaderboardEntry[]> = {
  Weekly: WEEKLY, Monthly: MONTHLY, "All Time": ALL_TIME,
};

const RANK_STYLES: Record<number, { bg: string; color: string; icon?: React.ReactNode }> = {
  1: { bg: "rgba(245,185,44,0.15)", color: "#F5B92C", icon: <Medal size={16} fill="rgba(245,185,44,0.3)" className="text-yellow-400" /> },
  2: { bg: "rgba(160,164,184,0.1)", color: "#A0A4B8", icon: <Medal size={16} className="text-[#A0A4B8]" /> },
  3: { bg: "rgba(255,122,69,0.12)", color: "#FF7A45", icon: <Medal size={16} className="text-orange-400" /> },
};

export default function Leaderboard() {
  const [period, setPeriod] = useState<Period>("Weekly");
  const data = PERIOD_DATA[period];
  const PERIODS: Period[] = ["Weekly", "Monthly", "All Time"];

  const youEntry = data.find((e) => e.isYou);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="font-display text-xs uppercase tracking-[0.25em] text-violet-400 mb-1">Rankings</div>
      <h1 className="font-display font-bold text-white text-3xl mb-6">Leaderboard</h1>

      {/* Period tabs */}
      <div className="flex gap-1 glass-card rounded-xl p-1 w-fit border border-white/8 mb-8">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className="px-5 py-2 rounded-lg text-sm font-display font-semibold transition-all"
            style={period === p ? { background: "linear-gradient(135deg, #8B5CF6, #22D3EE)", color: "white" } : { color: "#A0A4B8" }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Top 3 podium */}
      <div className="flex items-end justify-center gap-4 mb-8">
        {[data[1], data[0], data[2]].map((entry, podiumIndex) => {
          const visualRank = [2, 1, 3][podiumIndex];
          const heights = ["h-24", "h-32", "h-20"];
          const rankStyle = RANK_STYLES[visualRank] || { bg: "", color: "#A0A4B8" };
          return (
            <div key={entry.name} className={`flex flex-col items-center gap-2 ${podiumIndex === 1 ? "scale-105" : ""}`}>
              <div className="text-3xl">{entry.avatar}</div>
              <div className="font-display font-bold text-white text-xs text-center">{entry.name}</div>
              <div
                className={`w-20 ${heights[podiumIndex]} rounded-t-xl flex flex-col items-center justify-center gap-1`}
                style={{ background: rankStyle.bg, border: `1px solid ${rankStyle.color}40` }}
              >
                {rankStyle.icon}
                <span className="font-display font-bold text-2xl" style={{ color: rankStyle.color }}>#{visualRank}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Your rank card */}
      {youEntry && (
        <div
          className="glass-card rounded-xl p-4 border mb-4 flex items-center gap-4"
          style={{ borderColor: "rgba(139,92,246,0.4)", background: "rgba(139,92,246,0.08)" }}
        >
          <div className="font-display font-bold text-violet-400 text-sm w-8 text-center">#{youEntry.rank}</div>
          <div className="text-2xl">{youEntry.avatar}</div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-white text-sm">{youEntry.name} <span className="text-violet-400 text-xs">(You)</span></div>
            <div className="text-xs text-[#A0A4B8]">{youEntry.class} · Lv. {youEntry.level}</div>
          </div>
          <div className="text-right">
            <div className="font-display font-bold text-violet-400 text-sm">{youEntry.xp.toLocaleString()} XP</div>
            <div className="flex items-center gap-1 text-xs text-orange-400 justify-end"><Flame size={10} />{youEntry.streak}d</div>
          </div>
        </div>
      )}

      {/* Full list */}
      <div className="space-y-2">
        {data.map((entry) => {
          const rankStyle = RANK_STYLES[entry.rank];
          return (
            <div
              key={entry.name}
              className={`glass-card rounded-xl p-4 border flex items-center gap-4 transition-all hover:border-white/15 ${entry.isYou ? "border-violet-500/30" : "border-white/6"}`}
              style={entry.isYou ? { background: "rgba(139,92,246,0.05)" } : undefined}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-display font-bold text-sm"
                style={rankStyle ? { background: rankStyle.bg, color: rankStyle.color } : { color: "#A0A4B8" }}
              >
                {rankStyle?.icon || entry.rank}
              </div>
              <div className="text-xl flex-shrink-0">{entry.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-white text-sm">{entry.name}</span>
                  {entry.isYou && <span className="text-[10px] px-2 py-0.5 rounded-full font-display" style={{ background: "rgba(139,92,246,0.2)", color: "#8B5CF6" }}>YOU</span>}
                </div>
                <div className="text-xs text-[#A0A4B8]">{entry.class} · Lv. {entry.level}</div>
              </div>

              <div className="hidden sm:flex items-center gap-1 text-xs text-orange-400">
                <Flame size={11} />
                <span className="font-display font-bold">{entry.streak}</span>
              </div>

              <div className="flex items-center gap-1 text-violet-400">
                <Zap size={12} />
                <span className="font-display font-bold text-sm">{entry.xp.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
