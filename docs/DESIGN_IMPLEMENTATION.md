# ALIGN — Design System & UI Implementation Specification

## 1. Design Vision & Philosophy

ALIGN's visual identity has been established in **Google Stitch** and is translated here into precise React and Tailwind CSS implementation specifications. 

The aesthetic is:
**Premium, Approachable, Trustworthy, Human, Calm, Modern, and Accessible.**

It is deliberately crafted to feel like a high-end financial guidance tool that demystifies government credit programs, avoiding both archaic government portal clutter and trendy, superficial AI gimmicks.

### The "Anti-Patterns" to Strictly Avoid:
* ❌ **NO Purple AI Gradients or Glowing Highlights:** Avoid dark backgrounds with purple/magenta neon accents.
* ❌ **NO Glassmorphism or Heavy Backdrop Blurs:** Elements should have solid, readable contrast.
* ❌ **NO Floating Blobs or Abstract Futuristic AI Graphics:** The visual language must be grounded in physical reality and calm clarity.
* ❌ **NO Overly Rounded "Pill" Cards:** Use moderate, disciplined corner radii (`rounded-xl` / `rounded-2xl`).
* ❌ **NO Archaic Bureaucratic Tables:** Replace dense, tiny-font government tables with spacious, structured cards.

---

## 2. Color Palette & Token Architecture

The color system uses warm, earth-grounded neutrals balanced with restrained forest greens (signifying financial growth and savings) and dignified deep blues/charcoals (signifying institutional trust and stability).

```typescript
// tailwind.config.js theme extension
module.exports = {
  theme: {
    extend: {
      colors: {
        align: {
          // Warm Backgrounds
          bg: {
            subtle: '#FAF8F5',      // Warm linen / off-white app background
            card: '#FFFFFF',        // Pure white container background
            muted: '#F4EFEB',       // Secondary card fill / chip background
            accent: '#EDE6DF'       // Border and divider warm stone
          },
          // Charcoal & Slate Typography
          text: {
            primary: '#1F2421',     // Deep charcoal (WCAG AAA contrast)
            secondary: '#4A5568',   // Medium slate gray
            muted: '#718096',       // Descriptive captions and placeholders
            inverted: '#FFFFFF'     // White text on dark buttons
          },
          // Restrained Brand Primaries
          primary: {
            DEFAULT: '#1E3A2F',     // Deep evergreen (primary CTAs, headers)
            hover: '#162C24',       // Darkened forest green
            subtle: '#E8F1EC'       // Very soft green tint for badges & highlights
          },
          // Restrained Secondary (Trust & Maps)
          accent: {
            DEFAULT: '#2B4C6F',     // Slate navy (secondary actions, map markers)
            hover: '#203A55',
            subtle: '#EDF3F9'
          },
          // Semantic Indicators
          status: {
            eligible: '#2E7D32',    // Restrained forest green
            eligibleBg: '#E8F5E9',
            warning: '#D97706',     // Amber
            warningBg: '#FEF3C7',
            border: '#E2DCD5'       // Neutral warm border
          }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      borderRadius: {
        'card': '1rem',             // 16px
        'card-lg': '1.25rem',       // 20px
        'btn': '0.625rem'           // 10px
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(31, 36, 33, 0.04), 0 1px 2px 0 rgba(31, 36, 33, 0.02)',
        'elevated': '0 4px 12px 0 rgba(31, 36, 33, 0.06), 0 2px 4px 0 rgba(31, 36, 33, 0.04)',
        'drawer': '0 -4px 20px 0 rgba(31, 36, 33, 0.08)'
      }
    }
  }
}
```

---

## 3. Typography & Information Hierarchy

* **Font Family:** `Plus Jakarta Sans` as primary font, with `Inter` as system fallback.
* **Heading 1 (Screen Titles):** `text-3xl font-bold text-align-text-primary tracking-tight`
* **Heading 2 (Card / Section Titles):** `text-xl font-semibold text-align-text-primary`
* **Heading 3 (Subsections / Metadata):** `text-base font-semibold text-align-text-secondary`
* **Financial Numbers (EMI, Loan Totals):** `text-2xl font-bold text-align-text-primary font-mono tracking-tight`
* **Body Text:** `text-sm text-align-text-secondary leading-relaxed`
* **Badges & Tags:** `text-xs font-medium px-2.5 py-1 rounded-full uppercase tracking-wider`

---

## 4. Key Component Implementations

