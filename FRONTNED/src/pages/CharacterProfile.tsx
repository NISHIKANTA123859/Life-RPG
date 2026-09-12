import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { Page } from "../App";
import { CHARACTER } from "../data/gameData";
import { Shield, Edit3, Sword, Brain, Heart, Sparkles, Target, Zap } from "lucide-react";

interface Props {
  onNavigate: (p: Page) => void;
}

const XP_HISTORY = [
  { day: "Sep 6", xp: 340 }, { day: "Sep 7", xp: 520 }, { day: "Sep 8", xp: 210 },
  { day: "Sep 9", xp: 680 }, { day: "Sep 10", xp: 450 }, { day: "Sep 11", xp: 720 },
  { day: "Sep 12", xp: 890 },
];

const ATTRIBUTES = [
  { name: "Intellect",   value: 78, max: 100, icon: Brain,  color: "#22D3EE", desc: "Master of knowledge" },
  { name: "Strength",    value: 45, max: 100, icon: Sword,  color: "#F0466B", desc: "Physical power" },
  { name: "Health",      value: 62, max: 100, icon: Heart,  color: "#34D399", desc: "Body & wellness" },
  { name: "Mind",        value: 85, max: 100, icon: Sparkles, color: "#8B5CF6", desc: "Mental clarity" },
  { name: "Discipline",  value: 70, max: 100, icon: Target, color: "#F5B92C", desc: "Consistency" },
  { name: "Endurance",   value: 53, max: 100, icon: Shield, color: "#FF7A45", desc: "Stamina & grit" },
];

const EQUIPMENT = [
  { slot: "Head",     name: "Scholar's Crown",  rarity: "Rare",   bonus: "+5 INT", icon: "👑" },
  { slot: "Body",     name: "Arcane Robe",       rarity: "Epic",   bonus: "+8 MND", icon: "🥋" },
  { slot: "Weapon",   name: "Tome of Algorithms",rarity: "Legendary", bonus: "+10 INT", icon: "📚" },
  { slot: "Off-hand", name: "Focus Crystal",     rarity: "Rare",   bonus: "+4 DIS", icon: "💎" },
  { slot: "Ring",     name: "Ring of Streaks",   rarity: "Uncommon",bonus: "+2 ALL", icon: "💍" },
  { slot: "Boots",    name: "Swift Sandals",     rarity: "Common", bonus: "+1 END", icon: "👟" },
];

const RARITY_COLORS: Record<string, string> = {
  Common: "#A0A4B8", Uncommon: "#34D399", Rare: "#22D3EE", Epic: "#8B5CF6", Legendary: "#F5B92C",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card rounded-xl px-3 py-2 border border-white/10">
        <div className="text-xs text-[#A0A4B8] mb-1">{label}</div>
        <div className="font-display font-bold text-violet-400 text-sm">+{payload[0].value} XP</div>
      </div>
    );
  }
  return null;
};

