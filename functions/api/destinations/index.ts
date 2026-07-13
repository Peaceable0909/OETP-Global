import { json, type Env } from "../types";
import { rowToApi, type CountryRow } from "../admin/_countries";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare(
    `SELECT * FROM countries WHERE status = 'published' ORDER BY name`
  ).all<CountryRow>();

  return json({ destinations: results.map(rowToApi) });
};
