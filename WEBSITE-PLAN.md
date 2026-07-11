# Website-Plan — Selin Weikard · Ganzheitliche Hundegesundheit

**Grundlage:** `Hundegesundheitscoach Konzept.docx`
**Ziel:** Professionelle, mehrseitige Website, optimiert für SEO, GEO (Generative Engine Optimization), AEO (Answer Engine Optimization) und Conversions.
**Entscheidungen:** Tech = Code (Astro empfohlen / Next.js möglich) · Sprache = Deutsch (Start) · Umfang = Plan.
**Claim:** „Ich war da, wo du jetzt bist. Und ich weiß, wie es weitergeht.“

---

## 1. Strategische Ausgangslage

Das Konzept schlägt bewusst eine schlanke **Single-Landingpage** vor. Für die von dir gewünschte **Mehrseiten-Website** gilt: Das ist für SEO/GEO/AEO die deutlich stärkere Wahl — jede Unterseite ist eine eigene Ranking- und Zitierfläche. Der Funnel-Gedanke des Konzepts (Ad → Seite → WhatsApp → Abschluss) bleibt vollständig erhalten: Die **Startseite und dedizierte Landingpages** übernehmen die Conversion-Rolle, die **Content-Seiten (Wissen/Blog)** übernehmen die Sichtbarkeits-Rolle.

**Zentrale Leitplanke (aus Abschnitt 1, 2, 8 des Konzepts):**
Keine Heilversprechen, keine Diagnosen, keine erfundenen Referenzen/Presseartikel. Durchgängig „Begleitung / Beratung / Coaching“ statt „Therapie / Behandlung / Heilung“. Diese Compliance-Regel wird in **jedes** Textmodul eingebaut, nicht nur ins Impressum.

---

## 2. Technischer Stack (Empfehlung)

| Baustein | Empfehlung | Begründung |
|---|---|---|
| Framework | **Astro** | Content-lastige Seite mit Blog; liefert reines HTML (top Core Web Vitals), ideal für SEO/AEO. Next.js gleichwertig möglich, falls später viel Interaktivität nötig. |
| Content/Blog | **Astro Content Collections** (Markdown) oder Headless-CMS (Sanity/Storyblok) | Selin kann Fachartikel eigenständig pflegen (Abschnitt 13). |
| Styling | Tailwind CSS | Schnell, konsistent, gutes Responsive-Handling. |
| Hosting | Vercel / Netlify / Cloudflare Pages | CDN, automatisches HTTPS, Edge-Performance weltweit. |
| Terminbuchung | Cal.com / Calendly (Embed) | Abschnitt 8. |
| Zahlung | Stripe (Checkout-Links) | Abschnitt 8: Karte, PayPal, Klarna, Apple/Google Pay, SEPA. |
| Kontakt/Funnel | Click-to-WhatsApp-Button mit vorausgefüllter Nachricht | Abschnitt 4. |
| Formulare | Serverless Function + Double-Opt-In (Brevo/MailerLite) | Lead-Magnet & Newsletter, DSGVO-konform. |
| Academy (später) | Externe Plattform (z. B. Learning Suite / Elopage / Memberspot) verlinkt | Abschnitt 9, kein Eigenbau nötig. |

---

## 3. Seitenarchitektur (Sitemap)

```
/                         Startseite (Hero, Ursache-statt-Symptom, Trust, CTA)
/ueber-selin              Über Selin & die Morpheus-Geschichte (Trust-Kern)
/methode                  Der ganzheitliche Ansatz (5 Schritte, Ursache statt Symptom)
/angebot                  Angebotsübersicht (4 Pakete + Preise)
  /angebot/erst-check          99 €
  /angebot/ursachen-klarheit   349 €
  /angebot/gesundheits-reset   890 €
  /angebot/volle-begleitung    1.890 €
  /angebot/lifetime-partner    2.990 €
/academy                  Online-Academy & Mitgliedschaft (29,99 €/Monat, 7 Module)
/podcast                  „Drei Perspektiven, ein Hund“ (Marketing + Trust)
/wissen                   Blog-/Wissenshub (Übersicht, Kategorien)
  /wissen/[artikel]            Einzelartikel (Fachartikel-Serie, Abschnitt 13)
/haeufige-fragen          FAQ (zentrale AEO-Seite)
/kontakt                  Kontakt + WhatsApp + Terminbuchung
/lead-magnet              Gratis-Checkliste „10 Zeichen, dass dein Hund leidet“
--- rechtlich ---
/impressum  /datenschutz  /agb  /widerruf  /haftungsausschluss
```

