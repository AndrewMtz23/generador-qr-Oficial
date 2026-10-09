# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** QR Gratis
**Generated:** 2026-10-09 16:54:39
**Category:** Productivity Tool

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#0D9488` | `--color-primary` |
| Secondary | `#14B8A6` | `--color-secondary` |
| CTA/Accent | `#F97316` | `--color-cta` |
| Background | `#F0FDFA` | `--color-background` |
| Text | `#134E4A` | `--color-text` |

**Color Notes:** Teal focus + action orange

#### Project overrides (contrast-checked, take precedence over the table above)

The generated hues fail WCAG AA with white text (`#F97316` ≈ 2.8:1, `#0D9488` ≈ 3.7:1). Use these instead:

| Role | Tailwind | Hex | Use |
|------|----------|-----|-----|
| Primary (buttons, links, focus ring) | `teal-700` / hover `teal-800` | `#0F766E` / `#115E59` | white text ≈ 5.5:1 |
| Primary tint (badges, icon chips) | `teal-50` / `teal-100` | `#F0FDFA` / `#CCFBF1` | with `teal-800` text |
| CTA (Generate / Download only) | `orange-700` / hover `orange-800` | `#C2410C` / `#9A3412` | white text ≈ 5.2:1 |
| Page background (light) | `slate-50` | `#F8FAFC` | sections alternate with `white` |
| Text (light) | `slate-900` / muted `slate-600` | `#0F172A` / `#475569` | never lighter than slate-600 for body |
| Dark mode bg / surface | `slate-950` / `slate-900` | `#020617` / `#0F172A` | primary becomes `teal-400`, CTA stays `orange-600`+white bold |
| Borders | `slate-200` (light) / `slate-800` (dark) | | |

Orange is reserved for the single primary action per view; everything else uses teal or neutral.

### Typography

- **Heading Font:** Outfit (600/700) — geometric, more distinctive than Inter
- **Body Font:** Work Sans (400/500/600)
- **Mood:** geometric, modern, clean, approachable
- **Tailwind:** `fontFamily: { heading: ['Outfit', 'system-ui', 'sans-serif'], sans: ['Work Sans', 'system-ui', 'sans-serif'] }`

**Load in `index.html` head (not CSS @import, to avoid render-blocking chains):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700&family=Work+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
```

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #F97316;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #0D9488;
  border: 2px solid #0D9488;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #F0FDFA;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #0D9488;
  outline: none;
  box-shadow: 0 0 0 3px #0D948820;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Micro-interactions

**Keywords:** Small animations, gesture-based, tactile feedback, subtle animations, contextual interactions, responsive

**Best For:** Mobile apps, touchscreen UIs, productivity tools, user-friendly, consumer apps, interactive components

**Key Effects:** Small hover (50-100ms), loading spinners, success/error state anim, gesture-triggered (swipe/pinch), haptic

### Page Pattern

**Pattern Name:** Minimal Single Column

- **Conversion Strategy:** Single CTA focus. Large typography. Lots of whitespace. No nav clutter. Mobile-first.
- **CTA Placement:** Center, large CTA button
- **Section Order:** 1. Hero headline, 2. Short description, 3. Benefit bullets (3 max), 4. CTA, 5. Footer

#### Project override: tool-first landing (home `/` and `/generador-qr/:type`)

The generic pattern assumes a CTA that leads elsewhere; here the product IS the page, so the tool sits above the fold and SEO content follows.

1. Compact header: logo, type links (URL, WhatsApp, WiFi, Texto), FAQ, language as text codes `ES · EN · PT` (no flag emojis), dark-mode toggle.
2. Hero: H1 (page-specific), one-line promise, 3 benefit chips (Sin registro · Sin anuncios · No caduca) with Lucide icons.
3. Tool card: type tabs + form (left) and live QR preview + orange Download CTA (right); stacks on mobile with preview after the form.
4. "Cómo funciona" — 3 numbered steps.
5. Type-specific section (home: grid of 4 type cards linking to each landing; type page: what it does, use cases, tips).
6. "QR estático vs dinámico" — two-column comparison.
7. "Por qué QR Gratis" — honest comparison table vs "otros generadores" (no brand names).
8. FAQ accordion (native `<details>`, content present in HTML for SEO).
9. Footer: links to all type pages, FAQ, about, donations, legal.

Max content width `max-w-6xl`; sections alternate `bg-white` / `bg-slate-50`; cards `rounded-2xl border border-slate-200 shadow-sm`; motion only on hover/focus/state change, disabled under `prefers-reduced-motion`.

---

## Anti-Patterns (Do NOT Use)

- ❌ Complex onboarding
- ❌ Slow performance

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
