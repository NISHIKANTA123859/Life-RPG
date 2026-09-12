import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { Brain, Zap, TrendingUp, Star, Sparkles } from "lucide-react";
import { apiFetch } from "../lib/api";

type Recommendation = {
  id?: number;
  icon: string;
  title: string;
  category: string;
  likelihood: number;
  xp: number;
  gold: number;
  reason: string;
  difficulty: string;
  color: string;
};

type Insight = {
  label: string;
  value: string;
  color: string;
};

type WeeklyCompletionPoint = {
  week: string;
  completed: number;
  total: number;
};

type CategoryRadarPoint = {
  subject: string;
  A: number;
  fullMark: number;
};

const FALLBACK_RECOMMENDATIONS: Recommendation[] = [
  {
    icon: "💻", title: "Build REST API with FastAPI", category: "Intellect", likelihood: 94,
    xp: 200, gold: 80, reason: "Matches your Python mastery and recent backend work.",
    difficulty: "Hard", color: "#22D3EE",
  },
  {
    icon: "📊", title: "Complete Kaggle Titanic Challenge", category: "Intellect", likelihood: 87,
    xp: 150, gold: 60, reason: "Perfect next step after your Data Science skill unlock.",
    difficulty: "Medium", color: "#8B5CF6",
  },
  {
    icon: "🧘", title: "7-Day Meditation Streak", category: "Mind", likelihood: 82,
    xp: 90, gold: 35, reason: "You've completed 4/7 days. Only 3 more to unlock a bonus.",
    difficulty: "Easy", color: "#34D399",
  },
  {
    icon: "📝", title: "Write Technical Blog Post", category: "Discipline", likelihood: 79,
    xp: 120, gold: 50, reason: "Combines your Intellect and Discipline — high yield quest.",
    difficulty: "Medium", color: "#F5B92C",
  },
  {
    icon: "🏋️", title: "3×10 Strength Circuit", category: "Strength", likelihood: 72,
    xp: 80, gold: 30, reason: "Your Strength attribute is below average. Time to level up.",
    difficulty: "Medium", color: "#F0466B",
  },
];

const FALLBACK_WEEKLY_COMPLETION: WeeklyCompletionPoint[] = [
  { week: "W35", completed: 12, total: 18 },
  { week: "W36", completed: 15, total: 20 },
  { week: "W37", completed: 10, total: 16 },
  { week: "W38", completed: 18, total: 22 },
  { week: "W39", completed: 14, total: 19 },
  { week: "W40", completed: 16, total: 21 },
];

const FALLBACK_CATEGORY_RADAR: CategoryRadarPoint[] = [
  { subject: "Intellect", A: 78, fullMark: 100 },
  { subject: "Strength",  A: 45, fullMark: 100 },
  { subject: "Health",    A: 62, fullMark: 100 },
  { subject: "Mind",      A: 85, fullMark: 100 },
  { subject: "Discipline",A: 70, fullMark: 100 },
  { subject: "Endurance", A: 53, fullMark: 100 },
];

const DIFF_COLORS: Record<string, string> = {
  Easy: "#34D399", Medium: "#F5B92C", Hard: "#F0466B", Epic: "#C026D3",
};

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card rounded-xl px-3 py-2 border border-white/10 text-xs">
        <div className="text-[#A0A4B8] mb-1">{label}</div>
        <div className="text-violet-400 font-display font-bold">{payload[0].value} / {payload[1]?.value} quests</div>
      </div>
    );
  }
  return null;
};

