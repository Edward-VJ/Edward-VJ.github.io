# edward-vj.github.io — operating rules for this repository

This is the personal site of Edward Jakunskas, built with Claude Code from the public plan in
`docs/plan/`. Read `docs/plan/01-plan.md` before changing anything: it defines the stack, the
per-route budgets, the gates, and the nine steps. The plan is the definition of done.

## Rules (positive statements; each one is enforced by a gate where a gate can enforce it)

- Zero running cost: GitHub Pages and free tiers only. Any paid plan needs a dated entry in
  `docs/decisions.md` approved by Edward first.
- No session transcripts or replays are published, and no session-URL trailer on commits.
  Commits carry `Plan-Step`, `Sign-off` and `Co-Authored-By` (gate G11 checks all three).
- No machine-learning models run in the browser. Interactive pieces are built on exported outputs only.
- Client work is described in prose consistent with the CV. No client artefacts, data, imagery,
  repositories or internal statistics are published.
- Research claims are limited to what the thesis states, in its wording.
- The site's code is entirely agent-written (Claude Code). Authorship is stated in those words and
  no other ratio or figure is used.
- "Built with Claude Code" appears as plain text only. No Claude or Anthropic logos. The site is not
  affiliated with Anthropic.
- Contact: email, LinkedIn, GitHub. No phone number, no postal address, anywhere, including PDFs.
- The Web3Forms `access_key` in `src/config.ts` is public by design (Web3Forms FAQ: "Access key is
  public"). Do not move it to a secret or an environment variable. If a scanner flags it, resolve as
  Won't Fix with this reason.
- Budgets and gates in `docs/plan/01-plan.md` §6 are the definition of done. A red gate is never
  bypassed, and every allow marker for the hard-rules scanner carries a reason.

## How work happens

- One branch and one pull request per plan step (`ps-3-read-pages`, title `PS-3: ...`).
- Tests are written before the code they test. Pure logic lives in `src/lib/` and is unit-tested
  with coverage thresholds; DOM, canvas and WebGL glue lives in `src/islands/` and is exercised end-to-end.
- Every route's JavaScript budget is in the plan. Read routes ship zero external scripts.
- Static analysis runs on a local SonarQube before merge; the result URL goes in the step log.
- `docs/plan/steps/PS-n.md` is the log for each step. The first commit of step n+1 marks step n signed off.

## Commands

```
npm ci
npm run dev            # astro dev (prebuild writes src/data/build-stats.json)
npm run build          # astro check && astro build
npm test               # vitest with coverage
npm run e2e            # playwright (needs a build; uses astro preview)
npm run size           # size-limit budgets
npm run check:assets   # post-build asset budgets
npm run check:trailers # commit provenance
npm run check:rules    # hard-rules scanner (needs HARD_RULES_DENYLIST)
npm run lhci:urls      # generate lighthouserc.json from the sitemap
npm run sonar          # local SonarQube scan (needs SONAR_HOST_URL and SONAR_TOKEN)
```
