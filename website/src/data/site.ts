/**
 * Zentrale Website-Konfiguration.
 * Platzhalter (WhatsApp-Nummer, Buchungslink etc.) hier zentral anpassen.
 */

export const site = {
  name: "Selin Weikard",
  tagline: "Ganzheitliche Hundegesundheit",
  claim: "Ich war da, wo du jetzt bist. Und ich weiß, wie es weitergeht.",
  domain: "https://www.selin-weikard.de",
  description:
    "Ganzheitliche Begleitung für Hundegesundheit: Ursache statt Symptom. Homöopathie, Ernährung und Naturheilkunde – online, weltweit. Aus eigener Erfahrung mit Rhodesian Ridgeback Morpheus.",
  email: "info@limit-breakers.eu",
  phone: "+359 895 500 755",
  // WhatsApp: internationale Nummer ohne + und ohne Leerzeichen (TODO: echte Nummer eintragen)
  // Alle Anfragen laufen ausschließlich über WhatsApp.
  whatsappNumber: "491700000000",
  whatsappPrefill:
    "Können wir den Erst-Check durchführen damit ich weiß welches Paket das richtige ist?",
} as const;

/**
 * Rechtliche Angaben für Impressum, Datenschutz & AGB.
 * Betreibende Gesellschaft: Limitbreakers OOD (kein Personenname im Impressum).
 */
export const legal = {
  name: "Limitbreakers OOD",
  representative: "Dr. Maya Neidenowa",
  street: "Shipka 36",
  postalCode: "1504",
  city: "Sofia",
  country: "Bulgarien",
  vatId: "BG206546638",
  email: "info@limit-breakers.eu",
  phone: "+359 895 500 755",
  lastUpdated: "Juli 2026",
} as const;

export function whatsappLink(message: string = site.whatsappPrefill): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Hauptnavigation */
export const nav = [
  { label: "Methode", href: "/methode" },
  { label: "Angebot", href: "/angebot" },
  { label: "Über Selin", href: "/ueber-selin" },
  { label: "Galerie", href: "/galerie" },
  { label: "Hunde-Check", href: "/hunde-check" },
  { label: "Academy", href: "/academy" },
  { label: "Podcast", href: "/podcast" },
  { label: "Wissen", href: "/wissen" },
  { label: "FAQ", href: "/haeufige-fragen" },
] as const;

/** Die 5-Schritte-Methode (Abschnitt 1 des Konzepts) */
export const methodSteps = [
  {
    title: "Anamnese",
    icon: "chat",
    text: "Symptome, Vorgeschichte und bisherige Behandlungsversuche werden vollständig erfasst – nichts wird vorschnell abgetan.",
  },
  {
    title: "Ganzheitlicher Blick",
    icon: "compass",
    text: "Ernährung, Darm, Immunsystem und Verhalten werden zusammen betrachtet. Bei körperlichen Blockaden ggf. Weiterempfehlung an einen Tier-Chiropraktiker.",
  },
  {
    title: "Ursache erkennen",
    icon: "search",
    text: "Die verborgene Verbindung zwischen Symptom und eigentlicher Wurzel wird sichtbar gemacht – oft dort, wo vorher niemand hingeschaut hat.",
  },
  {
    title: "Plan",
    icon: "leaf",
    text: "Homöopathische Begleitung, Ernährungsanpassung, sinnvolle Ergänzungen – individuell abgestimmt, bei Bedarf mit Weiterempfehlung an Spezialisten.",
  },
  {
    title: "Begleitung",
    icon: "handHeart",
    text: "Den Verlauf beobachten, anpassen und langfristig stabilisieren – damit aus einer Verbesserung dauerhafte Gesundheit wird.",
  },
] as const;

export type Pkg = {
  slug: string;
  name: string;
  price: string;
  priceValue: number;
  tagline: string;
  content: string;
  features: string[];
  meta: string;
  forWhom: string;
  featured?: boolean;
};

