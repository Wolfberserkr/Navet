# Phase 1 prompt — Village viewer

Paste everything below the line into Claude Code, opened in the repo folder.

---

Read `CLAUDE.md` and `docs/concept.md` first. Then build **Phase 1 only: the village viewer.** No backend, no Supabase, no agents yet.

## What to build

1. **Project setup**
   - Vite + React + TypeScript app at the repo root.
   - Installable PWA: manifest, icons (use a crop of the town hall from the map), offline cache of the app shell and assets.

2. **The map**
   - Show `assets/map/village-map-v1.png` (2576×1438) as the world.
   - Render on an HTML canvas with crisp pixels (no smoothing).
   - Fit the map to the screen. If the screen is smaller than the map, a camera follows the player smoothly. It must look good fullscreen on a 1920×1080 TV and usable on a phone.

3. **Walkable areas**
   - Build a **walkable mask** so the player stays on paths, grass and the plaza, and can't walk through buildings, trees, the fountain or the stream (bridges are walkable).
   - Add a hidden **mask editor**, toggled with `M`: shows the mask as a green/red overlay, lets me paint walkable (left drag) and blocked (right drag or Shift+drag), and saves to `src/data/walkable-mask.png`.
   - Make a reasonable first pass at the mask yourself, then I'll fix it with the editor.

4. **The player**
   - A placeholder 16-bit character drawn in code (a small figure in a dark coat; real sprites come later).
   - Move with arrow keys and WASD; **Shift** to run.
   - Must also work with the **Fire TV remote**: its D-pad sends arrow keys, and its center button sends Enter.
   - Collision with the mask, no teleporting, no walking through walls.

5. **Building hotspots**
   - Define a hotspot at each building's door from the table below. Positions are **approximate** (percent of map width/height), so verify against the image and adjust.
   - Walking near a door shows a small pixel-style label (e.g. "Marisol — Post Cottage"). Pressing **Enter** or **Space** opens a simple placeholder panel with that director's name, role and portrait (`assets/portraits/portrait-<name>.png`, magenta background keyed out).

   | Building | Director | Approx. position (x%, y%) |
   | --- | --- | --- |
   | Town hall | Rhod | 29, 31 |
   | Red cottage, pigeon loft | Marisol | 47, 23 |
   | Stone counting house | Ruben | 60, 24 |
   | Red house, cooking-pot sign | Yara | 70, 32 |
   | Slate-roof training house | Ivo | 81, 39 |
   | Red academy, telescope | Maarten | 16, 51 |
   | Viking longhouse | Liv | 34, 70 |
   | Blue inn | Gisela | 56, 77 |
   | Blue workshop, lean-to | Elvin | 77, 65 |
   | Fountain (plaza center) | — | 50, 55 |

6. **Day and night, synced to Aruba**
   - Use the real time in `America/Aruba` and real sunrise/sunset for Oranjestad (12.52°N, 70.03°W). A small sun-position library like `suncalc` is fine.
   - Smooth tint over the map: warm dawn, clear day, golden hour, blue dusk, dark night.
   - At night, draw soft lit-window glows on each house. For now all houses glow; in Phase 2 only houses with active work will.
   - Debug key `T` cycles through times of day so I can preview them.

7. **Ambient motion (light touch)**
   - Chimney smoke drifting from a few chimneys, and a sparkle/ripple on the fountain. Keep it subtle; no new art files.

## Rules for this phase

- Ask me before adding any dependency other than `react`, `react-dom`, `vite`, `typescript`, `vite-plugin-pwa`, and `suncalc`.
- Do not modify or regenerate the map or portrait images.
- No network calls, no APIs, no hosting. It runs locally with `npm run dev`.
- Commit after each numbered step above.

## Done means

- `npm run dev` opens the village; I can walk around with the keyboard, stay on walkable ground, read door labels and open each director's placeholder panel.
- `T` previews day/night, `M` opens the mask editor, and both are hidden in normal use.
- It installs as an app from the browser and looks right fullscreen at 1920×1080.

When you're done, tell me how to run it and what to look at, and list anything you were unsure about (especially hotspot positions and the walkable mask).
