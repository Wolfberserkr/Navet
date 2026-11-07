# Walk-cycle prompts (Gemini)

Walking frames for the map sprites: 3 frames in each of the 12 directions, for Rick and all nine residents. Make each character's 12-direction standing sheet first (`docs/sprites/prompts.md`); the walk cycle is drawn from it.

## How it works

- **One chat per character.** Paste that character's setup prompt (below) with its three attachments, wait for "Ready", then send the 12 direction prompts one at a time. Keeping it in one chat helps Gemini keep the character the same across all 12 strips.
- **Each answer is one strip of 3 frames:** left stride, passing, right stride. The village plays them as stride → passing → stride → passing, so 3 drawings make a smooth 4-step loop. Running (Shift) plays the same frames faster.
- **Per character:** 12 strips × 3 frames = 36 frames. The standing pose is the cell from the 12-direction sheet.
- **If a strip drifts** (different size, colors, or face), say: "Redo this one; match the sprite sheet exactly: same size, colors and proportions." If the character starts drifting after many strips, start a new chat with the setup prompt and carry on from the next direction.
- **Save each strip** named by character and direction number, e.g. `walk-rick-01.png` … `walk-rick-12.png`, so I can slice and line them up in a script. Gemini's pixels aren't on a true grid; I'll downscale, snap colors, key out the magenta and align the feet.

## Setup prompts

### Rick — the player, chief human officer

Attach: `portrait-rick.png`, Rick's finished 12-direction sheet, and the map reference crop.

```text
We're going to make walk-cycle frames for Rick, one direction at a time. The first attached image is his portrait (the likeness), the second is his finished 12-direction sprite sheet (the exact sprite to animate: same size, proportions, colors and outline), and the third is a crop of the village map (the style).

Character: a man in his thirties, average height and build. Short black hair, warm medium-brown skin, a short dark beard along the jaw and chin. Dark navy double-breasted watchman's coat with a high collar and brass buttons, worn open over a dark grey shirt. A brown leather strap runs across his chest from his left shoulder to his right hip, where a brass spyglass hangs. Brown belt with a silver buckle, dark trousers, brown boots. No hat.

Rules for every image I ask for in this chat:
- 16-bit SNES-era RPG pixel art, crisp dark outlines, no anti-aliasing, no gradients, no blur, light from the upper left. Exactly the same sprite as the 12-direction sheet; only the arms and legs move.
- One image, a row of 3 equal cells, left to right, on a flat, pure magenta (#FF00FF) background, no grid lines, no ground shadow, no text.
- Cell 1: mid-stride, the character's left leg forward and right arm forward. Cell 2: passing pose, legs together under the body, the body one pixel higher. Cell 3: mid-stride, the right leg forward and left arm forward.
- A relaxed, steady walking pace; the head and torso stay level apart from that one-pixel bob. The feet sit on the same baseline in all three cells, and the character is the same size as in the sheet.
- Keep the brass spyglass on his right hip and the chest strap on the same side of the body; never mirror the character.

Reply "Ready" and wait for me to name the direction.
```

### Rhod — chief of staff

Attach: `portrait-rhod.png`, Rhod's finished 12-direction sheet, and the map reference crop.

```text
We're going to make walk-cycle frames for Rhod, one direction at a time. The first attached image is his portrait (the likeness), the second is his finished 12-direction sprite sheet (the exact sprite to animate: same size, proportions, colors and outline), and the third is a crop of the village map (the style).

Character: a stocky, broad-shouldered man in his thirties, a little shorter and heavier than Rick. Short black hair, warm medium-brown skin, full short black beard and moustache. Open brown leather vest over a cream long-sleeved shirt with a laced collar, sleeves pushed up. Brown belt, dark brown trousers, boots.

Rules for every image I ask for in this chat:
- 16-bit SNES-era RPG pixel art, crisp dark outlines, no anti-aliasing, no gradients, no blur, light from the upper left. Exactly the same sprite as the 12-direction sheet; only the arms and legs move.
- One image, a row of 3 equal cells, left to right, on a flat, pure magenta (#FF00FF) background, no grid lines, no ground shadow, no text.
- Cell 1: mid-stride, the character's left leg forward and right arm forward. Cell 2: passing pose, legs together under the body, the body one pixel higher. Cell 3: mid-stride, the right leg forward and left arm forward.
- A relaxed, steady walking pace; the head and torso stay level apart from that one-pixel bob. The feet sit on the same baseline in all three cells, and the character is the same size as in the sheet.
- Keep the open brown leather vest on the same side of the body; never mirror the character.

Reply "Ready" and wait for me to name the direction.
```

