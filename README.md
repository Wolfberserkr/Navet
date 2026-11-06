# The Village

Rick's 16-bit fantasy village where his AI agents live and work. Private project.

## Getting started

1. Create a **private** GitHub repo named `village`.
2. Unzip this pack into it, commit and push.
3. Open Claude Code in the repo folder.
4. Paste the prompt from `docs/phase-1-prompt.md`.

## Running the village (Phase 1)

```
npm install
npm run dev
```

Open the address it prints (http://localhost:5173). `npm run dev` also prints a Network address for a phone or the Fire TV on the same Wi-Fi; nothing is hosted publicly.

| Key | Does |
| --- | --- |
| Arrows / WASD (Fire TV D-pad) | Walk; hold Shift to run |
| Enter / Space (Fire TV centre button) | Open the building you're standing at; again to close |
| Esc / Backspace | Close a panel or the editor |
| T | Debug: preview dawn, morning, day, golden hour, dusk, night, then live Aruba time |
| M | Debug: walkable-mask editor (left drag walkable, right or Shift+drag blocked, `[` `]` brush, Z whole map, Ctrl+Z undo, Ctrl+S save) |

On a phone: drag anywhere to walk, tap to open a building.

To install it as an app, run `npm run build && npm run preview`, open it in Chrome or Edge and use "Install". The app works offline once installed.

## What's in here

| Path | What it is |
| --- | --- |
| `CLAUDE.md` | Rules Claude Code reads every session: stack, guardrails, cast, art rules, build phases |
| `docs/concept.md` | The full design |
| `docs/phase-1-prompt.md` | First build instruction: the village viewer |
| `assets/map/village-map-v1.png` | The village map (2576×1438), final |
| `assets/map/history/` | Earlier map versions and the wide world map, kept in case a house needs redoing |
| `assets/portraits/` | One portrait per character on magenta (#FF00FF) |
| `assets/portraits/alt/` | Alternate portraits not currently in use |
| `src/` | The village app (React + TypeScript + canvas) |
| `src/data/walkable-mask.png` | Where Rick can walk; edit it in the app with M |
| `src/data/residents.ts` | Door hotspots, labels and director panel text |
| `src/data/lights.ts` | Window glows and chimney positions |
| `scripts/make-icons.py` | Rebuilds the app icons from the town hall on the map |

## Art notes

| File | Source | Note |
| --- | --- | --- |
| portrait-rick.png | Gemini original, 2048 | The player: watchman's coat, spyglass |
| portrait-rhod.png | Gemini original, 2048 | Resembles Rick; may be regenerated |
| portrait-ruben.png | Gemini original, 2048 | |
| portrait-yara.png | Gemini original, 2048 | |
| portrait-ivo.png | Gemini original, 2048 | |
| portrait-maarten.png | Gemini original, 1024 | Lower resolution than the rest |
| portrait-marisol.png | Cropped from phone screenshot, 1172 | Replace with the original download when available |
| portrait-liv.png | Cropped from phone screenshot, 1172 | Replace with the original download when available |
| portrait-elvin.png | Cropped from phone screenshot, 1172 | Replace with the original download when available |
| portrait-gisela.png | Cut from a framed card, padded to square | Shawl version; matches her description best |
| alt/portrait-gisela-apron.png | Cropped from phone screenshot | Copies Elvin's apron; alternate only |

Still to make: blink and talk variants for each portrait, and small walking sprites for the map.
