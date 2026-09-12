import { useState } from "react";
import { Shield } from "lucide-react";

type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
type FilterTab = "All" | "Equipped" | "Equipment" | "Boosts" | "Cosmetics";

interface InventoryItem {
  id: number;
  icon: string;
  name: string;
  rarity: Rarity;
  type: "Equipment" | "Boosts" | "Cosmetics";
  bonus: string;
  equipped: boolean;
  quantity?: number;
  slot?: string;
}

const RARITY_COLORS: Record<Rarity, string> = {
  Common: "#A0A4B8", Uncommon: "#34D399", Rare: "#22D3EE", Epic: "#8B5CF6", Legendary: "#F5B92C",
};

const INITIAL_ITEMS: InventoryItem[] = [
  { id: 1,  icon: "👑", name: "Scholar's Crown",      rarity: "Rare",      type: "Equipment", bonus: "+5 INT",  equipped: true,  slot: "Head" },
  { id: 2,  icon: "🥋", name: "Arcane Robe",           rarity: "Epic",      type: "Equipment", bonus: "+8 MND",  equipped: true,  slot: "Body" },
  { id: 3,  icon: "📚", name: "Tome of Algorithms",    rarity: "Legendary", type: "Equipment", bonus: "+10 INT", equipped: true,  slot: "Weapon" },
  { id: 4,  icon: "💎", name: "Focus Crystal",         rarity: "Rare",      type: "Equipment", bonus: "+4 DIS",  equipped: true,  slot: "Off-hand" },
  { id: 5,  icon: "💍", name: "Ring of Streaks",       rarity: "Uncommon",  type: "Equipment", bonus: "+2 ALL",  equipped: true,  slot: "Ring" },
  { id: 6,  icon: "👟", name: "Swift Sandals",         rarity: "Common",    type: "Equipment", bonus: "+1 END",  equipped: true,  slot: "Boots" },
  { id: 7,  icon: "🗡️", name: "Rusty Sword",          rarity: "Common",    type: "Equipment", bonus: "+1 STR",  equipped: false, slot: "Weapon" },
  { id: 8,  icon: "🛡️", name: "Apprentice Shield",    rarity: "Common",    type: "Equipment", bonus: "+2 END",  equipped: false, slot: "Off-hand" },
  { id: 9,  icon: "⚡", name: "XP Boost (24h)",       rarity: "Uncommon",  type: "Boosts",    bonus: "2× XP",   equipped: false, quantity: 3 },
  { id: 10, icon: "🌙", name: "Night Owl Boost",       rarity: "Common",    type: "Boosts",    bonus: "+50% XP", equipped: false, quantity: 2 },
  { id: 11, icon: "🎨", name: "Neon Avatar Frame",     rarity: "Uncommon",  type: "Cosmetics", bonus: "Avatar",  equipped: false },
];

const SLOTS = ["Head", "Body", "Weapon", "Off-hand", "Ring", "Boots"];
const SLOT_ICONS: Record<string, string> = {
  Head: "👑", Body: "🥋", Weapon: "⚔️", "Off-hand": "🛡️", Ring: "💍", Boots: "👟",
};

