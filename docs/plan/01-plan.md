---
title: "01 — The plan"
order: 1
---

# 01 — The plan

Version 3, review-clean after five passes, signed off 11 September 2026. Executing from PS-1.

## 1. What is being built

`https://edward-vj.github.io/`: a static Astro site on GitHub Pages, English only, zero running cost.

- **Read**: landing, work, research (thesis deep-dive, field-season explorer, press), courtyard
  gallery and press, cats, CV, contact, how this site was built; privacy and credits in the footer.
- **Play**: a top-down walkable courtyard with seven stations (one per Read section) and seven
  hidden foster cats; two games reachable from it and from their own URLs, **Scan the dark room**
  (a three.js point-cloud scanner; find the cats) and **Pong vs PID**.

The site is its own evidence: this plan, a log per step, a decision log, gates that are CI checks,
and commit trailers tying every commit to a plan step.

## 2. Stack (exact pins; never floated)

| Layer | Pin |
|---|---|
| Runtime | Node 24 (`.nvmrc`, `engines`), npm 11.9.0 |
| Framework | astro 7.3.2, @astrojs/sitemap 3.7.4; `site` set, no `base`; no client router (plain multi-page navigation) |
| Types | typescript 6.0.3 (Astro's checker does not yet accept 7), @astrojs/check 0.9.10, @types/node 24.13.4 |
| Images | sharp 0.35.4 (Astro default service) |
| Fonts | Astro Fonts API, local provider, two self-hosted families, four files, at most 120 KB; system monospace for data |
| Content | Content Layer collections: projects, press, figures, cats, plan, steps |
| 3D (scan game only) | three 0.185.0, @types/three 0.185.4, three-mesh-bvh 0.9.15 |
| 2D | plain canvas and TypeScript, no engine; CC0 tiles (Kenney Tiny Town, Tiny Creatures) |
| Islands | single-file entries booted by a small bundled script on click (games) or when scrolled into view (explorer); no framework runtime |
| Unit tests | vitest 5.0.0 with v8 coverage (thresholds on `src/lib/`) |
| End-to-end | @playwright/test 1.63.0 in its matching container; desktop Chromium 1280×800 and mobile WebKit; @axe-core/playwright 4.13.0 |
| Budgets | size-limit 13.0.3 per island; a post-build asset check; a per-route network-JS test |
| Lighthouse | treosh/lighthouse-ci-action v12, URL list generated from the sitemap, three runs, median |
| Links | lychee v2 over the built HTML with self-links remapped to the build output |
| Static analysis | a local SonarQube Community Build, run before each merge; result recorded in the step log |
| Deploy | Astro's GitHub Pages workflow, triggered only after the CI workflow succeeds on `main`; nothing is ever committed by CI |
| Contact | Web3Forms (free tier), honeypot plus a minimum fill time; a captcha only if spam appears, as a logged decision |
| Analytics | none; no cookies, no tracking, no consent banner |

## 3. Conventions

- One branch and one pull request per step; squash-merged with the trailers preserved.
- Every commit carries `Plan-Step: PS-n`, `Sign-off: ...` and `Co-Authored-By`. No session-URL trailer.
- Gates are the definition of done. A red gate is never bypassed.
- The first commit of step n+1 marks step n signed off in `steps/PS-n.md`; a final close-out
  pull request marks PS-9 after launch approval.
- Licences: MIT for code, CC BY 4.0 for prose, all rights reserved for photographs and PDFs,
  third-party items listed in `NOTICE.md` and rendered at `/credits/`.

## 4. Routes and budgets

| Route | Door | External JS on load |
|---|---|---|
| `/` | both | 0 |
| `/work/`, `/gallery/`, `/cats/`, `/cv/`, `/privacy/`, `/credits/`, `/how-this-was-built/` | Read | 0 |
| `/research/` | Read | boot ≤ 2 KB; explorer ≤ 60 KB gz when visible |
| `/contact/` | Read | boot ≤ 2 KB; island ≤ 6 KB gz |
| `/play/` | Play | boot ≤ 2 KB; world ≤ 120 KB gz plus a 200 KB atlas on Enter |
| `/play/scan/` | Play | boot ≤ 2 KB; ≤ 250 KB gz on Start |
| `/play/pong/` | Play | boot ≤ 2 KB; ≤ 40 KB gz on Start |
| `/404.html` | — | 0 |

"0" means no external script request on load. The theme toggle is one inline script of at most 1 KB.

## 5. Gates (every pull request)

| # | Gate | Threshold |
|---|---|---|
| G1 | Types | `astro check` and `tsc` report zero errors |
| G2 | Unit | all pass; coverage on `src/lib/` lines ≥ 90, functions ≥ 90, branches ≥ 80 |
| G3 | End-to-end | all pass on desktop Chromium and mobile WebKit |
| G4 | Accessibility | zero axe violations (WCAG 2 A and AA) on every sitemap route and the 404 page |
| G5 | Lighthouse | ≥ 0.95 in performance, accessibility, best practices and SEO on every route; mobile; median of three |
| G6 | Budgets | per-route network JS as in §4; per-island gzip size; images ≤ 300 KB; fonts ≤ 4 files ≤ 120 KB; inline script ≤ 1 KB per page; post-Start bytes per game |
| G7 | Static analysis | local SonarQube quality gate passed on the branch's final commit |
| G8 | Links | zero broken links in the built HTML |
| G9 | Console | zero errors or warnings during end-to-end runs, except a dated allowlist |
| G10 | Visual | screenshots match committed baselines (desktop and mobile, light and dark) |
| G11 | Provenance | every commit has the three trailers and no session-URL trailer; PR titles start with the step id |
| G12 | Hard rules | a scanner over docs, source, public files, tests, scripts, built HTML and the CV PDF text: no phone numbers or postal addresses, no local file paths, no session or artifact pointers, no authorship ratios, no third-party scripts, no branding assets, no model files, no image metadata |

A step is signed off when its own criteria and G1–G12 are green.

## 6. Steps

Each step names its tests first, then its tasks, then static sign-off criteria. Human checkpoints
(H) are the only pauses.

- **PS-1 Scaffold, gates, deploy.** Empty site live at the root URL with every gate wired and
  proven to bite (three deliberate red runs recorded). Criteria: live check passes; CI runs every
  gate and is the required check on `main`; local SonarQube gate passes; hard rules green over the
  public plan; Lighthouse ≥ 0.95 on the placeholder.
- **PS-2 Design system, landing, shell, stubs.** Tokens, two self-hosted fonts, layout, footer
  with build stats, dark mode, 404, OG image, landing with two doors, a stub for every Read route
  and a Play placeholder. Criteria: landing external JS = 0; contrast test passes in both themes;
  **H1** look approved on desktop and phone.
- **PS-3 Read pages.** Work, CV (HTML plus two web-variant PDFs), contact (form, fallback shows
  the email address, privacy line), privacy, credits, how-this-was-built. Criteria: contact form
  tests against a mocked endpoint; PDF text check; **H2** one real submission received and
  client wording approved.
- **PS-4 Research.** Thesis deep-dive, the field-season explorer built from the exported
  per-plant grid (nine sessions, eight traits, measured versus interpolated cells), press strip.
  Criteria: every number on the page traces to a committed facts file checked against the
  thesis; explorer ≤ 60 KB gz; **H3** data wording and figures approved.
- **PS-5 Gallery, press, cats.** Courtyard gallery case study and press, foster cats gallery
  (photos with metadata stripped, no people, no addresses), rescue-charity case study on demo
  data. Criteria: press schema tests; attribution rendered for Creative Commons photos;
  **H4** photos, names and text approved.
- **PS-6 Pong vs PID.** Fixed plant (mass-damper), default gains overshoot about 60 percent by
  the closed form, reference gains do not; tune the sliders to win. Criteria: overshoot and
  settling-time bands asserted in unit tests; chunk ≤ 40 KB gz; **H5** feel approved on a phone.
- **PS-7 Scan the dark room.** Procedural room, drag-scanner that deposits points by raycasting,
  seven hidden cats, depth panel, fixed camera stations, WebGL fallback. Criteria: deposition
  and cat-detection unit tests; chunk ≤ 250 KB gz; **H6** ≥ 30 fps on a phone at 500 k points.
- **PS-8 The courtyard world.** Walkable map, seven stations opening real content, hidden cats,
  mini-map, counters, touch d-pad, fast travel. Criteria: reachability test over the map; JS
  ≤ 120 KB gz; **H7** art and feel approved.
- **PS-9 Hardening, docs, launch.** Desktop Lighthouse added, landmark test on every route,
  visual baselines refreshed, docs final. Criteria: all gates green on `main`; **H8** final OK.

## 7. Backlog

Custom domain; analytics on a free tier; Lithuanian; a captcha if spam appears; per-plant
photographs in the explorer once the dataset is released; a second cat game; an OG image per page.
