import { json, type Env } from "../types";
import { requireAdmin } from "./_auth";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const ok = await requireAdmin(request, env);
  if (!ok) return json({ authenticated: false }, 401);
  return json({ authenticated: true });
};
