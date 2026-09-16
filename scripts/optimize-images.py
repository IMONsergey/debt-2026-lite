"""Rebuild committed WebP assets from originals retained in Git history.

Usage: python scripts/optimize-images.py [--source-ref COMMIT]
Requires Pillow with WebP support. Does not crop or upscale images.
"""
import argparse
import io
import json
from pathlib import Path
import subprocess

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = "a2e8ebda9674ab86a2ba890407e68ce0ff12fba4"
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--source-ref", default=DEFAULT_SOURCE)
args = parser.parse_args()


def git(*arguments):
    return subprocess.check_output(["git", *arguments], cwd=ROOT)


def save_webp(image, path, **options):
    encoded = io.BytesIO()
    image.save(encoded, "WEBP", method=6, **options)
    path.write_bytes(encoded.getvalue())
    with Image.open(path) as check:
        check.load()


files = git("ls-tree", "-r", "--name-only", args.source_ref, "public/assets").decode().splitlines()
manifest = {}
original_bytes = output_bytes = 0
for name in files:
    path = Path(name)
    if path.suffix not in (".png", ".jpg", ".webp"):
        continue
    # Keep the social-sharing JPEG and small browser/navigation icons compatible.
    if path.name in ("favicon.png", "menu-spaceship.png", "debt-tech-2026-social-preview.jpg"):
        continue
    original = git("show", f"{args.source_ref}:{name}")
    original_bytes += len(original)
    with Image.open(io.BytesIO(original)) as source:
        image = ImageOps.exif_transpose(source).convert("RGBA" if "transparency" in source.info or "A" in source.getbands() else "RGB")
        width, height = image.size
        target = path.with_suffix(".webp")
        target_path = ROOT / target
        target_path.parent.mkdir(parents=True, exist_ok=True)
        quality = 86 if "/gallery/" in name or "/venue/" in name or path.suffix == ".jpg" else 92
        if path.suffix == ".webp":
            # Preserve the full-resolution master of images already encoded as WebP.
            target_path.write_bytes(original)
        else:
            save_webp(image, target_path, quality=quality, lossless=path.name == "contacts-rocket.png")
        output_bytes += target_path.stat().st_size
        variants = []
        if any(folder in name for folder in ("/gallery/", "/venue/", "/organizer/", "/other-conferences/")):
            for size in (640, 960):
                if size >= width:
                    continue
                resized = image.resize((size, round(height * size / width)), Image.Resampling.LANCZOS)
                variant = target_path.with_stem(f"{target_path.stem}-{size}w")
                save_webp(resized, variant, quality=quality)
                variants.append(size)
                output_bytes += variant.stat().st_size
        manifest[target.relative_to("public").as_posix()] = {"width": width, "height": height, "variants": variants}

(ROOT / "src/data/images.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
print(f"Optimized {len(manifest)} images: {original_bytes:,} -> {output_bytes:,} bytes including responsive variants.")
