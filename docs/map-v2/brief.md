# Village map v2: brief for Gemini

Why v2: on `village-map-v1.png` the houses sit close together and at an angle. Liv's and Gisela's doors face the river, Rhod's door is up the stairs away from the plaza, and there is little room to walk between houses.

Goals:

- More space between houses, so Rick and, later, the residents can walk freely.
- A **ring road** around the village with a short path to every front door.
- **Every front door on the bottom wall** (the side facing the viewer). In a top-down 16-bit view a door on any other wall is hidden or awkward, and that is the real cause of the v1 problem.

Layout reference: `layout-sketch.png` (in this folder). Give it to Gemini together with `assets/map/village-map-v1.png` as the style reference.

## How to use

1. In Gemini, attach `village-map-v1.png` (style) and `layout-sketch.png` (layout).
2. Paste the prompt below.
3. Expect a few rounds. Gemini doesn't follow layouts exactly, so check the checklist at the bottom and ask for fixes one at a time (for example "move only the inn's door to its front wall, change nothing else").
4. Save the result as `assets/map/village-map-v2.png`, ideally at 2576×1438 (16:9). Don't overwrite v1.

## Prompt

```
Create a new top-down 16-bit pixel-art fantasy village map in the exact art style,
palette and level of detail of the first attached image (the village map).
Use the second attached image (the layout sketch) as the floor plan.

View: classic 16-bit RPG three-quarter top-down view, camera looking straight
north. Buildings are NOT rotated: their front walls face the viewer (south).
Every building's front door is on its front (bottom) wall and clearly visible.

Format: wide 16:9 landscape, 2576×1438 pixels, one still image, no text,
no labels, no UI, no characters or people.

Layout:
- A cobblestone RING ROAD (rounded rectangle) runs around the middle of the
  village. Leave generous open grass or cobbles between all buildings, at least
  one house-width apart, so people can walk around every building.
- A round cobbled plaza in the centre of the ring with a stone fountain. Four
  short cobbled spokes connect the plaza to the ring road (north, south, east,
  west).
- North of the ring road, in one row from left to right, each with a short path
  from its front door down to the ring road:
  1. Red academy with a telescope on the roof and a book sign.
  2. Red post cottage with a pigeon loft and a clock on the gable.
  3. Large grey stone town hall with a clock and bell tower, wide front steps
     leading straight down to the ring road (centre, biggest building).
  4. Grey stone counting house with a gold coin hanging sign.
  5. Red kitchen cottage with a big cooking-pot sign and vegetable crates.
- Inside the ring, west of the plaza: slate-roof training house with a
  crossed-swords shield over the door, a wooden sparring dummy and a bicycle
  beside it.
- Inside the ring, east of the plaza: two small market stalls with cream canvas
  awnings, in front of the kitchen cottage.
- Inside the ring, south row, each door on its front wall with a short path down
  to the bottom of the ring road:
  6. Viking longhouse with carved dragon heads, a round painted shield and a
     Norwegian flag on a pole (left).
  7. Blue-roofed village inn with a foaming beer-mug hanging sign and lanterns
     (centre, directly below the fountain).
  8. Blue carpenter's workshop with a lean-to, a hammer-and-saw sign and a small
     fenced work yard (right).
- South of the ring road: a blue river flowing west to east across the bottom of
  the map, with two wooden bridges where the road crosses it (south-west and
  south-east).
- Roads also leave the ring to the west and east edges of the map.
- Dense forest of round trees around the outer border, with a hedge line behind
  the north row of buildings.
- Small details: flower boxes, barrels, crates, fences around gardens, rocks.
  Keep paths and doorways free of clutter.

Lighting: neutral daylight, no strong shadows, no night lights (day and night
are added later in code).
```

## Checklist before I wire it in

- [ ] All 9 buildings present, recognizable from their signs.
- [ ] Every front door visible on the bottom wall.
- [ ] Every door has an unblocked path to the ring road.
- [ ] Space to walk around each building (no houses touching).
- [ ] No text, people or UI baked into the image.
- [ ] 16:9, close to 2576×1438, crisp pixels (no blur).

## What I do once v2 is in the repo

- Switch the app to `village-map-v2.png` (map size constant, camera bounds).
- Redraw the walkable mask for v2 with the built-in mask editor (`M`).
- Re-measure door hotspots in `src/data/residents.ts`, plus the spawn point.
- Move chimney smoke, fountain sparkle and lit-window positions (`src/game/ambient.ts`, `src/data/lights.ts`).
- Keep v1 in `assets/map/history/` for reference.