/** Angebotsstruktur (Abschnitt 3 des Konzepts) */
export const packages: Pkg[] = [
  {
    slug: "erst-check",
    name: "Erst-Check",
    price: "99 €",
    priceValue: 99,
    tagline: "Der erste ehrliche Blick auf deinen Hund.",
    content:
      "60 Minuten Einzelsession online – Anamnese, erste Einschätzung von Körper, Ernährung & Verhalten, mit schriftlichem Kurz-Feedback danach.",
    features: [
      "60 Min Einzelsession online",
      "Anamnese & erste Einordnung",
      "Blick auf Körper, Ernährung & Verhalten",
      "Schriftliches Kurz-Feedback im Anschluss",
    ],
    meta: "1 Session · 60 Min",
    forWhom:
      "Perfekt für den Einstieg, wenn du eine ehrliche erste Einschätzung möchtest, bevor du dich auf mehr festlegst.",
  },
  {
    slug: "ursachen-klarheit",
    name: "Ursachen-Klarheit",
    price: "349 €",
    priceValue: 349,
    tagline: "Endlich verstehen, was wirklich los ist.",
    content:
      "Zwei ausführliche Beratungen plus individueller Plan und ein Follow-up – für alle, die der Ursache wirklich auf den Grund gehen wollen.",
    features: [
      "2× 60 Min Beratung",
      "Individueller Plan (Mittel / Ernährung / Übungen)",
      "1 Follow-up nach 2 Wochen",
      "Schriftliche Zusammenfassung",
    ],
    meta: "2 Sessions + Follow-up",
    forWhom:
      "Für Halter, die einem konkreten Anliegen wirklich auf den Grund gehen und einen klaren Plan an die Hand bekommen wollen.",
    featured: true,
  },
  {
    slug: "gesundheits-reset",
    name: "Gesundheits-Reset",
    price: "890 €",
    priceValue: 890,
    tagline: "Sechs Wochen konsequente Begleitung.",
    content:
      "3–4 Sitzungen über 6 Wochen, vertiefte ganzheitliche Begleitung mit schriftlichen Anpassungen und WhatsApp-Begleitung an Werktagen.",
    features: [
      "3–4 Sitzungen über 6 Wochen",
      "Vertiefte ganzheitliche Begleitung",
      "Laufende schriftliche Anpassungen",
      "WhatsApp-Begleitung (werktags)",
    ],
    meta: "6 Wochen · 3–4 Sessions",
    forWhom:
      "Wenn ein Thema konsequent über mehrere Wochen begleitet werden soll – mit laufenden Anpassungen unterwegs.",
  },
  {
    slug: "volle-begleitung",
    name: "Volle Begleitung",
    price: "1.890 €",
    priceValue: 1890,
    tagline: "Drei Monate, mehrere Themen, ein Ziel.",
    content:
      "6–8 Sitzungen über 3 Monate über mehrere Themenbereiche hinweg – Körper, Ernährung und Verhalten – mit durchgehender Begleitung.",
    features: [
      "6–8 Sitzungen über 3 Monate",
      "Mehrere Themenbereiche (Körper, Ernährung, Verhalten)",
      "Durchgehende Begleitung",
      "Priorisierte Rückfragen",
    ],
    meta: "3 Monate · 6–8 Sessions",
    forWhom:
      "Für mehrere ineinandergreifende Themen – Körper, Ernährung und Verhalten – über einen längeren Zeitraum.",
  },
  {
    slug: "lifetime-partner",
    name: "Lifetime-Partner",
    price: "2.990 €",
    priceValue: 2990,
    tagline: "Ein halbes Jahr an deiner Seite.",
    content:
      "6 Monate intensive Begleitung mit durchgehendem persönlichem Zugang – inklusive Academy-Zugang für die gesamte Laufzeit.",
    features: [
      "6 Monate intensive Begleitung",
      "Durchgehender persönlicher Zugang",
      "Academy-Zugang für die gesamte Laufzeit",
      "Höchste Priorität",
    ],
    meta: "6 Monate · inkl. Academy",
    forWhom:
      "Für alle, die dauerhaft jemanden an ihrer Seite wollen – mit persönlichem Zugang und vollem Academy-Zugang.",
  },
];

/** Academy-Leistungen (Abschnitt 9) */
export const academyBenefits = [
  {
    title: "Zugang zur Learning Suite",
    text: "Lebenslang, solange die Mitgliedschaft aktiv läuft – alle Kurse und alle künftigen Updates inklusive.",
  },
  {
    title: "Monatlicher Kompetenz-Call",
    text: "1× im Monat live mit Selin – Fragen, Fallbesprechungen und neue Impulse.",
  },
  {
    title: 'Podcast „Drei Perspektiven, ein Hund"',
    text: "Tierärztin, Tier-Chiropraktiker und Selin – drei Blickwinkel auf denselben Hund.",
  },
  {
    title: "Wöchentliche WhatsApp-Runde",
    text: "Austausch-Runde für alle Mitglieder – sich gegenseitig unterstützen und Erfahrungen teilen.",
  },
];

/** Academy-Kursmodule (Abschnitt 9) */
export const academyModules = [
  {
    n: 1,
    title: "Grundlagen der ganzheitlichen Hundegesundheit",
    text: "Konventionelle vs. ganzheitliche Sicht, die drei Säulen Ernährung, Nahrungsergänzung und Homöopathie – und warum Hinterfragen schon beim Züchter beginnt.",
  },
  {
    n: 2,
    title: "Gesunde Ernährung für Hunde",
    text: "Vom Selbstkochen bis zum Baukasten-Prinzip: Protein, Gemüse, Öl – die Basis, die den Unterschied macht. Inkl. Portionsrechner-Vorlage.",
  },
  {
    n: 3,
    title: "Nahrungsergänzung & Kräuter",
    text: "Spirulina, MSM, OPC, Heilpilze, Grünlippenmuschel & Co. – Inhaltsstoffe verstehen statt Marketing glauben.",
  },
  {
    n: 4,
    title: "Homöopathie für Hunde – Einführung",
    text: "Vom Skeptiker zur Überzeugung: Grundprinzipien verständlich erklärt und erste häufige Mittel.",
  },
  {
    n: 5,
    title: "Praktische Mittelwahl & Potenzierung",
    text: "Anamnese, Mittelwahl und Potenzen praxisnah – inkl. der Kernmethodik: erst ausleiten, dann gezielt behandeln.",
  },
  {
    n: 6,
    title: "Häufige Krankheitsbilder & Protokolle",
    text: "Haut & Allergien, Gelenke, Verdauung, Verhalten – konkrete, nachvollziehbare Wege aus echten Erfahrungen.",
  },
  {
    n: 7,
    title: "Langfristige Betreuung & Erfolgskontrolle",
    text: "Reise-Hausapotheke, Gesundheitstagebuch und die Präventions-Haltung: Vorsorge statt Nachsorge.",
  },
];

