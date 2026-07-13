import { json, type Env } from "../types";
import { rowToApi, type TestimonialRow } from "../admin/_testimonials";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare(
    `SELECT * FROM testimonials WHERE status = 'published' ORDER BY sort_order, name`
  ).all<TestimonialRow>();

  return json({ testimonials: results.map(rowToApi) });
};
