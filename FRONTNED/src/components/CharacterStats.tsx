import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

const ATTRIBUTES = [
  { stat: "Intellect", value: 78, max: 100, color: "#22D3EE" },
  { stat: "Strength",  value: 45, max: 100, color: "#F0466B" },
  { stat: "Health",    value: 62, max: 100, color: "#34D399" },
  { stat: "Mind",      value: 85, max: 100, color: "#8B5CF6" },
  { stat: "Discipline",value: 70, max: 100, color: "#F5B92C" },
  { stat: "Endurance", value: 53, max: 100, color: "#FF7A45" },
];

const radarData = ATTRIBUTES.map((a) => ({ subject: a.stat, A: a.value }));

export default function CharacterStats() {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/8">
      <div className="flex items-center justify-between mb-5">
        <span className="font-display font-bold text-white">Character Attributes</span>
        <span
          className="text-xs px-2.5 py-1 rounded-full font-display"
          style={{ background: "rgba(139,92,246,0.15)", color: "#8B5CF6", border: "1px solid rgba(139,92,246,0.3)" }}
        >
          Scholar Class
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-5 items-center">
        {/* Radar chart */}
        <div className="w-full md:w-48 h-44 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" radialLines={false} />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#A0A4B8", fontSize: 9, fontFamily: "Chakra Petch" }}
                tickLine={false}
              />
              <Radar
                dataKey="A"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.15}
                strokeWidth={1.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Attribute bars */}
        <div className="flex-1 space-y-3 w-full">
          {ATTRIBUTES.map((attr) => (
            <div key={attr.stat}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-display text-xs text-[#A0A4B8] uppercase tracking-wider">{attr.stat}</span>
                <span className="font-display text-xs font-bold" style={{ color: attr.color }}>
                  {attr.value}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${attr.value}%`,
                    background: attr.color,
                    boxShadow: `0 0 8px ${attr.color}60`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total power */}
      <div
        className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between"
      >
        <span className="text-xs text-[#A0A4B8]">Combat Power</span>
        <div className="flex items-center gap-2">
          <div className="h-1 w-16 rounded-full" style={{ background: "linear-gradient(90deg, #8B5CF6, #22D3EE)" }} />
          <span className="font-display font-bold grad-primary-text text-sm">4,820</span>
        </div>
      </div>
    </div>
  );
}
