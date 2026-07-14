import { json, type Env } from "./types";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare(`SELECT key, value FROM settings`).all<{ key: string; value: string }>();
  const settings: Record<string, string> = {};
  for (const row of results) settings[row.key] = row.value;

  return json({ settings });
};
