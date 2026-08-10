import fs from 'node:fs';
import path from 'node:path';

const SOURCE_DIR = '/Users/rishvantha/Downloads/ezgif-8d8c3a442cbc0661-png-split';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'sequence', 'waffle-reveal');

async function main() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch (e) {
    console.log('Sharp not available directly, running python conversion script fallback...');
    const { execSync } = await import('node:child_process');
    execSync('python3 scripts/convert-frames.py', { stdio: 'inherit' });
    return;
  }

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Source directory not found: ${SOURCE_DIR}`);
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = fs
    .readdirSync(SOURCE_DIR)
    .filter((f) => f.match(/\.(png|jpg|jpeg|webp)$/i))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
      return numA - numB;
    });

  console.log(`Found ${files.length} source frames.`);

  const rawFrames = files.map((file) => path.join(SOURCE_DIR, file));
  const rawCount = rawFrames.length;
  const INTERPOLATE = rawCount < 60;
  const targetTotalFrames = INTERPOLATE ? (rawCount - 1) * 2 + 1 : rawCount;

  let outIdx = 1;
  let overSizedCount = 0;

  for (let i = 0; i < rawCount; i++) {
    const sourcePath = rawFrames[i];
    const frameNum = outIdx.toString().padStart(4, '0');
    const outPath = path.join(OUTPUT_DIR, `frame_${frameNum}.webp`);

    const baseBuffer = await sharp(sourcePath)
      .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();

    fs.writeFileSync(outPath, baseBuffer);
    const sizeKB = (baseBuffer.length / 1024).toFixed(1);
    if (baseBuffer.length > 120 * 1024) overSizedCount++;

    if (INTERPOLATE && i < rawCount - 1) {
      outIdx++;
      const nextPath = rawFrames[i + 1];
      const interFrameNum = outIdx.toString().padStart(4, '0');
      const interOutPath = path.join(OUTPUT_DIR, `frame_${interFrameNum}.webp`);

      const img1 = sharp(sourcePath).resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true });
      const metadata1 = await img1.metadata();

      const img2Resized = await sharp(nextPath)
        .resize(metadata1.width, metadata1.height, { fit: 'fill' })
        .ensureAlpha(0.5)
        .png()
        .toBuffer();

      const blendedBuffer = await sharp(sourcePath)
        .resize(metadata1.width, metadata1.height, { fit: 'fill' })
        .composite([{ input: img2Resized, blend: 'over' }])
        .webp({ quality: 80, effort: 4 })
        .toBuffer();

      fs.writeFileSync(interOutPath, blendedBuffer);
      if (blendedBuffer.length > 120 * 1024) overSizedCount++;
    }
    outIdx++;
  }

  console.log(`Conversion finished: generated ${targetTotalFrames} WebP frames. Oversized: ${overSizedCount}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
