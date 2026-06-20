import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const processedDir = path.join(process.cwd(), 'processed');

if (!fs.existsSync(processedDir)) {
  fs.mkdirSync(processedDir, { recursive: true });
}

export async function processImage(
  filepath: string,
  filename: string,
): Promise<string> {
  const ext = path.extname(filename) || '.png';
  const basename = path.basename(filename, ext);
  const outputName = `${basename}-processed${ext}`;
  const outputPath = path.join(processedDir, outputName);

  const watermark = Buffer.from(
    `<svg width="300" height="60">
      <text x="10" y="40" font-family="Arial" font-size="28" fill="rgba(255,255,255,0.5)" transform="rotate(-15, 150, 30)">EduPlatform</text>
    </svg>`,
  );

  await sharp(filepath)
    .resize(800, 800, { fit: 'inside' })
    .composite([{ input: watermark, gravity: 'southeast' }])
    .toFile(outputPath);

  return outputPath;
}
