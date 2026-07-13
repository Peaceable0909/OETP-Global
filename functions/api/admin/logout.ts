import { type Env } from "../types";
import { destroySession, clearSessionCookie } from "./_auth";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  await destroySession(request, env);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "Set-Cookie": clearSessionCookie(),
    },
  });
};
