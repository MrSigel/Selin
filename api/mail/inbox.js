import { ImapFlow } from "imapflow";
import { createClient } from "@supabase/supabase-js";

// Nur eingeloggte CRM-Nutzer (Supabase-Session) dürfen zugreifen.
async function requireUser(req) {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!token) return null;
  try {
    const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await sb.auth.getUser(token);
    return error ? null : data?.user || null;
  } catch {
    return null;
  }
}

function imapClient() {
  return new ImapFlow({
    host: process.env.MAIL_IMAP_HOST || "imap.strato.de",
    port: Number(process.env.MAIL_IMAP_PORT || 993),
    secure: true,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
    logger: false,
  });
}

export default async function handler(req, res) {
  if (!(await requireUser(req))) return res.status(401).json({ error: "unauthorized" });
  const client = imapClient();
  try {
    await client.connect();
    const messages = [];
    const lock = await client.getMailboxLock("INBOX");
    try {
      const total = client.mailbox?.exists || 0;
      if (total > 0) {
        const start = Math.max(1, total - 29); // letzte 30
        for await (const m of client.fetch(`${start}:*`, {
          uid: true, envelope: true, flags: true, internalDate: true,
        })) {
          const f = m.envelope?.from?.[0];
          messages.push({
            uid: m.uid,
            seen: m.flags?.has ? m.flags.has("\\Seen") : false,
            subject: m.envelope?.subject || "(kein Betreff)",
            from: f?.name || f?.address || "",
            fromAddress: f?.address || "",
            date: m.internalDate || m.envelope?.date || null,
          });
        }
      }
    } finally {
      lock.release();
    }
    await client.logout();
    messages.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    res.status(200).json({ messages });
  } catch (e) {
    try { await client.logout(); } catch {}
    res.status(500).json({ error: String(e?.message || e) });
  }
}
