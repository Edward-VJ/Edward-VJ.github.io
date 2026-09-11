---
step: PS-2
title: Design system, landing, shell, stubs
branch: ps-2-design
pr: 2
status: in-progress
signedOff: null
criteria:
  - { id: PS-2.1, kind: machine, passed: true, evidence: "https://github.com/Edward-VJ/Edward-VJ.github.io/actions/runs/34593019361" }
  - { id: PS-2.2, kind: machine, passed: true, evidence: "tests/unit/tokens.test.ts, 10 pairs per theme, run 34593019361" }
  - { id: PS-2.3, kind: human, passed: false, evidence: null }
---

# PS-2 — Design system, landing, shell, stubs

Started 11 September 2026.

## Log

- First commit marks PS-1 signed off with its evidence.
- Tokens live in `src/lib/tokens.ts` and generate the CSS custom properties, so the contrast
  test and the stylesheet cannot drift apart. Ten foreground/background pairs are asserted at
  4.5:1 or better in both themes.
- Fonts: Bricolage Grotesque 400/700 and Source Serif 4 400/400-italic, Latin subset, from the
  Fontsource packages, self-hosted through Astro's Fonts API (`local` provider, config shape
  checked against the Fonts guide first). Licences in `public/credits/`.
- Landing: name, one line, headshot, GitHub/LinkedIn/email, two doors (Read → `/work/`,
  Play → `/play/`). Every Read route has a stub page with one `h1` and a note naming the step
  that fills it, so navigation and the link gate stay green from here on.
- `/play/` is a placeholder whose Enter button dynamically imports `src/islands/world.ts`; this
  proves the island boot mechanism and produces the first real chunk for the size budgets.
- Gate refinements found by the tests: the per-route script allowance is a maximum, not an exact count; fonts are counted by unique URL because WebKit reports a preloaded font twice; the `shared` chunk budget moved from size-limit (which cannot express "may match nothing") into `scripts/check-assets.ts`.
- Local SonarQube (gate G7) first flagged seven new-code style findings (replaceAll, dataset, Number.parseInt, networkidle waits in tests); all fixed, rescanned, gate PASSED.
- H1 round of changes (Edward, 11 Sep): the one-line pitch merged the two identities too hard. Reworded so robotics stands on its own first and the AI-native work is a recent, separate track: "Computer vision and robotics engineer, with a research MSc from Maynooth. Since 2026 also an AI-native software engineer: production systems delivered by directing coding agents." A two-track line under the name makes the split scannable. Applied to the landing, the meta description, the social image and the README.
- Theme: one inline script before paint applies the stored choice; a second, tiny inline script
  wires the toggle. Both count against the 1 KB inline budget.

## Sign-off criteria

| id | criterion | evidence |
|---|---|---|
| PS-2.1 | All PS-2 tests green; landing external JS = 0; fonts ≤ 4 files ≤ 120 KB | CI run 34593019361 green; landing 4.03 KB gz HTML, 0 external scripts; 4 woff2 files, 84,928 B |
| PS-2.2 | Contrast test passes in both themes | 10 pairs per theme ≥ 4.5:1, `tests/unit/tokens.test.ts` |
| PS-2.3 | H1: look approved on desktop and phone; font names and licences in the decision log | awaiting Edward (screenshots sent 2026-09-11) |
