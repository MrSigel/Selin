# Brand Guide — Selin Weikard · Ganzheitliche Hundegesundheit

Markenidentität **„Unter der Oberfläche"**. Alles ist tokenbasiert in
`src/styles/global.css` (Farben/Fonts) definiert; Assets liegen in `public/brand/`.

---

## 1. Markenidee

**Ursache statt Symptom** — mit Herz. Das Logo zeigt einen fröhlich springenden Hund, der
aus einem grünen Rahmen heraus ins Leben springt: Gesundheit, Lebensfreude, Vertrauen.
Grün (`#2a5740`) steht für Natur & Ruhe, Ocker (`#9c6015`) für Wärme & Naturheilkunde.
Ton: ehrlich, warm, fundiert — nie marktschreierisch, keine Heilversprechen.

---

## 2. Logo-System

Quelle: das gelieferte Marken-Logo (springender Hund + Wortmarke „Selin Weikard").
Marken-Farben sind identisch mit den Website-Tokens: Grün `#2a5740`, Ocker `#9c6015`.

Komponente für die Website: `src/components/Logo.astro` — Marken-Icon (Chip) + Wortmarke
live gesetzt; `variant="dark"` für helle, `variant="light"` für dunkle Hintergründe.

Assets in `public/brand/`:

| Datei | Verwendung |
|---|---|
| `logo-selin.png` | Vollständiges Logo (Icon + Wortmarke) — Master |
| `mark.png` | Nur Marken-Icon (Hund + Rahmen) auf Mint — für Chip/Header |

Aus diesen werden alle Favicons/App-Icons und das OG-Bild generiert
(`node scripts/generate-icons.mjs`).

**Regeln:** Logo nie verzerren, Farben nicht verändern, ausreichend Schutzraum lassen.
Das vollständige Logo bevorzugt auf hellem/Mint-Grund; das Icon funktioniert als Chip auch
auf dunklem Grund. Empfehlung: für gestochen scharfe große Darstellungen eine höher
aufgelöste Fassung (≥ 1024 px) oder SVG des Logos nachliefern (Quelle ist 200 px).

---

## 3. Farbsystem

| Rolle | Token | Hex |
|---|---|---|
| Primär / Tiefe (Ink, dunkle Sektionen) | `petrol-900` | `#172d24` |
| Primär 600 (Flächen, Sekundär-Button) | `petrol-600` | `#2a5740` |
| Akzent / CTA (Honig-Ocker) | `clay-600` | `#9c6015` |
| Akzent hell (auf Dunkel) | `clay-300` | `#dbab54` |
| Papier / Hintergrund | `sand-50` | `#f3f0e7` |
| Fließtext | `sand-800` | `#343028` |
| Referenz „Fell" (sehr sparsam) | `rust-500` | `#a9542e` |

Dark-Mode-Flächen nutzen `petrol-900`/`-950` mit Text `sand-100` und Akzent `clay-300`.
CTA-Kontrast Weiß auf `clay-600` = 5,1 : 1 (AA).

---

## 4. Typografie

- **Display / Headlines / Zitate:** **Newsreader** (`--font-serif`). Kursive = Signatur
  (z. B. Claim-Betonung).
- **Body / UI / Labels:** **Hanken Grotesk** (`--font-sans`).
- Skala: H1 `clamp ~2.7–3.7rem` (weight 560, tracking -0.018em) · H2 `~2–2.6rem` · Lead
  `1.25rem` · Body `1rem/1.7` · Eyebrow: Hanken, uppercase, `tracking-[0.2em]`, `clay-600`.

---

## 5. Design-Tokens

- **Radius:** Karten `rounded-2xl` (1rem) · Chips/Buttons `rounded-full` · Bild-Rahmen
  `rounded-[1.75rem]`.
- **Shadows:** `shadow-sm` Standard, `shadow-md`/`-lg` bei Hover, `shadow-2xl` für gerahmte
  Bilder.
- **Spacing:** Sektionen `py-24`; Container `max-w-7xl`, Text `max-w-3xl`.
- **Buttons:** Primär = `clay-600` (Weiß), Sekundär = `petrol-700`, Ghost = Rand
  `petrol-300`; Hover hebt an (`-translate-y-0.5`), Pfoten-CTA mit `wag`.
- **Cards:** weiß, Rand `sand-200`, Hover `border-petrol-200` + `-translate-y-1`.
- **Signatur-Element:** `SurfaceDivider.astro` (Bodenlinie mit wachsender Wurzel).

---

## 6. Favicons / App-Icons (in `public/`)

`favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`,
`apple-touch-icon.png` (180), `android-chrome-192x192.png`, `android-chrome-512x512.png`,
`mstile-150x150.png`, `site.webmanifest`, `images/og.png` (1200×630).
Neu generieren nach Icon-Änderung: `node scripts/generate-icons.mjs`.

---

## 7. SEO / Brand-Entity

`BaseLayout.astro` liefert je Seite Title, Description, Canonical, Open Graph + Twitter
(PNG-OG) und JSON-LD `ProfessionalService` inkl. `logo` (ImageObject 512), Adresse,
`contactPoint`, `slogan`. So werden Marke und Angebot von Google, AI Overviews und
Answer-Engines (ChatGPT, Claude, Perplexity) strukturiert erfasst.

---

## 8. Tonalität

Aktive Sprache, Kleinschreibung in Sätzen, keine Floskeln. Immer „Begleitung/Beratung/
Coaching" statt „Therapie/Heilung"; kein Ersatz für den Tierarzt; keine Heilversprechen.
