// Generiert Logo-Marke, Favicon-/App-Icon-/OG-Paket aus dem neuen Logo (New_logo.jpeg).
// - mark.png:        Hund als Linienzeichnung (braun) transparent – für helle Hintergründe
// - mark-light.png:  Hund cremefarben getönt transparent – für dunkle Hintergründe (Footer)
// - Favicons/Icons:  Hund cremefarben auf pinie-grünem, abgerundetem Grund
// - og.png:          vollständiges Logo auf Creme
// Aufruf:  node scripts/generate-icons.mjs
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = resolve(__dirname, "..", "public");
const assets = resolve(__dirname, "..", "src", "assets");
mkdirSync(resolve(pub, "images"), { recursive: true });
mkdirSync(resolve(pub, "brand"), { recursive: true });

const LOGO = resolve(pub, "New_logo.jpeg");
const PINE = "#172d24";
const CREAM = "#efe7df"; // entspricht dem Logo-Hintergrund
const DOG_LIGHT = "#ece0cc"; // warmes Creme für dunkle Flächen

// Creme-Hintergrund transparent machen (weicher Rand). Dunkle Linien bleiben erhalten.
async function keyCream(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  for (let i = 0; i < data.length; i += ch) {
    const m = Math.min(data[i], data[i + 1], data[i + 2]);
    if (m >= 205) data[i + 3] = 0;
    else if (m >= 150) data[i + 3] = Math.min(data[i + 3], Math.round((255 * (205 - m)) / 55));
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: ch } }).png().toBuffer();
}

// Opake Bereiche einfärben, Alpha beibehalten.
async function tint(buf, color) {
  const m = await sharp(buf).metadata();
  return sharp({ create: { width: m.width, height: m.height, channels: 4, background: color } })
    .composite([{ input: buf, blend: "dest-in" }])
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
  // 1) Hund freistellen (braun, transparent) + getrimmt
  const dogRaw = await sharp(LOGO).extract({ left: 215, top: 35, width: 290, height: 398 }).png().toBuffer();
  const dogBrown = await sharp(await keyCream(dogRaw)).trim({ threshold: 10 }).png().toBuffer();
  const dogCream = await tint(dogBrown, DOG_LIGHT);

  // 2) Marken für Header (braun) und Footer (creme)
  const markBrown = await sharp(dogBrown).resize({ height: 240 }).png().toBuffer();
  const markCream = await sharp(dogCream).resize({ height: 240 }).png().toBuffer();
  writeFileSync(resolve(pub, "brand", "mark.png"), markBrown);
  writeFileSync(resolve(assets, "mark.png"), markBrown);
  writeFileSync(resolve(pub, "brand", "mark-light.png"), markCream);
  writeFileSync(resolve(assets, "mark-light.png"), markCream);
  console.log("✓ mark.png (braun) & mark-light.png (creme)");

  // 3) App-Icon: creme-Hund auf pinie-grünem Grund
  async function appIcon(size, pad = 0.18) {
    const inner = Math.round(size * (1 - pad * 2));
    const fitted = await sharp(dogCream).resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
    return sharp({ create: { width: size, height: size, channels: 4, background: PINE } })
      .composite([{ input: fitted, gravity: "center" }])
      .png()
      .toBuffer();
  }

  writeFileSync(resolve(pub, "favicon-16x16.png"), await rounded(await appIcon(16, 0.12), 16));
  writeFileSync(resolve(pub, "favicon-32x32.png"), await rounded(await appIcon(32, 0.12), 32));
  writeFileSync(
    resolve(pub, "favicon.ico"),
    buildIco([
      { size: 16, data: await rounded(await appIcon(16, 0.12), 16) },
      { size: 32, data: await rounded(await appIcon(32, 0.12), 32) },
      { size: 48, data: await rounded(await appIcon(48, 0.14), 48) },
    ])
  );
  writeFileSync(resolve(pub, "apple-touch-icon.png"), await appIcon(180));
  writeFileSync(resolve(pub, "android-chrome-192x192.png"), await appIcon(192));
  writeFileSync(resolve(pub, "android-chrome-512x512.png"), await appIcon(512));
  writeFileSync(resolve(pub, "mstile-150x150.png"), await appIcon(150));
  console.log("✓ favicons + app-icons (pinie/creme)");

  // 4) Vollständiges Logo (transparent) als Master
  const fullRaw = await sharp(LOGO).extract({ left: 205, top: 40, width: 1310, height: 400 }).png().toBuffer();
  writeFileSync(resolve(pub, "brand", "logo-full.png"), await sharp(await keyCream(fullRaw)).trim({ threshold: 12 }).png().toBuffer());
  writeFileSync(resolve(pub, "brand", "logo-selin.png"), await sharp(LOGO).png().toBuffer());
  console.log("✓ brand/logo-full.png & logo-selin.png");

  // 5) Open-Graph 1200x630 auf Creme
  const ogLogo = await sharp(fullRaw).resize({ width: 940 }).toBuffer();
  const textSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <text x="600" y="470" text-anchor="middle" font-family="Georgia, serif" font-size="40" font-style="italic" fill="#2a5740">„Ursache statt Symptom."</text>
      <text x="600" y="528" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#9c6015">Ganzheitliche Begleitung · online · weltweit</text>
    </svg>`
  );
  const og = await sharp({ create: { width: 1200, height: 630, channels: 4, background: CREAM } })
    .composite([
      { input: ogLogo, top: 70, left: Math.round((1200 - 940) / 2) },
      { input: textSvg, top: 0, left: 0 },
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
