"""Build src/data/occluders.png: pixel-exact cutouts of everything Rick can walk behind.

Each object gets a rough region (measured on a 2000x1116 copy of the map, scaled
to 2576x1438). Inside that region, ground (grass, cobbles, dirt) is flood-filled
in from the region's edge; what the flood can't reach is the object. Trees are
as green as the grass, and stone buildings look like cobbles, so those use their
hand-drawn outline as is ('shape'). 'open' objects (stalls) keep enclosed gaps.

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
K = 2576 / 2000

def R(x0, y0, x1, y1):
    return [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]

# (id, kind, region in source px). Order matters: it is the index in the PNG.
OBJECTS = [
    ('maarten', 'auto', [(354, 392), (354, 186), (556, 186), (556, 290), (600, 290), (600, 345),
                         (556, 345), (556, 392)]),
    ('marisol', 'auto', [(634, 395), (634, 190), (676, 170), (676, 128), (748, 128), (748, 170),
                         (794, 190), (794, 395)]),
    # Stone buildings: their stone looks like cobbles, so they use exact hand outlines.
    ('rhod', 'shape', [(878, 386), (878, 95), (948, 95), (948, 40), (1000, 0), (1052, 40),
                       (1052, 95), (1125, 95), (1125, 386)]),
    ('rhod-left', 'shape', R(848, 222, 940, 446)),
    ('rhod-right', 'shape', R(1058, 222, 1152, 446)),
    ('rhod-post', 'auto', R(1080, 414, 1106, 482)),
    ('ruben', 'shape', R(1226, 198, 1394, 392)),
    ('ruben-sign', 'auto', R(1172, 292, 1228, 358)),
    ('yara', 'auto', [(1424, 395), (1424, 300), (1466, 300), (1466, 208), (1504, 208), (1504, 160),
                      (1540, 160), (1540, 208), (1696, 208), (1696, 395)]),
    ('ivo', 'auto', R(484, 428, 704, 615)),
    ('dummy', 'auto', R(440, 541, 496, 620)),
    ('stall-west', 'open', R(806, 660, 914, 794)),
    ('stall-1', 'open', R(1304, 458, 1406, 580)),
    ('stall-2', 'open', R(1424, 458, 1552, 586)),
    ('banner-post', 'auto', R(782, 650, 818, 738)),
    ('flag', 'auto', R(804, 772, 912, 902)),
    ('fountain', 'auto', R(944, 528, 1066, 666)),
    ('liv', 'auto', [(506, 880), (506, 828), (540, 760), (580, 700), (728, 588), (762, 594),
                     (802, 700), (812, 760), (808, 902), (760, 916), (700, 948), (640, 930)]),
    ('gisela', 'auto', R(974, 692, 1276, 906)),
    ('elvin', 'auto', [(1366, 702), (1368, 594), (1480, 586), (1612, 582), (1668, 690),
                       (1668, 785), (1602, 846), (1530, 856), (1476, 848), (1428, 804),
                       (1372, 772)]),
    # Trees: hand outline.
    ('tree-west', 'shape', [(198, 598), (240, 586), (290, 590), (318, 612), (326, 652),
                            (318, 690), (292, 712), (286, 748), (262, 756), (226, 750),
                            (222, 720), (196, 704), (182, 668), (184, 624)]),
]

def is_ground(r, g, b):
    h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    h *= 360
    if 50 <= h <= 115 and s >= 0.25 and l >= 0.08:  # grass, incl. shadow
        return True
    if 8 <= h <= 48 and s <= 0.34 and 0.06 <= l <= 0.72:  # cobbles and their joints
        return True
    if 20 <= h <= 35 and 0.45 <= s <= 0.75 and 0.2 <= l <= 0.4:  # dirt
        return True
    if 185 <= h <= 235 and s >= 0.2:  # river
        return True
    return False

def build():
    img = Image.open(MAP).convert('RGB')
    W, H = img.size
    rgb = np.asarray(img)
    out = np.zeros((H, W), np.uint8)
    for idx, (oid, kind, region) in enumerate(OBJECTS, start=1):
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
                        ground[yy, xx] = is_ground(*sub[yy, xx])
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
            if kind == 'open':  # keep the gaps between stall legs see-through
                o = out[y0:y1, x0:x1]
                o[(np.asarray(m) > 0) & r & (o == 0)] = idx
                continue
            # Holes = empty pixels not connected to the box's border.
            padded = Image.new('L', (m.width + 2, m.height + 2), 0)
            padded.paste(m, (1, 1))
            ImageDraw.floodfill(padded, (0, 0), 128)
            fa = np.asarray(padded)[1:-1, 1:-1]
            obj = ((np.asarray(m) > 0) | (fa == 0)) & r
        o = out[y0:y1, x0:x1]
        o[obj & (o == 0)] = idx
    return out

if __name__ == '__main__':
    out = build()
    Image.fromarray(out).save(OUT, optimize=True)
    print('objects:', len(OBJECTS), 'pixels:', int((out > 0).sum()))
    if len(sys.argv) > 1:
        m = Image.open(MAP).convert('RGBA')
        tint = Image.new('RGBA', m.size, (255, 0, 255, 0))
        tint.putalpha(Image.fromarray(np.where(out > 0, 110, 0).astype(np.uint8)))
        Image.alpha_composite(m, tint).convert('RGB').save(sys.argv[1])
