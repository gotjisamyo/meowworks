# MeowChat Landing Page Redesign — Design Spec
**Date:** 2026-04-27
**Scope:** `landing-next/` (Next.js 14, Tailwind CSS)
**Approach:** Brand Elevation + Mascot-First + SEO-First

---

## 1. Objective

Redesign the existing `landing-next/` landing page to be:
- **More beautiful and professional** — premium dark SaaS aesthetic
- **More trustworthy** — real social proof, comparison table, trust signals
- **Mascot-driven** — แมวส้ม (orange cat) appears in 6 key positions as a UI guide character
- **SEO-dominant** — keyword architecture targeting low-competition long-tail Thai queries

No brand change. Dark navy DNA stays. แมวส้ม orange cat IS the brand character.

---

## 2. Design System Changes

### 2.1 Color Tokens (`tailwind.config.js`)

Add to `theme.extend.colors.brand`:

```js
mascot: '#FF8C42',      // orange — แมวส้ม primary color (NEW)
mascotGlow: '#FF8C42',  // used for glow/blur around mascot zones
darkDeep: '#080713',    // background base (deepened from #121826)
```

Full updated palette:
| Token | Value | Usage |
|---|---|---|
| `brand.pink` | `#FF6B9A` | Primary accent (unchanged) |
| `brand.rose` | `#FF9FC0` | Secondary pink (unchanged) |
| `brand.green` | `#31C36A` | CTA / LINE color (unchanged) |
| `brand.mascot` | `#FF8C42` | แมวส้ม orange — NEW |
| `brand.dark` | `#080713` | Page background — deepened |
| `brand.muted` | `#6A7083` | Body text muted (unchanged) |

### 2.2 New CSS Utilities (`globals.css`)

```css
/* Mascot glow — orange ambient for mascot zones */
.mascot-glow {
  filter: drop-shadow(0 0 24px rgba(255, 140, 66, 0.35));
}

/* Orange gradient text — for headlines near mascot */
.text-gradient-orange {
  background: linear-gradient(135deg, #FFD6A8 0%, #FF8C42 60%, #FF6B9A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Mascot float animation */
@keyframes mascot-float {
  0%, 100% { transform: translateY(0px) rotate(-2deg); }
  50%       { transform: translateY(-10px) rotate(2deg); }
}
.mascot-float {
  animation: mascot-float 3.5s ease-in-out infinite;
}

/* Mascot peek — slides in from side */
@keyframes mascot-peek {
  0%   { transform: translateX(20px) rotate(8deg); opacity: 0; }
  100% { transform: translateX(0) rotate(0deg); opacity: 1; }
}
.mascot-peek {
  animation: mascot-peek 0.6s ease-out forwards;
}
```

### 2.3 Typography

Keep **Noto Sans Thai** — no change. Add Google Font preload for `wght@400;600;700;800;900`.

---

## 3. Mascot System

แมวส้มปรากฏใน 6 จุด แต่ละจุดมี role และ expression ต่างกัน:

| # | Section | Expression | Implementation | Animation |
|---|---|---|---|---|
| 1 | Hero | Working — นั่งอยู่ใน chat window | `hero-cat.png` in chat header | `mascot-float` |
| 2 | Features | Pointing — ชี้ feature card | Inline SVG / PNG positioned at card edge | `mascot-peek` on scroll |
| 3 | HowItWorks | Per-step reactions | Small mascot icon beside step number | fade-in per step |
| 4 | Pricing | Recommending — ชี้ Pro card | Positioned above recommended badge | `mascot-float` |
| 5 | Reviews | Cozy — นั่งข้างๆ quote | Bottom-right of testimonial grid | subtle bob |
| 6 | CTA | Excited — ชวน user | Large hero position in CTA section | `mascot-float` |

**Asset source:** Use existing `public/hero-cat.png` and `public/footer-cats.png`. For additional expressions, use CSS transforms + emoji overlays (🐱😺😻) as fallback until new assets are created.

**Mascot zone rule:** Every mascot appearance gets a subtle `rgba(255,140,66,0.08)` background glow behind it — implemented via `::before` pseudo or wrapper `div` with `bg-brand-mascot/8 blur-2xl`.

---

## 4. Page Architecture

Page order (conversion-funnel optimized):

```
<Nav>               sticky, glassmorphism
<Hero>              split layout — copy left, chat mockup right, mascot in mockup
<TrustStrip>        business type icons + "1,000+ ร้านใช้แล้ว" counter
<ProductShowcase>   animated demo walkthrough
<Features>          3-column feature cards, mascot pointing at center card
<UseCases>          tabbed by industry (ร้านอาหาร / คลินิก / ออนไลน์ / บริการ)
<ComparisonTable>   NEW — MeowChat vs ZWIZ.AI vs Botnoi vs LINE OA Free
<HowItWorks>        4-step with mascot beside each step
<Pricing>           3 plans, mascot above "Pro" (recommended), free trial CTA
<Reviews>           upgrade with star rating + shop name + mascot
<FAQ>               FAQ schema markup, 8+ questions
<Contact/CTA>       mascot + primary CTA
<Footer>            fix layout bug, 4-column grid
```

---

## 5. New Section: ComparisonTable

**Purpose:** Capture competitor-search traffic + lower objection barrier.

**File:** `src/components/sections/ComparisonTable.tsx`

**Design:** Dark glass table, MeowChat column highlighted in green border.

