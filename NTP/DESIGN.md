---
name: Chronos Technical Infrastructure
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#bec6e0'
  on-secondary: '#283044'
  secondary-container: '#3f465c'
  on-secondary-container: '#adb4ce'
  tertiary: '#f3f5ff'
  on-tertiary: '#233144'
  tertiary-container: '#ccdaf3'
  on-tertiary-container: '#515f75'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#d5e3fd'
  tertiary-fixed-dim: '#b9c7e0'
  on-tertiary-fixed: '#0d1c2f'
  on-tertiary-fixed-variant: '#3a485c'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  display-time:
    fontFamily: JetBrains Mono
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-desktop: 32px
  margin-mobile: 16px
  container-max: 1440px
---

## Brand & Style

The design system is engineered for high-stakes network environments where precision and uptime are the primary metrics of success. The brand personality is clinical, authoritative, and ultra-reliable, evoking the atmosphere of a state-of-the-art Network Operations Center (NOC). 

The visual style follows a **Modern Corporate** aesthetic with **Minimalist** efficiency. It prioritizes information density and glanceability over decorative flair. Every element is designed to feel like a physical component of a rack-mounted server—structured, purposeful, and robust. The UI uses sharp clarity and a sophisticated dark-mode-first approach to reduce eye strain during long-duration monitoring.

## Colors

This design system utilizes a "Deep Space" palette optimized for high-contrast data visualization. 

- **Primary (Electric Cyan):** Reserved for active states, data points, and synchronized status indicators. It should be used sparingly to draw focus to critical information.
- **Secondary (Deep Navy):** Used for the primary background and structural surfaces, providing a low-fatigue base.
- **Tertiary (Slate Gray):** Used for component backgrounds, such as card containers and input fields.
- **Neutral (Cool Gray):** Applied to secondary text and inactive icons.

**Status Colors:**
- **Success:** Emerald 400 (#34D399) for "Locked" or "Synchronized" states.
- **Warning:** Amber 400 (#FBBF24) for "Clock Drift" or "High Jitter."
- **Critical:** Rose 500 (#F43F5E) for "Unsynchronized" or "Hardware Fault."

## Typography

Typography is treated as a functional tool for data hierarchy.

1.  **Inter (UI & Navigation):** Used for all structural labels, headings, and general interface text. It provides a neutral, highly legible foundation.
2.  **JetBrains Mono (Data & Time):** Applied to any variable data, including timestamps, IP addresses, MAC addresses, and coordinates. The monospaced nature ensures that jumping numbers do not cause layout shifts and that strings are easily comparable.

**Usage Rules:**
- Use `label-caps` for table headers and section titles to create a distinct hardware-label feel.
- `display-time` is reserved strictly for the primary clock display.
- Maintain high contrast between primary labels (White/Cyan) and secondary descriptions (Slate 400).

## Layout & Spacing

The layout is based on a **12-column fluid grid** that snaps to fixed breakpoints for wide-screen monitoring. 

- **Grid:** On desktop, use a 16px gutter to maximize data density. On mobile, transition to a single-column stack with 16px side margins.
- **Density:** This design system favors a "Compact" spacing model. Vertical padding within cards and list items should be kept tight (8px to 12px) to allow for more rows of data to be visible without scrolling.
- **Alignment:** All data points in lists must be vertically aligned to the baseline of their labels to ensure rapid scanning across columns.

## Elevation & Depth

In this system, depth is communicated through **Tonal Layering** and **Low-Contrast Outlines** rather than traditional shadows. This mimics the appearance of backlit LED panels and glass-fronted server displays.

1.  **Surface 0 (Background):** The darkest navy (#020617). Used for the global canvas.
2.  **Surface 1 (Cards/Panels):** A slightly lighter navy (#0F172A). These surfaces use a 1px border (#1E293B) to define their boundaries.
3.  **Surface 2 (Popovers/Modals):** These sit at the top of the hierarchy and include a subtle backdrop blur (8px) to separate them from the data-heavy background.
4.  **Interactive States:** Hovering over a card or list item increases the border brightness (to Cyan #00F0FF at 30% opacity), creating a "glow" effect that signifies interactivity.

## Shapes

The shape language is strictly professional. 

- **Radius:** A consistent **4px (Soft)** radius is used for all containers, buttons, and input fields. This provides a modern touch while maintaining the structured, rectilinear feel of high-end rack hardware.
- **Dividers:** Horizontal and vertical rules should be 1px thick, using a low-contrast slate color to organize data without breaking the visual flow.

## Components

### Buttons
- **Primary:** Solid Cyan (#00F0FF) with dark navy text. Used for critical actions like "System Restart" or "Apply Changes."
- **Secondary:** Outlined with Cyan or Slate. Used for standard navigation or non-destructive actions.
- **Ghost:** No background, only text. Used for utility actions within data rows.

### Cards & Data Panels
Cards must feature a header row with a `label-caps` title and an optional status dot. Borders are mandatory to differentiate panels in high-density layouts.

### Inputs & Selects
Field backgrounds should be darker than the card they sit on. Focus states must use a 1px Cyan ring and a subtle Cyan outer glow.

### Status Chips
Small, low-profile badges with a background opacity of 10-15% of the status color.
- **Locked:** Green text on dark green tint.
- **Syncing:** Cyan text on dark cyan tint with a pulsing animation.
- **Alarm:** Red text on dark red tint.

### Data Visualization
Charts should use 2px stroke widths for line graphs. Grids within charts must be minimal, using dashed lines in a very low-contrast gray. Data points on hover should trigger a vertical "crosshair" line for precise reading.