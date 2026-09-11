# Decisions

Dated, append-only. Each entry says what was decided and why. Paid services need an entry here
before they are enabled.

- **2026-09-10 — Hosting: GitHub Pages, zero cost.** A custom domain is a later step.
- **2026-09-10 — Framework: Astro.** Content pages ship no framework runtime; games load only on demand. A Next.js static export was the alternative and would have paid the React runtime on every page.
- **2026-09-10 — Two doors.** A fast static site (Read) beside a walkable courtyard (Play). The Play door is never the only way to any content.
- **2026-09-10 — Games kept: Scan the dark room, Pong vs PID, hidden cats in the courtyard.** Cut: a gantry path planner (boring), a plural-rules language toy, a session replay (would publish transcripts), an in-browser vision pipeline (needs a workstation GPU and the segmentation result was negative), a multiplayer seat map.
- **2026-09-10 — Contact: Web3Forms.** Free relay for a static site; the access key is public by design. Honeypot and minimum fill time at launch; a captcha only if spam appears.
- **2026-09-10 — English only at launch.**
- **2026-09-10 — No session-URL trailer on commits.** A session URL is a permanent public pointer to a transcript; commits carry `Plan-Step`, `Sign-off` and `Co-Authored-By` instead.
- **2026-09-10 — The public plan is written fresh, not copied from the private working copy.** The working copy contains local paths and third-party details.
- **2026-09-10 — CV PDFs are published as web variants**: no phone number, no referees.
- **2026-09-10 — Privacy and credits pages added.** No cookies, no analytics, no consent banner.
- **2026-09-11 — Per-plant field values may be shown** in the research explorer, including the measured-versus-interpolated flag (owner's permission).
- **2026-09-11 — Static analysis runs on a local SonarQube** before each merge rather than in CI; the instance is not reachable from the internet. Result URLs go in the step logs.
- **2026-09-11 — Fonts: Bricolage Grotesque (headings, interface) and Source Serif 4 (body).** Both SIL Open Font License, Latin subset from Fontsource, four files totalling about 85 KB, self-hosted. The serif continues the CV's typeface; the grotesk gives the headings a voice without reaching for the usual defaults. Data and paths use the system monospace stack. Confirmed at H1 (pending).
- **2026-09-11 — Positioning wording: two tracks, robotics first.** The pitch names the computer vision and robotics engineer (research MSc) first, then the AI-native software engineer as a track added in 2026, in two short sentences. Not a single merged role: the robotics work stands without AI, and the AI-native work is recent and distinct.