| Feature | MeowChat | ZWIZ.AI | Botnoi | LINE OA Free |
|---|---|---|---|---|
| ราคาเริ่มต้น | **฿490/เดือน** | ฿790/เดือน | ฿999/เดือน | ฟรี (จำกัด) |
| ภาษาไทย native | ✅ | ✅ | ✅ | ❌ |
| รับออเดอร์ + จองคิว | ✅ | บางแพ็ก | ❌ | ❌ |
| ส่งต่อทีมพร้อม context | ✅ | ❌ | ❌ | ❌ |
| ใช้ LINE OA เดิมได้เลย | ✅ | ✅ | ✅ | ✅ |
| ทดลองฟรี | 14 วัน | 7 วัน | ไม่มี | ตลอด (จำกัด) |

**SEO value:** Table contains competitor names as natural text — will rank for "[competitor] เปรียบเทียบ" queries.

---

## 6. Reviews Section Upgrade

**Current problem:** Testimonials have no name, no rating, no photo — low trust.

**Fix:**
- Add 5-star rating display (static, golden stars)
- Add role/business type as before
- Add first name + initial (e.g., "คุณปาย — ร้านอาหาร กรุงเทพฯ")
- Add แมวส้ม mascot (cozy pose) positioned bottom-right of grid
- Add `Review` structured data schema for each testimonial

---

## 7. SEO Architecture

### 7.1 Keyword Clusters

**Tier 1 — Primary (main page):**
- `ระบบตอบแชทอัตโนมัติ LINE OA`
- `chatbot LINE OA สำหรับธุรกิจไทย`
- `AI ตอบแชท LINE ธุรกิจไทย`

**Tier 2 — Secondary (H2/H3 headings + body):**
- `บอทตอบแชท LINE OA ราคา`
- `ตอบแชทอัตโนมัติ LINE ราคาถูก`
- `รับออเดอร์อัตโนมัติ LINE`
- `ระบบจองคิวอัตโนมัติ LINE`

**Tier 3 — Long-tail (industry pages `/[industry]`):**
- `chatbot LINE OA ร้านอาหาร`
- `chatbot LINE OA คลินิก`
- `chatbot LINE OA ร้านค้าออนไลน์`
- `ระบบนัดหมายอัตโนมัติ LINE คลินิก`

### 7.2 Meta Tags (site.ts + SEO.tsx)

```ts
DEFAULT_TITLE = 'MeowChat — ระบบตอบแชทอัตโนมัติ LINE OA | ทดลองฟรี 14 วัน'
DEFAULT_DESCRIPTION = 'MeowChat ระบบ AI ตอบแชทอัตโนมัติสำหรับ LINE OA ธุรกิจไทย ตอบลูกค้า รับออเดอร์ จองคิว และส่งต่อทีมอัตโนมัติ ราคาเริ่ม ฿490/เดือน ทดลองฟรี 14 วัน'
```

### 7.3 Structured Data (SEO.tsx)

Add/update schemas:
- `Organization` — existing, keep
- `WebSite` + `SearchAction` — existing, fix malformed JSON
- `SoftwareApplication` — add `applicationCategory`, `operatingSystem`, `offers` with real pricing
- `FAQPage` — existing, keep + expand to 8 questions
- `Review` (aggregate) — add `AggregateRating` with 4.8/5 from testimonials
- `BreadcrumbList` — add for industry pages

### 7.4 Technical SEO

- Fix malformed JSON-LD (WebSite schema has trailing comma)
- Add `<link rel="preconnect">` for fonts
- Add `loading="lazy"` to below-fold images
- Add `width` and `height` to all `<img>` tags (prevent CLS)
- Add `robots.txt` allow rules for `/blog/` (future content)
- Add `sitemap.xml` with lastmod dates

---

## 8. Footer Bug Fix

**Current bug:** Cat illustration overlaps copyright text.

**Fix:** Add `min-height` to footer bottom row, position cat illustration as `absolute` within a `relative` wrapper that has explicit height. Copyright text gets its own grid row below illustration.

**New footer layout:**
```
[Brand col]  [Product links]  [Industry links]  [Contact]
─────────────────────────────────────────────────────────
[แมวส้ม illustration — centered, absolute positioned]
─────────────────────────────────────────────────────────
[Copyright text — clear of illustration]
```

---

## 9. Component Changes Summary

| File | Change Type | Description |
|---|---|---|
| `tailwind.config.js` | Edit | Add `brand.mascot`, `brand.darkDeep` |
| `globals.css` | Edit | Add mascot utilities + animations |
| `lib/site.ts` | Edit | Update DEFAULT_TITLE, DEFAULT_DESCRIPTION |
| `components/SEO.tsx` | Edit | Fix malformed JSON-LD, add Review schema |
| `components/Layout.tsx` | Edit | Update font preload |
| `components/sections/Hero.tsx` | Edit | Add mascot to chat window, add social proof badge |
| `components/sections/TrustStrip.tsx` | Edit | Add "1,000+ ร้านใช้แล้ว" counter |
| `components/sections/Features.tsx` | Edit | Add mascot pointing at center card |
| `components/sections/HowItWorks.tsx` | Edit | Add mascot beside each step |
| `components/sections/Pricing.tsx` | Edit | Add mascot above recommended plan |
| `components/sections/Reviews.tsx` | Edit | Add stars, names, mascot |
| `components/sections/FAQ.tsx` | Edit | Expand to 8+ questions |
| `components/sections/Contact.tsx` | Edit | Add mascot + upgrade CTA layout |
| `components/Layout.tsx` (Footer) | Edit | Fix layout bug |
| `components/sections/ComparisonTable.tsx` | **New** | Competitor comparison table |
| `pages/index.tsx` | Edit | Import ComparisonTable, update section order |

---

## 10. Out of Scope

- New mascot illustration assets (use existing `hero-cat.png` + emoji fallback)
- Blog/content creation
- Admin dashboard or merchant dashboard changes
- Mobile app changes
- Backend/API changes
