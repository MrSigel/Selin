// Generiert das komplette Favicon-/App-Icon-/OG-Paket aus dem Marken-Logo.
// - Browser-Favicons: abgerundete Ecken
// - Header/Footer-Logo (mark.png): Mint-Hintergrund transparent
// Aufruf:  node scripts/generate-icons.mjs
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = resolve(__dirname, "..", "public");
mkdirSync(resolve(pub, "images"), { recursive: true });

const LOGO = resolve(pub, "brand", "logo-selin.png");
const MINT = "#f1fcff";
const OAT = "#f3f0e7";

// Icon-Ausschnitt (Hund + grünes Quadrat), zugeschnitten.
const topBuf = await sharp(LOGO).extract({ left: 0, top: 0, width: 200, height: 118 }).png().toBuffer();
const iconBuf = await sharp(topBuf).trim({ threshold: 15 }).png().toBuffer();

// Mint-Hintergrund transparent machen – mit weichem Rand (Feather) gegen hellen Saum.
async function keyMint(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const mr = 241, mg = 252, mb = 255;
  for (let i = 0; i < data.length; i += ch) {
    const dr = data[i] - mr, dg = data[i + 1] - mg, db = data[i + 2] - mb;
    const d = Math.sqrt(dr * dr + dg * dg + db * db);
    if (d < 48) data[i + 3] = 0;
    else if (d < 130) data[i + 3] = Math.min(data[i + 3], Math.round((255 * (d - 48)) / 82));
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: ch } }).png().toBuffer();
}

// Icon zentriert auf quadratischem (Mint-)Grund mit Rand.
async function appIcon(size, bg = MINT, pad = 0.16) {
  const inner = Math.round(size * (1 - pad * 2));
  const fitted = await sharp(iconBuf).resize(inner, inner, { fit: "contain", background: bg }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    .composite([{ input: fitted, gravity: "center" }])
    .png()
    .toBuffer();
}

// Abgerundete Ecken (transparente Ecken).
async function rounded(buf, size, radiusPct = 0.22) {
  const r = Math.round(size * radiusPct);
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" ry="${r}"/></svg>`
  );
  return sharp(buf).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
}

function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  const blobs = [];
  let offset = 6 + images.length * 16;
  for (const { size, data } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    blobs.push(data);
    offset += data.length;
  }
  return Buffer.concat([header, ...entries, ...blobs]);
}

const run = async () => {
  // Browser-Favicons: abgerundet
  writeFileSync(resolve(pub, "favicon-16x16.png"), await rounded(await appIcon(16), 16));
  writeFileSync(resolve(pub, "favicon-32x32.png"), await rounded(await appIcon(32), 32));
  console.log("✓ favicon-16/-32 (abgerundet)");
  writeFileSync(
    resolve(pub, "favicon.ico"),
    buildIco([
      { size: 16, data: await rounded(await appIcon(16), 16) },
      { size: 32, data: await rounded(await appIcon(32), 32) },
      { size: 48, data: await rounded(await appIcon(48), 48) },
    ])
  );
  console.log("✓ favicon.ico (abgerundet)");

  // Apple/Android/MS: vollflächig opak (OS rundet selbst)
  writeFileSync(resolve(pub, "apple-touch-icon.png"), await appIcon(180));
  writeFileSync(resolve(pub, "android-chrome-192x192.png"), await appIcon(192));
  writeFileSync(resolve(pub, "android-chrome-512x512.png"), await appIcon(512));
  writeFileSync(resolve(pub, "mstile-150x150.png"), await appIcon(150));
  console.log("✓ apple-touch / android / mstile");

  // Header/Footer-Logo: transparenter Hintergrund
  const markSized = await sharp(iconBuf).resize({ height: 240 }).png().toBuffer();
  writeFileSync(resolve(pub, "brand", "mark.png"), await keyMint(markSized));
  console.log("✓ brand/mark.png (transparent)");

  // Open-Graph 1200x630
  const logoOg = await sharp(LOGO).resize(360, 360, { fit: "contain", background: MINT }).toBuffer();
  const textSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <text x="470" y="288" font-family="Georgia, serif" font-size="80" font-weight="600" fill="#172d24">Ursache statt</text>
      <text x="470" y="380" font-family="Georgia, serif" font-size="80" font-weight="600" font-style="italic" fill="#172d24">Symptom.</text>
      <text x="472" y="444" font-family="Arial, sans-serif" font-size="23" letter-spacing="3" fill="#2a5740">GANZHEITLICHE HUNDEGESUNDHEIT</text>
      <text x="472" y="502" font-family="Georgia, serif" font-size="23" font-style="italic" fill="#9c6015">„Ich war da, wo du jetzt bist – und ich weiß, wie es weitergeht."</text>
    </svg>`
  );
  const og = await sharp({ create: { width: 1200, height: 630, channels: 4, background: MINT } })
    .composite([
      { input: textSvg, top: 0, left: 0 },
      { input: logoOg, top: 135, left: 70 },
    ])
    .png()
    .toBuffer();
  writeFileSync(resolve(pub, "images", "og.png"), og);
  console.log("✓ images/og.png");
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
