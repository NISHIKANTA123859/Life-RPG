 LIFE RPG — Figma Design Brief & AI Prompt

Use the **short prompt** below directly in Figma AI (First Draft) or Figma Make.
Use the **full brief** underneath it if you're briefing a human designer, building a design system manually, or feeding it section-by-section into Figma AI for more control.

---

## 1. SHORT PROMPT (paste into Figma AI / First Draft)

```
Design a dark, immersive RPG-themed productivity web app called "LIFE RPG" 
that turns real-life goals into game quests.

Style: Dark cyberpunk-fantasy hybrid. Deep charcoal/near-black background 
(#0B0D14), glassmorphism cards with subtle blur and 1px glowing borders, 
neon accent gradients (violet #8B5CF6 to cyan #22D3EE for primary actions, 
gold #F5B92C for currency/rewards, emerald #34D399 for success/XP), 
rounded-xl cards with soft depth shadows, bold condensed display font for 
headers (e.g. "Chakra Petch" or "Orbitron" style), clean sans-serif for 
body (e.g. "Inter").

Design a desktop dashboard screen (1440x1024) with:
- Left sidebar nav with glowing active state icons (Dashboard, Quests, 
  Character, Skills, Quest Intelligence, Achievements, Shop, Inventory, 
  Activity, Leaderboard, Profile, Settings)
- Top bar showing avatar, Level badge, XP bar, Gold counter, streak flame counter
- "Welcome Back, Hero" header with character name, class tag, level ring
- Large XP progress bar (current/required XP, non-linear curve)
- Daily quest progress ("4/6 Quests Completed") bar
- 3-4 quest cards in a grid, each showing icon, title, category tag, 
  difficulty badge, XP/Gold/Attribute rewards, deadline, and a glowing 
  "COMPLETE" button
- A streak widget with a 7-day calendar strip
- A small stats/radar chart panel for character attributes

Also design a mobile version (390x844) of the same dashboard with bottom 
tab navigation (5 icons) instead of sidebar.

Include a level-up modal overlay: large centered card, "LEVEL UP!" in 
glowing display type, confetti/particle burst, new level number, and 
unlocked reward.

Use consistent 8px spacing grid, 12-16px card radius, and give every 
interactive element a visible hover/glow state.
```

---

## 2. FULL DESIGN BRIEF (for Figma file structure / designer handoff)

### A. Figma File Structure (Pages)

