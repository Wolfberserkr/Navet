"""Build src/data/walkable-mask.png for village-map-v2.png.

Shapes are measured on a 2000x1116 copy of the map and scaled to the
2576x1438 map. White = walkable. Run: python3 scripts/make-mask-v2.py [preview.png]
Fine-tune afterwards with the in-app mask editor (key M).
"""
import sys
from collections import deque
from PIL import Image, ImageDraw

SRC_W, SRC_H = 2000, 1116
MAP_W, MAP_H = 2576, 1438
CELL = 4
MW, MH = -(-MAP_W // CELL), -(-MAP_H // CELL)
K = MAP_W / SRC_W / CELL  # source px -> mask px

def P(pts):
    return [(x * K, y * K) for x, y in pts]

def R(x0, y0, x1, y1):
    return [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]

def scaled(pts):
    return P(pts)

BLOCK = [
    # Forest and hedge to the north, west and east.
    [(0, 0), (2000, 0), (2000, 585), (1745, 585), (1745, 222), (1400, 208), (1150, 195),
     (850, 195), (560, 210), (275, 215), (270, 378), (190, 448), (110, 560), (0, 585)],
    # Trees and river to the south-west, river along the south, forest to the south-east.
    [(0, 642), (120, 645), (175, 690), (200, 770), (250, 815), (330, 880), (450, 898),
     (600, 925), (750, 955), (900, 975), (1000, 1000), (1400, 995), (1460, 955),
     (1600, 905), (1700, 880), (1730, 640), (2000, 640), (2000, 1116), (0, 1116)],
    # Tree west of the longhouse, bush and rock by the west road.
    [(195, 600), (310, 600), (320, 700), (275, 745), (210, 730), (185, 660)],
    R(228, 465, 296, 530), R(178, 492, 216, 526),
    # Rocks east of the workshop, bush east of the stalls.
    R(1668, 660, 1748, 728), R(1662, 455, 1722, 496),
    # Maarten: academy, vegetable garden, fence, flower box, sign.
    R(358, 185, 552, 386), R(283, 255, 362, 425), R(283, 400, 420, 426),
    R(486, 372, 540, 402), R(546, 295, 598, 338),
    # Marisol: cottage, fences, barrel and crate.
    R(636, 130, 792, 390), R(594, 322, 640, 345), R(594, 322, 606, 410),
    R(780, 322, 832, 345), R(820, 322, 832, 410), R(742, 360, 778, 412),
    # Rhod: town hall and the platform either side of the steps; post.
    R(848, 30, 1152, 384), R(848, 384, 940, 446), R(1058, 384, 1152, 446),
    R(1084, 418, 1100, 478),
    # Ruben: counting house, sign, crates.
    R(1226, 200, 1394, 392), R(1178, 296, 1228, 352), R(1392, 302, 1428, 378),
    # Yara: cottage, cooking pot, crates and barrels.
    R(1468, 205, 1688, 392), R(1428, 312, 1476, 362), R(1450, 358, 1540, 428),
    R(1598, 382, 1652, 422), R(1652, 358, 1692, 398), R(1648, 408, 1680, 442),
    # Ivo: training house, dummy, dog, bike, barrels.
    R(488, 432, 700, 612), R(444, 545, 492, 616), R(510, 598, 546, 626),
    R(626, 578, 702, 626), R(690, 522, 724, 600),
    # Market stalls.
    R(1308, 462, 1402, 576), R(1428, 462, 1548, 582),
    # Fountain.
    'fountain',
    # Liv: longhouse and its fence, flag with fence, banner post, stall.
    [(505, 820), (540, 770), (590, 668), (730, 598), (800, 762), (800, 900), (746, 925),
     (746, 962), (505, 962)],
    R(800, 812, 908, 898), R(788, 655, 812, 732), R(812, 668, 908, 788),
    # Gisela: inn, sign, bench, barrel.
    R(1028, 698, 1272, 902), R(978, 836, 1030, 892), R(1186, 888, 1248, 926),
    R(1262, 856, 1292, 902),
    # Elvin: workshop, fenced plot to its west, fenced yard.
    [(1375, 648), (1490, 645), (1612, 645), (1662, 690), (1662, 782), (1600, 842),
     (1530, 852), (1478, 845), (1430, 800), (1370, 700)],
    [(1228, 692), (1300, 648), (1425, 650), (1432, 700), (1418, 842), (1398, 842), (1262, 752)],
    [(1470, 842), (1590, 918), (1728, 822), (1728, 790), (1662, 748), (1600, 842)],
]

WALK_AGAIN = [
    # Town hall steps and the landing in front of the door.
    R(942, 384, 1056, 482),
    # West bridge and east bridge.
    [(245, 850), (300, 812), (400, 860), (398, 905), (330, 925), (250, 885)],
    [(1440, 925), (1475, 915), (1520, 942), (1585, 975), (1580, 1000), (1520, 1005), (1470, 985)],
]

SPAWN = (1004, 700)

def build():
    im = Image.new('L', (MW, MH), 255)
    d = ImageDraw.Draw(im)
    for shape in BLOCK:
        if shape == 'fountain':
            d.ellipse([950 * K, 572 * K, 1060 * K, 660 * K], fill=0)
        else:
            d.polygon(scaled(shape), fill=0)
    for shape in WALK_AGAIN:
        d.polygon(scaled(shape), fill=255)
    # Keep only what can be reached from the spawn point.
    px = im.load()
    sx, sy = int(SPAWN[0] * K), int(SPAWN[1] * K)
    seen = {(sx, sy)}
    q = deque([(sx, sy)])
    while q:
        x, y = q.popleft()
        for n in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= n[0] < MW and 0 <= n[1] < MH and n not in seen and px[n] > 127:
                seen.add(n)
                q.append(n)
    out = Image.new('L', (MW, MH), 0)
    op = out.load()
    for p in seen:
        op[p] = 255
    return out

if __name__ == '__main__':
    mask = build()
    mask.save('src/data/walkable-mask.png')
    if len(sys.argv) > 1:
        m = Image.open('assets/map/village-map-v2.png').convert('RGBA')
        tint = Image.new('RGBA', m.size, (0, 255, 0, 0))
        a = mask.resize(m.size, Image.NEAREST).point(lambda v: 80 if v else 0)
        tint.putalpha(a)
        Image.alpha_composite(m, tint).convert('RGB').resize((2000, 1116)).save(sys.argv[1])
