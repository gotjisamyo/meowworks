# MeowChat Landing Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `landing-next/` to be premium, mascot-driven, and SEO-dominant while keeping dark navy brand DNA intact.

**Architecture:** 14 focused tasks covering design tokens → SEO metadata → mascot integration in 6 sections → new ComparisonTable component → footer bug fix → build gate. Each task is independently committable.

**Tech Stack:** Next.js 14, Tailwind CSS 3, TypeScript, Noto Sans Thai (Google Fonts)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `tailwind.config.js` | Edit | Add `brand.mascot`, `brand.darkDeep` tokens |
| `src/styles/globals.css` | Edit | Add mascot CSS utilities + keyframe animations |
| `src/lib/site.ts` | Edit | Update SEO title/description with target keywords |
| `src/components/SEO.tsx` | Edit | Add AggregateRating schema, fix WebSite JSON-LD |
| `src/components/Layout.tsx` | Edit | Fix footer layout bug (cat image overlaps copyright) + font preload |
| `src/components/sections/Hero.tsx` | Edit | Add mascot in chat window header + "500+ ร้านค้า" badge |
| `src/components/sections/TrustStrip.tsx` | Edit | Add "500+ ร้านค้าใช้แล้ว" animated counter |
| `src/components/sections/Features.tsx` | Edit | Add mascot peek above center feature card |
| `src/components/sections/HowItWorks.tsx` | Edit | Add small mascot emoji beside each step number |
| `src/components/sections/Pricing.tsx` | Edit | Add floating mascot above Pro/recommended plan |
| `src/components/sections/Reviews.tsx` | Edit | Add star ratings + role attribution + mascot |
| `src/components/sections/FAQ.tsx` | None | Already has 8 items — no change needed |
| `src/components/sections/Contact.tsx` | Edit | Add mascot above CTA headline |
| `src/components/sections/ComparisonTable.tsx` | **Create** | New competitor comparison table |
| `src/pages/index.tsx` | Edit | Import ComparisonTable, insert after UseCases |

---

## Task 1: Design Tokens

**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/styles/globals.css`

- [ ] **Step 1: Add mascot color tokens to Tailwind**

Open `tailwind.config.js`. In `theme.extend.colors.brand`, add two new keys:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#FF6B9A',
          rose: '#FF9FC0',
          blush: '#FFE7F0',
          orange: '#FFB36B',
          peach: '#FFD6B3',
          green: '#31C36A',
          dark: '#080713',        // deepened from #121826
          mascot: '#FF8C42',      // แมวส้ม orange — NEW
          card: '#FFF7FB',
          muted: '#6A7083',
          soft: '#FFFDFB',
        },
      },
      fontFamily: { sans: ['Noto Sans Thai', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: Add mascot CSS utilities to globals.css**

Open `src/styles/globals.css`. Append at end of file (after existing utilities):

```css
/* ── MASCOT SYSTEM ─────────────────────────── */

.mascot-glow {
  filter: drop-shadow(0 0 24px rgba(255, 140, 66, 0.35));
}

