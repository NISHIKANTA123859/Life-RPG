import { Sword, Shield, Brain, Trophy, Zap, Target, Star, ChevronRight, Flame } from "lucide-react";

interface Props {
  onEnter: () => void;
  onLogin: () => void;
}

const features = [
  {
    icon: Sword,
    title: "Quest System",
    desc: "Transform daily tasks into epic quests with difficulty tiers, XP rewards, and loot drops.",
    color: "text-violet-400",
    glow: "rgba(139,92,246,0.3)",
  },
  {
    icon: Brain,
    title: "AI Quest Intelligence",
    desc: "Get AI-powered quest suggestions tailored to your goals with completion likelihood scores.",
    color: "text-cyan-400",
    glow: "rgba(34,211,238,0.3)",
  },
  {
    icon: Shield,
    title: "Character Progression",
    desc: "Build a unique hero across six attributes: Intellect, Strength, Health, Mind, Discipline, Endurance.",
    color: "text-emerald-400",
    glow: "rgba(52,211,153,0.3)",
  },
  {
    icon: Trophy,
    title: "Achievements & Loot",
    desc: "Unlock rare achievements, equip items from the shop, and climb the global leaderboard.",
    color: "text-yellow-400",
    glow: "rgba(245,185,44,0.3)",
  },
  {
    icon: Flame,
    title: "Streak Engine",
    desc: "Maintain daily streaks to earn multipliers and bonus XP. Miss a day and lose your flame.",
    color: "text-orange-400",
    glow: "rgba(251,146,60,0.3)",
  },
  {
    icon: Target,
    title: "Skill Trees",
    desc: "Unlock branching skill trees for each attribute — master Python, then ML, then Deep Learning.",
    color: "text-pink-400",
    glow: "rgba(244,114,182,0.3)",
  },
];

const stats = [
  { value: "127K+", label: "Heroes Active" },
  { value: "4.2M", label: "Quests Completed" },
  { value: "98%", label: "Streak Rate" },
  { value: "∞", label: "Potential Unlocked" },
];

