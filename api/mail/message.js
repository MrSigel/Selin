import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { createClient } from "@supabase/supabase-js";

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
  const uid = String(req.query.uid || "");
  if (!uid) return res.status(400).json({ error: "uid fehlt" });

  const client = imapClient();
  try {
    await client.connect();
    let out = null;
    const lock = await client.getMailboxLock("INBOX");
    try {
      const msg = await client.fetchOne(uid, { source: true }, { uid: true });
      if (msg && msg.source) {
        const p = await simpleParser(msg.source);
        out = {
          uid,
          subject: p.subject || "(kein Betreff)",
          from: p.from?.text || "",
          to: p.to?.text || "",
          date: p.date || null,
          html: p.html || null,
          text: p.text || "",
        };
        try { await client.messageFlagsAdd(uid, ["\\Seen"], { uid: true }); } catch {}
      }
    } finally {
      lock.release();
    }
    await client.logout();
    if (!out) return res.status(404).json({ error: "nicht gefunden" });
    res.status(200).json(out);
  } catch (e) {
    try { await client.logout(); } catch {}
    res.status(500).json({ error: String(e?.message || e) });
  }
}
