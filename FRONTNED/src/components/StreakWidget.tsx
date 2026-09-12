import { Flame, TrendingUp } from "lucide-react";

interface Props {
  streak: number;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function StreakWidget({ streak }: Props) {
  const today = new Date().getDay();

  // Build a 7-day window ending today
  const week = Array.from({ length: 7 }, (_, i) => {
    const dayIndex = (today - 6 + i + 7) % 7;
    const daysAgo = 6 - i;
    const active = daysAgo < streak;
    const isToday = i === 6;
    return { label: DAYS[dayIndex], active, isToday };
  });

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/8">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Flame size={18} className="text-orange-400" />
          <span className="font-display font-bold text-white">Daily Streak</span>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.25)" }}
        >
          <Flame size={13} className="text-orange-400" />
          <span className="font-display font-bold text-orange-400 text-lg">{streak}</span>
          <span className="text-orange-300/70 text-xs">days</span>
        </div>
      </div>

      {/* 7-day calendar strip */}
      <div className="grid grid-cols-7 gap-2 mb-5">
        {week.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-[#A0A4B8]">{day.label}</span>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
              style={
                day.isToday
                  ? {
                      background: "linear-gradient(135deg, #FF7A45, #F5B92C)",
                      boxShadow: "0 0 14px rgba(251,146,60,0.5)",
                    }
                  : day.active
                  ? {
                      background: "rgba(251,146,60,0.2)",
                      border: "1px solid rgba(251,146,60,0.4)",
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }
              }
            >
              {day.active && (
                <Flame
                  size={14}
                  style={{
                    color: day.isToday ? "white" : "#FB923C",
                    filter: day.isToday ? "drop-shadow(0 0 4px rgba(255,255,255,0.5))" : undefined,
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Streak milestones */}
      <div className="space-y-2">
        <div className="text-xs text-[#A0A4B8] uppercase tracking-wider mb-2">Milestones</div>
        {[
          { days: 7,  label: "Week Warrior",   xp: "+200 XP",  done: streak >= 7  },
          { days: 30, label: "Month Legend",    xp: "+1K XP",   done: streak >= 30 },
          { days: 100, label: "Century Hero",   xp: "+5K XP",   done: streak >= 100 },
        ].map((m) => (
          <div key={m.days} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${m.done ? "" : "bg-white/15"}`}
                style={m.done ? { background: "#F5B92C", boxShadow: "0 0 6px rgba(245,185,44,0.5)" } : {}}
              />
              <span className={`text-xs ${m.done ? "text-yellow-300" : "text-[#A0A4B8]"}`}>
                {m.days}d — {m.label}
              </span>
            </div>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={
                m.done
                  ? { background: "rgba(245,185,44,0.15)", color: "#F5B92C" }
                  : { background: "rgba(255,255,255,0.05)", color: "#A0A4B8" }
              }
            >
              {m.xp}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#A0A4B8]">
        <TrendingUp size={12} className="text-emerald-400" />
        <span>Personal best: <span className="text-emerald-400 font-semibold">31 days</span></span>
      </div>
    </div>
  );
}
