---
step: PS-1
title: Scaffold, gates, deploy
branch: ps-1-scaffold
pr: 1
status: signed-off
signedOff: 2026-09-11
criteria:
  - { id: PS-1.1, kind: machine, passed: true, evidence: "https://github.com/Edward-VJ/Edward-VJ.github.io/actions/runs/34591687107" }
  - { id: PS-1.2, kind: machine, passed: true, evidence: "https://github.com/Edward-VJ/Edward-VJ.github.io/actions/runs/34591473070" }
  - { id: PS-1.3, kind: machine, passed: true, evidence: "local SonarQube 26.9, quality gate PASSED, 2026-09-11" }
  - { id: PS-1.4, kind: machine, passed: true, evidence: "hard-rules step green in run 34590641354 and 34591473070" }
  - { id: PS-1.5, kind: machine, passed: true, evidence: "https://github.com/Edward-VJ/Edward-VJ.github.io/actions/runs/34590641354" }
  - { id: PS-1.6, kind: machine, passed: true, evidence: "runs 34590924744 (size), 34591030925 (hard rules), 34589234940 (links)" }
---

# PS-1 — Scaffold, gates, deploy

Started and signed off 11 September 2026. Merged as PR #1 (squash commit 7570975).

## Resolved at this step

| Item | Value |
|---|---|
| Node / npm | 24.14.0 / 11.9.0 |
| typescript | 6.0.3 (highest 6.x; Astro's checker does not accept 7.x yet) |
| @types/node | 24.13.4 |
| actions/upload-artifact | v7 (v7.0.1, node24 runtime) |
| actions/download-artifact | v8 (v8.0.1, node24 runtime) |
| Static analysis | local SonarQube Community Build, upgraded to 26.9 before the first scan |

## Log

- Scaffolded from the Astro minimal template; every dependency pinned exactly.
- Wrote the tests first: version helpers, sitemap-to-Lighthouse URL derivation, commit-trailer
  rules, hard-rules scanner (unit); smoke, network-JS budget, accessibility on every route, visual
  baseline (end-to-end).
- `astro preview` returns HTTP 404 for unknown paths on both browser projects (recorded from the smoke test annotation); tests address the 404 page as `/404.html`.
- Local SonarQube (Community Build 26.9) first scan: quality gate PASSED, project `edward-vj-github-io`.
- The `shared` size-limit entry is added in PS-2 when the first island boot module exists (size-limit refuses a pattern that matches no files).
- First fully green CI run: 34590641354 (build, e2e in the Playwright container, quality: Lighthouse, links, trailers, hard rules). Earlier runs each retired one gate: generated JSON missing before `astro check` (34589062945), a footer link to a route that does not exist yet (34589234940, the links gate), the trailer gate reading GitHub's synthetic merge commit (34590346456).
- Wired the gates: `ci.yml` (build → e2e in the Playwright container → quality: Lighthouse, links,
  trailers, hard rules → a single required `ci` check) and `deploy.yml` (runs only after `ci`
  succeeds on `main`; never commits).

## Sign-off criteria

| id | criterion | evidence |
|---|---|---|
| PS-1.1 | The deploy workflow's live check passes against the root URL | deploy run 34591687107; `https://edward-vj.github.io/` returned 200 with `<h1>Edward Jakunskas</h1>` |
| PS-1.2 | `ci` runs every gate green and is the required check on `main`; `npm ci` green on Linux | PR run 34590641354 and main run 34591473070 green; ruleset requires `ci` |
| PS-1.3 | Local SonarQube gate passes for the project | PASSED, 2026-09-11, local dashboard `dashboard?id=edward-vj-github-io` |
| PS-1.4 | Hard rules green over the public plan | hard-rules step green on every green run |
| PS-1.5 | Lighthouse ≥ 0.95 in all four categories on the placeholder | 1.00 / 1.00 / 1.00 / 1.00 on `/` and `/404.html`, median of 3 mobile runs, CI run 34590641354 |
| PS-1.6 | Three red runs recorded (size budget, hard rules, links) | size budget 1 B → build failed at `npx size-limit`, run 34590924744; hard rules (fake phone number in README) → quality failed at the hard-rules step, run 34591030925; links → the genuine broken-link run 34589234940 (lychee rejected a footer link to a route that did not exist yet), plus 34589995064 (a GitHub path that only exists after merge) |