### Marisol — Inbox & Calendar

Attach: `portrait-marisol.png`, Marisol's finished 12-direction sheet, and the map reference crop.

```text
We're going to make walk-cycle frames for Marisol, one direction at a time. The first attached image is her portrait (the likeness), the second is her finished 12-direction sprite sheet (the exact sprite to animate: same size, proportions, colors and outline), and the third is a crop of the village map (the style).

Character: a slim young woman. Warm tan-brown skin, dark curly hair piled into a loose bun with a white quill feather tucked into it. Mustard-yellow long dress with a cream lace neckline, a brown leather satchel on a strap across her chest from her right shoulder, the bag resting on her left hip.

Rules for every image I ask for in this chat:
- 16-bit SNES-era RPG pixel art, crisp dark outlines, no anti-aliasing, no gradients, no blur, light from the upper left. Exactly the same sprite as the 12-direction sheet; only the arms and legs move.
- One image, a row of 3 equal cells, left to right, on a flat, pure magenta (#FF00FF) background, no grid lines, no ground shadow, no text.
- Cell 1: mid-stride, the character's left leg forward and right arm forward. Cell 2: passing pose, legs together under the body, the body one pixel higher. Cell 3: mid-stride, the right leg forward and left arm forward.
- A relaxed, steady walking pace; the head and torso stay level apart from that one-pixel bob. The feet sit on the same baseline in all three cells, and the character is the same size as in the sheet.
- Keep the satchel on her left hip and the quill in her hair on the same side of the body; never mirror the character.

Reply "Ready" and wait for me to name the direction.
```

### Ruben — Finance

Attach: `portrait-ruben.png`, Ruben's finished 12-direction sheet, and the map reference crop.

```text
We're going to make walk-cycle frames for Ruben, one direction at a time. The first attached image is his portrait (the likeness), the second is his finished 12-direction sprite sheet (the exact sprite to animate: same size, proportions, colors and outline), and the third is a crop of the village map (the style).

Character: an elderly man, slight and a little stooped. Swept-back white hair, white moustache, small round gold wire spectacles, fair skin. Dark green waistcoat over a white high-collared shirt, a gold pocket-watch chain across the waistcoat. Dark grey trousers, polished black shoes.

Rules for every image I ask for in this chat:
- 16-bit SNES-era RPG pixel art, crisp dark outlines, no anti-aliasing, no gradients, no blur, light from the upper left. Exactly the same sprite as the 12-direction sheet; only the arms and legs move.
- One image, a row of 3 equal cells, left to right, on a flat, pure magenta (#FF00FF) background, no grid lines, no ground shadow, no text.
- Cell 1: mid-stride, the character's left leg forward and right arm forward. Cell 2: passing pose, legs together under the body, the body one pixel higher. Cell 3: mid-stride, the right leg forward and left arm forward.
- A relaxed, steady walking pace; the head and torso stay level apart from that one-pixel bob. The feet sit on the same baseline in all three cells, and the character is the same size as in the sheet.
- Keep the watch chain on the waistcoat on the same side of the body; never mirror the character.

Reply "Ready" and wait for me to name the direction.
```

### Ivo — Fitness

Attach: `portrait-ivo.png`, Ivo's finished 12-direction sheet, and the map reference crop.

```text
We're going to make walk-cycle frames for Ivo, one direction at a time. The first attached image is his portrait (the likeness), the second is his finished 12-direction sprite sheet (the exact sprite to animate: same size, proportions, colors and outline), and the third is a crop of the village map (the style).

Character: a tall, athletic young man with a big confident grin. Tousled black hair, a rust-red headband, tanned skin, muscular bare arms. Sleeveless teal shirt with frayed armholes and an open collar, a studded brown leather wristband on his right wrist. Brown trousers, laced boots.

Rules for every image I ask for in this chat:
- 16-bit SNES-era RPG pixel art, crisp dark outlines, no anti-aliasing, no gradients, no blur, light from the upper left. Exactly the same sprite as the 12-direction sheet; only the arms and legs move.
- One image, a row of 3 equal cells, left to right, on a flat, pure magenta (#FF00FF) background, no grid lines, no ground shadow, no text.
- Cell 1: mid-stride, the character's left leg forward and right arm forward. Cell 2: passing pose, legs together under the body, the body one pixel higher. Cell 3: mid-stride, the right leg forward and left arm forward.
- A relaxed, steady walking pace; the head and torso stay level apart from that one-pixel bob. The feet sit on the same baseline in all three cells, and the character is the same size as in the sheet.
- Keep the wristband on his right wrist on the same side of the body; never mirror the character.

Reply "Ready" and wait for me to name the direction.
```

