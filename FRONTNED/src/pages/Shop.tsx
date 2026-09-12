import { useState } from "react";
import { Coins, ShoppingCart, Lock, CheckCircle2 } from "lucide-react";
import { CHARACTER } from "../data/gameData";
import { rpgEvents } from "../components/background/rpgEvents";

type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
type Category = "All" | "Equipment" | "Boosts" | "Cosmetics" | "Skills";

interface ShopItem {
  id: number;
  icon: string;
  name: string;
  desc: string;
  price: number;
  rarity: Rarity;
  category: Category;
  bonus: string;
  owned: boolean;
  levelRequired?: number;
}

const RARITY_COLORS: Record<Rarity, string> = {
  Common: "#A0A4B8", Uncommon: "#34D399", Rare: "#22D3EE", Epic: "#8B5CF6", Legendary: "#F5B92C",
};

const ITEMS: ShopItem[] = [
  { id: 1,  icon: "👑", name: "Scholar's Crown",       desc: "A crown of knowledge that amplifies all Intellect gains.",         price: 800,  rarity: "Rare",      category: "Equipment", bonus: "+5 INT", owned: true },
  { id: 2,  icon: "💎", name: "Focus Crystal",          desc: "Infused with pure concentration energy.",                         price: 500,  rarity: "Rare",      category: "Equipment", bonus: "+4 DIS", owned: true },
  { id: 3,  icon: "📚", name: "Tome of Algorithms",     desc: "Ancient tome containing legendary programming knowledge.",         price: 2500, rarity: "Legendary", category: "Equipment", bonus: "+10 INT", owned: true, levelRequired: 20 },
  { id: 4,  icon: "🔱", name: "Titan Gauntlets",        desc: "Forged from the will of champions.",                              price: 1200, rarity: "Epic",      category: "Equipment", bonus: "+8 STR", owned: false, levelRequired: 30 },
  { id: 5,  icon: "🗡️", name: "Blade of Discipline",   desc: "Only the disciplined may wield this blade.",                      price: 1800, rarity: "Epic",      category: "Equipment", bonus: "+6 DIS", owned: false, levelRequired: 25 },
  { id: 6,  icon: "⚡", name: "XP Boost (24h)",        desc: "Double XP earned for 24 hours.",                                  price: 300,  rarity: "Uncommon",  category: "Boosts",    bonus: "2× XP", owned: false },
  { id: 7,  icon: "🌙", name: "Night Owl Boost",        desc: "+50% XP for all quests completed after 8 PM.",                   price: 150,  rarity: "Common",    category: "Boosts",    bonus: "+50% XP (night)", owned: false },
  { id: 8,  icon: "🛡️", name: "Streak Shield",         desc: "Protects your streak for 1 missed day.",                         price: 600,  rarity: "Rare",      category: "Boosts",    bonus: "Streak protection", owned: false },
  { id: 9,  icon: "🎨", name: "Neon Avatar Frame",      desc: "Glowing violet-cyan frame for your profile avatar.",             price: 400,  rarity: "Uncommon",  category: "Cosmetics", bonus: "Avatar frame", owned: false },
  { id: 10, icon: "🌌", name: "Cosmic Theme",           desc: "Deep space UI theme for the entire dashboard.",                  price: 900,  rarity: "Rare",      category: "Cosmetics", bonus: "UI theme", owned: false },
  { id: 11, icon: "🏆", name: "Gold Trophy Title",      desc: "Display 'Gold Champion' under your name.",                      price: 2000, rarity: "Epic",      category: "Cosmetics", bonus: "Title", owned: false, levelRequired: 50 },
  { id: 12, icon: "🔮", name: "Mystic Skill Slot",      desc: "Unlock an extra skill slot in any skill tree.",                  price: 1500, rarity: "Epic",      category: "Skills",    bonus: "+1 skill slot", owned: false, levelRequired: 20 },
];

interface Props {
  character: typeof CHARACTER;
}

