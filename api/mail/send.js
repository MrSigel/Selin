import nodemailer from "nodemailer";
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

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });
  if (!(await requireUser(req))) return res.status(401).json({ error: "unauthorized" });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const { to, subject, text, html, inReplyTo, references } = body;
  if (!to || !subject || !(text || html)) {
    return res.status(400).json({ error: "to, subject und Text sind erforderlich" });
  }

  const port = Number(process.env.MAIL_SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SMTP_HOST || "smtp.strato.de",
    port,
    secure: port === 465,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.MAIL_USER,
      to,
      subject,
      text: text || undefined,
      html: html || undefined,
      inReplyTo: inReplyTo || undefined,
      references: references || undefined,
    });
    res.status(200).json({ ok: true, id: info.messageId });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
