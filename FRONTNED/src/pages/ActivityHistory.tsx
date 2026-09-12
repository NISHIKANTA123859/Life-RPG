import { useState, useEffect } from "react";
import { CheckCircle2, Zap, Coins, Trophy, Star, TrendingUp } from "lucide-react";
import { getActivity } from "../services/api";

interface ActivityEvent {
  type: "quest" | "level" | "achievement" | "purchase" | "streak";
  icon: string;
  title: string;
  detail: string;
  xp: number;
  gold: number;
  time: string;
  color: string;
}

interface DayGroup {
  date: string;
  isToday: boolean;
  events: ActivityEvent[];
}

const HISTORY: DayGroup[] = [
  {
    date: "Today — September 12, 2026",
    isToday: true,
    events: [
      { type: "quest",       icon: "🏃", title: "Morning Run — 5km completed",             detail: "Endurance quest",       xp: 70,  gold: 25, time: "8:02 AM",  color: "#34D399" },
      { type: "quest",       icon: "📖", title: "Read 'Deep Work' — Ch. 4 completed",      detail: "Discipline quest",      xp: 60,  gold: 20, time: "9:31 AM",  color: "#8B5CF6" },
      { type: "streak",      icon: "🔥", title: "14-Day Streak maintained!",               detail: "Consistency bonus",     xp: 50,  gold: 0,  time: "9:31 AM",  color: "#FF7A45" },
      { type: "achievement", icon: "⚡", title: "Achievement unlocked: Speed Runner",       detail: "+5 quests in one day",  xp: 150, gold: 0,  time: "10:14 AM", color: "#F5B92C" },
    ],
  },
  {
    date: "Yesterday — September 11, 2026",
    isToday: false,
    events: [
      { type: "quest",   icon: "💻", title: "Complete Leetcode Daily completed",         detail: "Intellect quest",   xp: 120, gold: 45, time: "9:15 AM",  color: "#22D3EE" },
      { type: "quest",   icon: "🧘", title: "20-min Meditation completed",              detail: "Mind quest",        xp: 50,  gold: 15, time: "7:05 AM",  color: "#8B5CF6" },
      { type: "quest",   icon: "💪", title: "Push-up Challenge — 100 reps completed",  detail: "Strength quest",    xp: 90,  gold: 30, time: "6:00 PM",  color: "#F0466B" },
      { type: "quest",   icon: "📝", title: "Write in Journal — 500 words completed",  detail: "Discipline quest",  xp: 40,  gold: 10, time: "10:50 PM", color: "#8B5CF6" },
      { type: "level",   icon: "✨", title: "Level 24 reached!",                        detail: "New skill slot available", xp: 500, gold: 250, time: "10:51 PM", color: "#8B5CF6" },
    ],
  },
  {
    date: "September 10, 2026",
    isToday: false,
    events: [
      { type: "quest",    icon: "🏃", title: "Morning Run — 5km completed",            detail: "Endurance quest",    xp: 70,  gold: 25, time: "8:00 AM",  color: "#34D399" },
      { type: "purchase", icon: "💎", title: "Focus Crystal purchased from Shop",       detail: "500 gold spent",    xp: 0,   gold: -500, time: "2:00 PM", color: "#22D3EE" },
      { type: "quest",    icon: "🧠", title: "Build ML Model Pipeline completed",       detail: "Epic quest — INT +5", xp: 350, gold: 150, time: "8:47 PM", color: "#C026D3" },
    ],
  },
  {
    date: "September 9, 2026",
    isToday: false,
    events: [
      { type: "quest",       icon: "💻", title: "Deploy Feature to Production completed",  detail: "Hard quest",          xp: 200, gold: 80, time: "4:30 PM", color: "#22D3EE" },
      { type: "achievement", icon: "💎", title: "Achievement unlocked: Deep Work",          detail: "10 Intellect quests", xp: 250, gold: 0,  time: "4:31 PM", color: "#F5B92C" },
    ],
  },
];

