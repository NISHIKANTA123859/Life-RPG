import { useState } from "react";
import { logout } from "../services/api";
import { User, Palette, Bell, Accessibility, ChevronRight, Shield, LogOut } from "lucide-react";

interface ToggleSetting {
  key: string;
  label: string;
  desc: string;
  value: boolean;
}

type Section = "Account" | "Appearance" | "Notifications" | "Accessibility";

interface SectionConfig {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  toggles: ToggleSetting[];
}

const SECTIONS: Record<Section, SectionConfig> = {
  Account: {
    icon: User,
    color: "#8B5CF6",
    toggles: [
      { key: "public_profile",   label: "Public Profile",        desc: "Allow others to view your profile.",              value: true  },
      { key: "show_on_lb",       label: "Show on Leaderboard",   desc: "Include your score on global leaderboards.",      value: true  },
      { key: "two_factor",       label: "Two-Factor Auth",       desc: "Add extra security to your account.",             value: false },
    ],
  },
  Appearance: {
    icon: Palette,
    color: "#22D3EE",
    toggles: [
      { key: "dark_mode",        label: "Dark Mode",             desc: "Use dark theme (recommended).",                   value: true  },
      { key: "reduced_motion",   label: "Reduced Motion",        desc: "Minimize animations across the UI.",              value: false },
      { key: "compact_mode",     label: "Compact Mode",          desc: "Denser layout for more content per screen.",      value: false },
      { key: "neon_glow",        label: "Neon Glow Effects",     desc: "Enable glowing borders and button effects.",       value: true  },
    ],
  },
  Notifications: {
    icon: Bell,
    color: "#F5B92C",
    toggles: [
      { key: "notif_quests",     label: "Quest Reminders",       desc: "Get reminded about upcoming quest deadlines.",    value: true  },
      { key: "notif_level",      label: "Level Up Alerts",       desc: "Receive notifications when you level up.",        value: true  },
      { key: "notif_streak",     label: "Streak Warnings",       desc: "Alert when your streak is at risk.",              value: true  },
      { key: "notif_social",     label: "Social Activity",       desc: "Notify when you rank up on the leaderboard.",     value: false },
      { key: "notif_email",      label: "Email Digest",          desc: "Receive a weekly summary via email.",             value: false },
    ],
  },
  Accessibility: {
    icon: Accessibility,
    color: "#34D399",
    toggles: [
      { key: "high_contrast",    label: "High Contrast",         desc: "Increase text and UI contrast ratios.",           value: false },
      { key: "large_text",       label: "Large Text",            desc: "Increase base font size across the app.",         value: false },
      { key: "screen_reader",    label: "Screen Reader Mode",    desc: "Optimize for assistive technology.",              value: false },
      { key: "keyboard_nav",     label: "Keyboard Navigation",   desc: "Enable enhanced keyboard shortcuts.",             value: true  },
    ],
  },
};

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0"
      style={{ background: value ? "linear-gradient(135deg, #8B5CF6, #22D3EE)" : "rgba(255,255,255,0.1)" }}
    >
      <div
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300"
        style={{ left: value ? "calc(100% - 20px)" : "4px" }}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>("Account");
  const [settings, setSettings] = useState(SECTIONS);

  const toggle = (section: Section, key: string) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        toggles: prev[section].toggles.map((t) =>
          t.key === key ? { ...t, value: !t.value } : t
        ),
      },
    }));
  };

  const SECTION_KEYS = Object.keys(SECTIONS) as Section[];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="font-display text-xs uppercase tracking-[0.25em] text-violet-400 mb-1">Preferences</div>
      <h1 className="font-display font-bold text-white text-3xl mb-6">Settings</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Section nav */}
        <div className="md:w-48 flex-shrink-0">
          <div className="glass-card rounded-2xl border border-white/8 overflow-hidden">
            {SECTION_KEYS.map((s, i) => {
              const Icon = SECTIONS[s].icon;
              const active = s === activeSection;
              return (
                <button
                  key={s}
                  onClick={() => setActiveSection(s)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-sm transition-all text-left"
                  style={{
                    borderBottom: i < SECTION_KEYS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : undefined,
                    background: active ? `${SECTIONS[s].color}12` : undefined,
                    color: active ? SECTIONS[s].color : "#A0A4B8",
                    borderLeft: active ? `2px solid ${SECTIONS[s].color}` : "2px solid transparent",
                  }}
                >
                  <Icon size={16} />
                  <span className="font-display font-semibold">{s}</span>
                </button>
              );
            })}
          </div>

          {/* Danger zone */}
          <div className="glass-card rounded-2xl border border-red-500/20 overflow-hidden mt-4">
            <div className="px-4 py-2.5 border-b border-white/5">
              <span className="text-xs text-[#F0466B] font-display uppercase tracking-wider">Danger Zone</span>
            </div>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#F0466B] hover:bg-red-500/10 transition-colors" onClick={logout}>
              <LogOut size={15} /> Log Out
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#F0466B] hover:bg-red-500/10 transition-colors border-t border-white/5">
              <Shield size={15} /> Delete Account
            </button>
          </div>
        </div>

        {/* Toggle list */}
        <div className="flex-1">
          <div className="glass-card rounded-2xl border border-white/8 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
              {(() => {
              const Icon = SECTIONS[activeSection].icon;
              const sectionColor = SECTIONS[activeSection].color;
              const colorClass = sectionColor === "#8B5CF6" ? "text-violet-400" : sectionColor === "#22D3EE" ? "text-cyan-400" : sectionColor === "#F5B92C" ? "text-yellow-400" : "text-emerald-400";
              return <Icon size={18} className={colorClass} />;
            })()}
              <span className="font-display font-bold text-white">{activeSection}</span>
            </div>
            <div className="divide-y divide-white/5">
              {settings[activeSection].toggles.map((toggle_) => (
                <div key={toggle_.key} className="flex items-center justify-between px-6 py-4 hover:bg-white/2 transition-colors">
                  <div className="flex-1 pr-6">
                    <div className="text-sm font-semibold text-white mb-0.5">{toggle_.label}</div>
                    <div className="text-xs text-[#A0A4B8]">{toggle_.desc}</div>
                  </div>
                  <Toggle value={toggle_.value} onChange={() => toggle(activeSection, toggle_.key)} />
                </div>
              ))}
            </div>
          </div>

          {/* Character name edit */}
          {activeSection === "Account" && (
            <div className="glass-card rounded-2xl border border-white/8 mt-4 p-6">
              <div className="font-display text-sm font-semibold text-white mb-4">Account Information</div>
              <div className="space-y-4">
                {[
                  { label: "Hero Name", value: "Aria Thornwood" },
                  { label: "Email", value: "aria@liferp.gg" },
                  { label: "Class", value: "Scholar" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="text-xs text-[#A0A4B8] uppercase tracking-wider mb-1.5 block">{field.label}</label>
                    <div className="flex gap-3">
                      <input
                        defaultValue={field.value}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white outline-none"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                      />
                      <button className="px-4 py-2.5 rounded-xl text-sm text-violet-400 font-semibold hover:bg-violet-500/10 transition-colors border border-violet-500/30 flex items-center gap-1">
                        Save <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
