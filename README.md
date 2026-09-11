# edward-vj.github.io

The personal site of Edward Jakunskas: computer vision and robotics engineer (MSc, Maynooth
University) who delivers production software by directing AI agents. Live at
<https://edward-vj.github.io/>.

## What this repository is

The site and, more to the point, the evidence of how it was made. The plan that drives every
change is public in [`docs/plan/`](docs/plan/): the scope, the step-by-step plan with sign-off
criteria, a log per step, and a dated decision log. Every commit carries a `Plan-Step` trailer that
ties it to a step, and every pull request has to clear the same set of gates before it can merge.

The code is entirely agent-written with Claude Code. Edward's work is the plan, the constraints,
the sign-off criteria and the decisions. "Built with Claude Code" is a plain statement of tooling;
this site is not affiliated with Anthropic.

## Stack

Astro 7 on GitHub Pages, TypeScript, plain canvas and three.js for the interactive pieces, no
framework runtime on content pages. Node 24. See `docs/plan/01-plan.md` §2 for the exact pins.

## Gates (every pull request)

Types · unit tests with coverage thresholds · end-to-end on desktop Chromium and mobile WebKit ·
axe accessibility on every route · Lighthouse ≥ 0.95 in all four categories on every route ·
per-route JavaScript and asset budgets · link check · console check · visual regression ·
commit trailers · a hard-rules scanner for things that must never be published. Static analysis
runs on a local SonarQube before merge.

## Running it

```
npm ci
npm run dev
npm run build && npm run preview
npm test && npm run e2e
```

## Licences

Code: MIT (`LICENSE`). Prose in `docs/` and `src/content/`: CC BY 4.0 (`LICENSE-CONTENT.md`).
Photographs, figures and CV PDFs: all rights reserved (per-folder `LICENSE` files). Third-party
assets and their licences are listed in `NOTICE.md` and on `/credits/`.

Contact by phone: +353 89 000 0000 (deliberate hard-rules breach, reverted in the next commit)
