import type { Env } from "./types";

// Resend's shared sandbox sender — works before tenzaglobal.com is verified
// in Resend, so email sending can be tested end-to-end without waiting on
// domain verification. Override via the EMAIL_FROM env var once verified.
const DEFAULT_FROM = "CompeTenza Admissions <onboarding@resend.dev>";

export type SendEmailResult = { sent: boolean; error?: string };

// Never throws — callers treat email as a best-effort side effect, not
// something that should fail the request that triggered it (same contract
// as the DEPLOY_HOOK_URL fetch in the admin publish.ts routes).
export async function sendEmail(
  env: Env,
  opts: {
    to: string;
    subject: string;
    html: string;
    replyTo?: string;
    // Resend expects base64 content per attachment — same shape apply.ts
    // already builds its Apps Script document payload in, so callers can
    // reuse that array directly with no re-encoding.
    attachments?: { filename: string; content: string }[];
  }
): Promise<SendEmailResult> {
  if (!env.RESEND_API_KEY) {
    return { sent: false, error: "RESEND_API_KEY not configured — email not sent." };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM || DEFAULT_FROM,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        reply_to: opts.replyTo,
        attachments: opts.attachments,
      }),
    });
    if (!res.ok) {
      return { sent: false, error: `Resend responded with ${res.status}` };
    }
    return { sent: true };
  } catch (e) {
    return { sent: false, error: e instanceof Error ? e.message : "Email request failed" };
  }
}

const STATUS_LABELS: Record<string, string> = {
  new: "Received",
  reviewing: "Under Review",
  contacted: "Contacted",
  completed: "Completed",
};

function shell(bodyHtml: string): string {
  return `<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#111827">
    <p style="font-weight:800;font-size:13px;letter-spacing:0.05em;text-transform:uppercase;color:#2563EB;margin:0 0 16px">CompeTenza Business Services</p>
    ${bodyHtml}
    <p style="margin-top:32px;font-size:12px;color:#6B7280">Study. Work. Succeed Anywhere.</p>
  </div>`;
}

export function applicationConfirmationEmail(opts: { id: string; fullName: string; whatsapp: string }): {
  subject: string;
  html: string;
} {
  const firstName = opts.fullName.trim().split(/\s+/)[0] || "there";
  return {
    subject: `Application Received — ${opts.id}`,
    html: shell(`
      <h1 style="font-size:22px;margin:0 0 12px">Hi ${firstName}, we've got your application!</h1>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px">Your Application ID is</p>
      <p style="display:inline-block;font-size:22px;font-weight:800;letter-spacing:0.1em;background:#F8FAFC;border:1px solid #E5E7EB;border-radius:16px;padding:12px 20px;margin:0 0 16px">${opts.id}</p>
      <p style="font-size:14px;line-height:1.6;color:#4B5563;margin:0 0 20px">Save this ID — you'll use it in every conversation with us. A counselor will contact you within 24–48 hours.</p>
      <a href="${opts.whatsapp}?text=${encodeURIComponent(`Hello! I just applied. My Application ID is ${opts.id}.`)}"
         style="display:inline-block;background:#25D366;color:#fff;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:999px">Continue on WhatsApp</a>
    `),
  };
}

export function applicationStaffNotificationEmail(opts: {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  destination: string;
  program: string;
  message: string;
  documentNames: string[];
  driveFolderUrl?: string;
}): { subject: string; html: string } {
  const docsHtml =
    opts.documentNames.length > 0
      ? `<ul>${opts.documentNames.map((d) => `<li>${d}</li>`).join("")}</ul>`
      : "<p><em>No documents uploaded.</em></p>";
  return {
    subject: `New Application: ${opts.fullName} (${opts.id})`,
    html: shell(`
      <h1 style="font-size:20px;margin:0 0 12px">New application: ${opts.fullName}</h1>
      <p style="font-size:14px;line-height:1.7;margin:0 0 4px"><strong>Application ID:</strong> ${opts.id}</p>
      <p style="font-size:14px;line-height:1.7;margin:0 0 4px"><strong>Email:</strong> ${opts.email}</p>
      <p style="font-size:14px;line-height:1.7;margin:0 0 4px"><strong>Phone:</strong> ${opts.phone}</p>
      <p style="font-size:14px;line-height:1.7;margin:0 0 4px"><strong>Country:</strong> ${opts.country}</p>
      <p style="font-size:14px;line-height:1.7;margin:0 0 4px"><strong>Destination:</strong> ${opts.destination}</p>
      <p style="font-size:14px;line-height:1.7;margin:0 0 4px"><strong>Program:</strong> ${opts.program || "—"}</p>
      ${opts.message ? `<p style="font-size:14px;line-height:1.7;margin:8px 0 4px"><strong>Message:</strong> ${opts.message}</p>` : ""}
      <p style="font-size:14px;margin:16px 0 4px"><strong>Documents</strong> (attached):</p>
      ${docsHtml}
      ${opts.driveFolderUrl ? `<p style="font-size:13px;margin-top:12px"><a href="${opts.driveFolderUrl}">Open the Drive backup folder →</a></p>` : ""}
    `),
  };
}

export function statusUpdateEmail(opts: { id: string; fullName: string; status: string; whatsapp: string }): {
  subject: string;
  html: string;
} {
  const firstName = opts.fullName.trim().split(/\s+/)[0] || "there";
  const label = STATUS_LABELS[opts.status] ?? opts.status;
  return {
    subject: `Your CompeTenza Application (${opts.id}) — ${label}`,
    html: shell(`
      <h1 style="font-size:22px;margin:0 0 12px">Hi ${firstName}, your application status changed</h1>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px">Application <strong>${opts.id}</strong> is now:</p>
      <p style="display:inline-block;font-size:16px;font-weight:800;background:#EFF6FF;color:#2563EB;border-radius:999px;padding:8px 20px;margin:0 0 20px">${label}</p>
      <p style="font-size:14px;line-height:1.6;color:#4B5563;margin:0 0 20px">Questions about what this means? Message us any time.</p>
      <a href="${opts.whatsapp}?text=${encodeURIComponent(`Hi! Checking in about my application ${opts.id}.`)}"
         style="display:inline-block;background:#25D366;color:#fff;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:999px">Message us on WhatsApp</a>
    `),
  };
}
