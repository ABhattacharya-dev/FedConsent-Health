---
name: FedConsent Health
description: Consent-aware federated research evidence in a spacious clinical workspace.
colors:
  primary: "#0066d9"
  primary-hover: "#0054b4"
  teal: "#08746c"
  ink: "#1c2228"
  muted: "#566574"
  canvas: "#f7f9fb"
  surface: "#fff"
  border: "#dbe3e9"
  blue-panel: "#edf5ff"
  mint-panel: "#eef8f2"
  apricot-panel: "#fff5ec"
  privacy-panel: "#131b21"
  privacy-accent: "#67d8d0"
  success: "#24663e"
  danger: "#a02930"
typography:
  display:
    fontFamily: "Roboto, 'Segoe UI', sans-serif"
    fontSize: "clamp(32px, 3.5vw, 48px)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-.025em"
  headline:
    fontFamily: "Roboto, 'Segoe UI', sans-serif"
    fontSize: "23px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-.025em"
  body:
    fontFamily: "Roboto, 'Segoe UI', sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Roboto, 'Segoe UI', sans-serif"
    fontSize: "12px"
    fontWeight: 500
  mono:
    fontFamily: "Consolas, monospace"
rounded:
  field: "12px"
  notice: "16px"
  control: "24px"
  card: "28px"
  pill: "40px"
  metric: "48px"
spacing:
  compact: "8px"
  control: "18px"
  card: "28px"
  content: "42px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#fff"
    rounded: "{rounded.control}"
    padding: "10px 18px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "#fff"
    rounded: "{rounded.control}"
    padding: "10px 18px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "#273b4a"
    rounded: "{rounded.control}"
    padding: "10px 18px"
    height: "44px"
  input:
    backgroundColor: "#f7f9fc"
    textColor: "#243a4b"
    rounded: "{rounded.field}"
    padding: "9px 12px"
    height: "46px"
---

# Design System: FedConsent Health

## Overview

**Creative North Star: "The Inspectable Research Desk"**

The interface makes complex consent and privacy evidence feel like a calm, readable workspace. White surfaces and generous breathing room establish the baseline; cool blue, mint, and apricot separate the three hospital cohorts without turning their data into decoration.

The blue-teal sculpture and the dark privacy chart are reserved evidence landmarks. They give the research view a recognizable focal point while measured values, consent status, and limitations stay in ordinary readable UI.

**Key Characteristics:**

- Spacious white cards on a pale blue-grey canvas.
- Rounded controls and cohort-specific tonal panels.
- Blue for primary action, teal for consent-aware context, and a dark panel for privacy evidence.

## Colors

Cool clinical neutrals carry routine work; accents identify state, cohort, or a single action.

### Primary

- **Research Blue:** used for primary actions, links, selected navigation, and focused comparison controls.
- **Trust Teal:** used for workspace context and consent-aware status copy.

### Secondary

- **Cohort Blue:** the Hospital A surface and its comparison fill.
- **Cohort Mint:** the Hospital B surface and its comparison fill.
- **Cohort Apricot:** the Hospital C surface and its comparison fill.

### Tertiary

- **Privacy Aqua:** reserved for plotted points and the blue-teal research sculpture's visual family.

### Neutral

- **Paper Canvas:** the application background.
- **White Surface:** cards, navigation, and controls at rest.
- **Quiet Ink:** headings and high-emphasis information.
- **Muted Slate:** explanatory body copy and secondary evidence.
- **Fine Border:** field and structural dividers.

**The Cohort Separation Rule.** Use blue, mint, and apricot to distinguish the three existing hospital cohorts; do not use them to imply performance or consent quality.

## Typography

**Display Font:** Roboto (with Segoe UI fallback)
**Body Font:** Roboto (with Segoe UI fallback)
**Label/Mono Font:** Consolas for IDs and machine-readable evidence

**Character:** Roboto keeps dense experiment and consent evidence familiar and neutral. Tabular numerals on strong values and table cells make comparisons stable at a glance.

### Hierarchy

- **Display:** used for page titles; balanced wrapping keeps the principal task readable.
- **Headline:** section titles for major evidence blocks.
- **Title:** compact labels for cards and subsections.
- **Body:** explanatory copy with a maximum width of 75ch.
- **Label:** fields, captions, badges, and secondary evidence use smaller medium-weight text.