export default function QuestIntelligence() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(FALLBACK_RECOMMENDATIONS);
  const [weeklyCompletion, setWeeklyCompletion] = useState<WeeklyCompletionPoint[]>(FALLBACK_WEEKLY_COMPLETION);
  const [categoryRadar, setCategoryRadar] = useState<CategoryRadarPoint[]>(FALLBACK_CATEGORY_RADAR);
  const [insights, setInsights] = useState<Insight[]>([
    { label: "Best day for quests", value: "Saturday", color: "#8B5CF6" },
    { label: "Peak completion time", value: "9–11 AM", color: "#22D3EE" },
    { label: "Strongest category", value: "Intellect", color: "#34D399" },
    { label: "Needs attention", value: "Strength", color: "#F0466B" },
    { label: "Avg quest/day", value: "3.4", color: "#F5B92C" },
  ]);
  const [addedIds, setAddedIds] = useState<(number | string)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddQuest = async (rec: Recommendation) => {
    const id = rec.id || 101;
    setAddedIds((prev) => [...prev, id, rec.title]);
    try {
      await apiFetch(`/api/quest-intelligence/recommendations/${id}/add`, { method: "POST" });
    } catch {}
  };

  useEffect(() => {
    async function loadIntelligence() {
      setLoading(true);
      setError("");

      try {
        const [recs, insightPayload] = await Promise.all([
          apiFetch<any>("/api/recommendations"),
          apiFetch<{ insights: Insight[]; weekly_completion: WeeklyCompletionPoint[]; category_radar: CategoryRadarPoint[] }>("/api/insights"),
        ]);

        if (recs && (recs.recommendations || Array.isArray(recs))) {
          const raw = recs.recommendations || recs;
          setRecommendations(
            raw.map((r: any) => ({
              id: r.id,
              icon: r.icon || "⚡",
              title: r.title,
              category: r.category,
              difficulty: r.difficulty,
              xp: r.xp,
              gold: r.gold,
              reason: r.reason,
              color: r.color || "#8B5CF6",
              likelihood: Math.round((r.completion_probability || r.completion_likelihood || (r.likelihood / 100) || 0.78) * 100),
            }))
          );
        }

        if (insightPayload?.insights?.length) {
          setInsights(insightPayload.insights);
        }

        if (insightPayload?.weekly_completion?.length) {
          setWeeklyCompletion(insightPayload.weekly_completion);
        }

        if (insightPayload?.category_radar?.length) {
          setCategoryRadar(insightPayload.category_radar);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load ML intelligence");
      } finally {
        setLoading(false);
      }
    }

    loadIntelligence();
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-2 mb-1">
        <Brain size={16} className="text-violet-400" />
        <div className="font-display text-xs uppercase tracking-[0.25em] text-violet-400">AI-Powered</div>
      </div>
      <h1 className="font-display font-bold text-white text-3xl mb-2">Quest Intelligence</h1>
      <p className="text-[#A0A4B8] text-sm mb-8">Personalized quest recommendations powered by your progress patterns.</p>

      {error && (
        <div className="mb-4 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-xs text-amber-200">
          {error}. Showing local fallback model data.
        </div>
      )}

      {loading && (
        <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-[#A0A4B8]">
          Loading ML recommendations...
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-yellow-400" />
            <span className="font-display font-semibold text-white">Recommended For You</span>
          </div>

          {recommendations.map((rec) => (
            <div
              key={rec.title}
              className="glass-card rounded-2xl p-5 border border-white/8 hover:border-white/15 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${rec.color}15`, border: `1px solid ${rec.color}30` }}>
                  {rec.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-display font-semibold text-white text-sm leading-tight">{rec.title}</h3>
                    <span className="text-[10px] font-display font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ color: DIFF_COLORS[rec.difficulty] ?? "#8B5CF6", background: `${DIFF_COLORS[rec.difficulty] ?? "#8B5CF6"}20` }}>
                      {rec.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-[#A0A4B8] mb-3 leading-relaxed">{rec.reason}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Zap size={11} className="text-violet-400" />
                      <span className="text-violet-300 font-semibold">{rec.xp} XP</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Star size={11} className="text-yellow-400" />
                      <span className="text-yellow-300 font-semibold">{rec.gold} G</span>
                    </div>
                    {/* Completion likelihood */}
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs text-[#A0A4B8] whitespace-nowrap">Completion odds</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden max-w-24">
                        <div className="h-full rounded-full" style={{ width: `${rec.likelihood}%`, background: rec.likelihood > 85 ? "#34D399" : rec.likelihood > 70 ? "#F5B92C" : "#F0466B", boxShadow: `0 0 6px ${rec.likelihood > 85 ? "#34D399" : "#F5B92C"}50` }} />
                      </div>
                      <span className="text-xs font-display font-bold" style={{ color: rec.likelihood > 85 ? "#34D399" : rec.likelihood > 70 ? "#F5B92C" : "#F0466B" }}>
                        {Math.round(rec.likelihood)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleAddQuest(rec)}
                disabled={addedIds.includes(rec.id!) || addedIds.includes(rec.title)}
                className={`w-full mt-4 py-2.5 rounded-xl text-sm font-display font-bold text-white transition-all flex items-center justify-center gap-2 ${
                  addedIds.includes(rec.id!) || addedIds.includes(rec.title)
                    ? "bg-white/10 text-emerald-300 border border-emerald-500/30 cursor-default"
                    : "hover:opacity-90 active:scale-95"
                }`}
                style={
                  addedIds.includes(rec.id!) || addedIds.includes(rec.title)
                    ? {}
                    : { background: "linear-gradient(135deg, #8B5CF6, #22D3EE)", boxShadow: "0 0 12px rgba(139,92,246,0.3)" }
                }
              >
                {addedIds.includes(rec.id!) || addedIds.includes(rec.title) ? (
                  <>
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span>Added to Quest Board ✓</span>
                  </>
                ) : (
                  "Add to Quest Board"
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Right panel: charts */}
        <div className="space-y-5">
          {/* Insight cards */}
          <div className="glass-card rounded-2xl p-5 border border-white/8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-emerald-400" />
              <span className="font-display font-semibold text-white text-sm">Key Insights</span>
            </div>
            <div className="space-y-3">
              {insights.map((s) => (
                <div key={s.label} className="flex justify-between items-center">
                  <span className="text-xs text-[#A0A4B8]">{s.label}</span>
                  <span className="text-xs font-display font-bold" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly bar chart */}
          <div className="glass-card rounded-2xl p-5 border border-white/8">
            <div className="font-display font-semibold text-white text-sm mb-4">Weekly Completion</div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyCompletion} margin={{ top: 0, right: 0, bottom: 0, left: -25 }} barGap={2}>
                  <XAxis dataKey="week" tick={{ fill: "#A0A4B8", fontSize: 10, fontFamily: "Chakra Petch" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#A0A4B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="total" fill="rgba(139,92,246,0.2)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="completed" fill="#8B5CF6" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar */}
          <div className="glass-card rounded-2xl p-5 border border-white/8">
            <div className="font-display font-semibold text-white text-sm mb-2">Attribute Balance</div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={categoryRadar} margin={{ top: 0, right: 10, bottom: 0, left: 10 }}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#A0A4B8", fontSize: 9, fontFamily: "Chakra Petch" }} tickLine={false} />
                  <Radar dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.15} strokeWidth={1.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
