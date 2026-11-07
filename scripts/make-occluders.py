"""Build src/data/occluders.png (+ occluders.ts): pixel-exact cutouts of everything
Rick can walk behind.

Each object gets a rough region (measured on a 2000x1116 copy of the map, scaled
to 2576x1438). Inside that region, ground (grass, cobbles, dirt) is flood-filled
in from the region's edge; what the flood can't reach is the object. See the
kinds and depth modes above OBJECTS.

Output: an 8-bit grayscale PNG the size of the map. Pixel value = index + 1 of
the object in OBJECTS (0 = no object). The app reads it in src/game/occlusion.ts.

Run: python3 scripts/make-occluders.py [preview.png]   (needs Pillow and numpy)
"""
import colorsys
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

MAP = 'assets/map/village-map-v2.png'
OUT = 'src/data/occluders.png'
TS_OUT = 'src/data/occluders.ts'
K = 2576 / 2000

def R(x0, y0, x1, y1):
    return [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]

# (id, kind, depth, region in source px). Order matters: it is the index in the PNG.
#
# kind:  'auto'  ground is flood-filled away from the region's edge, holes filled
#        'open'  like auto, but enclosed ground (between stall legs) stays clear
#        'tree'  like auto, with a stricter grass rule (leaves are green too)
#        'shape' the region itself (stone buildings look like cobbles)
# depth: 'column'  a pixel is in front of Rick when its column's lowest object
#                  pixel is below his feet (buildings and stalls: follows sloped walls
#                  and leaves overhangs beside him alone)
#        'base'    the whole object is in front when its base is below his feet;
#                  the base is its lowest pixel, or the given y (signs hang on a wall)
OBJECTS = [
    ('maarten', 'auto', 'column', R(354, 186, 556, 392)),
    ('maarten-sign', 'auto', 388, R(546, 290, 600, 345)),
    ('marisol', 'auto', 'column', [(634, 395), (634, 190), (676, 170), (676, 128), (748, 128),
                                   (748, 170), (794, 190), (794, 395)]),
    ('rhod', 'shape', 'column', [(878, 386), (878, 95), (948, 95), (948, 40), (1000, 0),
                                 (1052, 40), (1052, 95), (1125, 95), (1125, 386)]),
    ('rhod-left', 'shape', 'column', R(848, 222, 940, 446)),
    ('rhod-right', 'shape', 'column', R(1058, 222, 1152, 446)),
    ('rhod-post', 'auto', 'base', R(1080, 414, 1106, 482)),
    ('ruben', 'shape', 'column', R(1226, 198, 1394, 392)),
    ('ruben-sign', 'auto', 392, R(1172, 292, 1228, 358)),
    ('yara-pot', 'auto', 392, R(1424, 300, 1470, 368)),
    ('yara', 'auto', 'column', [(1470, 395), (1466, 208), (1504, 208), (1504, 160), (1540, 160),
                                (1540, 208), (1696, 208), (1696, 395)]),
    ('ivo', 'auto', 'column', R(484, 428, 704, 615)),
    ('dummy', 'auto', 'base', R(440, 541, 496, 620)),
    ('banner-post', 'auto', 'base', R(782, 650, 818, 738)),
    ('stall-west', 'open', 'column', R(818, 660, 914, 794)),
    ('stall-1', 'open', 'column', R(1304, 458, 1406, 580)),
    # East stall without the crates and barrel in front of it.
    ('stall-2', 'open', 'column', [(1424, 458), (1530, 458), (1530, 526), (1513, 526), (1513, 555),
                                   (1487, 555), (1487, 595), (1424, 595)]),
    ('stall-2-crates', 'auto', 'base', R(1486, 526, 1550, 600)),
    ('flag', 'auto', 'base', R(804, 772, 912, 902)),
    ('fountain', 'auto', 'base', R(944, 528, 1066, 666)),
    ('liv', 'auto', 'column', [(506, 880), (506, 828), (540, 760), (546, 712), (562, 666),
                               (606, 666), (614, 690), (728, 588), (762, 594), (802, 700),
                               (812, 760), (808, 902), (760, 916), (700, 948), (640, 930)]),
    ('inn-sign', 'auto', 903, R(974, 830, 1030, 898)),
    ('gisela', 'auto', 'column', R(1026, 692, 1276, 906)),
    ('elvin', 'auto', 'column', [(1366, 702), (1368, 594), (1480, 586), (1612, 582), (1668, 690),
                                 (1668, 785), (1602, 846), (1530, 856), (1476, 848), (1428, 804),
                                 (1372, 772)]),
    # Base = foot of the trunk; the ground shadow under it is left out.
    ('tree-west', 'tree', 746, [(176, 640), (190, 610), (214, 597), (224, 584), (292, 584),
                                (304, 598), (322, 616), (330, 640), (330, 716), (284, 716),
                                (284, 746), (222, 746), (222, 716), (176, 716)]),
]

def is_ground(r, g, b, tree=False):
    h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    h *= 360
    if tree:
        if 60 <= h <= 85 and s >= 0.72 and l >= 0.14:  # bright flat grass only
            return True
        if 8 <= h <= 48 and s <= 0.34 and l >= 0.06:  # cobbles
            return True
        return False
    if 50 <= h <= 115 and s >= 0.25 and l >= 0.08:  # grass, incl. shadow
        return True
    if 8 <= h <= 48 and s <= 0.34 and 0.06 <= l <= 0.72:  # cobbles and their joints
        return True
    if 20 <= h <= 35 and 0.45 <= s <= 0.75 and 0.2 <= l <= 0.4:  # dirt
        return True
    if 185 <= h <= 235 and s >= 0.2:  # river
        return True
    return False

