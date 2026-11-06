"""Make the PWA icons from a crop of the town hall on the map.

Run once (or whenever the crop changes):  python3 scripts/make-icons.py
Needs Pillow. Reads the map, never writes to it.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
MAP = ROOT / "assets/map/village-map-v1.png"
OUT = ROOT / "public/icons"

# Square crop around the town hall and its bell tower (map pixels).
CROP = (450, 0, 1130, 680)
BG = (34, 38, 58)  # night-blue backdrop for the maskable icon padding

def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    hall = Image.open(MAP).convert("RGB").crop(CROP)
    for size in (192, 512):
        hall.resize((size, size), Image.LANCZOS).save(OUT / f"icon-{size}.png")
    hall.resize((180, 180), Image.LANCZOS).save(OUT / "apple-touch-icon.png")
    hall.resize((64, 64), Image.LANCZOS).save(OUT / "favicon-64.png")
    # Maskable: keep the art inside the 80% safe zone.
    m = Image.new("RGB", (512, 512), BG)
    inner = hall.resize((410, 410), Image.LANCZOS)
    m.paste(inner, (51, 51))
    m.save(OUT / "icon-maskable-512.png")

if __name__ == "__main__":
    main()
