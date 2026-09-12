import { useState } from "react";
import { ChevronRight, ChevronLeft, Sword, Brain, Shield, Target, Star, Check } from "lucide-react";

interface Props {
  onDone: () => void;
  onLogin: () => void;
}

type ClassKey = "Scholar" | "Warrior" | "Ranger" | "Monk";

interface ClassData {
  key: ClassKey;
  icon: string;
  color: string;
  desc: string;
  bonuses: string[];
  attributes: { name: string; value: number }[];
  lucideIcon: React.ComponentType<{ size?: number; className?: string }>;
}

const CLASSES: ClassData[] = [
  {
    key: "Scholar", icon: "🧙‍♀️", color: "#22D3EE", lucideIcon: Brain,
    desc: "Master of knowledge and intellect. Excels at mental quests and learning.",
    bonuses: ["+2 INT per quest", "+1 DIS per week", "Bonus XP from reading quests"],
    attributes: [{ name: "INT", value: 80 }, { name: "MND", value: 70 }, { name: "DIS", value: 60 }, { name: "STR", value: 30 }, { name: "END", value: 40 }, { name: "HLT", value: 50 }],
  },
  {
    key: "Warrior", icon: "⚔️", color: "#F0466B", lucideIcon: Sword,
    desc: "Born for battle. Thrives on physical challenges and strength training.",
    bonuses: ["+2 STR per quest", "+1 END per week", "Bonus XP from fitness quests"],
    attributes: [{ name: "INT", value: 40 }, { name: "MND", value: 50 }, { name: "DIS", value: 60 }, { name: "STR", value: 85 }, { name: "END", value: 75 }, { name: "HLT", value: 70 }],
  },
  {
    key: "Ranger", icon: "🏹", color: "#34D399", lucideIcon: Target,
    desc: "Disciplined and consistent. Built for long-term habits and streaks.",
    bonuses: ["+2 DIS per quest", "+2 streak bonus", "Bonus gold from daily quests"],
    attributes: [{ name: "INT", value: 60 }, { name: "MND", value: 65 }, { name: "DIS", value: 85 }, { name: "STR", value: 55 }, { name: "END", value: 70 }, { name: "HLT", value: 65 }],
  },
  {
    key: "Monk", icon: "🧘", color: "#F5B92C", lucideIcon: Star,
    desc: "Perfect balance of mind and body. Gains bonuses across all attributes.",
    bonuses: ["+1 to ALL stats per quest", "+5% global XP bonus", "Bonus XP from Mind quests"],
    attributes: [{ name: "INT", value: 65 }, { name: "MND", value: 80 }, { name: "DIS", value: 65 }, { name: "STR", value: 55 }, { name: "END", value: 60 }, { name: "HLT", value: 75 }],
  },
];