const TYPE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  quest: CheckCircle2, level: Star, achievement: Trophy, purchase: Coins, streak: TrendingUp,
};

export default function ActivityHistory() {
  const [history, setHistory] = useState<DayGroup[]>(HISTORY);

  useEffect(() => {
    getActivity()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const events: ActivityEvent[] = data.map((act) => ({
            type: act.activity_type || act.type || "quest",
            icon: act.icon || "⚔️",
            title: act.title || act.action || "Activity logged",
            detail: act.description || act.detail || "Game event",
            xp: act.xp_earned || act.xp || 0,
            gold: act.gold_earned || act.gold || 0,
            time: act.created_at ? new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
            color: "#8B5CF6",
          }));
          setHistory([{ date: "Recent Activity", isToday: true, events }]);
        }
      })
      .catch(() => {});
  }, []);

  const totalXPToday = history[0]?.events?.reduce((sum, e) => sum + (e.xp || 0), 0) || 0;
  const totalQuestsToday = history[0]?.events?.filter((e) => e.type === "quest").length || 0;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="font-display text-xs uppercase tracking-[0.25em] text-violet-400 mb-1">Chronicle</div>
      <h1 className="font-display font-bold text-white text-3xl mb-6">Activity History</h1>

      {/* Today summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "XP Today",    value: `+${totalXPToday}`,       icon: <Zap size={14} className="text-violet-400" />,        color: "#8B5CF6" },
          { label: "Quests Done", value: totalQuestsToday,          icon: <CheckCircle2 size={14} className="text-emerald-400" />, color: "#34D399" },
          { label: "Streak",      value: "14 days",                icon: <TrendingUp size={14} className="text-orange-400" />,  color: "#FF7A45" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4 border border-white/8">
            <div className="flex items-center gap-2 mb-1">{s.icon}<span className="text-xs text-[#A0A4B8]">{s.label}</span></div>
            <div className="font-display font-bold text-white text-xl" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {history.map((group) => (
          <div key={group.date}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
              <span
                className="font-display text-xs uppercase tracking-wider px-3 py-1 rounded-full"
                style={group.isToday
                  ? { background: "rgba(139,92,246,0.2)", color: "#8B5CF6", border: "1px solid rgba(139,92,246,0.4)" }
                  : { color: "#A0A4B8" }
                }
              >
                {group.date}
              </span>
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>

            <div className="space-y-3">
              {group.events.map((event, i) => {
                const TypeIcon = TYPE_ICONS[event.type] || CheckCircle2;
                return (
                  <div key={i} className="flex items-start gap-4 group">
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                        style={{ background: `${event.color}15`, border: `1px solid ${event.color}30` }}
                      >
                        {event.icon}
                      </div>
                      {i < group.events.length - 1 && (
                        <div className="w-px flex-1 min-h-3 mt-1" style={{ background: "rgba(255,255,255,0.05)" }} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="glass-card rounded-xl p-4 flex-1 border border-white/6 group-hover:border-white/12 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-display font-semibold text-white text-sm mb-0.5">{event.title}</div>
                          <div className="text-xs text-[#A0A4B8]">{event.detail}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs text-[#A0A4B8]">{event.time}</div>
                          <div className="flex items-center gap-2 mt-1 justify-end">
                            {event.xp > 0 && (
                              <span className="flex items-center gap-1 text-xs font-display font-bold text-violet-400">
                                <Zap size={10} />{event.xp > 0 ? "+" : ""}{event.xp}
                              </span>
                            )}
                            {event.gold !== 0 && (
                              <span className="flex items-center gap-1 text-xs font-display font-bold" style={{ color: event.gold > 0 ? "#F5B92C" : "#F0466B" }}>
                                <Coins size={10} />{event.gold > 0 ? "+" : ""}{event.gold}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
