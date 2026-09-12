import { useEffect, useState } from "react";
import { Swords, Star, X, Zap } from "lucide-react";
import { rpgEvents } from "./background/rpgEvents";

interface Props {
  level: number;
  onClose: () => void;
}

interface Particle {
  id: number;
  x: number;
  color: string;
  duration: number;
  delay: number;
  size: number;
}

const COLORS = ["#8B5CF6", "#22D3EE", "#F5B92C", "#34D399", "#F0466B", "#FF7A45"];

export default function LevelUpModal({ level, onClose }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    rpgEvents.trigger("level_up");
    const ps: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: 1.5 + Math.random() * 1.5,
      delay: Math.random() * 0.8,
      size: 4 + Math.random() * 8,
    }));
    setParticles(ps);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle absolute bottom-0 rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            bottom: "30%",
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 6px ${p.color}`,
            "--duration": `${p.duration}s`,
            "--delay": `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Modal card */}
      <div
        className="level-up-enter relative glass-card rounded-3xl p-8 max-w-sm w-full text-center border overflow-hidden"
        style={{
          border: "1px solid rgba(139,92,246,0.4)",
          boxShadow: "0 0 60px rgba(139,92,246,0.4), 0 0 100px rgba(34,211,238,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, #8B5CF6 0%, transparent 70%)" }}
        />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#A0A4B8] hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 grad-primary glow-pulse"
          style={{ boxShadow: "0 0 40px rgba(139,92,246,0.6)" }}
        >
          <Swords size={36} className="text-white" />
        </div>

        {/* LEVEL UP text */}
        <div
          className="font-display font-bold text-sm uppercase tracking-[0.3em] text-violet-300 mb-2"
        >
          ✦ Achievement Unlocked ✦
        </div>
        <h2
          className="font-display font-bold text-white mb-1"
          style={{
            fontSize: "3rem",
            lineHeight: 1,
            textShadow: "0 0 30px rgba(139,92,246,0.8), 0 0 60px rgba(34,211,238,0.4)",
          }}
        >
          LEVEL UP!
        </h2>
        <div
          className="font-display font-bold grad-primary-text mb-5"
          style={{ fontSize: "4rem", lineHeight: 1 }}
        >
          {level}
        </div>

        {/* Rewards */}
        <div
          className="rounded-xl p-4 mb-5"
          style={{ background: "rgba(245,185,44,0.08)", border: "1px solid rgba(245,185,44,0.2)" }}
        >
          <div className="text-xs text-[#A0A4B8] uppercase tracking-wider mb-2">Rewards Unlocked</div>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5">
              <Zap size={14} className="text-violet-400" />
              <span className="font-display font-bold text-white text-sm">+500 XP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star size={14} className="text-yellow-400" />
              <span className="font-display font-bold text-yellow-300 text-sm">+250 Gold</span>
            </div>
          </div>
          <div
            className="mt-2 text-xs font-display font-semibold px-3 py-1 rounded-full inline-block"
            style={{ background: "rgba(192,38,211,0.15)", color: "#C026D3", border: "1px solid rgba(192,38,211,0.3)" }}
          >
            🗡️ Epic Skill Slot Unlocked
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-display font-bold text-white transition-all hover:opacity-90 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #8B5CF6, #22D3EE)",
            boxShadow: "0 0 20px rgba(139,92,246,0.5)",
          }}
        >
          CONTINUE YOUR JOURNEY
        </button>
      </div>
    </div>
  );
}