export default function Landing({ onEnter, onLogin }: Props) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-transparent">
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass-card border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center grad-primary"
              style={{ boxShadow: "0 0 16px rgba(139,92,246,0.5)" }}
            >
              <Sword size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white tracking-wide">LIFE RPG</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#A0A4B8]">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#stats" className="hover:text-white transition-colors">Community</a>
            <a href="#classes" className="hover:text-white transition-colors">Classes</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              className="text-sm text-[#A0A4B8] hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </button>
            <button
              onClick={onEnter}
              className="grad-primary text-white text-sm font-semibold px-5 py-2 rounded-lg glow-primary hover:opacity-90 transition-opacity"
            >
              Start Quest
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-32 px-6">
        {/* Background glow blobs */}
        <div
          className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #8B5CF6, transparent)" }}
        />
        <div
          className="absolute top-40 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-15"
          style={{ background: "radial-gradient(circle, #22D3EE, transparent)" }}
        />

        <div className="max-w-5xl mx-auto text-center relative">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-violet-500/30 text-sm text-violet-300 mb-8"
            style={{ boxShadow: "0 0 20px rgba(139,92,246,0.2)" }}
          >
            <Zap size={12} className="text-yellow-400" />
            <span className="font-display tracking-wider uppercase text-xs">Season 3 is LIVE — New Epic Quests Unlocked</span>
          </div>

          <h1
            className="font-display font-bold text-white mb-6 leading-none"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)", letterSpacing: "-0.02em" }}
          >
            TURN YOUR LIFE
            <br />
            <span className="grad-primary-text">INTO A GAME</span>
          </h1>

          <p className="text-[#A0A4B8] text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Transform your real-world goals into epic RPG quests. Earn XP, level up your character,
            unlock achievements, and compete on the global leaderboard. Your greatest adventure starts now.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onEnter}
              className="group grad-primary text-white font-semibold px-8 py-4 rounded-xl glow-primary hover:opacity-90 transition-all flex items-center gap-2 text-base"
              style={{ boxShadow: "0 0 30px rgba(139,92,246,0.5)" }}
            >
              <Sword size={18} />
              Begin Your Journey
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onEnter}
              className="glass-card text-white font-semibold px-8 py-4 rounded-xl hover:border-violet-500/40 transition-all flex items-center gap-2 text-base border border-white/10"
            >
              <Star size={18} className="text-yellow-400" />
              View Demo
            </button>
          </div>

          {/* Hero mockup preview */}
          <div className="mt-20 relative">
            <div
              className="glass-card rounded-2xl border border-white/10 overflow-hidden mx-auto max-w-4xl"
              style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(139,92,246,0.15)" }}
            >
              {/* Fake dashboard preview */}
              <div className="flex h-64 md:h-80">
                {/* Sidebar preview */}
                <div className="w-14 border-r border-white/5 flex flex-col items-center py-4 gap-4">
                  {[Sword, Target, Shield, Brain, Trophy].map((Icon, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === 0 ? "grad-primary glow-primary" : "bg-white/5 text-[#A0A4B8]"}`}
                    >
                      <Icon size={14} className="text-white" />
                    </div>
                  ))}
                </div>
                {/* Content preview */}
                <div className="flex-1 p-4 overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="h-3 w-32 rounded grad-primary-text shimmer mb-1" style={{ background: "linear-gradient(135deg, #8B5CF6, #22D3EE)", height: "12px" }} />
                      <div className="h-2 w-20 rounded bg-white/10 mt-2" />
                    </div>
                    <div className="flex gap-2">
                      {["#34D399", "#F5B92C", "#8B5CF6"].map((c, i) => (
                        <div key={i} className="w-8 h-8 rounded-lg" style={{ background: c, opacity: 0.8 }} />
                      ))}
                    </div>
                  </div>
                  {/* XP bar */}
                  <div className="h-2 rounded-full bg-white/10 mb-4 overflow-hidden">
                    <div className="h-full w-2/3 rounded-full grad-primary" />
                  </div>
                  {/* Quest cards */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { color: "#8B5CF6", label: "Daily Coding" },
                      { color: "#34D399", label: "Morning Run" },
                      { color: "#F5B92C", label: "Read 30 min" },
                    ].map((q, i) => (
                      <div key={i} className="glass-card rounded-lg p-2 border border-white/5">
                        <div className="w-6 h-6 rounded-md mb-2" style={{ background: q.color, opacity: 0.8 }} />
                        <div className="h-1.5 w-16 rounded bg-white/20 mb-1" />
                        <div className="h-1.5 w-10 rounded bg-white/10" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Gradient fade bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 h-32"
              style={{ background: "linear-gradient(to top, #0B0D14, transparent)" }}
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display font-bold text-4xl grad-primary-text mb-1">{s.value}</div>
              <div className="text-[#A0A4B8] text-sm uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block font-display text-xs uppercase tracking-[0.3em] text-violet-400 mb-4">
              Core Systems
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white">
              BUILT FOR <span className="grad-primary-text">CHAMPIONS</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="glass-card rounded-2xl p-6 border border-white/8 hover:border-white/15 transition-all group"
                  style={{ transition: "all 0.3s ease" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-white/5 group-hover:scale-110 transition-transform"
                    style={{ boxShadow: `0 0 16px ${f.glow}` }}
                  >
                    <Icon size={20} className={f.color} />
                  </div>
                  <h3 className="font-display font-semibold text-white text-lg mb-2">{f.title}</h3>
                  <p className="text-[#A0A4B8] text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Classes section */}
      <section id="classes" className="py-24 px-6" style={{ background: "rgba(20,22,31,0.5)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="font-display text-xs uppercase tracking-[0.3em] text-cyan-400 mb-4">
              Choose Your Path
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white">
              SELECT YOUR <span className="grad-primary-text">CLASS</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "SCHOLAR", icon: Brain, color: "#22D3EE", desc: "Master knowledge & intellect", bonus: "+2 INT per quest" },
              { name: "WARRIOR", icon: Shield, color: "#F0466B", desc: "Build strength & endurance", bonus: "+2 STR per quest" },
              { name: "RANGER", icon: Target, color: "#34D399", desc: "Discipline & consistency", bonus: "+2 DIS per quest" },
              { name: "MONK", icon: Star, color: "#F5B92C", desc: "Balance mind & body", bonus: "+1 ALL per quest" },
            ].map((cls) => {
              const Icon = cls.icon;
              return (
                <div
                  key={cls.name}
                  className="glass-card rounded-2xl p-5 border border-white/8 hover:border-white/20 text-center group cursor-pointer transition-all"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all group-hover:scale-110"
                    style={{ background: `${cls.color}20`, boxShadow: `0 0 20px ${cls.color}30` }}
                  >
                    <Icon size={24} style={{ color: cls.color }} />
                  </div>
                  <div className="font-display font-bold text-white mb-1 tracking-wide">{cls.name}</div>
                  <div className="text-[#A0A4B8] text-xs mb-2">{cls.desc}</div>
                  <div
                    className="text-xs font-semibold px-2 py-1 rounded-full inline-block"
                    style={{ background: `${cls.color}20`, color: cls.color }}
                  >
                    {cls.bonus}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: "radial-gradient(ellipse at center, #8B5CF6 0%, transparent 70%)" }}
        />
        <div className="max-w-2xl mx-auto text-center relative">
          <div className="font-display text-xs uppercase tracking-[0.3em] text-violet-400 mb-4">
            Your Legend Awaits
          </div>
          <h2 className="font-display font-bold text-white mb-6" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
            READY TO LEVEL UP <span className="grad-primary-text">YOUR LIFE?</span>
          </h2>
          <p className="text-[#A0A4B8] mb-10 text-lg">
            Join 127,000+ heroes who transformed their daily routine into an epic adventure.
          </p>
          <button
            onClick={onEnter}
            className="group grad-primary text-white font-bold px-10 py-5 rounded-xl text-lg flex items-center gap-3 mx-auto glow-pulse"
          >
            <Sword size={20} />
            Enter the Game
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md grad-primary flex items-center justify-center">
              <Sword size={12} className="text-white" />
            </div>
            <span className="font-display font-bold text-white text-sm">LIFE RPG</span>
          </div>
          <div className="text-[#A0A4B8] text-xs">
            © 2026 LIFE RPG. All rights reserved. Turn your grind into glory.
          </div>
        </div>
      </footer>
    </div>
  );
}
