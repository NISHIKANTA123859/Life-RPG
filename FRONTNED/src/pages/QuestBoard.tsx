import { useState } from "react";
import { Plus, Search, SlidersHorizontal, X, Clock, Coins, Zap, CheckCircle2 } from "lucide-react";
import QuestCard from "../components/QuestCard";
import { QUESTS_DATA } from "../data/gameData";

type Tab = "All" | "Today" | "Active" | "Completed";
type Difficulty = "All" | "Easy" | "Medium" | "Hard" | "Epic";

const EXTRA_QUESTS = [
  {
    id: 5, icon: "💪", title: "Push-up Challenge — 100 reps", category: "Strength", categoryColor: "#F0466B",
    difficulty: "Medium" as const, xp: 90, gold: 30, attribute: "STR +2", deadline: "Today, 11:00 PM",
    completed: false, description: "Complete 100 push-ups across any sets during the day.",
  },
  {
    id: 6, icon: "🧘", title: "20-min Morning Meditation", category: "Mind", categoryColor: "#8B5CF6",
    difficulty: "Easy" as const, xp: 50, gold: 15, attribute: "MND +1", deadline: "Today, 8:30 AM",
    completed: false, description: "Complete a focused 20-minute mindfulness session.",
  },
  {
    id: 7, icon: "🖥️", title: "Deploy Feature to Production", category: "Intellect", categoryColor: "#22D3EE",
    difficulty: "Hard" as const, xp: 200, gold: 80, attribute: "INT +3", deadline: "Friday, 5:00 PM",
    completed: false, description: "Ship the authentication refactor to the production environment.",
  },
  {
    id: 8, icon: "📝", title: "Write in Journal — 500 words", category: "Discipline", categoryColor: "#8B5CF6",
    difficulty: "Easy" as const, xp: 40, gold: 10, attribute: "DIS +1", deadline: "Today, 10:00 PM",
    completed: false, description: "Reflect on the day's progress with at least 500 words.",
  },
];

const ALL_QUESTS = [...QUESTS_DATA, ...EXTRA_QUESTS];

interface CreateQuestForm {
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Epic";
  deadline: string;
  description: string;
}