export default function Shop({ character }: Props) {
  const [category, setCategory] = useState<Category>("All");
  const [items, setItems] = useState(ITEMS);
  const [gold, setGold] = useState(character.gold);
  const [buyMsg, setBuyMsg] = useState<string | null>(null);

  const filtered = items.filter((i) => category === "All" || i.category === category);
  const CATEGORIES: Category[] = ["All", "Equipment", "Boosts", "Cosmetics", "Skills"];

  const handleBuy = (item: ShopItem) => {
    if (item.owned || gold < item.price) return;
    if (item.levelRequired && character.level < item.levelRequired) return;
    rpgEvents.trigger("gold_gain");
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, owned: true } : i));
    setGold((g) => g - item.price);
    setBuyMsg(`Purchased ${item.name}!`);
    setTimeout(() => setBuyMsg(null), 2500);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="font-display text-xs uppercase tracking-[0.25em] text-violet-400 mb-1">Market</div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-white text-3xl">Shop</h1>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: "rgba(245,185,44,0.1)", border: "1px solid rgba(245,185,44,0.25)" }}>
          <Coins size={16} className="text-yellow-400" />
          <span className="font-display font-bold text-yellow-400 text-lg">{gold.toLocaleString()}</span>
          <span className="text-[#A0A4B8] text-xs">gold</span>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="px-4 py-2 rounded-xl text-sm font-display font-semibold transition-all"
            style={
              category === c
                ? { background: "linear-gradient(135deg, #8B5CF6, #22D3EE)", color: "white" }
                : { background: "rgba(255,255,255,0.05)", color: "#A0A4B8", border: "1px solid rgba(255,255,255,0.08)" }
            }
          >
            {c}
          </button>
        ))}
      </div>

      {/* Buy success toast */}
      {buyMsg && (
        <div
          className="fixed top-20 right-6 z-50 px-5 py-3 rounded-xl font-display text-sm text-white flex items-center gap-2"
          style={{ background: "linear-gradient(135deg, #34D399, #22D3EE)", boxShadow: "0 0 20px rgba(52,211,153,0.4)" }}
        >
          <CheckCircle2 size={16} />
          {buyMsg}
        </div>
      )}

      {/* Items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item) => {
          const rarityColor = RARITY_COLORS[item.rarity];
          const canAfford = gold >= item.price;
          const meetsLevel = !item.levelRequired || character.level >= item.levelRequired;
          const canBuy = !item.owned && canAfford && meetsLevel;

          return (
            <div
              key={item.id}
              className="glass-card rounded-2xl p-5 border flex flex-col transition-all hover:border-white/15"
              style={{
                borderColor: item.owned ? `${rarityColor}40` : "rgba(255,255,255,0.08)",
                boxShadow: item.owned ? `0 0 16px ${rarityColor}10` : undefined,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: `${rarityColor}15`, border: `1px solid ${rarityColor}30` }}
                >
                  {item.icon}
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-display font-bold uppercase tracking-wider" style={{ color: rarityColor }}>
                    {item.rarity}
                  </div>
                  {item.levelRequired && (
                    <div className="text-[10px] text-[#A0A4B8]">Lv. {item.levelRequired}+</div>
                  )}
                </div>
              </div>

              <h3 className="font-display font-bold text-white text-sm mb-1">{item.name}</h3>
              <p className="text-xs text-[#A0A4B8] flex-1 mb-3 leading-relaxed">{item.desc}</p>

              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: "rgba(34,211,238,0.12)", color: "#22D3EE" }}>
                  {item.bonus}
                </span>
                <div className="flex items-center gap-1">
                  <Coins size={12} className="text-yellow-400" />
                  <span className="font-display font-bold text-yellow-400 text-sm">{item.price.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => handleBuy(item)}
                disabled={!canBuy}
                className="w-full py-2.5 rounded-xl text-sm font-display font-bold transition-all flex items-center justify-center gap-2"
                style={
                  item.owned
                    ? { background: "rgba(52,211,153,0.12)", color: "#34D399", border: "1px solid rgba(52,211,153,0.3)" }
                    : !meetsLevel
                    ? { background: "rgba(255,255,255,0.04)", color: "#A0A4B8", cursor: "not-allowed" }
                    : !canAfford
                    ? { background: "rgba(240,70,107,0.1)", color: "#F0466B", cursor: "not-allowed" }
                    : { background: "linear-gradient(135deg, #8B5CF6, #22D3EE)", color: "white", boxShadow: "0 0 12px rgba(139,92,246,0.3)" }
                }
              >
                {item.owned ? (
                  <><CheckCircle2 size={14} /> Owned</>
                ) : !meetsLevel ? (
                  <><Lock size={14} /> Level {item.levelRequired} Required</>
                ) : !canAfford ? (
                  <>Not Enough Gold</>
                ) : (
                  <><ShoppingCart size={14} /> Buy Now</>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