### 4.1 Natural Language Input Card (Screen 2)
* Large, welcoming input surface styled like a premium consultation notebook.
* Subtle warm border (`border-align-accent`), soft inner shadow.
* Auto-expanding textarea with clear action button positioned inside or directly below the field.
* Quick-prompt chips below textarea: Pill-shaped badges (`bg-align-bg-muted hover:bg-align-bg-accent text-xs`).

### 4.2 Universal Financial Calculator Bar (Screen 3)
* Fixed or sticky banner across the top of the comparison screen.
* Clean sliders with dual numeric inputs:
  - `Loan Amount (₹)`: Custom range slider with thumb styled in deep evergreen (`bg-align-primary`).
  - `Repayment Tenure (Months / Years)`: Step slider with intuitive discrete markers (12m, 24m, 36m, 60m).
* Updates comparison cards instantly with zero lag.

### 4.3 Side-by-Side Comparison Cards (Screen 3)
* Clean column layout (grid 1 to 3 columns on desktop).
* Structured row sections:
  1. Header: Scheme name, category tag, benchmark rate badge.
  2. Financial Core: Monthly EMI in bold font, total repayment, total interest.
  3. Terms Grid: Moratorium period, max loan headroom, repayment frequency.
  4. Primary Button: `Select This Scheme` (`bg-align-primary text-white`).
* Cards feature a crisp `border border-align-status-border` and subtle elevation on hover.

### 4.4 Floating AI What-If Assistant (Screen 3)
* **Docking:** Fixed at bottom center of viewport (`fixed bottom-4 z-40 max-w-3xl w-full px-4`).
* **Collapsed State:**
  - Compact message bar (`h-14 bg-white border border-align-status-border shadow-drawer rounded-xl flex items-center px-4`).
  - Left icon: Subtle spark icon (clean slate blue, not neon purple).
  - Center: Text input with placeholder: *"Ask ALIGN to explore a what-if scenario..."*
  - Right: Clean submit arrow button.
* **Expanded State (Post-Query):**
  - Expands upward smoothly (`max-h-80 overflow-y-auto transition-all duration-300`).
  - Top: Concise plain-language summary of impact.
  - Middle: Before/after delta indicator pills (e.g. `New EMI: ₹2,452 (-₹1,226)`).
  - Bottom: Action row with *"See comparison above to notice changes"* tip and a primary button: **`Apply this scenario`**.

### 4.5 Interactive Map & Partner List (Screen 4)
* **Split Layout:** Two-column container on desktop.
* **List Pane:** Scrollable cards with branch address, type tag (SCA / PSB / RRB), contact details, and distance.
* **Map Pane:** Google Maps embedded with custom SVG pin markers (Deep evergreen for active scheme, slate navy for other branches).
* **View Switcher:** Clean pill toggle in top-right of map:
  - `[ Compact Map | Expand Map ]`
  - Clicking `Expand Map` widens the map canvas to 80% width with smooth CSS grid transition (`grid-cols-12` transition).

### 4.6 Document Checklist & Dynamic PDF UI (Screen 5)
* Document cards grouped into expandable accordion sections.
* Checkbox status indicator for applicant tracking during preparation.
* Dedicated **Download Action Banner**:
  - Prominent card with document icon, file size estimate, and large CTA: **`Download Personalized Checklist PDF`**.
  - Secondary metadata: *"Includes verified partner contact details, exact document requirements, and official source circulars."*

---

## 5. Responsive Behavior & Accessibility (A11y)

1. **Breakpoints:**
   - Mobile: `< 640px` (single-column cards, drawer bottoms, vertically stacked map).
   - Tablet: `640px - 1024px` (two-column comparison with horizontal swipe, compact map).
   - Desktop: `> 1024px` (three-column comparison matrix, split-screen map & list).
2. **Accessible Color Contrast:** All primary text (`#1F2421`) on warm backgrounds (`#FAF8F5` / `#FFFFFF`) exceeds a 10:1 contrast ratio, surpassing WCAG AAA standards.
3. **Focus States:** High-visibility outline rings (`focus:ring-2 focus:ring-align-primary focus:outline-none`) across all form inputs and interactive buttons.

---

## 6. Open Decisions

| ID | Issue | Detail | Proposed Resolution |
| :--- | :--- | :--- | :--- |
| OD-UI1 | Dark Mode Support | Should dark mode be included in the SIH MVP? | **Omit dark mode for MVP.** Focus on the warm, accessible daylight palette developed in Stitch. Introducing dark mode risks diluting the warm financial guidance aesthetic. |
| OD-UI2 | Map Fallback UI | If the user has no internet or Google Maps fails, what renders on Screen 4? | Render a styled interactive district map SVG with clickable pins that synchronizes with the partner cards. |