**Themen-Landingpages für Ads (SEO + Paid-Traffic, je eigene URL):**
`/hund-chronisch-krank-ursache` · `/hund-verhalten-koerperliche-ursache` · `/hund-tierarzt-findet-nichts` · `/hundeernaehrung-selbst-kochen` · `/homoeopathie-hund`
→ Bedienen direkt die Keyword-Cluster aus Abschnitt 7 und das Prinzip „Körper & Verhalten hängen zusammen“.

---

## 4. Content-Mapping (Konzept → Seiten)

| Konzept-Abschnitt | Landet auf |
|---|---|
| 1 Positionierung, Claim, Philosophie, Haltung | Startseite Hero + /methode + /ueber-selin |
| 2 Was das Coaching bearbeitet | /methode + Themen-Landingpages |
| 3a Typische Anliegen (Muster statt Einzelfall) | Startseite, Themen-Landingpages |
| 3b Morpheus-Geschichte + Vorher/Nachher-Bildstrecke | /ueber-selin (+ Kurzversion Hero) |
| 3c Aufbau echter Referenzen | Trust-Sektionen, Google-Bewertungswidget |
| 3 Angebotsstruktur (Pakete) | /angebot + Detailseiten |
| 4 Funnel / WhatsApp | globaler CTA + /kontakt |
| 5 Verkaufsprozess | intern (Sprachnachrichten-Bibliothek, nicht öffentlich) |
| 6 Landingpage-Inhalte | Startseite-Blueprint |
| 7 Werbung Meta/Google | Themen-Landingpages als Ad-Ziele |
| 8 Technik & Recht | Stack + Rechtsseiten |
| 9 Academy & Podcast | /academy + /podcast |
| 10 Sprachen | i18n-Vorbereitung, Start DE |
| 13 Expertenstatus (echte Fachartikel) | /wissen (Blog) |
| 14 Offene Fragen | Vor Textproduktion zu klären (siehe §11) |

---

## 5. SEO-Strategie (klassisch)

**Technisch**
- Astro → statisches HTML, Lighthouse-Ziel ≥ 95, Core Web Vitals grün.
- Saubere URL-Struktur (sprechend, deutsch), `sitemap.xml`, `robots.txt`.
- Canonical-Tags, sauberes Heading-Hierarchie (eine H1/Seite).
- Bilder: WebP/AVIF, `alt`-Texte mit Keywords (Morpheus-Bildstrecke!), Lazy-Loading.
- Mobile-First (Großteil des Traffics über Meta-Ads = mobil).
- `hreflang`-Grundgerüst vorbereiten (für spätere EN-Version, Abschnitt 10).

**On-Page / Keyword-Cluster** (aus Abschnitt 7 abgeleitet)
- Cluster „Ursache“: *hund chronisch krank ursache*, *hund tierarzt findet nichts*, *symptom statt ursache hund*.
- Cluster „Verhalten & Körper“: *hund verhalten schmerzen*, *aggression hund körperliche ursache*.
- Cluster „Naturheilkunde“: *homöopathie hund*, *ganzheitliche hundetherapie*, *hund natürlich heilen*.
- Cluster „Ernährung“: *hund selbst kochen rezept*, *hundefutter allergie*, *barf alternative*.
- Cluster „NEM“: *spirulina hund*, *msm hund*, *heilpilze hund*, *grünlippenmuschel hund*.
→ Der Kursinhalt (Module 2–7) ist ein riesiger, echter Content-Fundus für dutzende Blogartikel = organischer Traffic ohne Ad-Budget.

**Content-Strategie**
- Pillar-Pages (`/methode`, `/hundeernaehrung-selbst-kochen`) + unterstützende Blogartikel, intern verlinkt (Topic Cluster).
- Redaktionsplan: 2–4 Artikel/Monat aus den Modulinhalten (Darmsanierung, Ausleitung, Sodbrennen/Bullrichsalz, Blutohr, Proteine nicht kreuzen …).

**Local/„GEO“ im geografischen Sinn (ergänzend)**
- Google-Unternehmensprofil früh anlegen (Abschnitt 3c) → Bewertungen einbetten.
- LocalBusiness-Schema mit Wohnort als Basis, auch wenn das Angebot online/weltweit ist.

---

## 6. GEO — Generative Engine Optimization (ChatGPT, Gemini, Perplexity, Google AI Overviews)

Ziel: Als **Quelle in KI-Antworten** zitiert werden, wenn Hundehalter Fragen stellen wie „mein Hund ist chronisch krank, Tierarzt findet nichts".

