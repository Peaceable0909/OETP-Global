import { json, type Env } from "../types";
import { verifyPassword, createSession } from "./_auth";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Expected JSON body" }, 400);
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (!password) {
    return json({ error: "Password is required" }, 400);
  }

  const ok = await verifyPassword(env, password);
  if (!ok) {
    return json({ error: "Incorrect password" }, 401);
  }

  const { cookie } = await createSession(env);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "Set-Cookie": cookie,
    },
  });
};
