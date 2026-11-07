# Character sprite and blink prompts (Gemini)

Prompts for the standing map sprites (12 directions each) and the portrait blink frames, for Rick and all nine residents. Every prompt is self-contained: paste it as-is. Walk cycles are in `walk-prompts.md`.

## What to attach

For every prompt, attach two images:

1. **The character's portrait** from `assets/portraits/` — this carries the likeness.
2. **`docs/sprites/map-style-reference.png`** (sprite sheets only) — a crop of the town hall and plaza from the map, so the sprite's outlines, palette and light match the village.

## The 12 directions

The character turns in 30° steps, like a clock face seen from above. Same order in every sheet, so the code can slice them the same way:

| Row | Cell 1 | Cell 2 | Cell 3 | Cell 4 |
| --- | --- | --- | --- | --- |
| 1 | Front (down) | 30° left | 60° left | Profile left |
| 2 | 120° (away, left) | 150° (almost back, left) | Back (up) | 150° (almost back, right) |
| 3 | 120° (away, right) | Profile right | 60° right | 30° right |

"Left" and "right" are the sides of the screen, not the character's own left and right.

## Tips for Gemini

- **One sheet per chat.** Start a fresh chat for each character so features don't bleed between them.
- **If the 12-cell grid comes out messy** (wrong count, cells that don't match), ask for it in two halves: "Only row 1 and row 2" then "Now only row 3, same character, same size". Or regenerate just the bad cells with the good sheet attached as a reference: "Redraw cell 6 to match the others".
- **Don't fix pixel sizes by hand.** Gemini's "pixels" aren't on a true grid; I'll downscale each sheet, snap it to the palette and key out the magenta in a script, the same way the portraits are handled.
- **Rhod vs Rick:** they look alike in the portraits. At sprite size the difference has to come from the clothes (Rick's navy coat and spyglass, Rhod's brown vest and cream sleeves) and Rhod's stockier build. If they still read as the same person, say so in the chat: "Make him visibly stockier, with a rounder face and a fuller beard".
- **Gisela** uses the current shawl portrait (`portrait-gisela.png`).

## Blinking

- **Portraits:** two edits per character (half-closed, closed). The village plays them as open → half → closed → half → open, every few seconds at a random interval. Gemini usually redraws a little more than asked; that's fine — I'll cut out only the eye area from each edit and patch it onto the original portrait, so the rest of the face can't drift. Pick the result whose eyes sit exactly where the originals are.
- **Map sprites:** no prompt needed. At sprite size the eyes are one or two pixels, so the blink is drawn in code on the front-facing cells.

## Prompts

### Rick — the player, chief human officer

Attach: `portrait-rick.png` + the map reference crop.

**Sprite sheet (12 directions)**

```text
Using the attached portrait as the character reference and the attached map crop as the style reference, draw a 12-direction character sprite sheet of Rick.

Character (keep this likeness exactly, same face, hair, colors and clothes as the portrait): a man in his thirties, average height and build. Short black hair, warm medium-brown skin, a short dark beard along the jaw and chin. Dark navy double-breasted watchman's coat with a high collar and brass buttons, worn open over a dark grey shirt. A brown leather strap runs across his chest from his left shoulder to his right hip, where a brass spyglass hangs. Brown belt with a silver buckle, dark trousers, brown boots. No hat.

Style: 16-bit SNES-era RPG pixel art that matches the map: crisp dark outlines, limited warm palette, no anti-aliasing, no gradients, no blur, light from the upper left. A small chibi map sprite, about 2.5 heads tall, as seen from a top-down three-quarter camera (the camera looks down at about 45 degrees, like the map). Big readable shapes so the likeness survives at about 32 pixels tall: hair shape, facial hair, headwear and clothing colors matter most.

Layout: one image, a 4 × 3 grid of 12 equal cells on a flat, pure magenta (#FF00FF) background, no grid lines, no shadows on the ground, no text or labels. The same character, standing still in a relaxed idle pose, at exactly the same size and with the feet on the same baseline in every cell. The character turns in 30-degree steps, counter-clockwise, starting by facing the viewer:
Row 1: (1) facing the viewer; (2) turned 30° toward the left side of the image; (3) turned 60° toward the left, mostly side-on with a little of the face visible; (4) full side profile facing left.
Row 2: (5) turned 120°: facing away and to the left, back of the shoulder showing, a sliver of the cheek; (6) turned 150°: almost back view, turned slightly left; (7) back to the viewer; (8) almost back view, turned slightly right.
Row 3: (9) facing away and to the right, back of the shoulder showing; (10) full side profile facing right; (11) mostly side-on facing right with a little of the face visible; (12) turned 30° toward the right side of the image.

Keep the brass spyglass on his right hip and the chest strap on the same side of the body in every direction; do not mirror the character.
```

**Blink (2 edits of the portrait)**

```text
Edit the attached portrait of Rick. Change only the eyes: draw the upper eyelids half-closed, as in the middle of a blink. Do not change anything else: same face, hair, clothes, pose, framing, pixel size, colors and flat magenta (#FF00FF) background. Output at the same size as the input.
```

```text
Edit the attached portrait of Rick. Change only the eyes: draw them fully closed, as in a blink, with a simple dark eyelid line and the lashes in the same color as the existing eye outline. Do not change anything else: same face, hair, clothes, pose, framing, pixel size, colors and flat magenta (#FF00FF) background. Output at the same size as the input.
```

### Rhod — chief of staff

Attach: `portrait-rhod.png` + the map reference crop.

**Sprite sheet (12 directions)**

```text
Using the attached portrait as the character reference and the attached map crop as the style reference, draw a 12-direction character sprite sheet of Rhod.

Character (keep this likeness exactly, same face, hair, colors and clothes as the portrait): a stocky, broad-shouldered man in his thirties, a little shorter and noticeably heavier-set than average, with a round face. Short black hair, warm medium-brown skin, full short black beard and moustache. Open brown leather vest over a cream long-sleeved shirt with a laced collar, sleeves pushed up. Brown belt, dark brown trousers, boots.

Style: 16-bit SNES-era RPG pixel art that matches the map: crisp dark outlines, limited warm palette, no anti-aliasing, no gradients, no blur, light from the upper left. A small chibi map sprite, about 2.5 heads tall, as seen from a top-down three-quarter camera (the camera looks down at about 45 degrees, like the map). Big readable shapes so the likeness survives at about 32 pixels tall: hair shape, facial hair, headwear and clothing colors matter most.

Layout: one image, a 4 × 3 grid of 12 equal cells on a flat, pure magenta (#FF00FF) background, no grid lines, no shadows on the ground, no text or labels. The same character, standing still in a relaxed idle pose, at exactly the same size and with the feet on the same baseline in every cell. The character turns in 30-degree steps, counter-clockwise, starting by facing the viewer:
Row 1: (1) facing the viewer; (2) turned 30° toward the left side of the image; (3) turned 60° toward the left, mostly side-on with a little of the face visible; (4) full side profile facing left.
Row 2: (5) turned 120°: facing away and to the left, back of the shoulder showing, a sliver of the cheek; (6) turned 150°: almost back view, turned slightly left; (7) back to the viewer; (8) almost back view, turned slightly right.
Row 3: (9) facing away and to the right, back of the shoulder showing; (10) full side profile facing right; (11) mostly side-on facing right with a little of the face visible; (12) turned 30° toward the right side of the image.

Keep the open brown leather vest on the same side of the body in every direction; do not mirror the character.
```

**Blink (2 edits of the portrait)**

```text
Edit the attached portrait of Rhod. Change only the eyes: draw the upper eyelids half-closed, as in the middle of a blink. Do not change anything else: same face, hair, clothes, pose, framing, pixel size, colors and flat magenta (#FF00FF) background. Output at the same size as the input.
```

```text
Edit the attached portrait of Rhod. Change only the eyes: draw them fully closed, as in a blink, with a simple dark eyelid line and the lashes in the same color as the existing eye outline. Do not change anything else: same face, hair, clothes, pose, framing, pixel size, colors and flat magenta (#FF00FF) background. Output at the same size as the input.
```

### Marisol — Inbox & Calendar

Attach: `portrait-marisol.png` + the map reference crop.

**Sprite sheet (12 directions)**

```text
Using the attached portrait as the character reference and the attached map crop as the style reference, draw a 12-direction character sprite sheet of Marisol.

Character (keep this likeness exactly, same face, hair, colors and clothes as the portrait): a slim young woman. Warm tan-brown skin, dark curly hair piled into a loose bun with a white quill feather tucked into it. Mustard-yellow long dress with a cream lace neckline, a brown leather satchel on a strap across her chest from her right shoulder, the bag resting on her left hip.

Style: 16-bit SNES-era RPG pixel art that matches the map: crisp dark outlines, limited warm palette, no anti-aliasing, no gradients, no blur, light from the upper left. A small chibi map sprite, about 2.5 heads tall, as seen from a top-down three-quarter camera (the camera looks down at about 45 degrees, like the map). Big readable shapes so the likeness survives at about 32 pixels tall: hair shape, facial hair, headwear and clothing colors matter most.

Layout: one image, a 4 × 3 grid of 12 equal cells on a flat, pure magenta (#FF00FF) background, no grid lines, no shadows on the ground, no text or labels. The same character, standing still in a relaxed idle pose, at exactly the same size and with the feet on the same baseline in every cell. The character turns in 30-degree steps, counter-clockwise, starting by facing the viewer:
Row 1: (1) facing the viewer; (2) turned 30° toward the left side of the image; (3) turned 60° toward the left, mostly side-on with a little of the face visible; (4) full side profile facing left.
Row 2: (5) turned 120°: facing away and to the left, back of the shoulder showing, a sliver of the cheek; (6) turned 150°: almost back view, turned slightly left; (7) back to the viewer; (8) almost back view, turned slightly right.
Row 3: (9) facing away and to the right, back of the shoulder showing; (10) full side profile facing right; (11) mostly side-on facing right with a little of the face visible; (12) turned 30° toward the right side of the image.

Keep the satchel on her left hip and the quill in her hair on the same side of the body in every direction; do not mirror the character.
```

**Blink (2 edits of the portrait)**

```text
Edit the attached portrait of Marisol. Change only the eyes: draw the upper eyelids half-closed, as in the middle of a blink. Do not change anything else: same face, hair, clothes, pose, framing, pixel size, colors and flat magenta (#FF00FF) background. Output at the same size as the input.
```

```text
Edit the attached portrait of Marisol. Change only the eyes: draw them fully closed, as in a blink, with a simple dark eyelid line and the lashes in the same color as the existing eye outline. Do not change anything else: same face, hair, clothes, pose, framing, pixel size, colors and flat magenta (#FF00FF) background. Output at the same size as the input.
```

### Ruben — Finance

Attach: `portrait-ruben.png` + the map reference crop.

**Sprite sheet (12 directions)**

```text
Using the attached portrait as the character reference and the attached map crop as the style reference, draw a 12-direction character sprite sheet of Ruben.

Character (keep this likeness exactly, same face, hair, colors and clothes as the portrait): an elderly man, slight and a little stooped. Swept-back white hair, white moustache, small round gold wire spectacles, fair skin. Dark green waistcoat over a white high-collared shirt, a gold pocket-watch chain across the waistcoat. Dark grey trousers, polished black shoes.

Style: 16-bit SNES-era RPG pixel art that matches the map: crisp dark outlines, limited warm palette, no anti-aliasing, no gradients, no blur, light from the upper left. A small chibi map sprite, about 2.5 heads tall, as seen from a top-down three-quarter camera (the camera looks down at about 45 degrees, like the map). Big readable shapes so the likeness survives at about 32 pixels tall: hair shape, facial hair, headwear and clothing colors matter most.

Layout: one image, a 4 × 3 grid of 12 equal cells on a flat, pure magenta (#FF00FF) background, no grid lines, no shadows on the ground, no text or labels. The same character, standing still in a relaxed idle pose, at exactly the same size and with the feet on the same baseline in every cell. The character turns in 30-degree steps, counter-clockwise, starting by facing the viewer:
Row 1: (1) facing the viewer; (2) turned 30° toward the left side of the image; (3) turned 60° toward the left, mostly side-on with a little of the face visible; (4) full side profile facing left.
Row 2: (5) turned 120°: facing away and to the left, back of the shoulder showing, a sliver of the cheek; (6) turned 150°: almost back view, turned slightly left; (7) back to the viewer; (8) almost back view, turned slightly right.
Row 3: (9) facing away and to the right, back of the shoulder showing; (10) full side profile facing right; (11) mostly side-on facing right with a little of the face visible; (12) turned 30° toward the right side of the image.

Keep the watch chain on the waistcoat on the same side of the body in every direction; do not mirror the character.
```

**Blink (2 edits of the portrait)**

```text
Edit the attached portrait of Ruben. Change only the eyes: draw the upper eyelids half-closed, as in the middle of a blink. Do not change anything else: same face, hair, clothes, pose, framing, pixel size, colors and flat magenta (#FF00FF) background. Output at the same size as the input.
```

```text
Edit the attached portrait of Ruben. Change only the eyes: draw them fully closed, as in a blink, with a simple dark eyelid line and the lashes in the same color as the existing eye outline. Do not change anything else: same face, hair, clothes, pose, framing, pixel size, colors and flat magenta (#FF00FF) background. Output at the same size as the input.
```

### Ivo — Fitness

Attach: `portrait-ivo.png` + the map reference crop.

**Sprite sheet (12 directions)**

```text
Using the attached portrait as the character reference and the attached map crop as the style reference, draw a 12-direction character sprite sheet of Ivo.

Character (keep this likeness exactly, same face, hair, colors and clothes as the portrait): a tall, athletic young man with a big confident grin. Tousled black hair, a rust-red headband, tanned skin, muscular bare arms. Sleeveless teal shirt with frayed armholes and an open collar, a studded brown leather wristband on his right wrist. Brown trousers, laced boots.

Style: 16-bit SNES-era RPG pixel art that matches the map: crisp dark outlines, limited warm palette, no anti-aliasing, no gradients, no blur, light from the upper left. A small chibi map sprite, about 2.5 heads tall, as seen from a top-down three-quarter camera (the camera looks down at about 45 degrees, like the map). Big readable shapes so the likeness survives at about 32 pixels tall: hair shape, facial hair, headwear and clothing colors matter most.

Layout: one image, a 4 × 3 grid of 12 equal cells on a flat, pure magenta (#FF00FF) background, no grid lines, no shadows on the ground, no text or labels. The same character, standing still in a relaxed idle pose, at exactly the same size and with the feet on the same baseline in every cell. The character turns in 30-degree steps, counter-clockwise, starting by facing the viewer:
Row 1: (1) facing the viewer; (2) turned 30° toward the left side of the image; (3) turned 60° toward the left, mostly side-on with a little of the face visible; (4) full side profile facing left.
Row 2: (5) turned 120°: facing away and to the left, back of the shoulder showing, a sliver of the cheek; (6) turned 150°: almost back view, turned slightly left; (7) back to the viewer; (8) almost back view, turned slightly right.
Row 3: (9) facing away and to the right, back of the shoulder showing; (10) full side profile facing right; (11) mostly side-on facing right with a little of the face visible; (12) turned 30° toward the right side of the image.

Keep the wristband on his right wrist on the same side of the body in every direction; do not mirror the character.
```

**Blink (2 edits of the portrait)**

```text
Edit the attached portrait of Ivo. Change only the eyes: draw the upper eyelids half-closed, as in the middle of a blink. Do not change anything else: same face, hair, clothes, pose, framing, pixel size, colors and flat magenta (#FF00FF) background. Output at the same size as the input.
```

```text
Edit the attached portrait of Ivo. Change only the eyes: draw them fully closed, as in a blink, with a simple dark eyelid line and the lashes in the same color as the existing eye outline. Do not change anything else: same face, hair, clothes, pose, framing, pixel size, colors and flat magenta (#FF00FF) background. Output at the same size as the input.
```

### Yara — Nutrition

Attach: `portrait-yara.png` + the map reference crop.

**Sprite sheet (12 directions)**

```text
Using the attached portrait as the character reference and the attached map crop as the style reference, draw a 12-direction character sprite sheet of Yara.

Character (keep this likeness exactly, same face, hair, colors and clothes as the portrait): a short, sturdy older woman with rosy cheeks and a practical smile. Grey hair under a rust-orange headscarf knotted at the back. Dark green long-sleeved dress, an off-white apron with a front pocket that has green herbs sticking out of it. Brown shoes.

Style: 16-bit SNES-era RPG pixel art that matches the map: crisp dark outlines, limited warm palette, no anti-aliasing, no gradients, no blur, light from the upper left. A small chibi map sprite, about 2.5 heads tall, as seen from a top-down three-quarter camera (the camera looks down at about 45 degrees, like the map). Big readable shapes so the likeness survives at about 32 pixels tall: hair shape, facial hair, headwear and clothing colors matter most.

Layout: one image, a 4 × 3 grid of 12 equal cells on a flat, pure magenta (#FF00FF) background, no grid lines, no shadows on the ground, no text or labels. The same character, standing still in a relaxed idle pose, at exactly the same size and with the feet on the same baseline in every cell. The character turns in 30-degree steps, counter-clockwise, starting by facing the viewer:
Row 1: (1) facing the viewer; (2) turned 30° toward the left side of the image; (3) turned 60° toward the left, mostly side-on with a little of the face visible; (4) full side profile facing left.
Row 2: (5) turned 120°: facing away and to the left, back of the shoulder showing, a sliver of the cheek; (6) turned 150°: almost back view, turned slightly left; (7) back to the viewer; (8) almost back view, turned slightly right.
Row 3: (9) facing away and to the right, back of the shoulder showing; (10) full side profile facing right; (11) mostly side-on facing right with a little of the face visible; (12) turned 30° toward the right side of the image.

Keep the herbs in the apron pocket and the headscarf knot at the back on the same side of the body in every direction; do not mirror the character.
```

**Blink (2 edits of the portrait)**

```text
Edit the attached portrait of Yara. Change only the eyes: draw the upper eyelids half-closed, as in the middle of a blink. Do not change anything else: same face, hair, clothes, pose, framing, pixel size, colors and flat magenta (#FF00FF) background. Output at the same size as the input.
```

```text
Edit the attached portrait of Yara. Change only the eyes: draw them fully closed, as in a blink, with a simple dark eyelid line and the lashes in the same color as the existing eye outline. Do not change anything else: same face, hair, clothes, pose, framing, pixel size, colors and flat magenta (#FF00FF) background. Output at the same size as the input.
```

### Maarten — Education

Attach: `portrait-maarten.png` + the map reference crop.

**Sprite sheet (12 directions)**

```text
Using the attached portrait as the character reference and the attached map crop as the style reference, draw a 12-direction character sprite sheet of Maarten.

Character (keep this likeness exactly, same face, hair, colors and clothes as the portrait): a tall, lanky older man. Wild, spiky grey hair, bushy dark-grey eyebrows, a lean lined face, round spectacles pushed up onto his forehead. Long dark navy-charcoal professor's coat with a high collar and a few ink stains, white shirt underneath. Dark trousers, brown shoes.

Style: 16-bit SNES-era RPG pixel art that matches the map: crisp dark outlines, limited warm palette, no anti-aliasing, no gradients, no blur, light from the upper left. A small chibi map sprite, about 2.5 heads tall, as seen from a top-down three-quarter camera (the camera looks down at about 45 degrees, like the map). Big readable shapes so the likeness survives at about 32 pixels tall: hair shape, facial hair, headwear and clothing colors matter most.

Layout: one image, a 4 × 3 grid of 12 equal cells on a flat, pure magenta (#FF00FF) background, no grid lines, no shadows on the ground, no text or labels. The same character, standing still in a relaxed idle pose, at exactly the same size and with the feet on the same baseline in every cell. The character turns in 30-degree steps, counter-clockwise, starting by facing the viewer:
Row 1: (1) facing the viewer; (2) turned 30° toward the left side of the image; (3) turned 60° toward the left, mostly side-on with a little of the face visible; (4) full side profile facing left.
Row 2: (5) turned 120°: facing away and to the left, back of the shoulder showing, a sliver of the cheek; (6) turned 150°: almost back view, turned slightly left; (7) back to the viewer; (8) almost back view, turned slightly right.
Row 3: (9) facing away and to the right, back of the shoulder showing; (10) full side profile facing right; (11) mostly side-on facing right with a little of the face visible; (12) turned 30° toward the right side of the image.

Keep the spectacles on his forehead and the wild hair on the same side of the body in every direction; do not mirror the character.
```

**Blink (2 edits of the portrait)**

```text
Edit the attached portrait of Maarten. Change only the eyes: draw the upper eyelids half-closed, as in the middle of a blink. Do not change anything else: same face, hair, clothes, pose, framing, pixel size, colors and flat magenta (#FF00FF) background. Output at the same size as the input.
```

```text
Edit the attached portrait of Maarten. Change only the eyes: draw them fully closed, as in a blink, with a simple dark eyelid line and the lashes in the same color as the existing eye outline. Do not change anything else: same face, hair, clothes, pose, framing, pixel size, colors and flat magenta (#FF00FF) background. Output at the same size as the input.
```

### Liv — Languages

Attach: `portrait-liv.png` + the map reference crop.

**Sprite sheet (12 directions)**

```text
Using the attached portrait as the character reference and the attached map crop as the style reference, draw a 12-direction character sprite sheet of Liv.

Character (keep this likeness exactly, same face, hair, colors and clothes as the portrait): a tall young woman with a dry, knowing half-smile. Long golden-blonde hair with small braids at the temples and one thick braid falling over her right shoulder to her waist. Dark green cloak with a thick cream fur collar, a small round rune pendant on a cord. Brown leather boots.

Style: 16-bit SNES-era RPG pixel art that matches the map: crisp dark outlines, limited warm palette, no anti-aliasing, no gradients, no blur, light from the upper left. A small chibi map sprite, about 2.5 heads tall, as seen from a top-down three-quarter camera (the camera looks down at about 45 degrees, like the map). Big readable shapes so the likeness survives at about 32 pixels tall: hair shape, facial hair, headwear and clothing colors matter most.

Layout: one image, a 4 × 3 grid of 12 equal cells on a flat, pure magenta (#FF00FF) background, no grid lines, no shadows on the ground, no text or labels. The same character, standing still in a relaxed idle pose, at exactly the same size and with the feet on the same baseline in every cell. The character turns in 30-degree steps, counter-clockwise, starting by facing the viewer:
Row 1: (1) facing the viewer; (2) turned 30° toward the left side of the image; (3) turned 60° toward the left, mostly side-on with a little of the face visible; (4) full side profile facing left.
Row 2: (5) turned 120°: facing away and to the left, back of the shoulder showing, a sliver of the cheek; (6) turned 150°: almost back view, turned slightly left; (7) back to the viewer; (8) almost back view, turned slightly right.
Row 3: (9) facing away and to the right, back of the shoulder showing; (10) full side profile facing right; (11) mostly side-on facing right with a little of the face visible; (12) turned 30° toward the right side of the image.

Keep the long braid over her right shoulder on the same side of the body in every direction; do not mirror the character.
```

**Blink (2 edits of the portrait)**

```text
Edit the attached portrait of Liv. Change only the eyes: draw the upper eyelids half-closed, as in the middle of a blink. Do not change anything else: same face, hair, clothes, pose, framing, pixel size, colors and flat magenta (#FF00FF) background. Output at the same size as the input.
```

```text
Edit the attached portrait of Liv. Change only the eyes: draw them fully closed, as in a blink, with a simple dark eyelid line and the lashes in the same color as the existing eye outline. Do not change anything else: same face, hair, clothes, pose, framing, pixel size, colors and flat magenta (#FF00FF) background. Output at the same size as the input.
```

### Gisela — Relationships

Attach: `portrait-gisela.png` + the map reference crop.

**Sprite sheet (12 directions)**

```text
Using the attached portrait as the character reference and the attached map crop as the style reference, draw a 12-direction character sprite sheet of Gisela.

Character (keep this likeness exactly, same face, hair, colors and clothes as the portrait): a short older woman with a warm smile and rosy cheeks. Grey hair loosely tied back with a few strands loose. A rust-red and brown knitted shawl around her shoulders over a grey-green dress. Brown shoes.

Style: 16-bit SNES-era RPG pixel art that matches the map: crisp dark outlines, limited warm palette, no anti-aliasing, no gradients, no blur, light from the upper left. A small chibi map sprite, about 2.5 heads tall, as seen from a top-down three-quarter camera (the camera looks down at about 45 degrees, like the map). Big readable shapes so the likeness survives at about 32 pixels tall: hair shape, facial hair, headwear and clothing colors matter most.

Layout: one image, a 4 × 3 grid of 12 equal cells on a flat, pure magenta (#FF00FF) background, no grid lines, no shadows on the ground, no text or labels. The same character, standing still in a relaxed idle pose, at exactly the same size and with the feet on the same baseline in every cell. The character turns in 30-degree steps, counter-clockwise, starting by facing the viewer:
Row 1: (1) facing the viewer; (2) turned 30° toward the left side of the image; (3) turned 60° toward the left, mostly side-on with a little of the face visible; (4) full side profile facing left.
Row 2: (5) turned 120°: facing away and to the left, back of the shoulder showing, a sliver of the cheek; (6) turned 150°: almost back view, turned slightly left; (7) back to the viewer; (8) almost back view, turned slightly right.
Row 3: (9) facing away and to the right, back of the shoulder showing; (10) full side profile facing right; (11) mostly side-on facing right with a little of the face visible; (12) turned 30° toward the right side of the image.

Keep the knitted shawl on the same side of the body in every direction; do not mirror the character.
```

**Blink (2 edits of the portrait)**

```text
Edit the attached portrait of Gisela. Change only the eyes: draw the upper eyelids half-closed, as in the middle of a blink. Do not change anything else: same face, hair, clothes, pose, framing, pixel size, colors and flat magenta (#FF00FF) background. Output at the same size as the input.
```

```text
Edit the attached portrait of Gisela. Change only the eyes: draw them fully closed, as in a blink, with a simple dark eyelid line and the lashes in the same color as the existing eye outline. Do not change anything else: same face, hair, clothes, pose, framing, pixel size, colors and flat magenta (#FF00FF) background. Output at the same size as the input.
```

### Elvin — Home & family

Attach: `portrait-elvin.png` + the map reference crop.

**Sprite sheet (12 directions)**

```text
Using the attached portrait as the character reference and the attached map crop as the style reference, draw a 12-direction character sprite sheet of Elvin.

Character (keep this likeness exactly, same face, hair, colors and clothes as the portrait): a sturdy middle-aged man with weathered tanned skin. Dark grey flat cap, salt-and-pepper beard. Cream short-sleeved henley shirt with the sleeves rolled up, a dark brown leather work apron with shoulder straps, rivets and a front pocket. Brown trousers, work boots.

Style: 16-bit SNES-era RPG pixel art that matches the map: crisp dark outlines, limited warm palette, no anti-aliasing, no gradients, no blur, light from the upper left. A small chibi map sprite, about 2.5 heads tall, as seen from a top-down three-quarter camera (the camera looks down at about 45 degrees, like the map). Big readable shapes so the likeness survives at about 32 pixels tall: hair shape, facial hair, headwear and clothing colors matter most.

Layout: one image, a 4 × 3 grid of 12 equal cells on a flat, pure magenta (#FF00FF) background, no grid lines, no shadows on the ground, no text or labels. The same character, standing still in a relaxed idle pose, at exactly the same size and with the feet on the same baseline in every cell. The character turns in 30-degree steps, counter-clockwise, starting by facing the viewer:
Row 1: (1) facing the viewer; (2) turned 30° toward the left side of the image; (3) turned 60° toward the left, mostly side-on with a little of the face visible; (4) full side profile facing left.
Row 2: (5) turned 120°: facing away and to the left, back of the shoulder showing, a sliver of the cheek; (6) turned 150°: almost back view, turned slightly left; (7) back to the viewer; (8) almost back view, turned slightly right.
Row 3: (9) facing away and to the right, back of the shoulder showing; (10) full side profile facing right; (11) mostly side-on facing right with a little of the face visible; (12) turned 30° toward the right side of the image.

Keep the flat cap and the leather work apron on the same side of the body in every direction; do not mirror the character.
```

**Blink (2 edits of the portrait)**

```text
Edit the attached portrait of Elvin. Change only the eyes: draw the upper eyelids half-closed, as in the middle of a blink. Do not change anything else: same face, hair, clothes, pose, framing, pixel size, colors and flat magenta (#FF00FF) background. Output at the same size as the input.
```

```text
Edit the attached portrait of Elvin. Change only the eyes: draw them fully closed, as in a blink, with a simple dark eyelid line and the lashes in the same color as the existing eye outline. Do not change anything else: same face, hair, clothes, pose, framing, pixel size, colors and flat magenta (#FF00FF) background. Output at the same size as the input.
```

