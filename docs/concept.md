# The Village: AI Agent Town Concept

Concept as of Nov 6, 2026 · Ulrich (Rick) Hoek

## Overview

The Village is a 16-bit fantasy village where Rick's AI agents live and work: a chief of staff, Rhod, and eight directors who each run one area of his life. The agents do real work in the background; the village is where Rick sees it, hands out tasks and stays in charge.

- **Focus:** personal life first. Business (Rockshore, the consultancy) becomes a separate district later.
- **Origin:** a YouTube "AI village" build, adapted to Rick's rotating shifts, his island and his existing automations (Floor Notes, /shift-start).
- **Status:** concept and art done; build starting in Claude Code.

## The town

A classic fantasy village in 16-bit pixel art: a stone town hall with a bell tower facing a cobblestone plaza with a fountain, eight timber-framed houses, a stream with wooden bridges, and forest all around.

| Element | Decision |
| --- | --- |
| Setting | Medieval fantasy village: timber-framed cottages, red and slate-blue roofs, cobblestone plaza, stream and bridges, oak forest, cliffs with a cave beyond |
| Art style | 16-bit pixel art with a modern level of detail, three-quarter top-down view |
| Centerpiece | Stone town hall with a clock and bell tower, facing the plaza and fountain. Rhod's office and the meeting hall |
| Time of day | Synced to real Aruba time |
| Growth | Fenced dirt plots already on the map; the road east over the bridge leads to a future business district |

**Night shows work.** After dark only the houses where a director is actively running a task keep their windows lit.

**Style guide** (pasted into every Gemini prompt):

> Top-down 16-bit pixel art in the style of classic SNES RPGs. A small medieval fantasy village: timber-framed cottages with white plaster and dark beams, steep red and slate-blue roofs, stone chimneys, flower boxes and wooden fences; cobblestone paths; oak trees and hedges. Limited warm palette, crisp outlines, no anti-aliasing, consistent light from the upper left.

### The map, house by house

| Building | Director | Signature details |
| --- | --- | --- |
| Town hall, top left | Rhod | Clock and bell tower, banners, pigeons in the tower |
| Red house, top center | Marisol | Pigeon loft on the roof, clock on the gable |
| Stone house, top center-right | Ruben | Gold coin sign, iron-banded door |
| Red house behind the market stalls | Yara | Cooking-pot sign, vegetable baskets; the stalls are her market |
| Slate-roof house, far right | Ivo | Shield with crossed swords, sparring dummy, bicycle |
| Red house left of the plaza | Maarten | Telescope on the roof, open-book sign, books in the window |
| Red house by the west bridge | Liv | Viking longhouse: dragon heads, round shield, Norwegian flag |
| Blue house below the fountain | Gisela | The inn: foaming mug sign, lanterns |
| Blue house with lean-to, bottom right | Elvin | Lean-to, crates and work yard; his sign can be added later |

### How the art was made

- **Tool:** Gemini (Nano Banana), by hand. Concept, then a zoomed-in village, then one house per in-place edit, then one final upscale.
- **Current file:** `assets/map/village-map-v1.png`, 2576×1438. Earlier versions are in `assets/map/history/`.
- **What prevents drift:** identify each house by its neighbors, list every finished building under "do not change", change only the building itself, never add things on the grass, and go back to the last clean version when something drifts.
- **Motion** (smoke, the fountain, walking characters, day and night) is layered on top in the village app; the map itself stays a still image.
- **Portraits:** one per character on a magenta background, in `assets/portraits/`. Blink and talk variants and small walking map sprites are still to be made.

## The cast

Rhod runs the town; eight directors each own one area of Rick's life and live in a house that looks like their job. Rick is the player, the chief human officer, in a watchman's coat with a spyglass.