Set up the Figma file with these **pages** (Figma's file-level pages, not app routes):

1. `📐 Cover & Brief`
2. `🎨 Design System` (colors, type, spacing, effects, icons)
3. `🧩 Components` (all reusable components + variants)
4. `🖥️ Desktop Screens`
5. `📱 Mobile Screens`
6. `🎬 Interactions & Prototype`
7. `🗑️ Archive / WIP`

---

### B. Design System (build this first, as Figma Variables/Styles)

**Color Styles** (define as Figma Variables for light/dark-proofing later)
| Token | Hex | Use |
|---|---|---|
| `bg/base` | #0B0D14 | App background |
| `bg/surface` | #14161F | Card base (before glass blur) |
| `bg/surface-elevated` | #1B1E2B | Modals, popovers |
| `accent/primary` | #8B5CF6 → #22D3EE (gradient) | Primary CTAs, active states |
| `accent/gold` | #F5B92C | Gold currency, rewards |
| `accent/xp` | #34D399 | XP bars, success states |
| `accent/danger` | #F0466B | Errors, destructive actions |
| `accent/epic` | #FF7A45 → #C026D3 (gradient) | Epic difficulty, rare items |
| `border/glass` | rgba(255,255,255,0.08) | Card borders |
| `text/primary` | #F5F6FA | Headings |
| `text/secondary` | #A0A4B8 | Body/muted |

**Effect Styles**
- `Glass Blur`: background blur 20px, fill rgba(255,255,255,0.04), 1px stroke rgba(255,255,255,0.08)
- `Glow — Primary`: drop shadow, violet, 0/0/24 blur, 40% opacity
- `Glow — Gold`: drop shadow, gold, 0/0/20 blur, 40% opacity
- `Card Depth`: drop shadow 0/8/24 black 30% opacity

**Type Styles**
- Display font: **Chakra Petch** or **Orbitron** (headers, level numbers, "LEVEL UP")
- Body font: **Inter** or **Sora**
- Scale: `Display/XL 48`, `Display/L 32`, `H1 28`, `H2 22`, `H3 18`, `Body 15`, `Caption 13`, `Overline 11 (uppercase, tracked)`

**Spacing/Grid**
- 8px base unit
- Desktop container: 1440px, 24px gutter, 12-col grid
- Mobile container: 390px, 16px margin, 4-col grid
- Card radius: 16px (large), 12px (medium), 8px (small/badges)

**Icon set**: Lucide icons (sword, shield, flame, brain, coin, trophy, backpack, users, settings) — import via Figma community "Lucide Icons" plugin.

---

### C. Components to Build (with variants)

Build each as a proper Figma component with variant properties (state, size, etc.):

- **NavItem** (states: default / hover / active) — sidebar & bottom nav
- **XPBar** (variants: default, animating, level-complete)
- **GoldCounter**
- **StreakFlameBadge** (variants: 1-6 days, 7-29, 30-99, 100+)
- **QuestCard** (variants: difficulty = Easy/Medium/Hard/Epic; state = active/completed/locked)
- **DifficultyBadge** (Easy/Medium/Hard/Epic — color-coded)
- **StatBar** (attribute bars: Intellect, Strength, Health, Mind, Discipline, Endurance)
- **CharacterCard**
- **SkillNode** (variants: locked / unlocked / in-progress / mastered)
- **AchievementCard** (variants: locked / unlocked)
- **ShopItemCard** (variants: owned / affordable / locked)
- **InventoryItemCard** (variants: equipped / unequipped)
- **LeaderboardRow** (variants: rank 1/2/3 medal, default, "you")
- **Button** (variants: primary-glow, secondary-outline, ghost, danger; sizes S/M/L)
- **Modal/LevelUpOverlay**
- **NotificationToast** (variants: success, level-up, achievement, purchase)
- **LoadingSkeleton**
- **EmptyState**
- **Input/TextField** (states: default, focus-glow, error)
- **Tabs** (All/Today/Active/Completed)
- **ProgressChart placeholder frame** (for Recharts hookup later)

---

### D. Screens to Design (15 routes, in priority order)

Design in this order so early screens establish the pattern for later ones:

1. **Dashboard** (desktop + mobile) — the flagship screen, do this first
2. **Landing Page** — hero "TURN YOUR LIFE INTO A GAME", feature cards, final CTA
3. **Quest Board** — tabs, filters, quest grid, create-quest modal
4. **Character Profile** — avatar, class, attribute bars, growth chart
5. **Skills / Skill Tree** — branching tree per attribute (Intellect→Python→SQL→ML→DL, etc.)
6. **Quest Intelligence (AI page)** — recommended quest cards w/ completion-likelihood %, insight charts
7. **Achievements** — locked/unlocked grid
8. **Shop** — category tabs, item grid, gold balance
9. **Inventory** — filter tabs, equip states
10. **Activity History** — timeline, grouped by day
11. **Leaderboard** — ranked list, weekly/monthly/all-time tabs
12. **Profile** — stats summary, edit action
13. **Settings** — sectioned toggles (Account, Appearance, Notifications, Accessibility)
14. **Login**
15. **Register / Character Creation** — class picker (Scholar/Warrior/Ranger/Monk) with live preview

For each screen, design **4 states** where relevant: default (populated), loading (skeleton), empty, error.

---

### E. Key Interaction Frames (for prototyping in Figma)

Build these as separate frames/overlays and wire with Smart Animate:

- Quest card → click Complete → checkmark morph → floating "+70 XP" / "+30 Gold" text → XP bar fill animation
- XP bar reaching full → transition into **Level Up modal** (scale-in + particle burst overlay)
- Achievement unlock → toast slides in from top-right with badge icon
- Shop purchase → gold counter count-down animation + item card "Owned" state swap

Use Figma's **Smart Animate** + **After Delay** interactions to simulate these without code.

---

### F. Moodboard Direction (for reference images to drop in the Cover page)

Search/reference: *Discord dark mode UI, Genshin Impact HUD, Diablo IV inventory screens, Duolingo gamification patterns, cyberpunk glassmorphism dashboards, Linear.app dark UI polish*.

---

## 3. Tips for Using Figma AI Effectively

- Generate **one screen at a time** (Dashboard first) rather than the whole app in one prompt — quality drops sharply past one screen.
- After generating the Dashboard, say: *"Now generate the Quest Board screen using the same design system, colors, and components as the previous screen."* This keeps visual consistency.
- Once you have 2-3 screens, **detach and rebuild key elements as real components** (Figma AI output is usually not componentized) so your design system stays reusable for engineering handoff.