export default function QuestBoard() {
  const [tab, setTab] = useState<Tab>("All");
  const [diffFilter, setDiffFilter] = useState<Difficulty>("All");
  const [search, setSearch] = useState("");
  const [quests, setQuests] = useState(ALL_QUESTS);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CreateQuestForm>({
    title: "", category: "Intellect", difficulty: "Easy", deadline: "", description: "",
  });

  const filtered = quests.filter((q) => {
    if (tab === "Today" && !q.deadline.startsWith("Today")) return false;
    if (tab === "Active" && q.completed) return false;
    if (tab === "Completed" && !q.completed) return false;
    if (diffFilter !== "All" && q.difficulty !== diffFilter) return false;
    if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleComplete = (id: number, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    void rect;
    setQuests((prev) => prev.map((q) => (q.id === id ? { ...q, completed: true } : q)));
  };

  const handleCreate = () => {
    if (!form.title) return;
    const xpMap = { Easy: 60, Medium: 120, Hard: 200, Epic: 350 };
    const goldMap = { Easy: 20, Medium: 45, Hard: 80, Epic: 150 };
    setQuests((prev) => [
      ...prev,
      {
        id: Date.now(), icon: "⚡", title: form.title, category: form.category,
        categoryColor: "#8B5CF6", difficulty: form.difficulty,
        xp: xpMap[form.difficulty], gold: goldMap[form.difficulty],
        attribute: "INT +1", deadline: form.deadline || "No deadline",
        completed: false, description: form.description,
      },
    ]);
    setForm({ title: "", category: "Intellect", difficulty: "Easy", deadline: "", description: "" });
    setShowCreate(false);
  };

  const TABS: Tab[] = ["All", "Today", "Active", "Completed"];
  const DIFFS: Difficulty[] = ["All", "Easy", "Medium", "Hard", "Epic"];
  const DIFF_COLORS: Record<Difficulty, string> = {
    All: "#A0A4B8", Easy: "#34D399", Medium: "#F5B92C", Hard: "#F0466B", Epic: "#C026D3",
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="font-display text-xs uppercase tracking-[0.25em] text-violet-400 mb-1">Quest Board</div>
          <h1 className="font-display font-bold text-white text-3xl">Your Quests</h1>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 grad-primary text-white font-semibold px-5 py-3 rounded-xl glow-primary hover:opacity-90 transition-opacity text-sm self-start"
        >
          <Plus size={16} /> Create Quest
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 glass-card rounded-xl p-1 w-fit border border-white/8">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-display font-semibold transition-all ${
              tab === t ? "text-white" : "text-[#A0A4B8] hover:text-white"
            }`}
            style={tab === t ? { background: "linear-gradient(135deg, #8B5CF6, #22D3EE)" } : {}}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A4B8]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quests..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-[#A0A4B8] outline-none focus:border-violet-500/50 transition-colors"
            style={{ background: "rgba(20,22,31,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {DIFFS.map((d) => (
            <button
              key={d}
              onClick={() => setDiffFilter(d)}
              className="px-3 py-2 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all"
              style={{
                color: DIFF_COLORS[d],
                background: diffFilter === d ? `${DIFF_COLORS[d]}20` : "rgba(255,255,255,0.05)",
                border: `1px solid ${diffFilter === d ? DIFF_COLORS[d] + "50" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total", value: quests.length, color: "#8B5CF6", icon: <SlidersHorizontal size={14} /> },
          { label: "Active", value: quests.filter((q) => !q.completed).length, color: "#22D3EE", icon: <Clock size={14} /> },
          { label: "Done", value: quests.filter((q) => q.completed).length, color: "#34D399", icon: <CheckCircle2 size={14} /> },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-3 border border-white/8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}20`, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <div className="font-display font-bold text-white text-lg">{s.value}</div>
              <div className="text-[#A0A4B8] text-xs">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quest grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">⚔️</div>
          <div className="font-display font-bold text-white text-xl mb-2">No quests found</div>
          <div className="text-[#A0A4B8] text-sm">Try adjusting your filters or create a new quest.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filtered.map((quest) => (
            <QuestCard key={quest.id} quest={quest} onComplete={handleComplete} />
          ))}
        </div>
      )}

      {/* Create Quest Modal */}
      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={() => setShowCreate(false)}
        >
          <div
            className="glass-card rounded-2xl p-6 w-full max-w-md border border-white/12"
            style={{ boxShadow: "0 0 40px rgba(139,92,246,0.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-white text-xl">Create Quest</h2>
              <button onClick={() => setShowCreate(false)} className="text-[#A0A4B8] hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#A0A4B8] uppercase tracking-wider mb-1.5 block">Quest Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Enter quest title..."
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-[#A0A4B8] outline-none transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#A0A4B8] uppercase tracking-wider mb-1.5 block">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    {["Intellect", "Strength", "Health", "Mind", "Discipline", "Endurance"].map((c) => (
                      <option key={c} value={c} style={{ background: "#1B1E2B" }}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#A0A4B8] uppercase tracking-wider mb-1.5 block">Difficulty</label>
                  <select
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value as CreateQuestForm["difficulty"] })}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    {["Easy", "Medium", "Hard", "Epic"].map((d) => (
                      <option key={d} value={d} style={{ background: "#1B1E2B" }}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-[#A0A4B8] uppercase tracking-wider mb-1.5 block">Deadline</label>
                <input
                  type="text"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  placeholder="e.g. Today, 11:59 PM"
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-[#A0A4B8] outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </div>
              <div>
                <label className="text-xs text-[#A0A4B8] uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your quest..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-[#A0A4B8] outline-none resize-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-[#A0A4B8] hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!form.title}
                className="flex-1 py-2.5 rounded-xl text-sm font-display font-bold text-white grad-primary glow-primary hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                Create Quest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