export default function Inventory() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [filterTab, setFilterTab] = useState<FilterTab>("All");
  const [selected, setSelected] = useState<InventoryItem | null>(null);

  const equippedItems = items.filter((i) => i.equipped && i.slot);
  const getEquipped = (slot: string) => equippedItems.find((i) => i.slot === slot);

  const filtered = items.filter((i) => {
    if (filterTab === "Equipped") return i.equipped;
    if (filterTab === "Equipment") return i.type === "Equipment";
    if (filterTab === "Boosts") return i.type === "Boosts";
    if (filterTab === "Cosmetics") return i.type === "Cosmetics";
    return true;
  });

  const handleEquip = (item: InventoryItem) => {
    if (item.type !== "Equipment" || !item.slot) return;
    setItems((prev) => prev.map((i) => {
      if (i.slot === item.slot && i.id !== item.id) return { ...i, equipped: false };
      if (i.id === item.id) return { ...i, equipped: !i.equipped };
      return i;
    }));
  };

  const TABS: FilterTab[] = ["All", "Equipped", "Equipment", "Boosts", "Cosmetics"];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="font-display text-xs uppercase tracking-[0.25em] text-violet-400 mb-1">Backpack</div>
      <h1 className="font-display font-bold text-white text-3xl mb-6">Inventory</h1>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Equipment slots */}
        <div className="xl:col-span-1">
          <div className="glass-card rounded-2xl p-5 border border-white/8">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={16} className="text-violet-400" />
              <span className="font-display font-semibold text-white text-sm">Equipped Gear</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SLOTS.map((slot) => {
                const eq = getEquipped(slot);
                const rarityColor = eq ? RARITY_COLORS[eq.rarity] : "rgba(255,255,255,0.1)";
                return (
                  <div
                    key={slot}
                    className="rounded-xl p-3 text-center cursor-pointer transition-all hover:scale-105"
                    style={{ background: eq ? `${rarityColor}12` : "rgba(255,255,255,0.03)", border: `1px solid ${rarityColor}` }}
                    onClick={() => eq && setSelected(eq)}
                  >
                    <div className="text-xl mb-1">{eq ? eq.icon : SLOT_ICONS[slot]}</div>
                    <div className="text-[9px] text-[#A0A4B8] uppercase tracking-wider">{slot}</div>
                    {eq && <div className="text-[9px] font-display font-bold mt-0.5" style={{ color: rarityColor }}>{eq.bonus}</div>}
                  </div>
                );
              })}
            </div>

            {/* Total bonuses */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="text-xs text-[#A0A4B8] uppercase tracking-wider mb-2">Active Bonuses</div>
              <div className="space-y-1">
                {equippedItems.map((i) => (
                  <div key={i.id} className="flex justify-between text-xs">
                    <span className="text-[#A0A4B8] truncate">{i.name}</span>
                    <span className="font-display font-bold" style={{ color: RARITY_COLORS[i.rarity] }}>{i.bonus}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Item grid */}
        <div className="xl:col-span-3">
          {/* Tabs */}
          <div className="flex gap-2 flex-wrap mb-4">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setFilterTab(t)}
                className="px-4 py-2 rounded-xl text-sm font-display font-semibold transition-all"
                style={
                  filterTab === t
                    ? { background: "linear-gradient(135deg, #8B5CF6, #22D3EE)", color: "white" }
                    : { background: "rgba(255,255,255,0.05)", color: "#A0A4B8", border: "1px solid rgba(255,255,255,0.08)" }
                }
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filtered.map((item) => {
              const rarityColor = RARITY_COLORS[item.rarity];
              return (
                <div
                  key={item.id}
                  className="glass-card rounded-xl p-3 text-center border cursor-pointer transition-all hover:scale-105"
                  style={{
                    borderColor: item.equipped ? `${rarityColor}60` : "rgba(255,255,255,0.08)",
                    boxShadow: item.equipped ? `0 0 12px ${rarityColor}20` : undefined,
                  }}
                  onClick={() => setSelected(item)}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mx-auto mb-2"
                    style={{ background: `${rarityColor}12`, border: `1px solid ${rarityColor}30` }}
                  >
                    {item.icon}
                  </div>
                  <div className="font-display text-xs text-white font-semibold leading-tight mb-1">{item.name}</div>
                  <div className="text-[10px]" style={{ color: rarityColor }}>{item.rarity}</div>
                  {item.quantity && <div className="text-[10px] text-[#A0A4B8]">×{item.quantity}</div>}
                  {item.equipped && (
                    <div className="mt-1 text-[9px] font-display font-bold text-emerald-400 uppercase tracking-wider">Equipped</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Item detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="glass-card rounded-2xl p-6 w-full max-w-xs border text-center"
            style={{ borderColor: `${RARITY_COLORS[selected.rarity]}40`, boxShadow: `0 0 40px ${RARITY_COLORS[selected.rarity]}20` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-5xl mb-3">{selected.icon}</div>
            <h2 className="font-display font-bold text-white text-xl mb-1">{selected.name}</h2>
            <div className="text-sm font-display font-semibold mb-4" style={{ color: RARITY_COLORS[selected.rarity] }}>{selected.rarity}</div>
            <div className="text-sm font-bold text-emerald-400 mb-6">{selected.bonus}</div>
            {selected.type === "Equipment" && (
              <button
                onClick={() => { handleEquip(selected); setSelected(null); }}
                className="w-full py-3 rounded-xl font-display font-bold text-white transition-all"
                style={{ background: selected.equipped ? "rgba(240,70,107,0.2)" : "linear-gradient(135deg, #8B5CF6, #22D3EE)", color: selected.equipped ? "#F0466B" : "white" }}
              >
                {selected.equipped ? "Unequip" : "Equip"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