/** Morpheus Vorher/Nachher-Bildstrecke (Abschnitt 3b) */
export const morpheusJourney = [
  {
    phase: "Leidenszeit",
    caption:
      "Die Hundemütze sollte verhindern, dass er sich beim Kopfschütteln die Ohren aufschlägt. Sie war eine Notlösung – keine Antwort auf die eigentliche Frage: Warum ist sein Immunsystem so aus dem Gleichgewicht?",
    alt: "Morpheus mit Hundemütze, Blick in die Kamera",
  },
  {
    phase: "Während der Ausleitung",
    caption:
      "Mitten im Prozess: Der Darm wird saniert, die Ernährung umgestellt. Man sieht noch die Spuren der alten Belastung im Fell – aber er findet wieder Ruhe.",
    alt: "Morpheus entspannt, Hautstellen im Fell noch sichtbar",
  },
  {
    phase: "Heute",
    caption:
      "Heute, mit fast 8 Jahren: glänzendes Fell, wache Augen, keine Ohrenprobleme mehr. Ich koche bis heute für ihn – aus Überzeugung, nicht aus Notwendigkeit.",
    alt: "Morpheus am Meer, glänzendes Fell, wacher Blick",
  },
];

/** Häufige Fragen (Abschnitt 2, 4, 8) – auch für FAQPage-Schema */
export const faqs = [
  {
    q: "Ersetzt das den Tierarzt?",
    a: "Nein – ausdrücklich nicht. Diese ganzheitliche Begleitung ist Coaching und Beratung, kein Ersatz für tierärztliche Diagnose oder Notfallbehandlung. Bei akuten Notfällen, schweren Erkrankungen oder unklaren Symptomen wird immer auf eine tierärztliche Abklärung verwiesen. Der Ansatz ist eine Ergänzung zur Tiermedizin, kein Gegensatz.",
  },
  {
    q: "Wie läuft eine Sitzung online ab?",
    a: "Die Sitzungen finden online per Videocall statt – ortsunabhängig, weltweit. Wir gehen die Anamnese durch, betrachten Ernährung, Körper und Verhalten deines Hundes gemeinsam und du bekommst im Anschluss eine schriftliche Einordnung. Anfrage und Terminabstimmung laufen unkompliziert über WhatsApp.",
  },
  {
    q: "Was, wenn mein Hund sehr ängstlich ist?",
    a: "Ängstlichkeit, Unruhe oder Rückzug haben oft eine körperliche Wurzel – Schmerzen, Blockaden oder Unverträglichkeiten, die der Hund nicht zeigen kann. Genau dieser Zusammenhang zwischen Körper und Verhalten steht im Mittelpunkt. Wir schauen also nicht nur auf das Verhalten, sondern auf das, was darunter liegt.",
  },
  {
    q: "Warum findet mein Tierarzt nichts?",
    a: "Viele Beschwerden zeigen sich nicht in einem einzelnen Befund, sondern erst im Zusammenspiel von Ernährung, Darm, Immunsystem und Nervensystem. Wenn einzelne Symptome behandelt werden, ohne die Verbindung dahinter zu sehen, verändert sich oft wenig. Der ganzheitliche Blick macht sichtbar, was einzeln betrachtet leicht übersehen wird.",
  },
  {
    q: "Für welche Hunde ist die Begleitung gedacht?",
    a: "Für Hundehalter, die merken: „Wir haben schon vieles probiert, aber niemand hat wirklich die Ursache gefunden“ – und die bereit sind, ganzheitlich auf ihren Hund zu schauen, statt nur das nächste Symptom zu behandeln. Viele Prinzipien gelten übrigens auch für Katzen.",
  },
  {
    q: "Welche Qualifikation hat Selin Weikard?",
    a: "Selin ist in Ausbildung zur Tierheilpraktikerin mit Schwerpunkt Tierhomöopathie. Ihr eigentliches Wissen stammt aus drei Jahren intensiver Eigenrecherche parallel zur Krankheit ihres Hundes Morpheus – aus echten Ergebnissen am eigenen Tier. Für chiropraktische Fragen arbeitet sie mit einem erfahrenen Tier-Chiropraktiker zusammen.",
  },
  {
    q: "Funktioniert die Beratung auch außerhalb Deutschlands?",
    a: "Ja. Das Angebot läuft vollständig online und richtet sich an Hundehalter weltweit – unabhängig vom Wohnort. Die Beratungen finden zunächst auf Deutsch statt, eine Erweiterung um weitere Sprachen ist geplant.",
  },
];