export default function Register({ onDone, onLogin }: Props) {
  const [step, setStep] = useState(1);
  const [selectedClass, setSelectedClass] = useState<ClassKey>("Scholar");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const cls = CLASSES.find((c) => c.key === selectedClass)!;

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onDone(); }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "#0B0D14" }}>
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: `radial-gradient(circle, ${cls.color}, transparent)` }} />

      <div className="w-full max-w-2xl relative">
        {/* Logo */}
        <div className="text-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center grad-primary mx-auto mb-3"
            style={{ boxShadow: "0 0 24px rgba(139,92,246,0.5)" }}
          >
            <Sword size={24} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-white text-2xl">Create Your Hero</h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-display font-bold transition-all"
                style={
                  step >= s
                    ? { background: "linear-gradient(135deg, #8B5CF6, #22D3EE)", color: "white" }
                    : { background: "rgba(255,255,255,0.1)", color: "#A0A4B8" }
                }
              >
                {step > s ? <Check size={12} /> : s}
              </div>
              <span className="text-xs font-display" style={{ color: step >= s ? "white" : "#A0A4B8" }}>
                {s === 1 ? "Choose Class" : "Your Details"}
              </span>
              {s < 2 && <div className="w-8 h-px" style={{ background: step > s ? "linear-gradient(90deg, #8B5CF6, #22D3EE)" : "rgba(255,255,255,0.1)" }} />}
            </div>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/10" style={{ boxShadow: "0 0 40px rgba(139,92,246,0.1)" }}>
          {/* Step 1: Class selection */}
          {step === 1 && (
            <>
              <h2 className="font-display font-bold text-white text-xl mb-1">Choose Your Class</h2>
              <p className="text-[#A0A4B8] text-sm mb-5">Your class determines your starting attributes and passive bonuses.</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {CLASSES.map((c) => {
                  const active = selectedClass === c.key;
                  const Icon = c.lucideIcon;
                  return (
                    <button
                      key={c.key}
                      onClick={() => setSelectedClass(c.key)}
                      className="rounded-2xl p-4 text-center transition-all hover:scale-105"
                      style={{
                        background: active ? `${c.color}15` : "rgba(255,255,255,0.03)",
                        border: `1.5px solid ${active ? c.color : "rgba(255,255,255,0.08)"}`,
                        boxShadow: active ? `0 0 20px ${c.color}25` : undefined,
                      }}
                    >
                      <div className="text-3xl mb-2">{c.icon}</div>
                      <div className="font-display font-bold text-white text-sm">{c.key}</div>
                      <div className="text-[10px] mt-1" style={{ color: c.color }}>
                        <Icon size={10} className="inline mr-0.5" />
                        {c.bonuses[0]}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Class preview */}
              <div
                className="rounded-xl p-4 mb-5"
                style={{ background: `${cls.color}08`, border: `1px solid ${cls.color}20` }}
              >
                <div className="flex gap-4">
                  <div className="text-4xl">{cls.icon}</div>
                  <div className="flex-1">
                    <div className="font-display font-bold text-white mb-1">{cls.key}</div>
                    <p className="text-[#A0A4B8] text-xs mb-3">{cls.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {cls.bonuses.map((b) => (
                        <span key={b} className="text-[10px] px-2 py-1 rounded-full font-semibold" style={{ background: `${cls.color}20`, color: cls.color }}>{b}</span>
                      ))}
                    </div>
                    {/* Attribute bars */}
                    <div className="grid grid-cols-3 gap-x-4 gap-y-1">
                      {cls.attributes.map((a) => (
                        <div key={a.name}>
                          <div className="flex justify-between text-[9px] mb-0.5">
                            <span className="text-[#A0A4B8]">{a.name}</span>
                            <span style={{ color: cls.color }}>{a.value}</span>
                          </div>
                          <div className="h-1 rounded-full bg-white/8 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${a.value}%`, background: cls.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 rounded-xl font-display font-bold text-white grad-primary glow-primary hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                Continue as {cls.key} <ChevronRight size={16} />
              </button>
            </>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <>
              <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-[#A0A4B8] hover:text-white transition-colors mb-4">
                <ChevronLeft size={15} /> Back
              </button>
              <h2 className="font-display font-bold text-white text-xl mb-5">Your Details</h2>

              <div className="flex items-center gap-3 mb-6 p-3 rounded-xl" style={{ background: `${cls.color}10`, border: `1px solid ${cls.color}25` }}>
                <span className="text-2xl">{cls.icon}</span>
                <div>
                  <div className="font-display text-xs uppercase tracking-wider" style={{ color: cls.color }}>{cls.key} class selected</div>
                  <div className="text-xs text-[#A0A4B8]">{cls.bonuses[0]}</div>
                </div>
                <button onClick={() => setStep(1)} className="ml-auto text-xs text-[#A0A4B8] hover:text-white transition-colors">Change</button>
              </div>

              <div className="space-y-4 mb-5">
                {[
                  { label: "Hero Name", placeholder: "Choose your hero name...", value: name, setter: setName, type: "text" },
                  { label: "Email", placeholder: "your@email.com", value: email, setter: setEmail, type: "email" },
                  { label: "Password", placeholder: "Create a strong password...", value: password, setter: setPassword, type: "password" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="text-xs text-[#A0A4B8] uppercase tracking-wider mb-1.5 block">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-[#A0A4B8] outline-none"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={!name || !email || !password || loading}
                className="w-full py-3.5 rounded-xl font-display font-bold text-white grad-primary glow-primary hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
                    Creating Hero...
                  </span>
                ) : (
                  <><Sword size={15} /> Begin Your Legend</>
                )}
              </button>
            </>
          )}
        </div>

        <div className="text-center mt-4">
          <span className="text-[#A0A4B8] text-sm">Already a hero? </span>
          <button onClick={onLogin} className="text-violet-400 hover:text-violet-300 text-sm font-semibold transition-colors">Sign In</button>
        </div>
      </div>
    </div>
  );
}