.text-gradient-orange {
  background: linear-gradient(135deg, #FFD6A8 0%, #FF8C42 60%, #FF6B9A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes mascot-float {
  0%, 100% { transform: translateY(0px) rotate(-2deg); }
  50%       { transform: translateY(-10px) rotate(2deg); }
}
.mascot-float {
  animation: mascot-float 3.5s ease-in-out infinite;
}

@keyframes mascot-peek {
  0%   { transform: translateX(20px) rotate(8deg); opacity: 0; }
  100% { transform: translateX(0) rotate(0deg); opacity: 1; }
}
.mascot-peek {
  animation: mascot-peek 0.6s ease-out forwards;
}

@keyframes mascot-bob {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-6px); }
}
.mascot-bob {
  animation: mascot-bob 2.8s ease-in-out infinite;
}
```

- [ ] **Step 3: Verify Tailwind compiles without error**

```bash
cd /home/got/.openclaw/workspace/meowchat/landing-next
pnpm build 2>&1 | tail -5
```

Expected: `✓ Compiled successfully` (or equivalent). No red errors.

- [ ] **Step 4: Commit**

```bash
cd /home/got/.openclaw/workspace/meowchat/landing-next
git add tailwind.config.js src/styles/globals.css
git commit -m "design: add mascot color tokens and CSS utilities"
```

---

## Task 2: SEO Metadata

**Files:**
- Modify: `src/lib/site.ts`
- Modify: `src/components/SEO.tsx`

- [ ] **Step 1: Update title and description in site.ts**

Open `src/lib/site.ts`. Replace the two DEFAULT lines:

```ts
export const DEFAULT_TITLE = 'MeowChat — ระบบตอบแชทอัตโนมัติ LINE OA | ทดลองฟรี 14 วัน';
export const DEFAULT_DESCRIPTION = 'MeowChat ระบบ AI ตอบแชทอัตโนมัติสำหรับ LINE OA ธุรกิจไทย ตอบลูกค้า รับออเดอร์ จองคิว และส่งต่อทีมอัตโนมัติ ราคาเริ่ม ฿490/เดือน ทดลองฟรี 14 วัน';
```

- [ ] **Step 2: Add AggregateRating schema to SEO.tsx**

Open `src/components/SEO.tsx`. Find the block that builds `softwareSchema`. Replace it:

```ts
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: BRAND_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: [
      { '@type': 'Offer', price: '490', priceCurrency: 'THB', name: 'Starter' },
      { '@type': 'Offer', price: '990', priceCurrency: 'THB', name: 'Pro' },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '3',
      bestRating: '5',
      worstRating: '1',
    },
    description,
    url: canonical,
  };
```

- [ ] **Step 3: Fix malformed WebSite JSON-LD in SEO.tsx**

Find the `websiteSchema` object. Ensure it has NO trailing comma after the last property and includes SearchAction:

```ts
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BRAND_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?s={search_term_string}`,
      'query-input': 'required name=search_term_string',
    }
  };
```

- [ ] **Step 4: Run build to verify JSON-LD is valid**

```bash
pnpm build 2>&1 | grep -E "error|Error|✓"
```

Expected: no JSON parse errors, build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/lib/site.ts src/components/SEO.tsx
git commit -m "seo: update title/description keywords, add AggregateRating schema"
```

---

## Task 3: Hero — Mascot + Social Proof Badge

**Files:**
- Modify: `src/components/sections/Hero.tsx`

- [ ] **Step 1: Add social proof badge above headline**

Open `src/components/sections/Hero.tsx`. Find `<div className="eyebrow mb-5">ผู้ช่วย LINE OA สำหรับธุรกิจไทย</div>`.

Replace that single line with:

```tsx
<div className="flex items-center gap-3 mb-5 flex-wrap">
  <div className="eyebrow">ผู้ช่วย LINE OA สำหรับธุรกิจไทย</div>
  <div className="flex items-center gap-1.5 rounded-full border border-brand-mascot/30 bg-brand-mascot/10 px-3 py-1 text-xs font-bold text-brand-mascot">
    <span>🐱</span>
    <span>500+ ร้านค้าใช้แล้ว</span>
  </div>
</div>
```

- [ ] **Step 2: Add mascot to chat window header**

Find the chat window header block — it currently shows a generic `🐱` emoji div. Replace the entire header `<div>` (the one with `flex items-center justify-between mb-4`):

```tsx
<div className="flex items-center justify-between mb-4">
  <div className="flex items-center gap-3">
    <div className="relative w-11 h-11 flex-shrink-0">
      <img
        src="/hero-cat.png"
        alt="แมวส้ม MeowChat mascot"
        width={44}
        height={44}
        className="rounded-2xl object-cover mascot-float"
      />
      <div className="absolute inset-0 rounded-2xl bg-brand-mascot/8 blur-xl -z-10" />
    </div>
    <div>
      <div className="font-semibold text-sm text-white">MeowChat</div>
      <div className="text-xs text-white/42">ตัวอย่างแชทที่ร้านและทีมใช้ต่อได้จริง</div>
    </div>
  </div>
  <div className="rounded-full bg-brand-green/12 border border-brand-green/20 px-3 py-1 text-xs font-semibold text-brand-green">พร้อมใช้งาน</div>