**The Evidence First Rule.** Large type belongs to measured values and page purpose; decorative type does not compete with research evidence.

## Layout

The desktop workspace uses a 232px sticky sidebar, a 78px top bar, and a centered content area capped at 1540px. Main content uses 42px horizontal and 36px top padding, a three-column hospital grid, and 28px card padding.

At 1150px, the sidebar narrows to 200px and content/top-bar padding becomes 28px. At 820px, the sidebar becomes a fixed bottom pill navigation, the top bar becomes flexible, and content reserves 95px below for that control. At 580px, content uses 16px side padding, hospital cards become a single column, metric strips stack, consent scopes stack, and comparison content becomes vertical. At 1500px and above, the comparison adds a second table column and reduces the sculpture to 230px.

**The Space for Evidence Rule.** Let dense tables scroll horizontally inside their own container; do not compress columns until values become hard to compare.

## Elevation & Depth

The system is flat by default. Canvas, white cards, tinted cohort panels, borders, and spacing establish hierarchy. The selected metric tab and mobile pill navigation alone use soft shadows to show their raised, interactive state.

### Shadow Vocabulary

- **Selected tab:** `0 2px 7px #273c4b12` for the active metric tab.
- **Mobile navigation:** `0 8px 30px #1f354726` for the floating bottom control.

**The Tonal Layer Rule.** Prefer a white or tinted surface change over a shadow; elevation is reserved for floating or selected controls.

## Shapes

Cards use 28px corners, falling to 24px on small screens. Controls use 24px corners, fields and table containers use 12px, and segmented or mobile navigation uses fully pill-shaped 40px corners. Thin borders support fields and structure; cards are borderless. The signature sculpture remains a contained 280px visual on ordinary screens and 250px on narrow screens.

## Components

### Buttons

- **Shape:** compact rounded controls (24px radius) with a 44px minimum height.
- **Primary:** Research Blue background, white text, and 10px × 18px padding.
- **Hover / Focus:** hover shifts white secondary controls to the blue panel and primary buttons to the darker primary tone; keyboard focus uses a 3px blue outline with a 4px offset.
- **Secondary / Ghost / Danger:** secondary controls are white with a fine border; links are underlined blue text; danger actions use the danger text and border with a pale red hover surface.

### Chips

- **Style:** small rounded status labels use tonal fills, 10px type, and compact 5px × 8px padding.
- **State:** run status communicates succeeded, failed, or running with green, red, or amber surfaces; cohort badges inherit their panel context.

### Cards / Containers

- **Corner Style:** broad 28px cards; 24px on small screens.
- **Background:** white for general panels; cohort cards use the three dedicated tonal panels.
- **Shadow Strategy:** flat, except for the active metric tab and mobile navigation described above.
- **Border:** none for main cards; fine dividers organize metrics, tables, and details.
- **Internal Padding:** 28px for panels, reduced to 22px × 18px on narrow screens.

### Inputs / Fields

- **Style:** pale field background, 1px slate border, 12px radius, and 46px minimum height.
- **Focus:** the shared 3px blue focus outline is visible for keyboard use.
- **Disabled:** controls retain their form and use 50% opacity with a blocked cursor.

### Navigation

- **Style:** desktop navigation is a quiet vertical list with a blue selected pill; under 820px it becomes a fixed white pill navigation at the viewport bottom.

### Evidence Chart

- **Style:** the privacy tradeoff uses the dark privacy panel with pale chart labels, dashed grid lines, and Privacy Aqua points. Exact values remain in the adjacent table and SVG titles.

## Do's and Don'ts

### Do:

- **Do** keep controls native and expose clear keyboard focus.
- **Do** use the three cohort surfaces consistently for Hospital A, B, and C.
- **Do** reserve the dark privacy panel for privacy evidence and comparative measurement.
- **Do** use actual experiment, consent, and accountant values in visual summaries.

### Don't:

- **Don't** add extra display fonts or icon libraries; the shipped system uses Roboto, Consolas, and inline or bundled SVG assets.
- **Don't** rely on shadows to make ordinary cards feel layered.
- **Don't** turn cohort colors into a claim about hospital quality, privacy, or clinical outcome.
