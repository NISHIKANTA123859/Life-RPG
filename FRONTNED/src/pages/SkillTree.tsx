import { useState } from "react";
import { Lock, CheckCircle2, Zap } from "lucide-react";

type NodeState = "mastered" | "unlocked" | "available" | "locked";

interface SkillNode {
  id: string;
  name: string;
  icon: string;
  state: NodeState;
  xpRequired: number;
  bonus: string;
  children: string[];
}

type SkillTreeData = Record<string, SkillNode>;

const TREES: Record<string, SkillTreeData> = {
  Intellect: {
    "programming": { id: "programming", name: "Programming", icon: "💻", state: "mastered", xpRequired: 0, bonus: "INT +5", children: ["python", "javascript"] },
    "python":      { id: "python", name: "Python", icon: "🐍", state: "mastered", xpRequired: 500, bonus: "INT +8", children: ["data-science", "automation"] },
    "javascript":  { id: "javascript", name: "JavaScript", icon: "⚡", state: "unlocked", xpRequired: 500, bonus: "INT +6", children: ["react", "node"] },
    "data-science":{ id: "data-science", name: "Data Science", icon: "📊", state: "unlocked", xpRequired: 1200, bonus: "INT +10", children: ["ml"] },
    "automation":  { id: "automation", name: "Automation", icon: "🤖", state: "available", xpRequired: 1200, bonus: "INT +7", children: [] },
    "react":       { id: "react", name: "React", icon: "⚛️", state: "available", xpRequired: 1000, bonus: "INT +8", children: [] },
    "node":        { id: "node", name: "Node.js", icon: "🟢", state: "locked", xpRequired: 1000, bonus: "INT +6", children: [] },
    "ml":          { id: "ml", name: "Machine Learning", icon: "🧠", state: "available", xpRequired: 3000, bonus: "INT +15", children: ["deep-learning"] },
    "deep-learning":{ id: "deep-learning", name: "Deep Learning", icon: "🔮", state: "locked", xpRequired: 6000, bonus: "INT +20", children: [] },
  },
  Strength: {
    "fitness":     { id: "fitness", name: "Fitness Basics", icon: "💪", state: "mastered", xpRequired: 0, bonus: "STR +5", children: ["lifting", "cardio"] },
    "lifting":     { id: "lifting", name: "Weightlifting", icon: "🏋️", state: "unlocked", xpRequired: 600, bonus: "STR +8", children: ["powerlifting"] },
    "cardio":      { id: "cardio", name: "Cardio", icon: "🏃", state: "mastered", xpRequired: 600, bonus: "END +5", children: ["marathon"] },
    "powerlifting":{ id: "powerlifting", name: "Powerlifting", icon: "🔱", state: "available", xpRequired: 2000, bonus: "STR +15", children: [] },
    "marathon":    { id: "marathon", name: "Marathon", icon: "🏅", state: "locked", xpRequired: 3000, bonus: "END +12", children: [] },
  },
  Mind: {
    "meditation":  { id: "meditation", name: "Meditation", icon: "🧘", state: "mastered", xpRequired: 0, bonus: "MND +5", children: ["focus", "mindfulness"] },
    "focus":       { id: "focus", name: "Deep Focus", icon: "🎯", state: "unlocked", xpRequired: 800, bonus: "MND +8", children: ["flow-state"] },
    "mindfulness": { id: "mindfulness", name: "Mindfulness", icon: "🌿", state: "mastered", xpRequired: 800, bonus: "MND +6", children: ["stoicism"] },
    "flow-state":  { id: "flow-state", name: "Flow State", icon: "🌊", state: "available", xpRequired: 2500, bonus: "MND +15", children: [] },
    "stoicism":    { id: "stoicism", name: "Stoicism", icon: "⚖️", state: "available", xpRequired: 2000, bonus: "DIS +10", children: [] },
  },
};

const STATE_STYLES: Record<NodeState, { border: string; bg: string; iconColor: string; badge: string }> = {
  mastered:  { border: "#F5B92C", bg: "rgba(245,185,44,0.15)", iconColor: "#F5B92C", badge: "MASTERED" },
  unlocked:  { border: "#8B5CF6", bg: "rgba(139,92,246,0.15)", iconColor: "#8B5CF6", badge: "UNLOCKED" },
  available: { border: "#22D3EE", bg: "rgba(34,211,238,0.10)", iconColor: "#22D3EE", badge: "AVAILABLE" },
  locked:    { border: "rgba(255,255,255,0.1)", bg: "rgba(255,255,255,0.03)", iconColor: "#A0A4B8", badge: "LOCKED" },
};

