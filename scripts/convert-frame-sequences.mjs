import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const HORIZONTAL_SOURCE = '/Users/rishvantha/Downloads/ezgif-862845b70af60c67-jpg';
const VERTICAL_SOURCE = '/Users/rishvantha/Downloads/ezgif-81e04550916d51c3-jpg';

const HORIZONTAL_OUTPUT = path.join(process.cwd(), 'public', 'sequence', 'horizontal');
const VERTICAL_OUTPUT = path.join(process.cwd(), 'public', 'sequence', 'vertical');

async function processSequence(sourceDir, outputDir, label) {
  if (!fs.existsSync(sourceDir)) {
    console.error(`[ERROR] Source directory not found: ${sourceDir}`);
    process.exit(1);
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const files = fs
    .readdirSync(sourceDir)
    .filter((f) => f.match(/\.(png|jpg|jpeg|webp)$/i))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0', 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || '0', 10);
      return numA - numB;
    });

  console.log(`Processing ${label} sequence: ${files.length} frames found in ${sourceDir}`);

  let completed = 0;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const sourcePath = path.join(sourceDir, file);
    const frameNum = (i + 1).toString().padStart(4, '0');
    const outPath = path.join(outputDir, `frame_${frameNum}.webp`);

    await sharp(sourcePath)
      .webp({ quality: 84, effort: 4 })
      .toFile(outPath);

    completed++;
    if (completed % 50 === 0 || completed === files.length) {
      console.log(`[${label}] Progress: ${completed}/${files.length} frames converted.`);
    }
  }

  console.log(`[SUCCESS] ${label} sequence saved to ${outputDir}\n`);
}

async function main() {
  console.log('=== STARTING CINEMATIC WAFFLE FRAME CONVERSION ===\n');
  await processSequence(HORIZONTAL_SOURCE, HORIZONTAL_OUTPUT, 'HORIZONTAL');
  await processSequence(VERTICAL_SOURCE, VERTICAL_OUTPUT, 'VERTICAL');
  console.log('=== FRAME CONVERSION COMPLETE ===');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