### Yara — Nutrition

Attach: `portrait-yara.png`, Yara's finished 12-direction sheet, and the map reference crop.

```text
We're going to make walk-cycle frames for Yara, one direction at a time. The first attached image is her portrait (the likeness), the second is her finished 12-direction sprite sheet (the exact sprite to animate: same size, proportions, colors and outline), and the third is a crop of the village map (the style).

Character: a short, sturdy older woman with rosy cheeks and a practical smile. Grey hair under a rust-orange headscarf knotted at the back. Dark green long-sleeved dress, an off-white apron with a front pocket that has green herbs sticking out of it. Brown shoes.

Rules for every image I ask for in this chat:
- 16-bit SNES-era RPG pixel art, crisp dark outlines, no anti-aliasing, no gradients, no blur, light from the upper left. Exactly the same sprite as the 12-direction sheet; only the arms and legs move.
- One image, a row of 3 equal cells, left to right, on a flat, pure magenta (#FF00FF) background, no grid lines, no ground shadow, no text.
- Cell 1: mid-stride, the character's left leg forward and right arm forward. Cell 2: passing pose, legs together under the body, the body one pixel higher. Cell 3: mid-stride, the right leg forward and left arm forward.
- A relaxed, steady walking pace; the head and torso stay level apart from that one-pixel bob. The feet sit on the same baseline in all three cells, and the character is the same size as in the sheet.
- Keep the herbs in the apron pocket and the headscarf knot at the back on the same side of the body; never mirror the character.

Reply "Ready" and wait for me to name the direction.
```

### Maarten — Education

Attach: `portrait-maarten.png`, Maarten's finished 12-direction sheet, and the map reference crop.

```text
We're going to make walk-cycle frames for Maarten, one direction at a time. The first attached image is his portrait (the likeness), the second is his finished 12-direction sprite sheet (the exact sprite to animate: same size, proportions, colors and outline), and the third is a crop of the village map (the style).

Character: a tall, lanky older man. Wild, spiky grey hair, bushy dark-grey eyebrows, a lean lined face, round spectacles pushed up onto his forehead. Long dark navy-charcoal professor's coat with a high collar and a few ink stains, white shirt underneath. Dark trousers, brown shoes.

Rules for every image I ask for in this chat:
- 16-bit SNES-era RPG pixel art, crisp dark outlines, no anti-aliasing, no gradients, no blur, light from the upper left. Exactly the same sprite as the 12-direction sheet; only the arms and legs move.
- One image, a row of 3 equal cells, left to right, on a flat, pure magenta (#FF00FF) background, no grid lines, no ground shadow, no text.
- Cell 1: mid-stride, the character's left leg forward and right arm forward. Cell 2: passing pose, legs together under the body, the body one pixel higher. Cell 3: mid-stride, the right leg forward and left arm forward.
- A relaxed, steady walking pace; the head and torso stay level apart from that one-pixel bob. The feet sit on the same baseline in all three cells, and the character is the same size as in the sheet.
- Keep the spectacles on his forehead and the wild hair on the same side of the body; never mirror the character.

Reply "Ready" and wait for me to name the direction.
```

### Liv — Languages

Attach: `portrait-liv.png`, Liv's finished 12-direction sheet, and the map reference crop.

```text
We're going to make walk-cycle frames for Liv, one direction at a time. The first attached image is her portrait (the likeness), the second is her finished 12-direction sprite sheet (the exact sprite to animate: same size, proportions, colors and outline), and the third is a crop of the village map (the style).

Character: a tall young woman with a dry, knowing half-smile. Long golden-blonde hair with small braids at the temples and one thick braid falling over her right shoulder to her waist. Dark green cloak with a thick cream fur collar, a small round rune pendant on a cord. Brown leather boots.

Rules for every image I ask for in this chat:
- 16-bit SNES-era RPG pixel art, crisp dark outlines, no anti-aliasing, no gradients, no blur, light from the upper left. Exactly the same sprite as the 12-direction sheet; only the arms and legs move.
- One image, a row of 3 equal cells, left to right, on a flat, pure magenta (#FF00FF) background, no grid lines, no ground shadow, no text.
- Cell 1: mid-stride, the character's left leg forward and right arm forward. Cell 2: passing pose, legs together under the body, the body one pixel higher. Cell 3: mid-stride, the right leg forward and left arm forward.
- A relaxed, steady walking pace; the head and torso stay level apart from that one-pixel bob. The feet sit on the same baseline in all three cells, and the character is the same size as in the sheet.
- Keep the long braid over her right shoulder on the same side of the body; never mirror the character.

Reply "Ready" and wait for me to name the direction.
```