- **Zitierfähige Inhalte:** klare, in sich abgeschlossene Absätze mit definierten Begriffen (z. B. „Ausleitung“, „Darmsanierung“), Aufzählungen, echte Erfahrungswerte → KI-Modelle bevorzugen strukturierten, faktenreichen Content.
- **E-E-A-T über echte Erfahrung:** Selins Ehrlichkeit („kein Diplom, drei Jahre Eigenrecherche“, Abschnitt 13) ist ein GEO-Vorteil — authentische Erstquellen werden zunehmend höher gewichtet.
- **Statistik/Fakt-Format:** Aussagen mit konkreten Zahlen und Beispielen (Dosierungen, Portionen, Zeiträume) sind gut zitierbar — vorsichtig formuliert, ohne Heilversprechen.
- **`llms.txt`** im Root hinterlegen (Kurzbeschreibung + wichtigste URLs für LLMs).
- **Crawlbarkeit für KI-Bots** (GPTBot, PerplexityBot, Google-Extended) bewusst in `robots.txt` erlauben.
- **Podcast als Autoritätssignal:** „Drei Perspektiven, ein Hund“ mit Tierärztin + Chiropraktiker → transkribieren und als Text veröffentlichen (dreifache echte Expertise ist ein starkes GEO/E-E-A-T-Signal).

---

## 7. AEO — Answer Engine Optimization (Featured Snippets, Voice, direkte Antworten)

- **Zentrale `/haeufige-fragen`-Seite** + FAQ-Blöcke auf jeder Angebots-/Themenseite, jeweils mit **FAQPage-Schema**.
  Fragen direkt aus dem Konzept (Abschnitt 4): *„Ersetzt das den Tierarzt?“*, *„Wie läuft eine Sitzung online ab?“*, *„Was, wenn mein Hund sehr ängstlich ist?“*, *„Warum findet der Tierarzt nichts?“*
- **Frage-als-Überschrift-Muster:** H2/H3 als echte Nutzerfrage, direkt darunter eine 40–60-Wörter-Kurzantwort (Snippet-optimiert), dann Vertiefung.
- **How-To-Inhalte** (z. B. „So läuft eine Begleitung ab — 5 Schritte“) mit klarer Schrittstruktur.
- **Schema.org durchgängig:** `Organization`/`Person` (Selin), `Service` + `Offer` (Pakete mit Preisen), `Article` (Blog), `FAQPage`, `Course` (Academy), `PodcastEpisode`, `BreadcrumbList`, `AggregateRating` (sobald echte Bewertungen da sind).

---

## 8. Conversion-Optimierung (CRO)

Der Funnel aus Abschnitt 4 bleibt das Herz:

- **Primär-CTA überall gleich:** „Jetzt Erst-Check anfragen“ → Click-to-WhatsApp mit vorausgefüllter Nachricht. Sticky-Button mobil.
- **Sekundär-CTA:** Terminbuchung (Cal.com/Calendly) für Nutzer, die nicht chatten wollen.
- **Startseiten-Blueprint (Abschnitt 6):** Hero (Foto Selin + Hund + Claim) → Video (3–6 Min Geschichte) → „Ursache statt Symptom“ (2 Blöcke) → 5 Schritte → Über Selin → **Vorher/Nachher-Bildstrecke „Der Weg von Morpheus“** (3 Bilder mit den ausformulierten Bildunterschriften aus Abschnitt 3b) → Trust/Bewertungen → Paketübersicht mit transparenten Preisen → FAQ → CTA.
- **Trust-Aufbau ohne erfundene Referenzen (Abschnitt 3b/3c/13):** Am Start trägt Selins eigene Geschichte + Morpheus-Bildstrecke; Google-Bewertungswidget und anonymisierte Falldokumentation ergänzen sukzessive.
- **Lead-Magnet** (`/lead-magnet`): Gratis-Checkliste „10 Zeichen, dass dein Hund unter der Oberfläche leidet“ (Abschnitt 9) → E-Mail-Einstieg für alle, die noch nicht kaufbereit sind.
- **Vertrauen statt Druck (Abschnitt 5):** keine künstlichen Countdown-/„jetzt oder nie“-Elemente — im sensiblen Tiergesundheitsmarkt kontraproduktiv.
- **Preistransparenz:** alle 4 Pakete offen sichtbar (99 € / 349 € / 890 € / 1.890 € / 2.990 €) + Academy 29,99 €/Monat.
- **Messung:** Conversion-Ziele = WhatsApp-Klick, Terminbuchung, Lead-Magnet-Download, Paket-Kauf.

---

## 9. Tracking, Analytics & Werbung

