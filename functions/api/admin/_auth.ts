import type { Env } from "../types";

const COOKIE_NAME = "admin_session";
const SESSION_DAYS = 7;

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPassword(env: Env, candidate: string): Promise<boolean> {
  if (!env.ADMIN_PASSWORD) return false;
  const [a, b] = await Promise.all([sha256Hex(candidate), sha256Hex(env.ADMIN_PASSWORD)]);
  return a === b;
}

export async function createSession(env: Env): Promise<{ cookie: string }> {
  const token = randomToken();
  const tokenHash = await sha256Hex(token);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();

  await env.DB.prepare(
    `INSERT INTO admin_sessions (token_hash, expires_at) VALUES (?, ?)`
  )
    .bind(tokenHash, expiresAt)
    .run();

  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  const cookie = `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
  return { cookie };
}

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("Cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return null;
}

export async function requireAdmin(request: Request, env: Env): Promise<boolean> {
  const token = readCookie(request, COOKIE_NAME);
  if (!token) return false;

  const tokenHash = await sha256Hex(token);
  await env.DB.prepare(`DELETE FROM admin_sessions WHERE expires_at < datetime('now')`).run();

  const row = await env.DB.prepare(
    `SELECT token_hash FROM admin_sessions WHERE token_hash = ? AND expires_at > datetime('now')`
  )
    .bind(tokenHash)
    .first();

  if (!row) return false;

  await env.DB.prepare(`UPDATE admin_sessions SET last_seen_at = datetime('now') WHERE token_hash = ?`)
    .bind(tokenHash)
    .run();

  return true;
}

export async function destroySession(request: Request, env: Env): Promise<void> {
  const token = readCookie(request, COOKIE_NAME);
  if (!token) return;
  const tokenHash = await sha256Hex(token);
  await env.DB.prepare(`DELETE FROM admin_sessions WHERE token_hash = ?`).bind(tokenHash).run();
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}
