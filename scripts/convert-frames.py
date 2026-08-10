import os
import glob
from PIL import Image

SOURCE_DIR = '/Users/rishvantha/Downloads/ezgif-8fafc3b879776de6-png-split'
OUTPUT_DIR = '/Users/rishvantha/Waffle/public/sequence/waffle-reveal'

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Remove old files in output dir first
for old_f in glob.glob(os.path.join(OUTPUT_DIR, '*.webp')):
    try:
        os.remove(old_f)
    except Exception:
        pass

files = sorted(glob.glob(os.path.join(SOURCE_DIR, 'ezgif-frame-*.png')))
raw_count = len(files)
print(f"Found {raw_count} source files in {SOURCE_DIR}.")

oversized = 0

for i in range(raw_count):
    img = Image.open(files[i]).convert('RGBA')

    w, h = img.size
    if max(w, h) > 1920:
        ratio = 1920.0 / max(w, h)
        img = img.resize((int(w * ratio), int(h * ratio)), Image.Resampling.LANCZOS)

    frame_num = i + 1
    frame_name = f"frame_{frame_num:04d}.webp"
    out_path = os.path.join(OUTPUT_DIR, frame_name)
    img.convert('RGB').save(out_path, 'WEBP', quality=80)

    size_kb = os.path.getsize(out_path) / 1024.0
    if size_kb > 120:
        oversized += 1
    if frame_num % 20 == 0 or frame_num == raw_count:
        print(f"Processed {frame_num}/{raw_count} ({frame_name}) - {size_kb:.1f} KB")

print(f"\nCompleted! Generated {raw_count} WebP frames in {OUTPUT_DIR}.")
print(f"Oversized (>120KB) frames: {oversized}")