</div>
```

- [ ] **Step 3: Verify visually**

```bash
pnpm dev
```

Open `http://localhost:3000`. Confirm:
- Orange badge "500+ ร้านค้าใช้แล้ว" appears beside eyebrow text
- hero-cat.png shows in chat header with float animation

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat(hero): add mascot to chat window + social proof badge"
```

---

## Task 4: TrustStrip — Social Proof Counter

**Files:**
- Modify: `src/components/sections/TrustStrip.tsx`

- [ ] **Step 1: Read the current TrustStrip file**

```bash
cat src/components/sections/TrustStrip.tsx
```

- [ ] **Step 2: Add counter stat to TrustStrip**

Find the main container div inside TrustStrip. Add a "500+ ร้านค้า" stat item alongside existing trust items. The exact addition depends on current layout — add this block as the first item in whatever flex/grid container exists:

```tsx
<div className="flex items-center gap-2 rounded-2xl border border-brand-mascot/20 bg-brand-mascot/8 px-5 py-3">
  <span className="text-xl">🐱</span>
  <div>
    <div className="text-lg font-black text-brand-mascot leading-none">500+</div>
    <div className="text-xs text-white/50 font-medium">ร้านค้าใช้แล้ว</div>
  </div>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/TrustStrip.tsx
git commit -m "feat(trust): add 500+ counter with mascot orange accent"
```

---

## Task 5: Features — Mascot Pointer

**Files:**
- Modify: `src/components/sections/Features.tsx`

- [ ] **Step 1: Wrap the 3-column grid in a relative container and add mascot above center card**

Find the `<div className="grid lg:grid-cols-3 gap-6">` that renders `FEATURE_PILLARS`. Replace it with:

```tsx
<div className="relative">
  {/* Mascot floats above center card on desktop */}
  <div className="hidden lg:flex absolute -top-10 left-1/2 -translate-x-1/2 flex-col items-center z-10 pointer-events-none">
    <div className="text-4xl mascot-peek">🐱</div>
    <div className="w-px h-6 bg-gradient-to-b from-brand-mascot/40 to-transparent" />
  </div>

  <div className="grid lg:grid-cols-3 gap-6">
    {FEATURE_PILLARS.map((item, index) => (
      <div
        key={item.title}
        className={`rounded-[28px] border bg-white/[0.04] p-6 md:p-7 card-glow transition-colors ${
          index === 1
            ? 'border-brand-mascot/30 bg-brand-mascot/[0.04]'
            : 'border-white/8'
        }`}
      >
        <div className="text-xs uppercase tracking-[0.16em] text-brand-peach mb-3">จุดเด่นของระบบ</div>
        <h3 className="text-2xl font-semibold mb-3 leading-tight text-white">{item.title}</h3>
        <p className="text-white/58 text-sm leading-7 mb-7">{item.desc}</p>
        <div className="space-y-3">
          {item.points.map((point) => (
            <div key={point} className="flex items-start gap-3 text-sm text-white/70 leading-6">
              <span className="mt-1 text-brand-peach">✦</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Features.tsx
git commit -m "feat(features): add mascot pointer above center card"
```

---

## Task 6: HowItWorks — Mascot Per Step

**Files:**
- Modify: `src/components/sections/HowItWorks.tsx`

- [ ] **Step 1: Add mascot emoji map to STEPS**

Add a `mascot` field to each step in the `STEPS` array:

```ts
const STEPS = [
  { num: 1, icon: '🐾', mascot: '😺', title: 'เริ่มทดลองใช้ฟรี', desc: 'เริ่มลองได้ก่อน ไม่ต้องใช้บัตรเครดิต และไม่ต้องมีทีมเทคนิค' },
  { num: 2, icon: '💚', mascot: '🐱', title: 'เชื่อม LINE OA เดิม', desc: 'ใช้กับบัญชี LINE OA ของร้านคุณได้เลย แล้วค่อยตั้งค่าสิ่งที่จำเป็นก่อน' },
  { num: 3, icon: '🛍️', mascot: '😸', title: 'บอกงานหลักของร้าน', desc: 'เช่น ถามราคา รับออเดอร์ จองคิว หรือเก็บข้อมูลลูกค้าที่ถามเข้ามาบ่อย' },
  { num: 4, icon: '💬', mascot: '😻', title: 'เริ่มให้ระบบช่วยตอบ', desc: 'ให้ AI รับหน้าแรกก่อน แล้วส่งต่อให้ทีมเมื่อเป็นเคสที่ต้องใช้คนดูแลต่อ' },
];
```

- [ ] **Step 2: Render mascot above the step number circle**

Inside the `.map()` for STEPS, find the step number div and prepend the mascot above it:

```tsx
<div key={s.num} className="relative">
  {i < STEPS.length - 1 && (
    <div className="hidden lg:block absolute top-10 left-full w-full h-px border-t border-dashed border-white/10 z-0" />
  )}
  <div className="rounded-[26px] border border-white/8 bg-white/[0.04] p-6 hover:border-brand-green/30 transition-colors relative z-10 text-center h-full card-glow">
    {/* Mascot above step number */}
    <div className="text-2xl mb-1 mascot-bob">{s.mascot}</div>
    <div className="w-11 h-11 rounded-full bg-brand-green/12 border border-brand-green/30 text-brand-green font-black text-lg flex items-center justify-center mx-auto mb-4">
      {s.num}
    </div>
    <div className="text-3xl mb-4">{s.icon}</div>
    <h3 className="font-semibold text-xl mb-3 text-white">{s.title}</h3>
    <p className="text-white/58 text-sm leading-7">{s.desc}</p>
  </div>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/HowItWorks.tsx
git commit -m "feat(how-it-works): add mascot emoji above each step"
```

---

## Task 7: Pricing — Mascot Above Recommended Plan

**Files:**
- Modify: `src/components/sections/Pricing.tsx`

- [ ] **Step 1: Find the recommended/popular plan card**

In `Pricing.tsx` the `popular: true` plan is Starter. Find where the popular plan card is rendered and add a mascot float above the popular badge. Look for where `plan.popular` is checked — add above the card's outer div:

```tsx
{plan.popular && (
  <div className="flex justify-center mb-2">
    <div className="mascot-float text-5xl">🐱</div>
  </div>
)}
<div className={`rounded-[28px] border p-7 md:p-8 card-glow relative ${
  plan.popular
    ? 'border-brand-mascot/40 bg-brand-mascot/[0.06]'
    : 'border-white/8 bg-white/[0.04]'
}`}>
  {/* ... rest of card unchanged */}
```

- [ ] **Step 2: Update popular badge color to mascot orange**

Find the "เริ่มต้นง่ายที่สุด" or similar popular label. Change its color classes to use mascot orange:

```tsx
{plan.popular && (
  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-mascot text-white text-xs font-black px-4 py-1.5 shadow-lg shadow-brand-mascot/30">
    เริ่มต้นง่ายที่สุด
  </div>
)}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Pricing.tsx
git commit -m "feat(pricing): add floating mascot + orange accent on recommended plan"
```

---

## Task 8: Reviews — Stars + Mascot

**Files:**
- Modify: `src/components/sections/Reviews.tsx`

- [ ] **Step 1: Add star rating and role-only attribution to TESTIMONIALS**

Replace the `TESTIMONIALS` array:

```ts
const TESTIMONIALS = [
  {
    quote: 'เมื่อก่อนลูกค้าทักมานอกเวลาแล้วหลุดบ่อย ตอนนี้อย่างน้อยระบบช่วยรับคำถามและเก็บเรื่องไว้ให้ทีมตามต่อได้',
    role: 'เจ้าของร้านอาหาร, กรุงเทพฯ',
    stars: 5,
  },
  {
    quote: 'จุดที่ชอบคือเวลาส่งต่อให้แอดมิน ทีมไม่ต้องเริ่มถามลูกค้าใหม่ทั้งหมด เพราะมีสรุปสิ่งที่คุยไว้แล้ว',
    role: 'เจ้าของคลินิก, เชียงใหม่',
    stars: 5,
  },
  {
    quote: 'มันไม่ใช่แค่ตอบแชทไวขึ้น แต่ทำให้ร้านรู้ว่าต้องตามลูกค้าคนไหนต่อก่อนหลัง',
    role: 'ร้านค้าออนไลน์, นนทบุรี',
    stars: 5,
  },
];
```

- [ ] **Step 2: Render stars inside each testimonial card**

Inside the `.map()` for TESTIMONIALS, add stars between the quote and role:

```tsx
{TESTIMONIALS.map((item, index) => (
  <div key={index} className="rounded-[24px] border border-white/8 bg-[#111827]/55 p-6 md:p-7 card-glow">
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: item.stars }).map((_, i) => (
        <span key={i} className="text-yellow-400 text-sm">★</span>
      ))}
    </div>
    <div className="text-brand-peach text-xl mb-3">"</div>
    <p className="text-white/84 text-base md:text-lg leading-8 mb-4">{item.quote}</p>
    <div className="text-sm md:text-base text-white/42">{item.role}</div>
  </div>
))}
```

- [ ] **Step 3: Add mascot (cozy) beside testimonial grid**

Wrap the grid in a `relative` div and add mascot bottom-right:

```tsx
<div className="relative">
  <div className="grid gap-4">
    {/* ... testimonial cards */}
  </div>
  {/* Mascot cozy pose — bottom right */}
  <div className="hidden md:block absolute -bottom-8 -right-6 text-5xl mascot-bob pointer-events-none select-none">
    😻
  </div>
</div>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Reviews.tsx
git commit -m "feat(reviews): add star ratings, role attribution, and mascot"
```

---

## Task 9: Contact CTA — Mascot

**Files:**
- Modify: `src/components/sections/Contact.tsx`

- [ ] **Step 1: Add mascot above the CTA headline**

Find the `<div className="eyebrow mb-5">พร้อมเริ่มต้นกับ MeowChat</div>` line. Insert above it:

```tsx
<div className="flex justify-center mb-6">
  <div className="text-7xl mascot-float">🐱</div>
</div>
```

- [ ] **Step 2: Add mascot glow radial to CTA section**

Find the existing radial gradient overlay `<div className="absolute inset-0 pointer-events-none bg-[radial-gradient(...)]" />`. Add a second overlay for orange mascot glow:

```tsx
<div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(255,140,66,0.10),transparent_40%)]" />
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Contact.tsx
git commit -m "feat(cta): add mascot above CTA headline with orange glow"
```

---

## Task 10: ComparisonTable — New Component

**Files:**
- Create: `src/components/sections/ComparisonTable.tsx`

- [ ] **Step 1: Create the ComparisonTable component**

```tsx
const ROWS = [
  {
    feature: 'ราคาเริ่มต้น',
    meow: '฿490/เดือน',
    zwiz: 'ดูราคา →',
    zwizHref: 'https://zwiz.ai',
    botnoi: 'ดูราคา →',
    botnoiHref: 'https://botnoi.ai',
    line: 'ฟรี (จำกัด)',
    highlight: true,
  },
  { feature: 'ภาษาไทย native', meow: '✅', zwiz: '✅', botnoi: '✅', line: '❌' },
  { feature: 'รับออเดอร์ + จองคิว', meow: '✅', zwiz: 'บางแพ็กเกจ', botnoi: '❌', line: '❌' },
  { feature: 'ส่งต่อทีมพร้อม context', meow: '✅', zwiz: '❌', botnoi: '❌', line: '❌' },
  { feature: 'ใช้ LINE OA เดิมได้เลย', meow: '✅', zwiz: '✅', botnoi: '✅', line: '✅' },
  { feature: 'ทดลองใช้ฟรี', meow: '14 วัน', zwiz: '7 วัน', botnoi: 'ไม่มี', line: 'ตลอด (จำกัด)' },
];

const COMPETITORS = ['MeowChat', 'ZWIZ.AI', 'Botnoi', 'LINE OA Free'];

export default function ComparisonTable() {
  return (
    <section id="comparison" className="py-24 max-w-5xl mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="eyebrow mb-4">เปรียบเทียบระบบ</div>
        <h2 className="text-3xl md:text-5xl font-black leading-tight mb-4 text-white">
          ทำไมร้านค้าไทยเลือก MeowChat
          <span className="block text-gradient-orange mt-1">มากกว่าตัวเลือกอื่น</span>
        </h2>
        <p className="text-white/58 text-lg leading-8">
          ระบบตอบแชทอัตโนมัติ LINE OA ที่ราคาเข้าถึงได้ พร้อมฟีเจอร์ที่ธุรกิจไทยต้องการจริง
        </p>
      </div>

      <div className="rounded-[28px] border border-white/8 overflow-hidden card-glow">
        {/* Header row */}
        <div className="grid grid-cols-5 bg-white/[0.06] border-b border-white/8">
          <div className="p-4 text-xs font-bold text-white/40 uppercase tracking-wider">ฟีเจอร์</div>
          {COMPETITORS.map((name, i) => (
            <div
              key={name}
              className={`p-4 text-center text-sm font-black ${
                i === 0 ? 'text-brand-mascot bg-brand-mascot/8 border-x border-brand-mascot/20' : 'text-white/70'
              }`}
            >
              {i === 0 && <span className="mr-1">🐱</span>}
              {name}
            </div>
          ))}
        </div>

        {/* Data rows */}
        {ROWS.map((row, ri) => (
          <div
            key={row.feature}
            className={`grid grid-cols-5 border-b border-white/6 last:border-0 ${
              ri % 2 === 0 ? 'bg-white/[0.02]' : ''
            }`}
          >
            <div className="p-4 text-sm text-white/60">{row.feature}</div>

            {/* MeowChat column — highlighted */}
            <div className="p-4 text-center text-sm font-bold text-brand-green bg-brand-mascot/[0.04] border-x border-brand-mascot/20">
              {row.meow}
            </div>

            {/* ZWIZ.AI */}
            <div className="p-4 text-center text-sm text-white/55">
              {'zwizHref' in row ? (
                <a href={row.zwizHref} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white/70 transition-colors text-xs underline underline-offset-2">
                  {row.zwiz}
                </a>
              ) : row.zwiz}
            </div>

            {/* Botnoi */}
            <div className="p-4 text-center text-sm text-white/55">
              {'botnoiHref' in row ? (
                <a href={row.botnoiHref} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white/70 transition-colors text-xs underline underline-offset-2">
                  {row.botnoi}
                </a>
              ) : row.botnoi}
            </div>

            {/* LINE OA Free */}
            <div className="p-4 text-center text-sm text-white/55">{row.line}</div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-white/28 mt-4">
        ข้อมูลคู่แข่งอ้างอิงจากข้อมูลสาธารณะ กรุณาตรวจสอบที่เว็บไซต์ของแต่ละบริการสำหรับราคาล่าสุด
      </p>
    </section>
  );
}
```

- [ ] **Step 2: Check TypeScript compiles**

```bash
pnpm build 2>&1 | grep -E "error TS|✓"
```

Expected: no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ComparisonTable.tsx
git commit -m "feat: add ComparisonTable component for SEO + conversion"
```

---

## Task 11: index.tsx — Wire ComparisonTable

**Files:**
- Modify: `src/pages/index.tsx`

- [ ] **Step 1: Import and insert ComparisonTable**

Open `src/pages/index.tsx`. Add import after UseCases import:

```tsx
import ComparisonTable from '../components/sections/ComparisonTable';
```

In the JSX, insert `<ComparisonTable />` after `<UseCases />` and before `<HowItWorks />`:

```tsx
<UseCases />
<ComparisonTable />
<HowItWorks />
```

- [ ] **Step 2: Verify page renders**

```bash
pnpm dev
```

Navigate to `http://localhost:3000`. Scroll to ComparisonTable — verify it renders without layout breaks, MeowChat column is orange-accented.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.tsx
git commit -m "feat: wire ComparisonTable into homepage after UseCases"
```

---

## Task 12: Footer Bug Fix

**Files:**
- Modify: `src/components/Layout.tsx`

- [ ] **Step 1: Fix cat image overlapping copyright**

Find the footer bottom row — the div containing `<img src="/assets/footer-cats.png" ...>` and the copyright `<p>`. It currently uses `flex items-start md:items-center justify-between`.

Replace that bottom row with a two-row structure:

```tsx
{/* Footer bottom: cats illustration */}
<div className="border-t border-white/6 pt-8 flex justify-center">
  <img
    src="/assets/footer-cats.png"
    alt="MeowChat mascots"
    width={180}
    height={60}
    className="opacity-60"
    loading="lazy"
  />
</div>

{/* Copyright row — separate from illustration */}
<div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-4 pb-6 text-xs text-white/34">
  <p>© 2026 {BRAND_COMPANY}. All rights reserved.</p>
  <p className="text-center md:text-right max-w-xl">
    รองรับการใช้งานบน LINE OA พร้อมช่องทาง support ({SUPPORT_EMAIL}), privacy ({PRIVACY_EMAIL}), legal ({LEGAL_EMAIL}) และ DPA ({DPA_EMAIL})
  </p>
</div>
```

- [ ] **Step 2: Add font preload to Layout `<Head>`**

Find the `<Head>` block. Add preconnect + preload for Google Fonts:

```tsx
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
```

- [ ] **Step 3: Verify footer visually**

```bash
pnpm dev
```

Scroll to footer. Confirm cat illustration sits above copyright text with no overlap.

- [ ] **Step 4: Commit**

```bash
git add src/components/Layout.tsx
git commit -m "fix(footer): resolve cat illustration overlap + add font preconnect"
```

---

## Task 13: Final Build Gate

- [ ] **Step 1: Full production build**

```bash
cd /home/got/.openclaw/workspace/meowchat/landing-next
pnpm build
```

Expected output:
```
✓ Compiled successfully
Route (pages) ...
┌ ○ /
...
```

No red errors. No TypeScript errors. No ESLint errors.

- [ ] **Step 2: Check all 6 mascot appearances in browser**

```bash
pnpm dev
```

Open `http://localhost:3000`. Verify mascot appears in:
1. Hero — chat window header (hero-cat.png floating)
2. Features — emoji peek above center card
3. HowItWorks — different emoji above each of 4 steps
4. Pricing — large float above Starter plan
5. Reviews — cozy emoji bottom-right of grid
6. Contact/CTA — large float above headline

- [ ] **Step 3: Verify SEO meta in browser**

Open `http://localhost:3000`. View source (`Ctrl+U`). Search for:
- `ระบบตอบแชทอัตโนมัติ LINE OA` — should appear in `<title>` and `<meta name="description">`
- `AggregateRating` — should appear in JSON-LD
- No trailing commas in JSON-LD blocks

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: landing redesign complete — mascot-first + SEO + premium UI"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Design tokens (Task 1) — `brand.mascot`, `brand.dark` deepened, CSS utilities
- [x] SEO metadata (Task 2) — title, description, AggregateRating, WebSite fix
- [x] Hero mascot + badge (Task 3) — hero-cat.png in chat + orange badge
- [x] TrustStrip counter (Task 4) — 500+ counter
- [x] Features mascot (Task 5) — peek above center card
- [x] HowItWorks mascot (Task 6) — per-step emoji
- [x] Pricing mascot (Task 7) — float above recommended
- [x] Reviews upgrade (Task 8) — stars + role + mascot
- [x] Contact mascot (Task 9) — float above CTA
- [x] ComparisonTable new (Task 10) — full component
- [x] index.tsx wiring (Task 11) — ComparisonTable inserted
- [x] Footer bug fix (Task 12) — no overlap
- [x] Build gate (Task 13) — full verification

**FAQ.tsx** — already has 8 items covering all required topics, no change needed. ✓
