import { json, type Env } from "./types";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { name?: string; contact?: string; channel?: string; destination?: string; note?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Expected JSON body" }, 400);
  }

  const contact = (body.contact ?? "").trim();
  if (!contact) return json({ error: "A phone, email or handle is required." }, 400);

  await env.DB.prepare(
    `INSERT INTO leads (name, contact, channel, destination_interest, note) VALUES (?, ?, ?, ?, ?)`
  )
    .bind(
      (body.name ?? "").trim() || null,
      contact,
      (body.channel ?? "web").trim(),
      (body.destination ?? "").trim() || null,
      (body.note ?? "").trim() || null
    )
    .run();

  return json({ ok: true });
};
