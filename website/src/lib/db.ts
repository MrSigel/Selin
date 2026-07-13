import { supabase } from "./supabase";

// ---------- Typen ----------
export interface Artikel {
  id: string;
  created_at?: string;
  updated_at?: string;
  published: boolean;
  slug: string | null;
  titel: string;
  beschreibung: string | null;
  kategorie: string | null;
  lesezeit: string | null;
  bild_url: string | null;
  image_label: string | null;
  inhalt: string | null;
  pub_date: string;
}

export interface GalerieItem {
  id: string;
  created_at?: string;
  published: boolean;
  bild_url: string;
  geschichte: string | null;
  sort: number;
}

// ---------- Helfer ----------
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

export function fmtDate(d: string | Date): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
}

export function euro(n: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n || 0);
}

export function escapeHtml(s: string): string {
  return (s || "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  );
}

/** Sehr einfacher Markdown->HTML-Wandler (Absätze, ## Überschriften, **fett**, - Listen). */
export function renderInhalt(src: string): string {
  const lines = (src || "").replace(/\r\n/g, "\n").split("\n");
  let html = "";
  let inList = false;
  const inline = (t: string) =>
    escapeHtml(t)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, href) => {
        // Interne Wissen-Artikel-Links auf die DB-Detailseite umschreiben
        const mm = String(href).match(/^\/wissen\/([a-z0-9-]+)\/?$/i);
        if (mm && mm[1] !== "beitrag") href = `/wissen/beitrag?slug=${mm[1]}`;
        return `<a href="${href}" class="font-medium text-petrol-700 underline underline-offset-2 hover:text-clay-600">${text}</a>`;
      });
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("## ")) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<h2>${inline(line.slice(3))}</h2>`;
    } else if (line.startsWith("- ")) {
      if (!inList) { html += "<ul>"; inList = true; }
      html += `<li>${inline(line.slice(2))}</li>`;
    } else if (line === "") {
      if (inList) { html += "</ul>"; inList = false; }
    } else {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<p>${inline(line)}</p>`;
    }
  }
  if (inList) html += "</ul>";
  return html;
}

// ---------- Storage ----------
export async function uploadMedia(file: File, folder: string): Promise<string> {
  const ext = (file.name.split(".").pop() || "bin").toLowerCase();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

// ---------- Wissen ----------
export async function listPublishedArtikel(): Promise<Artikel[]> {
  const { data, error } = await supabase
    .from("wissen_artikel")
    .select("*")
    .eq("published", true)
    .order("pub_date", { ascending: false });
  if (error) throw error;
  return (data as Artikel[]) || [];
}

export async function listAllArtikel(): Promise<Artikel[]> {
  const { data, error } = await supabase
    .from("wissen_artikel")
    .select("*")
    .order("pub_date", { ascending: false });
  if (error) throw error;
  return (data as Artikel[]) || [];
}

export async function getArtikel(id: string): Promise<Artikel | null> {
  const { data, error } = await supabase.from("wissen_artikel").select("*").eq("id", id).single();
  if (error) return null;
  return data as Artikel;
}

export async function getArtikelBySlug(slug: string): Promise<Artikel | null> {
  const { data, error } = await supabase.from("wissen_artikel").select("*").eq("slug", slug).single();
  if (error) return null;
  return data as Artikel;
}

export async function saveArtikel(a: Partial<Artikel>): Promise<Artikel> {
  const payload = { ...a };
  if (!payload.slug && payload.titel) payload.slug = `${slugify(payload.titel)}-${Date.now().toString(36)}`;
  let res;
  if (payload.id) {
    res = await supabase.from("wissen_artikel").update(payload).eq("id", payload.id).select().single();
  } else {
    res = await supabase.from("wissen_artikel").insert(payload).select().single();
  }
  if (res.error) throw res.error;
  return res.data as Artikel;
}

export async function deleteArtikel(id: string): Promise<void> {
  const { error } = await supabase.from("wissen_artikel").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Galerie ----------
export async function listPublicGalerie(): Promise<GalerieItem[]> {
  const { data, error } = await supabase
    .from("galerie")
    .select("*")
    .eq("published", true)
    .order("sort", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as GalerieItem[]) || [];
}

export async function listAllGalerie(): Promise<GalerieItem[]> {
  const { data, error } = await supabase
    .from("galerie")
    .select("*")
    .order("sort", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as GalerieItem[]) || [];
}

export async function createGalerie(item: Partial<GalerieItem>): Promise<GalerieItem> {
  const { data, error } = await supabase.from("galerie").insert(item).select().single();
  if (error) throw error;
  return data as GalerieItem;
}

export async function deleteGalerie(id: string): Promise<void> {
  const { error } = await supabase.from("galerie").delete().eq("id", id);
  if (error) throw error;
}

export async function setGaleriePublished(id: string, published: boolean): Promise<void> {
  const { error } = await supabase.from("galerie").update({ published }).eq("id", id);
  if (error) throw error;
}

// ---------- Erst-Check Lead ----------
export async function saveErstCheckLead(lead: {
  name?: string;
  email?: string;
  phone?: string;
  ergebnis_typ?: string;
  antworten?: unknown;
  consent?: boolean;
}): Promise<void> {
  const { error } = await supabase.from("erst_check_leads").insert(lead);
  if (error) throw error;
}

// ---------- Generische Tabellen-Helfer (CRM) ----------
export async function listRows(table: string, order = "created_at", asc = false): Promise<any[]> {
  const { data, error } = await supabase.from(table).select("*").order(order, { ascending: asc });
  if (error) throw error;
  return data || [];
}

export async function insertRow(table: string, row: Record<string, unknown>): Promise<any> {
  const { data, error } = await supabase.from(table).insert(row).select().single();
  if (error) throw error;
  return data;
}

export async function updateRow(table: string, id: string, patch: Record<string, unknown>): Promise<void> {
  const { error } = await supabase.from(table).update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteRow(table: string, id: string): Promise<void> {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}

export async function countRows(table: string): Promise<number> {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
  if (error) throw error;
  return count || 0;
}