export default function CharacterProfile({ onNavigate }: Props) {
  const xpPercent = Math.round((CHARACTER.currentXP / CHARACTER.maxXP) * 100);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="font-display text-xs uppercase tracking-[0.25em] text-violet-400 mb-1">Character</div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-white text-3xl">Profile</h1>
        <button className="flex items-center gap-2 glass-card px-4 py-2 rounded-xl border border-white/8 text-sm text-[#A0A4B8] hover:text-white transition-colors">
          <Edit3 size={14} /> Edit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — avatar card */}
        <div className="lg:col-span-1 space-y-5">
          {/* Avatar */}
          <div
            className="glass-card rounded-2xl p-6 border border-white/8 text-center"
            style={{ boxShadow: "0 0 40px rgba(139,92,246,0.1)" }}
          >
            <div className="relative inline-block mb-4">
              <svg width="120" height="120" className="absolute -inset-2">
                <circle cx="60" cy="60" r="56" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                <circle
                  cx="60" cy="60" r="56" fill="none"
                  stroke="url(#charRing)" strokeWidth="3"
                  strokeDasharray={`${xpPercent * 3.52} 352`}
                  strokeDashoffset="88"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="charRing" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
              </svg>
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
                style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(34,211,238,0.3))", border: "2px solid rgba(255,255,255,0.1)" }}
              >
                🧙‍♀️
              </div>
            </div>
            <h2 className="font-display font-bold text-white text-xl mb-1">{CHARACTER.name}</h2>
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="font-display text-xs uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "rgba(34,211,238,0.15)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.3)" }}>
                {CHARACTER.class}
              </span>
              <span className="font-display text-xs px-3 py-1 rounded-full" style={{ background: "rgba(139,92,246,0.15)", color: "#8B5CF6", border: "1px solid rgba(139,92,246,0.3)" }}>
                Lv. {CHARACTER.level}
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden mb-1">
              <div className="h-full rounded-full" style={{ width: `${xpPercent}%`, background: "linear-gradient(90deg, #8B5CF6, #22D3EE)", boxShadow: "0 0 8px rgba(139,92,246,0.5)" }} />
            </div>
            <div className="text-xs text-[#A0A4B8]">{CHARACTER.currentXP.toLocaleString()} / {CHARACTER.maxXP.toLocaleString()} XP</div>
          </div>

          {/* Quick stats */}
          <div className="glass-card rounded-2xl p-5 border border-white/8">
            <div className="font-display text-xs uppercase tracking-widest text-[#A0A4B8] mb-4">Quick Stats</div>
            <div className="space-y-3">
              {[
                { label: "Quests Completed", value: "247", color: "#34D399" },
                { label: "Total XP Earned",  value: "84,200", color: "#8B5CF6" },
                { label: "Gold Collected",   value: "12,450", color: "#F5B92C" },
                { label: "Achievements",     value: "38 / 120", color: "#22D3EE" },
                { label: "Days Active",      value: "127", color: "#FF7A45" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-sm text-[#A0A4B8]">{s.label}</span>
                  <span className="font-display font-bold text-sm" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment */}
          <div className="glass-card rounded-2xl p-5 border border-white/8">
            <div className="flex items-center justify-between mb-4">
              <div className="font-display text-xs uppercase tracking-widest text-[#A0A4B8]">Equipment</div>
              <button onClick={() => onNavigate("inventory")} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">View All</button>
            </div>
            <div className="space-y-2.5">
              {EQUIPMENT.map((item) => (
                <div key={item.slot} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white font-semibold truncate">{item.name}</div>
                    <div className="text-[10px]" style={{ color: RARITY_COLORS[item.rarity] }}>{item.rarity}</div>
                  </div>
                  <span className="text-[10px] font-display font-bold text-emerald-400 flex-shrink-0">{item.bonus}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — attributes + chart */}
        <div className="lg:col-span-2 space-y-5">
          {/* Attributes */}
          <div className="glass-card rounded-2xl p-6 border border-white/8">
            <div className="flex items-center justify-between mb-5">
              <div className="font-display font-bold text-white text-lg">Attributes</div>
              <button onClick={() => onNavigate("skills")} className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
                <Zap size={11} /> View Skill Tree
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ATTRIBUTES.map((attr) => {
                const Icon = attr.icon;
                return (
                  <div key={attr.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon size={14} style={{ color: attr.color }} />
                        <span className="font-display text-xs uppercase tracking-wider text-white">{attr.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-display font-bold text-sm" style={{ color: attr.color }}>{attr.value}</span>
                        <span className="text-[#A0A4B8] text-xs">/{attr.max}</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${attr.value}%`, background: attr.color, boxShadow: `0 0 8px ${attr.color}60` }} />
                    </div>
                    <div className="text-[10px] text-[#A0A4B8]">{attr.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* XP Growth Chart */}
          <div className="glass-card rounded-2xl p-6 border border-white/8">
            <div className="font-display font-bold text-white text-lg mb-5">XP Earned — Last 7 Days</div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={XP_HISTORY} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: "#A0A4B8", fontSize: 11, fontFamily: "Chakra Petch" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#A0A4B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#22D3EE" />
                    </linearGradient>
                  </defs>
                  <Line
                    type="monotone" dataKey="xp"
                    stroke="url(#lineGrad)" strokeWidth={2.5}
                    dot={{ fill: "#8B5CF6", r: 4, strokeWidth: 0 }}
                    activeDot={{ fill: "#22D3EE", r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Combat Power */}
          <div className="glass-card rounded-2xl p-5 border border-white/8">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display text-xs uppercase tracking-wider text-[#A0A4B8] mb-1">Total Combat Power</div>
                <div className="font-display font-bold grad-primary-text" style={{ fontSize: "2.5rem" }}>4,820</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-[#A0A4B8] mb-1">Global Rank</div>
                <div className="font-display font-bold text-yellow-400 text-2xl">#1,247</div>
                <div className="text-xs text-[#A0A4B8]">Top 1%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
