import { Flame, Coins, Bell, Menu } from "lucide-react";
import type { Page } from "../App";

interface CharacterData {
  name: string;
  class: string;
  level: number;
  currentXP: number;
  maxXP: number;
  gold: number;
  streak: number;
  dailyQuestsCompleted: number;
  dailyQuestsTotal: number;
}

interface Props {
  character: CharacterData;
  onMenuClick: () => void;
  onNavigate: (p: Page) => void;
}

export default function TopBar({ character, onMenuClick, onNavigate }: Props) {
  const xpPercent = Math.round((character.currentXP / character.maxXP) * 100);

  return (
    <header
      className="h-16 flex items-center gap-4 px-4 md:px-6 shrink-0"
      style={{
        background: "rgba(13,15,24,0.9)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Mobile menu */}
      <button
        className="lg:hidden text-[#A0A4B8] hover:text-white transition-colors"
        onClick={onMenuClick}
      >
        <Menu size={20} />
      </button>

      {/* Level ring + avatar */}
      <div className="relative flex-shrink-0">
        {/* Level ring */}
        <svg width="44" height="44" className="absolute -inset-1">
          <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          <circle
            cx="22" cy="22" r="20" fill="none"
            stroke="url(#xpGrad)" strokeWidth="2"
            strokeDasharray={`${xpPercent * 1.257} 125.7`}
            strokeDashoffset="31.4"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="xpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
        </svg>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg text-white"
          style={{ background: "linear-gradient(135deg, #8B5CF6, #22D3EE)" }}
        >
          {character.name[0]}
        </div>
      </div>

      {/* Name & level */}
      <div className="hidden sm:block">
        <div className="text-white text-sm font-semibold leading-tight">{character.name}</div>
        <div className="font-display text-xs text-violet-400">Level {character.level} {character.class}</div>
      </div>

      {/* XP bar */}
      <div className="flex-1 max-w-xs hidden md:block">
        <div className="flex justify-between text-xs text-[#A0A4B8] mb-1">
          <span>XP</span>
          <span>{character.currentXP.toLocaleString()} / {character.maxXP.toLocaleString()}</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${xpPercent}%`,
              background: "linear-gradient(90deg, #8B5CF6, #22D3EE)",
              boxShadow: "0 0 8px rgba(139,92,246,0.6)",
            }}
          />
        </div>
      </div>

      <div className="flex-1" />

      {/* Gold */}
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
        style={{ background: "rgba(245,185,44,0.1)", border: "1px solid rgba(245,185,44,0.2)" }}
      >
        <Coins size={14} className="text-yellow-400" />
        <span className="font-display font-bold text-yellow-400 text-sm">{character.gold.toLocaleString()}</span>
      </div>

      {/* Streak */}
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
        style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.2)" }}
      >
        <Flame size={14} className="text-orange-400" />
        <span className="font-display font-bold text-orange-400 text-sm">{character.streak}</span>
      </div>

      {/* Notifications */}
      <button className="relative text-[#A0A4B8] hover:text-white transition-colors p-1" onClick={() => onNavigate("activity")}>
        <Bell size={18} />
        <span
          className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
          style={{ background: "#8B5CF6" }}
        >
          3
        </span>
      </button>
    </header>
  );
}
