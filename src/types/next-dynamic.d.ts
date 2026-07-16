// This Next.js version ships next/dynamic's runtime (node_modules/next/dynamic.js
// forwards to dist/shared/lib/dynamic.js, a real implementation) but no .d.ts for
// it — see AGENTS.md. Declaring the well-established public signature here rather
// than falling back to `declare module "next/dynamic";` (which would type it `any`).
declare module "next/dynamic" {
  import type { ComponentType } from "react";

  export interface DynamicOptions<P = Record<string, unknown>> {
    loading?: ComponentType<P> | (() => JSX.Element | null);
    ssr?: boolean;
  }

  export default function dynamic<P = Record<string, unknown>>(
    loader: () => Promise<ComponentType<P> | { default: ComponentType<P> }>,
    options?: DynamicOptions<P>
  ): ComponentType<P>;
}