def is_grass(r, g, b):
    h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    return 50 <= h * 360 <= 115 and s >= 0.25 and l >= 0.08

def largest_piece(mask):
    """Keep the biggest 4-connected piece (drops slivers of path edges)."""
    img = Image.fromarray(mask.astype(np.uint8))  # 1 = object
    best, best_n, label = None, 0, 2
    for yy, xx in zip(*np.nonzero(mask)):
        if img.getpixel((int(xx), int(yy))) != 1:
            continue
        ImageDraw.floodfill(img, (int(xx), int(yy)), label)
        n = int((np.asarray(img) == label).sum())
        if n > best_n:
            best, best_n = label, n
        label += 1
        if label > 250:
            break
    return np.asarray(img) == best if best else mask

def build():
    img = Image.open(MAP).convert('RGB')
    W, H = img.size
    rgb = np.asarray(img)
    out = np.zeros((H, W), np.uint8)
    for idx, (oid, kind, depth, region) in enumerate(OBJECTS, start=1):
        poly = [(x * K, y * K) for x, y in region]
        reg_img = Image.new('L', (W, H), 0)
        ImageDraw.Draw(reg_img).polygon(poly, fill=1)
        reg = np.asarray(reg_img).astype(bool)
        ys, xs = np.nonzero(reg)
        y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        r = reg[y0:y1, x0:x1]
        if kind == 'shape':
            obj = r
        else:
            sub = rgb[y0:y1, x0:x1]
            ground = np.zeros(r.shape, bool)
            for yy in range(r.shape[0]):
                for xx in range(r.shape[1]):
                    if r[yy, xx]:
                        ground[yy, xx] = is_ground(*sub[yy, xx], tree=kind == 'tree')
            # Region edge: pixels in the region with a neighbour outside it.
            pad = np.pad(r, 1)
            inner = pad[1:-1, 1:-1] & pad[:-2, 1:-1] & pad[2:, 1:-1] & pad[1:-1, :-2] & pad[1:-1, 2:]
            reached = r & ~inner & ground
            while True:
                p = np.pad(reached, 1)
                grown = (p[1:-1, 1:-1] | p[:-2, 1:-1] | p[2:, 1:-1] | p[1:-1, :-2] | p[1:-1, 2:]) & ground
                if (grown == reached).all():
                    break
                reached = grown
            obj = r & ~reached
            # Drop specks, close pinholes, then fill holes.
            m = Image.fromarray((obj * 255).astype(np.uint8))
            m = m.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
            m = m.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
            if kind == 'open':  # keep the grass between stall legs see-through
                grass = np.zeros(r.shape, bool)
                for yy, xx in zip(*np.nonzero(r)):
                    grass[yy, xx] = is_grass(*sub[yy, xx])
                m = Image.fromarray((((np.asarray(m) > 0) & ~grass) * 255).astype(np.uint8))
                m = m.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
                o = out[y0:y1, x0:x1]
                o[(np.asarray(m) > 0) & r & (o == 0)] = idx
                continue
            # Holes = empty pixels not connected to the box's border.
            padded = Image.new('L', (m.width + 2, m.height + 2), 0)
            padded.paste(m, (1, 1))
            ImageDraw.floodfill(padded, (0, 0), 128)
            fa = np.asarray(padded)[1:-1, 1:-1]
            obj = ((np.asarray(m) > 0) | (fa == 0)) & r
            if kind == 'tree' or depth != 'column':
                obj = largest_piece(obj)
        o = out[y0:y1, x0:x1]
        o[obj & (o == 0)] = idx
    return out

def write_ts():
    lines = [
        '// Generated by scripts/make-occluders.py. Do not edit by hand.',
        '// One entry per object in src/data/occluders.png (pixel value = index + 1).',
        "// depth 'column': per-column test (buildings, stalls); a number: the object's",
        "// base in map px; 'base': its own lowest pixel.",
        "export type OccluderDepth = 'column' | 'base' | number;",
        '',
        'export const OCCLUDERS: { id: string; depth: OccluderDepth }[] = [',
    ]
    for oid, kind, depth, region in OBJECTS:
        d = f"'{depth}'" if isinstance(depth, str) else str(round(depth * K))
        lines.append(f"  {{ id: '{oid}', depth: {d} }},")
    lines.append('];')
    open(TS_OUT, 'w').write('\n'.join(lines) + '\n')

if __name__ == '__main__':
    out = build()
    Image.fromarray(out).save(OUT, optimize=True)
    write_ts()
    print('objects:', len(OBJECTS), 'pixels:', int((out > 0).sum()))
    if len(sys.argv) > 1:
        m = Image.open(MAP).convert('RGBA')
        tint = Image.new('RGBA', m.size, (255, 0, 255, 0))
        tint.putalpha(Image.fromarray(np.where(out > 0, 110, 0).astype(np.uint8)))
        Image.alpha_composite(m, tint).convert('RGB').save(sys.argv[1])
