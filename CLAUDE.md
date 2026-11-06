# The Village — project rules for Claude Code

The Village is a 16-bit fantasy village where Rick's AI agents live and work. Rick is the chief human officer, Rhod is his chief of staff, and eight directors each run one area of his personal life. The agents do real work in the background; the village is the screen where Rick sees that work, hands out tasks and approves things.

Full design: `docs/concept.md`. Read it before starting any phase. This file holds the rules that must not drift.

## Who you're working with

- **Rick** (Ulrich J. Hoek) is the director; you are the builder. He decides scope and look; you propose, build, and ask.
- He works rotating shifts as a casino surveillance agent in Aruba (timezone `America/Aruba`, UTC−4, no DST). The village runs on his shifts, not on a 9-to-5 clock.
- His stack: React, Supabase, GitHub. Prefer these over new tools.

## Working rules

1. **One phase at a time.** Build only the phase Rick asks for (see Build phases). Ask before adding anything outside it.
2. **Ask before anything that costs money**: paid APIs, API keys, image generation credits, hosting plans, new subscriptions.
3. **Ask before adding a dependency** that isn't already listed in this file or `package.json`.
4. **No public hosting.** Never deploy to GitHub Pages or any public URL. The village shows personal data.
5. **Never commit secrets** (tokens, keys, `.env`). Never commit personal health, finance or relationship details; those live in Supabase or local, git-ignored files.
6. **Keep Rick in the loop on visuals.** After any visual change, describe what changed, and say how to view it locally.
7. **Commit small, with clear messages**, at the end of each working step.

## Stack and architecture

| Part | Choice |
| --- | --- |
| App | React + TypeScript + Vite, installable PWA (works on phone, laptop, and a Fire TV Cube via its browser or a sideloaded wrapper) |
| Rendering | HTML canvas for the map and characters; React for panels and dialogs |
| Activity data | Supabase (tasks, director status, activity log, approvals, XP), realtime subscriptions so the village reacts live |
| Knowledge | Plain Markdown in this repo: `directors/<name>/instructions.md` and `directors/<name>/notes.md` |
| Agents | Scheduled Claude tasks in the cloud, not loops running on a screen |
| Pocket interface | Telegram bot for Rhod (Phase 4) |

**Files for knowledge, database for activity.** Directors think and remember in Markdown; they report what they're doing to Supabase; the village reads Supabase to draw the world.

## Art rules

- The map `assets/map/village-map-v1.png` (2576×1438) is a **still painted image**. Never redraw or regenerate it. All motion (smoke, fountain, flags, walking characters, day/night, lit windows) is **layered on top in code**.
- Portraits in `assets/portraits/` sit on a flat magenta (#FF00FF) background meant to be keyed out. Remove it with a tolerance; Gemini's magenta is not perfectly uniform.
- Keep pixels crisp: `image-rendering: pixelated`, integer scaling where possible, no smoothing on the canvas.
- Art is made by Rick in Gemini, by hand. Never call an image API without asking.

## The cast

| Role | Name | House on the map | Personality |
| --- | --- | --- | --- |
| Chief human officer | Rick (the player) | — | Watchman's coat and spyglass |
| Chief of staff | Rhod ("Rhoderick" when it's serious) | Stone town hall with clock and bell tower | Straight-talking friend; tells Rick what he's avoiding |
| Inbox & Calendar | Marisol | Red cottage with pigeon loft and gable clock | Fast, organized |
| Finance | Ruben | Stone counting house, gold coin sign | Calm, careful, old-school |
| Fitness | Ivo | Slate-roof training house, crossed-swords shield, dummy, bicycle | High energy, keeps score |
| Nutrition | Yara | Red house with cooking-pot sign behind the market stalls | Practical, hates waste |
| Education | Maarten | Red academy with telescope; the five ALTER agents are his staff | Curious professor |
| Languages | Liv | Viking longhouse by the west bridge, Norwegian flag | Dry humor, switches languages |
| Relationships | Gisela | Blue inn below the fountain, foaming mug sign, lanterns | Warm, remembers details |
| Home & family | Elvin | Blue workshop with lean-to, bottom right | Dependable fixer |

Gisela owns people (who and why); Elvin owns logistics (when and how). They hand off, they don't compete.

## Guardrails (build these into the system, not just the prompts)

Every agent action is one of three tiers:

| Tier | Covers |
| --- | --- |
| Do it | Read, summarize, plan, update their own notes |
| Prepare, Rick approves | Anything that leaves the village or changes Rick's things: email drafts, calendar adds, to-dos from chats |
| Never | Messaging people, moving money, buying, posting, deleting, touching work data |

- **Impossible, not forbidden.** Red-tier actions are enforced by giving agents no tool for them (e.g. Marisol's Gmail access can draft but has no send). Don't rely on instructions alone.
- **Approvals** are one tap (village, phone, or Telegram buttons). Unanswered approvals roll into Rhod's next brief.
- **Audit trail:** every agent action is logged in Supabase.
- **Curfew bell:** one control that pauses every agent at once.
- **Work data stays out.** No casino data in this system. The schedule drop keeps only Rick's own row.
- **Interrupt rule:** a director interrupts Rick only when he has to decide or act. Everything else is ambient (motion in town) or on demand (notebooks, archive).

## Build phases

1. **Village viewer** — map, walkable player, building hotspots, day/night synced to Aruba time, PWA shell. No backend. (Prompt: `docs/phase-1-prompt.md`)
2. **Data layer** — Supabase schema (tasks, directors, status, activity_log, approvals, xp), noticeboard, realtime updates into the village.
3. **Rhod + first residents** — Marisol (Gmail, Calendar), Ivo (Strava), Elvin (Calendar); characters walking, house interiors for those three; pre-shift brief and post-shift debrief.
4. **Rhod on Telegram** — bot locked to Rick's chat ID, briefs, approve/decline buttons, forwarding images (schedule drop, Gisela's screenshots), voice notes.
5. **Everyone else** — remaining directors and interiors, Ascend XP layer, town hall meetings, seasons and Halloween.

## Open items Rick knows about

- Rhod's portrait resembles Rick; may be regenerated.
- Gisela has two portrait options (`portrait-gisela.png` shawl version is current; `alt/portrait-gisela-apron.png` is the alternate).
- Elvin's hammer-and-saw sign landed on the inn's side wall in the map; Rick hasn't decided whether to keep it.
- Ruben's bank tracking is parked; Wealth and Vitality XP sources are undecided.