### Gisela — Relationships

Attach: `portrait-gisela.png`, Gisela's finished 12-direction sheet, and the map reference crop.

```text
We're going to make walk-cycle frames for Gisela, one direction at a time. The first attached image is her portrait (the likeness), the second is her finished 12-direction sprite sheet (the exact sprite to animate: same size, proportions, colors and outline), and the third is a crop of the village map (the style).

Character: a short older woman with a warm smile and rosy cheeks. Grey hair loosely tied back with a few strands loose. A rust-red and brown knitted shawl around her shoulders over a grey-green dress. Brown shoes.

Rules for every image I ask for in this chat:
- 16-bit SNES-era RPG pixel art, crisp dark outlines, no anti-aliasing, no gradients, no blur, light from the upper left. Exactly the same sprite as the 12-direction sheet; only the arms and legs move.
- One image, a row of 3 equal cells, left to right, on a flat, pure magenta (#FF00FF) background, no grid lines, no ground shadow, no text.
- Cell 1: mid-stride, the character's left leg forward and right arm forward. Cell 2: passing pose, legs together under the body, the body one pixel higher. Cell 3: mid-stride, the right leg forward and left arm forward.
- A relaxed, steady walking pace; the head and torso stay level apart from that one-pixel bob. The feet sit on the same baseline in all three cells, and the character is the same size as in the sheet.
- Keep the knitted shawl on the same side of the body; never mirror the character.

Reply "Ready" and wait for me to name the direction.
```

### Elvin — Home & family

Attach: `portrait-elvin.png`, Elvin's finished 12-direction sheet, and the map reference crop.

```text
We're going to make walk-cycle frames for Elvin, one direction at a time. The first attached image is his portrait (the likeness), the second is his finished 12-direction sprite sheet (the exact sprite to animate: same size, proportions, colors and outline), and the third is a crop of the village map (the style).

Character: a sturdy middle-aged man with weathered tanned skin. Dark grey flat cap, salt-and-pepper beard. Cream short-sleeved henley shirt with the sleeves rolled up, a dark brown leather work apron with shoulder straps, rivets and a front pocket. Brown trousers, work boots.

Rules for every image I ask for in this chat:
- 16-bit SNES-era RPG pixel art, crisp dark outlines, no anti-aliasing, no gradients, no blur, light from the upper left. Exactly the same sprite as the 12-direction sheet; only the arms and legs move.
- One image, a row of 3 equal cells, left to right, on a flat, pure magenta (#FF00FF) background, no grid lines, no ground shadow, no text.
- Cell 1: mid-stride, the character's left leg forward and right arm forward. Cell 2: passing pose, legs together under the body, the body one pixel higher. Cell 3: mid-stride, the right leg forward and left arm forward.
- A relaxed, steady walking pace; the head and torso stay level apart from that one-pixel bob. The feet sit on the same baseline in all three cells, and the character is the same size as in the sheet.
- Keep the flat cap and the leather work apron on the same side of the body; never mirror the character.

Reply "Ready" and wait for me to name the direction.
```


## Direction prompts

Same for every character. Send them one at a time, after "Ready". The numbers match the cells of the 12-direction sheet.

```text
Direction 1: facing the viewer, walking toward the bottom of the image. Match cell 1 of the sheet.
```

```text
Direction 2: turned 30° toward the left side of the image, walking down and slightly left. Match cell 2 of the sheet.
```

```text
Direction 3: turned 60° toward the left, mostly side-on with a little of the face visible, walking left and slightly down. Match cell 3 of the sheet.
```

```text
Direction 4: full side profile facing left, walking toward the left. Match cell 4 of the sheet.
```

```text
Direction 5: turned 120°, facing away and to the left, back of the shoulder showing, walking up and to the left. Match cell 5 of the sheet.
```

```text
Direction 6: almost back view, turned slightly left, walking up and slightly left. Match cell 6 of the sheet.
```

```text
Direction 7: back to the viewer, walking toward the top of the image. Match cell 7 of the sheet.
```

```text
Direction 8: almost back view, turned slightly right, walking up and slightly right. Match cell 8 of the sheet.
```

```text
Direction 9: facing away and to the right, back of the shoulder showing, walking up and to the right. Match cell 9 of the sheet.
```

```text
Direction 10: full side profile facing right, walking toward the right. Match cell 10 of the sheet.
```

```text
Direction 11: mostly side-on facing right with a little of the face visible, walking right and slightly down. Match cell 11 of the sheet.
```

```text
Direction 12: turned 30° toward the right side of the image, walking down and slightly right. Match cell 12 of the sheet.
```
