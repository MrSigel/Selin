import {
  listRows, insertRow, updateRow, deleteRow, uploadMedia,
  fmtDate, euro, escapeHtml,
} from "./db";

// ---------- Typen ----------
type FieldType =
  | "text" | "textarea" | "number" | "date" | "datetime"
  | "select" | "image" | "file" | "checkbox" | "email" | "tel";

export interface Field {
  key: string;
  label: string;
  type?: FieldType;
  options?: { value: string; label: string }[];
  required?: boolean;
  maxlength?: number;
  placeholder?: string;
  folder?: string;                 // Upload-Ordner für image/file
  metaKeys?: { name?: string; type?: string; size?: string }; // file: Zusatzfelder
  help?: string;
}

type ColType = "text" | "date" | "datetime" | "euro" | "badge" | "image" | "images" | "bool" | "link" | "truncate";

export interface Column {
  key: string;
  label: string;
  type?: ColType;
  hrefTemplate?: (row: any) => string;   // für type 'link'
  linkLabel?: string;
}

export interface ResourceConfig {
  table: string;
  singular: string;
  columns: Column[];
  fields: Field[];
  order?: string;
  asc?: boolean;
  defaults?: Record<string, unknown>;
  emptyText?: string;
  /** Beschriftung des Anlegen-Buttons (Standard: „+ Neu") */
  newLabel?: string;
  /** Prüft die Eingabe vor dem Speichern. Rückgabe = Fehlertext, null = in Ordnung. */
  validate?: (row: Record<string, unknown>) => string | null;
  /** optionale Zusammenfassung über der Tabelle (z. B. Summen) */
  summary?: (rows: any[]) => string;
}

