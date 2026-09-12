import { CheckCircle2, Clock, Coins, Zap } from "lucide-react";

type Difficulty = "Easy" | "Medium" | "Hard" | "Epic";

const DIFFICULTY_CONFIG: Record<Difficulty, { color: string; bg: string; label: string }> = {
  Easy:   { color: "#34D399", bg: "rgba(52,211,153,0.12)",  label: "EASY" },
  Medium: { color: "#F5B92C", bg: "rgba(245,185,44,0.12)",  label: "MEDIUM" },
  Hard:   { color: "#F0466B", bg: "rgba(240,70,107,0.12)",  label: "HARD" },
  Epic:   { color: "#C026D3", bg: "rgba(192,38,211,0.12)",  label: "EPIC" },
};

interface QuestData {
  id: number;
  icon: string;
  title: string;
  category: string;
  categoryColor: string;
  difficulty: Difficulty;
  xp: number;
  gold: number;
  attribute: string;
  deadline: string;
  completed: boolean;
  description: string;
}

interface Props {
  quest: QuestData;
  onComplete: (id: number, e: React.MouseEvent) => void;
}

export default function QuestCard({ quest, onComplete }: Props) {
  const diff = DIFFICULTY_CONFIG[quest.difficulty];
  const isEpic = quest.difficulty === "Epic";

  return (
    <div
      className={`glass-card rounded-2xl p-5 flex flex-col gap-3 border transition-all duration-200 group relative overflow-hidden ${
        quest.completed
          ? "opacity-60 border-white/5"
          : isEpic
          ? "border-purple-500/30 hover:border-purple-500/60"
          : "border-white/8 hover:border-white/15"
      }`}
      style={
        isEpic && !quest.completed
          ? { boxShadow: "0 0 30px rgba(192,38,211,0.15)" }
          : undefined
      }
    >
      {/* Epic shimmer */}
      {isEpic && !quest.completed && (
        <div className="absolute inset-0 shimmer pointer-events-none rounded-2xl" />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{
              background: isEpic
                ? "linear-gradient(135deg, rgba(255,122,69,0.2), rgba(192,38,211,0.2))"
                : "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {quest.icon}
          </div>
          <div>
            <div
              className="text-xs uppercase tracking-wider font-semibold mb-0.5"
              style={{ color: quest.categoryColor }}
            >
              {quest.category}
            </div>
            <h3 className="font-display font-semibold text-white text-sm leading-tight">{quest.title}</h3>
          </div>
        </div>

        {/* Difficulty badge */}
        <span
          className="text-[10px] font-display font-bold uppercase tracking-widest px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ color: diff.color, background: diff.bg, border: `1px solid ${diff.color}40` }}
        >
          {diff.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-[#A0A4B8] leading-relaxed">{quest.description}</p>

      {/* Rewards */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 text-xs">
          <Zap size={11} className="text-violet-400" />
          <span className="text-violet-300 font-semibold">{quest.xp} XP</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Coins size={11} className="text-yellow-400" />
          <span className="text-yellow-300 font-semibold">{quest.gold} G</span>
        </div>
        <div
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(34,211,238,0.12)", color: "#22D3EE" }}
        >
          {quest.attribute}
        </div>
      </div>

      {/* Deadline */}
      <div className="flex items-center gap-1.5 text-xs text-[#A0A4B8]">
        <Clock size={11} />
        <span>{quest.deadline}</span>
      </div>

      {/* Complete button */}
      <button
        onClick={(e) => !quest.completed && onComplete(quest.id, e)}
        className={`w-full py-2.5 rounded-xl text-sm font-display font-semibold transition-all duration-200 flex items-center justify-center gap-2 mt-1 ${
          quest.completed
            ? "bg-white/5 text-[#A0A4B8] cursor-default"
            : isEpic
            ? "hover:opacity-90 active:scale-95 text-white"
            : "hover:opacity-90 active:scale-95 text-white"
        }`}
        style={
          quest.completed
            ? {}
            : isEpic
            ? {
                background: "linear-gradient(135deg, #FF7A45, #C026D3)",
                boxShadow: "0 0 16px rgba(192,38,211,0.4)",
              }
            : {
                background: "linear-gradient(135deg, #8B5CF6, #22D3EE)",
                boxShadow: "0 0 12px rgba(139,92,246,0.4)",
              }
        }
        disabled={quest.completed}
      >
        {quest.completed ? (
          <>
            <CheckCircle2 size={15} className="text-emerald-400" />
            <span className="text-emerald-400">COMPLETED</span>
          </>
        ) : (
          <>
            <CheckCircle2 size={15} />
            COMPLETE
          </>
        )}
      </button>
    </div>
  );
}