| Role | Name | House | Personality |
| --- | --- | --- | --- |
| Chief of staff | Rhod (Rhoderick when it's serious) | Office in the town hall | Straight-talking friend; tells you what you're avoiding |
| Inbox & Calendar | Marisol | Red cottage with a pigeon loft and a clock on the gable | Fast, organized, never misses a deadline |
| Finance | Ruben | Stone counting house with a gold coin sign | Calm, careful, slightly old-school |
| Fitness | Ivo | Training house with a crossed-swords shield, sparring dummy and bicycle | High energy, keeps score of everything |
| Nutrition | Yara | Kitchen cottage with a cooking-pot sign behind the market stalls, next door to Ivo | Practical, plans ahead, hates waste |
| Education | Maarten | Academy with a telescope on the roof; the five ALTER agents work inside as his staff | Curious professor, asks hard questions |
| Languages | Liv | Viking longhouse by the stream with dragon heads and a Norwegian flag | Dry humor, switches languages mid-sentence |
| Relationships | Gisela | The village inn with a foaming mug sign and lanterns | Warm, remembers everyone's details |
| Home & family | Elvin | Carpenter's workshop with a lean-to and work yard | Dependable fixer, handles errands |

Workers hired later wear a vest and live in their director's building.

**Gisela and Elvin split the work by one test: is it about the person, or the errand?** Gisela owns the who and why (staying in touch, remembering what people said, birthdays, gift ideas, suggesting plans). Elvin owns the when and how (times, places, driving, errands, fitting it around shifts). They live next door, sharing a fence, and hand off rather than compete:

| Situation | Gisela | Elvin |
| --- | --- | --- |
| A friend's birthday | Reminds Rick, suggests a gift | Adds "pick up gift" to errands before the date |
| Date night with his wife | Suggests the idea | Finds a day off that works, drafts the reservation |
| Driving family to an appointment | Reminds Rick to ask how it went | Owns the drive, checks it against shifts |
| "Can you help me move next month?" | Notes that the friend asked | Puts the move on the schedule |

## Director jobs and limits

Marisol, Ivo and Elvin can do real work on day one because their connectors already exist, so they move in first.

| Director | Daily | Weekly | Limit |
| --- | --- | --- | --- |
| Marisol | Sorts inbox, flags what needs Rick, drafts replies, keeps calendar clean | Unsubscribe suggestions, unanswered follow-ups | Drafts only; calendar changes after Rick's OK |
| Ruben | Watches subscriptions, renewals and failed payments from email receipts | Spending vs. budget, what's due next week | Read and track only; never touches an account |
| Ivo | Reads rides and workouts, sets today's Spartan protocol around the shift | Training load, streaks, week planned around the schedule | Advises only |
| Yara | What to eat around today's shift, on-target check | Meal prep plan in the standard format, shopping list, synced with Ivo | Works within dietary constraints; no supplements or medical advice |
| Maarten | One study block sized to free time, quiz from recent reading | Advisor reviews progress, Librarian sorts new sources | Recommends; Rick decides what to study |
| Liv | Short Norwegian exercise; Danish once started | One conversation session | None needed |
| Gisela | Birthdays, anniversaries, "you haven't talked to X" nudges | One plan with his wife or friends that fits his days off | Strictest: reminders and drafts only, never sends |
| Elvin | Errands, household tasks, family appointments checked against shifts | Upcoming conflicts, maintenance, anything to book | Flags and drafts; never books or pays |

## Rituals

The village runs on Rick's shifts, not the clock: his "morning" can be 04:00, noon or 20:00 depending on the roster.

| Ritual | When | What happens |
| --- | --- | --- |
| Rhod's brief | About an hour before each shift | Today's calendar, what directors need from Rick, one straight-talk line about what's being avoided |
| Days-off greeting | First time Rick opens the village on a day off | Rhod greets him with the brief on arrival |
| Debrief | After each shift | What got done, what's waiting for approval, tomorrow's preview. After a night shift: a two-line "lights out" version |
| Noticeboard | Anytime | Board outside the town hall where directors post updates between meetings |
| Town hall | Quarterly | All eight directors take their seats and report on the quarter against Rick's bigger goals |
| Newsstand | New edition at 04:00 daily | Floor Notes lives in a kiosk on the plaza; the shutter rolls up when it lands. Never clutters Rhod's brief |

## What the village shows

Show everything, announce only what needs Rick. Like a monitor wall: every camera is live, but only an alarm makes you look up.

| Layer | What's in it | How it appears |
| --- | --- | --- |
| Ambient | Every action | Motion only: directors carrying work, chimney smoke, lit windows. No text, no sound |
| Attention | Approvals, problems, overdue tasks | Envelope plus phone ping, red pins on the noticeboard, ghosts |
| On demand | The full record of every action | Each director's notebook and the town hall archive; also the audit trail |

- **The rule:** a director interrupts Rick only when he has to decide or act. "Archived 12 newsletters" never notifies; "Your domain renewal failed" always does.
- **Briefs use counts, not details:** "Marisol handled 23 emails, 2 need you."

## Schedule drop

One WhatsApp image from Angelo and the whole village knows Rick's next two weeks.

1. Angelo's schedule arrives in WhatsApp as an image.
2. Rick shares it to the village: through the phone's share sheet (the PWA registers as a share target), or by forwarding it to Rhod on Telegram.
3. It lands in Marisol's mail slot. She reads Rick's row only and discards the rest of the roster.
4. She shows a preview ("15 shifts: 6 Blue, 5 Green, 4 days off. Correct?") and asks about any blurry cell instead of guessing.
5. On Rick's OK, she adds "Surveillance Shift" events to Google Calendar, the name /shift-start already looks for.
6. Rhod now knows when to brief and debrief; Elvin checks the new shifts against appointments.

- **Changes mid-period:** drop the updated image; Marisol shows only what changed.
- **Nudge:** if a new period (1st or 16th) is a few days away and nothing has been dropped, Rhod asks whether to check with Angelo.

## How it runs

The agents never run on a screen: they work as scheduled cloud tasks, and the village only shows their work and collects Rick's tasks.

```
Screens (TV, phone, laptop) ──opens──▶ Village app (PWA) ◀──live sync──▶ Supabase
                                                                          ▲
Telegram (Rhod in your pocket) ◀────────────────────────────────────────┤ tasks, status
                                                                          │
GitHub repo (code, director instructions + notes) ◀──memory──▶ Rhod + 8 directors
                                                               (scheduled cloud tasks)
                                                                          │
                                                       Connectors: Gmail, Calendar,
                                                       Strava, Readwise, AccuWeather
```

- **Files for knowledge, database for activity.** Director instructions and notes are plain Markdown in the private repo; tasks, status, the activity log and XP live in Supabase.
- **Screens:** the village is an installable app (PWA) for phone and laptop. The Fire TV Cube shows it in its browser or as a sideloaded Android wrapper, driven by the remote's D-pad. The Cube only displays; it never runs agents.
- **No public hosting.** GitHub Pages would make the village readable by anyone with the link, so it stays off.
- **Art:** the village map is made by hand in Gemini; motion is layered on top in the village app.
- **Usage:** scheduled check-ins instead of 24/7 loops, to stay within the subscription's weekly limits.

**Where notes live.** Director notes stay in the private repo permanently, whatever notes app Rick picks, so switching apps never breaks the village and every change keeps its history. Rick reads them in each house's notebook. His notes app, once chosen, gets a one-way export of finished reports, meal plans and study summaries; until then, Google Drive does that job.

## Rhod on Telegram

Telegram is Rhod in Rick's pocket; the village is the TV and home view. Both read from the same Supabase data, so approving something on Telegram updates the village instantly.

**Setup (Rick, about 10 minutes):** message @BotFather, send `/newbot`, name it Rhod, keep the bot token private, then send Rhod one message so he locks onto Rick's chat ID.

**What it does**

- **Briefs and debriefs** arrive as messages, timed to Rick's shifts.
- **One-tap approvals:** "Marisol drafted a reply to Namecheap." **[Approve] [Decline] [Show me]**.
- **Forwarding:** Angelo's schedule image goes to Marisol; chat screenshots go to Gisela.
- **Voice notes:** Rick talks, Rhod transcribes and routes the task.
- **Tasks in plain language:** "tell Elvin the car needs an oil change."

**What it needs:** a small always-on backend to receive messages (a Supabase Edge Function) and an Anthropic API key, which means pay-per-use costs. Set a spending cap on the key. This is the one place the village leaves "subscription only", so Rick approves it before it's built.

**Guardrails:** Rhod answers only Rick's chat ID and ignores everyone else; he cannot message other people; every button press is logged in the audit trail.

WhatsApp was considered and parked: it needs a separate business number, Meta verification, message templates and per-message fees.

## Connectors

| Connector | Status | Used by | Purpose |
| --- | --- | --- | --- |
| Gmail | Connected | Marisol | Inbox triage, drafts |
| Google Calendar | Connected | Marisol, Rhod, Elvin | Shifts, appointments, conflicts |
| Strava | Connected | Ivo | Rides and workouts (Garmin syncs here) |
| Wispr Flow | Connected | Rhod | Dictate tasks instead of typing |
| Supabase | Connected | The village | Database for tasks, status, log |
| Google Drive | Connected | All | Finished reports |
| Readwise | Connected | Maarten | Kindle highlights for quizzes and reading tracking |
| AccuWeather | Connected | Ivo, the village | Ride planning; real weather shown in town |
| PocketSmith | Ruled out | Ruben | Doesn't support Rick's bank |

**No connector exists for:** personal WhatsApp (hence the share sheet and Telegram forwarding, which also keep agents from messaging friends), food logging (Yara works from meal plans and photos) and language apps (Liv runs on conversation).

## Guardrails

Rick stays in charge: agents prepare, Rick approves, and the rules are built into the system so an agent can't break them even if it tries.

- **Messages:** emails are drafts only. Nothing reaches a friend or family member without Rick sending it himself.
- **Calendar:** changes need Rick's OK, including the schedule drop.
- **Money:** no agent touches an account or moves money.
- **Spending:** no image credits or paid API calls without asking first.
- **Publishing:** nothing is posted or published without Rick's approval.
- **Work data:** casino data stays out. The schedule drop keeps Rick's own row and discards the rest.
- **Audit trail:** every agent action is logged in Supabase, so Rick can always see who did what and when.

Every action falls into one of three tiers.

| Tier | Covers | Examples |
| --- | --- | --- |
| Do it | Read, summarize, plan, update their own notes | Ivo reads rides; Maarten builds a quiz |
| Prepare, Rick approves | Anything that leaves the village or changes Rick's things | Email drafts, calendar adds, to-dos extracted from chats |
| Never | Messaging people, moving money, buying, posting, deleting, work data | Enforced by giving agents no tool for it |

- **Impossible, not forbidden:** red-tier actions aren't blocked by instructions; agents simply get no tool for them. Marisol's Gmail access can draft but has no send.
- **Approvals:** one tap, on Rick's phone (push notification) or in Telegram. Ignored ones fall back into Rhod's next brief. In town, the director walks out holding an envelope with a "!" bubble.
- **Rule hits:** logged, reported to Rhod, and pinned in red on the noticeboard. Repeated hits usually mean a badly written job.
- **Curfew bell:** a bell in the town hall pauses every agent at once.

## House interiors

Full room scenes Rick can walk around in, built in the order directors move in: Marisol, Ivo and Elvin first.

Every room has the same four objects, so Rick always knows where to look:

- **Desk:** what the director is working on now
- **Notebook:** what they've learned (their notes file)
- **Tray:** items waiting for Rick's approval
- **Trophy shelf:** this month's wins

| Director | Room details |
| --- | --- |
| Marisol | Wall of pigeonholes, one per inbox category |
| Ruben | Ledger, wall calendar of renewals, a locked safe for the parked bank tracker |
| Ivo | Whiteboard with the training week, ride map on the wall, streak counter |
| Yara | Chalkboard menu of the week's meals; pantry shelves are the shopping list |
| Maarten | Classroom with five desks, one per ALTER agent; bookshelf of Kindle highlights |
| Liv | Flags, vocabulary cards, a conversation corner |
| Gisela | Inn wall of birthdays and recent contacts |
| Elvin | Workshop pegboard of errands, family calendar |

## The Ascend XP layer

Rick levels up only through verified actions, and the town grows with his level.

| Stat | Director | Verified by |
| --- | --- | --- |
| Strength | Ivo | Rides and workouts in Strava |
| Vitality | Yara | To decide |
| Intellect | Maarten | Study blocks and quizzes completed in the village |
| Languages | Liv | Practice sessions logged in the village |
| Bonds | Gisela | Screenshot drops, approved drafts in Sent, her plans landing in the calendar |
| Wealth | Ruben | To decide (bank tracking parked) |
| Order | Marisol, Elvin | Inbox cleared, approvals handled, errands closed |

- **Quests:** daily ones from Rhod's brief, weekly ones from each director, quarterly boss battles in the cave beyond the village, announced at the town hall.
- **Streaks:** shift-aware. Rest days follow the roster, so a night shift never breaks one.
- **Penalties:** ghosts and streak loss. One ghost follows Rick per overdue task, capped at about five; past that, Rhod pulls him aside about the backlog. In October the ghosts wear costumes.
- **No proof, no XP:** a stat with no data source doesn't level.
- **Levels grow the town** (see Growth below).

## Screenshot drops for Gisela

Rick messages friends instead of calling and shares a slice of the chat to the village (share sheet or Telegram), the same way as the schedule drop. Gisela turns it into proof and to-dos.

| In the chat | What happens |
| --- | --- |
| "Let's grab lunch Saturday" | Marisol drafts a calendar event for Rick's one-tap OK |
| "I'll send you that link tomorrow" | A to-do for Rick, mentioned in Rhod's next brief |
| "Can you help me move next month?" | Elvin adds it and checks it against shifts |
| "My birthday's on the 14th" | Added to Gisela's birthday calendar |
| "How did the interview go?" | Gisela notes it and nudges Rick to follow up |

- **Proof:** who and when earns Bonds XP and updates her last-contact record for nudges.
- **Storage:** Gisela keeps what she extracted and deletes the screenshot itself.

## Growth, seasons and Halloween

The town grows the way Rick does, and every new building has to mean something: a real director, a real milestone or a real season.

- **Empty lots:** the fenced dirt plots already on the map. A new director means a construction site, workers in vests, then a house.
- **Business district:** later, the road east over the bridge leads to a district for Rockshore and the consultancy, kept off the home streets.
- **Ascend unlocks:** milestones upgrade buildings. A 30-day training streak upgrades Ivo's gym; a finished ALTER module adds a library wing to the academy.
- **Workers:** busy directors hire through the town hall, so busy houses get more staff on the streets.
- **Seasons:** Carnival decorations in February, flags for Dia di Betico in March, lights at Christmas.

### Halloween

Rick's favorite holiday, and the village's biggest event. The first one is October 2027.

- **All of October, slowly:** jack-o'-lanterns in week one, cobwebs on the fences mid-month, fog rolling off the stream in the last week. Real-time nights turn properly dark.
- **Costumes matched to jobs:** Ruben as a vampire counting coins, Marisol as a ghost delivering mail, Ivo as a mummy in resistance bands. Rhod wears one pair of cat ears.
- **Trick-or-treat:** on Halloween night Rick walks house to house. Treats are the month's wins; tricks are small ghosts that follow him, one per overdue task, until he deals with it.
- **The cave:** the cave in the cliffs turns haunted, bats circle the bell tower, the oaks become twisted silhouettes, and a haunted cottage appears on an empty plot only in October.

## Build phases

1. **Village viewer:** map, walkable player, building hotspots, day/night synced to Aruba time, PWA shell. No backend.
2. **Data layer:** Supabase schema, noticeboard, realtime updates into the village.
3. **Rhod and the first residents:** Marisol, Ivo and Elvin with real connectors, their interiors, briefs and debriefs.
4. **Rhod on Telegram:** bot, approve buttons, forwarding, voice notes.
5. **Everyone else:** remaining directors and interiors, Ascend XP, town hall meetings, seasons and Halloween.

## Open questions and next steps

- [ ] Task audit: list every recurring task over one to two weeks and mark what could be handed off
- [ ] Phase 1 build in Claude Code
- [ ] Portraits: blink and talk variants; small walking map sprites
- [ ] Decide on Rhod's portrait (currently resembles Rick) and Gisela's (shawl or apron version)
- [ ] Elvin's hammer-and-saw sign: keep it on the inn's side wall, or redo the upscale from the clean inn version
- [ ] Ruben's bank tracking (parked); XP sources for Vitality and Wealth