// ---------- Toast ----------
function toast(msg: string, ok = true) {
  let host = document.getElementById("crm-toast");
  if (!host) {
    host = document.createElement("div");
    host.id = "crm-toast";
    host.className = "fixed bottom-5 right-5 z-[80] flex flex-col gap-2";
    document.body.appendChild(host);
  }
  const el = document.createElement("div");
  el.className =
    "rounded-xl px-4 py-3 text-sm text-white shadow-lg " + (ok ? "bg-petrol-700" : "bg-rust-600");
  el.textContent = msg;
  host.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

// ---------- Zellen-Renderer ----------
function cell(row: any, col: Column): string {
  const v = row[col.key];
  switch (col.type) {
    case "date": return v ? escapeHtml(fmtDate(v)) : "–";
    case "datetime": return v ? escapeHtml(new Date(v).toLocaleString("de-DE")) : "–";
    case "euro": return escapeHtml(euro(Number(v)));
    case "bool":
      return v
        ? `<span class="rounded-full bg-petrol-100 px-2 py-0.5 text-xs font-medium text-petrol-700">ja</span>`
        : `<span class="rounded-full bg-sand-200 px-2 py-0.5 text-xs font-medium text-sand-600">nein</span>`;
    case "badge":
      return v ? `<span class="rounded-full bg-clay-100 px-2 py-0.5 text-xs font-medium text-clay-700">${escapeHtml(String(v))}</span>` : "–";
    case "image":
      return v ? `<img src="${escapeHtml(String(v))}" alt="" class="h-10 w-14 rounded object-cover" />` : "–";
    case "images": {
      const arr = Array.isArray(v) ? v : [];
      if (!arr.length) return "–";
      return (
        arr.slice(0, 5).map((u: string) =>
          `<a href="${escapeHtml(u)}" target="_blank" rel="noopener" class="mr-1 inline-block"><img src="${escapeHtml(u)}" alt="" class="h-10 w-10 rounded object-cover" /></a>`
        ).join("") + (arr.length > 5 ? `<span class="text-xs text-sand-500">+${arr.length - 5}</span>` : "")
      );
    }
    case "link":
      return col.hrefTemplate
        ? `<a href="${escapeHtml(col.hrefTemplate(row))}" target="_blank" rel="noopener" class="font-medium text-petrol-600 underline underline-offset-2 hover:text-clay-600">${escapeHtml(col.linkLabel || "öffnen")}</a>`
        : "–";
    case "truncate":
      return v ? `<span class="block max-w-[22ch] truncate" title="${escapeHtml(String(v))}">${escapeHtml(String(v))}</span>` : "–";
    default:
      return v == null || v === "" ? "–" : escapeHtml(String(v));
  }
}

// ---------- Formularfeld ----------
function fieldHtml(f: Field, value: any): string {
  const base =
    "mt-1.5 w-full rounded-lg border border-sand-300 bg-sand-50 px-4 py-2.5 text-sand-800 focus:border-petrol-500 focus:bg-white focus:outline-none";
  const val = value ?? "";
  const req = f.required ? "required" : "";
  const help = f.help ? `<span class="mt-1 block text-xs text-sand-500">${escapeHtml(f.help)}</span>` : "";
  let input = "";
  switch (f.type) {
    case "textarea":
      input = `<textarea name="${f.key}" rows="8" ${req} maxlength="${f.maxlength || 20000}" placeholder="${escapeHtml(f.placeholder || "")}" class="${base}">${escapeHtml(String(val))}</textarea>`;
      break;
    case "select":
      input = `<select name="${f.key}" ${req} class="${base}">${(f.options || [])
        .map((o) => `<option value="${escapeHtml(o.value)}" ${String(val) === o.value ? "selected" : ""}>${escapeHtml(o.label)}</option>`)
        .join("")}</select>`;
      break;
    case "checkbox":
      input = `<label class="mt-1.5 inline-flex items-center gap-2"><input type="checkbox" name="${f.key}" ${val ? "checked" : ""} class="h-4 w-4 rounded border-sand-300 text-petrol-600 focus:ring-petrol-500" /><span class="text-sm text-sand-600">${escapeHtml(f.placeholder || "aktiv")}</span></label>`;
      break;
    case "image":
    case "file":
      input = `
        <input type="hidden" name="${f.key}" value="${escapeHtml(String(val))}" />
        <div class="mt-1.5 flex items-center gap-3">
          <input type="file" data-upload="${f.key}" data-folder="${f.folder || "media"}" ${f.type === "image" ? 'accept="image/*"' : ""} class="text-sm text-sand-600 file:mr-3 file:rounded-full file:border-0 file:bg-petrol-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-petrol-700 hover:file:bg-petrol-200" />
          <span data-upload-status="${f.key}" class="text-xs text-sand-500"></span>
        </div>
        <div data-preview="${f.key}" class="mt-2">${val && f.type === "image" ? `<img src="${escapeHtml(String(val))}" class="h-20 w-28 rounded object-cover" />` : ""}</div>`;
      break;
    case "number":
      input = `<input type="number" step="0.01" name="${f.key}" value="${escapeHtml(String(val))}" ${req} class="${base}" />`;
      break;
    case "date":
      input = `<input type="date" name="${f.key}" value="${val ? String(val).slice(0, 10) : ""}" ${req} class="${base}" />`;
      break;
    case "datetime":
      input = `<input type="datetime-local" name="${f.key}" value="${val ? new Date(val).toISOString().slice(0, 16) : ""}" ${req} class="${base}" />`;
      break;
    default:
      input = `<input type="${f.type || "text"}" name="${f.key}" value="${escapeHtml(String(val))}" ${req} maxlength="${f.maxlength || 500}" placeholder="${escapeHtml(f.placeholder || "")}" class="${base}" />`;
  }
  return `<label class="block"><span class="text-sm font-medium text-sand-700">${escapeHtml(f.label)}${f.required ? " *" : ""}</span>${input}${help}</label>`;
}

// ---------- Hauptfunktion ----------
export function mountResource(cfg: ResourceConfig) {
  const root = document.getElementById("crm-root");
  if (!root) return;

  root.innerHTML = `
    <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
      <p id="crm-count" class="text-sm text-sand-500">Wird geladen …</p>
      <button id="crm-new" class="inline-flex items-center gap-2 rounded-full bg-clay-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-clay-700">${escapeHtml(cfg.newLabel || "+ Neu")}</button>
    </div>
    <div id="crm-summary"></div>
    <div class="overflow-x-auto rounded-2xl border border-sand-200 bg-white">
      <table class="min-w-full divide-y divide-sand-100 text-sm">
        <thead class="bg-sand-50 text-left text-xs uppercase tracking-wide text-sand-500">
          <tr>${cfg.columns.map((c) => `<th class="whitespace-nowrap px-4 py-3 font-semibold">${escapeHtml(c.label)}</th>`).join("")}<th class="px-4 py-3"></th></tr>
        </thead>
        <tbody id="crm-tbody" class="divide-y divide-sand-100"></tbody>
      </table>
    </div>

    <div id="crm-modal" class="fixed inset-0 z-[70] hidden items-start justify-center overflow-y-auto bg-petrol-950/50 p-4 sm:items-center">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div class="mb-5 flex items-center justify-between">
          <h2 id="crm-modal-title" class="font-serif text-xl text-petrol-900"></h2>
          <button id="crm-modal-close" class="rounded-lg p-1.5 text-sand-500 hover:bg-sand-100" aria-label="Schließen">✕</button>
        </div>
        <form id="crm-form" class="space-y-4"></form>
      </div>
    </div>`;

  const tbody = root.querySelector("#crm-tbody") as HTMLElement;
  const countEl = root.querySelector("#crm-count") as HTMLElement;
  const summaryEl = root.querySelector("#crm-summary") as HTMLElement;
  const modal = root.querySelector("#crm-modal") as HTMLElement;
  const modalTitle = root.querySelector("#crm-modal-title") as HTMLElement;
  const form = root.querySelector("#crm-form") as HTMLFormElement;

  let editing: any = null;

  function openModal(row: any | null) {
    editing = row;
    modalTitle.textContent = (row ? "Bearbeiten" : "Neu") + ": " + cfg.singular;
    form.innerHTML =
      cfg.fields.map((f) => fieldHtml(f, row ? row[f.key] : (cfg.defaults?.[f.key] ?? ""))).join("") +
      `<div class="flex justify-end gap-3 pt-2">
        <button type="button" id="crm-cancel" class="rounded-full px-5 py-2.5 text-sm font-medium text-sand-600 hover:bg-sand-100">Abbrechen</button>
        <button type="submit" class="rounded-full bg-petrol-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-petrol-800">Speichern</button>
      </div>`;
    wireUploads();
    form.querySelector("#crm-cancel")?.addEventListener("click", closeModal);
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
  function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    editing = null;
  }

  function wireUploads() {
    form.querySelectorAll<HTMLInputElement>("input[type=file][data-upload]").forEach((inp) => {
      inp.addEventListener("change", async () => {
        const file = inp.files?.[0];
        if (!file) return;
        const key = inp.dataset.upload!;
        const folder = inp.dataset.folder || "media";
        const status = form.querySelector(`[data-upload-status="${key}"]`) as HTMLElement;
        const hidden = form.querySelector(`input[name="${key}"]`) as HTMLInputElement;
        const preview = form.querySelector(`[data-preview="${key}"]`) as HTMLElement;
        status.textContent = "lädt hoch …";
        try {
          const url = await uploadMedia(file, folder);
          hidden.value = url;
          status.textContent = "hochgeladen ✓";
          if (file.type.startsWith("image/")) preview.innerHTML = `<img src="${url}" class="h-20 w-28 rounded object-cover" />`;
          // Zusatzfelder (Dokumente)
          const field = cfg.fields.find((f) => f.key === key);
          if (field?.metaKeys) {
            if (field.metaKeys.name) {
              const n = form.querySelector(`[name="${field.metaKeys.name}"]`) as HTMLInputElement;
              if (n && !n.value) n.value = file.name;
            }
            if (field.metaKeys.type) {
              const t = form.querySelector(`[name="${field.metaKeys.type}"]`) as HTMLInputElement;
              if (t) t.value = file.type;
            }
            if (field.metaKeys.size) {
              const s = form.querySelector(`[name="${field.metaKeys.size}"]`) as HTMLInputElement;
              if (s) s.value = String(file.size);
            }
          }
        } catch (e) {
          status.textContent = "Upload fehlgeschlagen";
          toast("Upload fehlgeschlagen – ist der Storage-Bucket 'media' angelegt?", false);
          console.error(e);
        }
      });
    });
  }

  function collect(): Record<string, unknown> {
    const fd = new FormData(form);
    const out: Record<string, unknown> = {};
    for (const f of cfg.fields) {
      if (f.type === "checkbox") { out[f.key] = fd.get(f.key) != null; continue; }
      let v = fd.get(f.key);
      let s = v == null ? "" : String(v);
      if (s === "" && f.type !== "number") { out[f.key] = null; continue; }
      if (f.type === "number") { out[f.key] = s === "" ? null : Number(s); continue; }
      if (f.type === "datetime" && s) { out[f.key] = new Date(s).toISOString(); continue; }
      out[f.key] = s;
    }
    return out;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = collect();
    const problem = cfg.validate?.(payload);
    if (problem) { toast(problem, false); return; }
    const btn = form.querySelector("button[type=submit]") as HTMLButtonElement;
    btn.disabled = true; btn.textContent = "Speichert …";
    try {
      if (editing?.id) await updateRow(cfg.table, editing.id, payload);
      else await insertRow(cfg.table, { ...(cfg.defaults || {}), ...payload });
      toast("Gespeichert");
      closeModal();
      await load();
    } catch (err: any) {
      toast(err?.message || "Speichern fehlgeschlagen", false);
      btn.disabled = false; btn.textContent = "Speichern";
      console.error(err);
    }
  });

  async function remove(row: any) {
    if (!confirm(`„${cfg.singular}" wirklich löschen?`)) return;
    try {
      await deleteRow(cfg.table, row.id);
      toast("Gelöscht");
      await load();
    } catch (e: any) {
      toast(e?.message || "Löschen fehlgeschlagen", false);
    }
  }

  function renderRows(rows: any[]) {
    countEl.textContent = `${rows.length} ${rows.length === 1 ? "Eintrag" : "Einträge"}`;
    summaryEl.innerHTML = cfg.summary ? cfg.summary(rows) : "";
    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="${cfg.columns.length + 1}" class="px-4 py-10 text-center text-sand-500">${escapeHtml(cfg.emptyText || "Noch keine Einträge.")}</td></tr>`;
      return;
    }
    tbody.innerHTML = "";
    rows.forEach((row) => {
      const tr = document.createElement("tr");
      tr.className = "hover:bg-sand-50/60";
      tr.innerHTML =
        cfg.columns.map((c) => `<td class="px-4 py-3 align-middle text-sand-700">${cell(row, c)}</td>`).join("") +
        `<td class="whitespace-nowrap px-4 py-3 text-right">
          <button data-edit class="rounded-lg px-2.5 py-1 text-xs font-medium text-petrol-700 hover:bg-petrol-50">Bearbeiten</button>
          <button data-del class="rounded-lg px-2.5 py-1 text-xs font-medium text-rust-600 hover:bg-rust-50">Löschen</button>
        </td>`;
      tr.querySelector("[data-edit]")?.addEventListener("click", () => openModal(row));
      tr.querySelector("[data-del]")?.addEventListener("click", () => remove(row));
      tbody.appendChild(tr);
    });
  }

  async function load() {
    try {
      const rows = await listRows(cfg.table, cfg.order || "created_at", cfg.asc ?? false);
      renderRows(rows);
    } catch (e: any) {
      countEl.textContent = "";
      tbody.innerHTML = `<tr><td colspan="${cfg.columns.length + 1}" class="px-4 py-10 text-center text-rust-600">Konnte nicht geladen werden. Ist das Datenbank-Schema eingerichtet?<br><span class="text-xs text-sand-500">${escapeHtml(e?.message || "")}</span></td></tr>`;
      console.error(e);
    }
  }

  root.querySelector("#crm-new")?.addEventListener("click", () => openModal(null));
  root.querySelector("#crm-modal-close")?.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  load();
}