- **Analytics:** datenschutzfreundlich (Plausible/Matomo) oder GA4 mit Consent Mode v2.
- **Consent-Management (CMP):** DSGVO-konformer Cookie-Banner vor allen Marketing-Tags.
- **Meta Pixel + Conversions API** und **Google Ads Tag** — vorbereitet für die Kampagnen aus Abschnitt 7 (Testbudget 15–25 €/Tag je Kanal, Ziel-URLs = Themen-Landingpages).
- **Event-Tracking** für jeden CTA (WhatsApp, Termin, Download, Checkout).

---

## 10. Rechtliche Basis (Abschnitt 8 — vor Launch)

- Pflichtseiten: **Impressum, Datenschutzerklärung, AGB, Widerrufsbelehrung, Haftungsausschluss.**
- **Kommunikations-Leitlinie durchsetzen:** „Begleitung/Beratung/Coaching“ statt „Therapie/Behandlung/Heilung“; kein Ersatz für tierärztliche Diagnose; Hinweis auf Tierarzt bei Notfällen — als wiederkehrendes Disclaimer-Modul.
- **Ausbildungsstand transparent:** „in Ausbildung zur Tierheilpraktikerin mit Schwerpunkt Tierhomöopathie“ statt fertigem Titel (Abschnitt 8 & 13).
- **Keine erfundenen Presseartikel/Testimonials** (Abschnitt 13) — nur echte, überprüfbare Trust-Bausteine.
- **Empfehlung:** Vor Launch Text-Freigabe durch Anwalt (Heilpraktiker-/Werberecht) + Steuerberater (Abschnitt 8). Die Website wird so gebaut, dass Formulierungen leicht anpassbar sind.

---

## 11. Vor der Textproduktion zu klären (aus Abschnitt 14)

1. Offizielle Berufsbezeichnung (Hundegesundheitscoach vs. …) — rechtlich mit Anwalt.
2. Finale Preise (Vorschläge aus Abschnitt 3 bestätigen/anpassen).
3. Die 5 persönlichen Fragen aus Abschnitt 3b → emotionaler Kern für `/ueber-selin`.
4. Vorhandene Ausbildung/Zertifikate nennbar? (stärkt Trust erheblich)
5. Finale Bildauswahl der 3 Morpheus-Phasen (Hundemütze / Ausleitung / heute am Meer) + Hero-Foto + Video.

---

## 12. Umsetzungs-Roadmap

**Phase 0 — Vorbereitung (parallel):** Offene Fragen §11 klären · Anwalt/Steuerberater · Foto-/Videomaterial finalisieren · Google-Unternehmensprofil anlegen.

**Phase 1 — Fundament (Woche 1–2):** Astro-Projekt, Design-System (Farbwelt aus Konzept: Petrol `#2A6B7C` / Hellblau `#EAF4F7`), Layout, Rechtsseiten, Analytics + Consent, Schema-Grundgerüst.

**Phase 2 — Conversion-Kern (Woche 2–3):** Startseite, `/ueber-selin` (Morpheus-Story + Bildstrecke), `/methode`, `/angebot` + Paket-Detailseiten, `/kontakt` mit WhatsApp + Buchung + Stripe.

**Phase 3 — Sichtbarkeit (Woche 3–4):** `/wissen`-Hub + erste 4 Fachartikel (Abschnitt 13), `/haeufige-fragen`, Themen-Landingpages für Ads, `/lead-magnet`.

**Phase 4 — Ausbau (laufend):** `/academy`, `/podcast` (mit Transkripten), Redaktionsplan 2–4 Artikel/Monat, Bewertungswidget, GEO-/AEO-Feinschliff, später EN-Version (Abschnitt 10).

**Phase 5 — Optimierung (nach 4–8 Wochen, Abschnitt 12):** Kampagnen-/Text-/Paket-Optimierung anhand echter Daten; A/B-Tests auf Hero & CTA.

---

## 13. Erfolgskennzahlen

- **SEO:** Rankings der Keyword-Cluster (§5), organischer Traffic, indexierte Seiten.
- **GEO/AEO:** Erwähnungen/Zitate in KI-Antworten & AI Overviews, Featured Snippets, FAQ-Rich-Results.
- **Conversion:** WhatsApp-Klickrate, Terminbuchungen, Lead-Magnet-Downloads, Paketverkäufe, Academy-Mitglieder.
- **Business (Abschnitt 11):** Phase 1 ~2.000–6.000 €/Monat, Phase 2 ~6.000–20.000 €/Monat + Academy 1.500–6.000 €/Monat.
