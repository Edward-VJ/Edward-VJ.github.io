---
title: "00 — Scope"
order: 0
---

# 00 — Scope

Started 10 September 2026 with a research phase: seven parallel research reports on the reference
site that inspired the idea, the canon of interactive developer portfolios and how they are
received, how people show agentic-coding skill credibly on personal sites, what robotics and vision
demos actually run in a 2026 browser, hosting and anti-jank engineering, press coverage worth
linking, and an inventory of assets that already existed. Decisions were made on those reports.

## Purpose

A personal site for Edward Jakunskas (Dublin; computer vision and robotics MSc; software engineer
who delivers production systems by directing AI agents) that is **raw**: it shows the ability to
build, and the workflow that built it, in its own right, more than it is "a website". The audience
is hiring managers for robotics, vision and software roles, and anyone who follows a link from a
CV or a profile.

## How the site is built

1. **Plan the plan.** Research first: does the idea have ground to stand on, has anyone done it,
   what are the right tools.
2. **Constraints and priorities, not choices.** The owner states constraints and priorities; the
   agent makes the informed decision and records why.
3. **Every step written down**, with static sign-off criteria fixed before any code.
4. **Tests first**, so no change can break what already works.
5. **Every decision logged**, dated, in `../decisions.md`.
6. **Static analysis at every junction.**
7. **The plan is reviewed several times before execution**: package compatibility, version pins,
   every uncertainty resolved ("does the input exist, in what format, where?"). The plan for this
   site went through five review passes before its first step ran.
8. **The agent writes every commit and every review.** The owner's work is the plan, the sign-off
   criteria, and the decisions.

## Constraints

- Zero running cost: GitHub Pages and free tiers only. A custom domain is a later step.
- No session transcripts or replays are published.
- No machine-learning models run in the browser; interactive pieces are built on exported outputs.
- Client work is described in prose consistent with the CV; no client material is published.
- Research claims are limited to what the thesis states.
- The site's code is entirely agent-written, and authorship is stated in those words.
- "Built with Claude Code" is plain text; no logos; no affiliation with Anthropic.
- Contact by email, LinkedIn and GitHub only.
- English only at launch.

## Priorities (ordered)

1. The site is evidence of the workflow: the plan, the sign-off criteria, the tests, the logged
   decisions, the gates.
2. Not janky: fast, works on phones, keyboard-accessible, every interactive thing has a fallback,
   no autoplay, no fake assets.
3. Personality: the rescue cats, the courtyard gallery.
4. Interactive pieces are secondary and each must prove one true thing.

## What was decided

- **Shape: two doors on one landing.** Read (a fast static site) or Play (a walkable courtyard
  with seven stations and seven hidden cats, and two games reachable from it and from their own
  URLs: a point-cloud scanner game and pong against a PID controller you tune).
- **Framework: Astro**, chosen over a Next.js static export because content pages ship no
  framework runtime and games load only when asked for.
- **Hosting: GitHub Pages**, zero cost.
- **Contact form: Web3Forms**, a free relay; the access key is public by design.
- **Research page:** a thesis deep-dive with an explorer built on the exported field-season
  outputs (a grid of per-plant measurements over nine sessions), with the owner's permission to
  show per-plant values.
- **Cut after review:** a gantry path-planning game (boring), a plural-rules language toy, a
  session replay (would publish transcripts), an in-browser vision pipeline (needs a workstation
  GPU; and the segmentation result was a negative one), a multiplayer seat map.
- **Cat section:** rescue-charity link, foster photos, and the hidden-cats layer in the courtyard.
- The courtyard theme echoes the owner's father's street-art courtyard gallery in Kaunas, whose
  website the owner built and which is the one public artefact linked from the CV.
