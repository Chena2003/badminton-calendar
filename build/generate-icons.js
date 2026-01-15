const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputLogo = 'logo.png';
const outputDir = '_public/badminton';

const sizes = [
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'maskable_icon_x512.png', size: 512 },
];

async function generateIcons() {
  console.log('Generating icons from logo.png...');

  for (const { name, size } of sizes) {
    const outputPath = path.join(outputDir, name);

    await sharp(inputLogo)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath);

    console.log(`Generated ${name} (${size}x${size})`);
  }

  console.log('All icons generated successfully!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
