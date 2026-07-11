# Website Selin Weikard – Ganzheitliche Hundegesundheit

Produktive Astro-Website (Tailwind v4, selbstgehostete Fonts, DSGVO-konform).

## Entwicklung

```bash
cd website
npm install      # einmalig
npm run dev      # Entwicklungsserver auf http://localhost:4321
npm run build    # Produktions-Build nach dist/
npm run preview  # Build lokal ansehen
```

## Projektstruktur

```
src/
  data/site.ts            → Zentrale Inhalte: Pakete, FAQ, Navigation, Kontaktdaten
  layouts/BaseLayout.astro→ Grundgerüst inkl. SEO-Meta & Schema.org
  components/              → Header, Footer, Buttons, CTA, FAQ, Bild-Platzhalter …
  pages/                  → Alle Seiten (Startseite, Methode, Angebot, Academy …)
  content/wissen/         → Blog-Artikel als Markdown
  styles/global.css       → Design-System (Farben, Typografie)
public/                   → favicon, robots.txt, llms.txt, Bilder
```

## Vor dem Launch noch einzutragen (Platzhalter)

Alle zentral in **`src/data/site.ts`**:

- `whatsappNumber` → echte WhatsApp-Nummer (Format: `491701234567`, ohne + und Leerzeichen)
- `bookingUrl` → echter Cal.com/Calendly-Link
- `email` → finale E-Mail-Adresse
- `domain` → finale Domain (auch in `astro.config.mjs` und `public/robots.txt` / `public/llms.txt`)

Weitere ToDos:

- **Echte Fotos** einsetzen: Die `<ImagePlaceholder>`-Elemente durch `<img>` ersetzen
  (Morpheus-Bildstrecke, Hero, Selin-Porträts). Der `label`-Text beschreibt jeweils das Motiv.
- **Formular-Endpunkte** (`/kontakt`, `/lead-magnet`): `action="#"` durch echten Dienst
  (Formspree / Brevo / MailerLite mit Double-Opt-in) ersetzen.
- **Video** auf der Startseite & „Über Selin“ einbetten.
- **Rechtsseiten** (Impressum, Datenschutz, AGB, Widerruf) – bewusst noch NICHT enthalten.
- **Ad-Landingpages** – bewusst noch NICHT enthalten (späterer Schritt).

## Enthaltene Seiten

Startseite · Methode · Angebot (+ 5 Paket-Detailseiten) · Über Selin · Academy · Podcast ·
Wissen/Blog (+ 4 Artikel) · Häufige Fragen · Kontakt · Lead-Magnet.

## SEO / GEO / AEO

- Pro Seite: Title, Meta-Description, Canonical, Open Graph, Schema.org (JSON-LD).
- `sitemap-index.xml` wird beim Build erzeugt.
- `robots.txt` erlaubt klassische und KI-/Antwort-Bots (GPTBot, PerplexityBot, Google-Extended …).
- `llms.txt` für generative Engines.
- FAQPage-, Service/Offer-, Course-, BlogPosting-, HowTo- und BreadcrumbList-Schema.