function SkillNodeCard({ node, onUnlock }: { node: SkillNode; onUnlock: (id: string) => void }) {
  const style = STATE_STYLES[node.state];
  return (
    <div
      className="rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 hover:scale-105 relative"
      style={{ background: style.bg, border: `1.5px solid ${style.border}`, boxShadow: node.state !== "locked" ? `0 0 16px ${style.border}30` : undefined, minWidth: 120 }}
      onClick={() => node.state === "available" && onUnlock(node.id)}
    >
      {node.state === "locked" && (
        <div className="absolute inset-0 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
          <Lock size={18} className="text-[#A0A4B8]" />
        </div>
      )}
      {node.state === "mastered" && (
        <div className="absolute -top-2 -right-2">
          <CheckCircle2 size={16} className="text-yellow-400" fill="rgba(245,185,44,0.2)" />
        </div>
      )}
      <div className="text-3xl mb-2">{node.icon}</div>
      <div className="font-display font-bold text-white text-xs mb-1">{node.name}</div>
      <div className="text-[10px] font-semibold" style={{ color: style.iconColor }}>{node.bonus}</div>
      {node.state === "available" && (
        <button
          className="mt-2 px-3 py-1 rounded-full text-[10px] font-display font-bold text-white"
          style={{ background: "linear-gradient(135deg, #8B5CF6, #22D3EE)" }}
        >
          UNLOCK
        </button>
      )}
    </div>
  );
}

export default function SkillTree() {
  const [activeTree, setActiveTree] = useState<keyof typeof TREES>("Intellect");
  const [trees, setTrees] = useState(TREES);

  const handleUnlock = (nodeId: string) => {
    setTrees((prev) => ({
      ...prev,
      [activeTree]: {
        ...prev[activeTree],
        [nodeId]: { ...prev[activeTree][nodeId], state: "unlocked" as NodeState },
      },
    }));
  };

  const tree = trees[activeTree];
  const nodes = Object.values(tree);
  const mastered = nodes.filter((n) => n.state === "mastered").length;
  const total = nodes.length;

  // Build levels for display
  const getLevels = (treeData: SkillTreeData): SkillNode[][] => {
    const visited = new Set<string>();
    const levels: SkillNode[][] = [];
    const roots = Object.values(treeData).filter((n) =>
      !Object.values(treeData).some((other) => other.children.includes(n.id))
    );
    let current = roots;
    while (current.length > 0) {
      levels.push(current);
      current.forEach((n) => visited.add(n.id));
      const next = current.flatMap((n) => n.children.map((id) => treeData[id]).filter(Boolean).filter((n) => !visited.has(n.id)));
      current = next;
    }
    return levels;
  };

  const levels = getLevels(tree);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="font-display text-xs uppercase tracking-[0.25em] text-violet-400 mb-1">Skills</div>
      <h1 className="font-display font-bold text-white text-3xl mb-6">Skill Tree</h1>

      {/* Tree selector */}
      <div className="flex gap-2 flex-wrap mb-8">
        {Object.keys(TREES).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTree(t as keyof typeof TREES)}
            className="px-5 py-2.5 rounded-xl text-sm font-display font-semibold transition-all"
            style={
              activeTree === t
                ? { background: "linear-gradient(135deg, #8B5CF6, #22D3EE)", color: "white", boxShadow: "0 0 16px rgba(139,92,246,0.4)" }
                : { background: "rgba(255,255,255,0.05)", color: "#A0A4B8", border: "1px solid rgba(255,255,255,0.08)" }
            }
          >
            {t}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="glass-card rounded-2xl p-5 border border-white/8 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-violet-400" />
            <span className="font-display font-semibold text-white">{activeTree} Mastery</span>
          </div>
          <span className="font-display text-sm text-[#A0A4B8]">{mastered}/{total} skills mastered</span>
        </div>
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(mastered / total) * 100}%`, background: "linear-gradient(90deg, #F5B92C, #8B5CF6)", boxShadow: "0 0 8px rgba(139,92,246,0.5)" }} />
        </div>
      </div>

      {/* Tree visualization */}
      <div className="overflow-x-auto pb-4">
        <div className="flex flex-col items-center gap-8 min-w-max px-8">
          {levels.map((level, li) => (
            <div key={li} className="flex gap-8 items-center">
              {level.map((node) => (
                <SkillNodeCard key={node.id} node={node} onUnlock={handleUnlock} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-8 justify-center">
        {(Object.entries(STATE_STYLES) as [NodeState, typeof STATE_STYLES[NodeState]][]).map(([state, style]) => (
          <div key={state} className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full" style={{ background: style.border }} />
            <span className="text-[#A0A4B8] capitalize">{state}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
