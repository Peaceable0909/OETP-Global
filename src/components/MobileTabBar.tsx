"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, MessageCircle, Compass } from "lucide-react";
import { DOCUMENT_PORTAL_URL } from "@/lib/documentPortal";

export default function MobileTabBar({ whatsapp }: { whatsapp: string }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  const tabCls = "flex flex-1 flex-col items-center justify-center gap-1 py-2.5";
  const iconWrapCls = (active: boolean) =>
    `grid h-8 w-8 place-items-center rounded-xl transition-colors ${
      active ? "bg-study text-white" : "text-ink-mute"
    }`;
  const labelCls = (active: boolean) => `text-[11px] font-bold ${active ? "text-study" : "text-ink-soft"}`;

  const applyActive = pathname?.startsWith("/apply") ?? false;
  const exploreActive = pathname?.startsWith("/destinations") ?? false;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-white/95 backdrop-blur sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a href={DOCUMENT_PORTAL_URL} className={tabCls}>
        <span className={iconWrapCls(applyActive)}>
          <FileText className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        <span className={labelCls(applyActive)}>Apply</span>
      </a>

      <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={tabCls}>
        <span className={iconWrapCls(false)}>
          <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        <span className={labelCls(false)}>Talk to Advisor</span>
      </a>

      <Link href="/destinations/" className={tabCls}>
        <span className={iconWrapCls(exploreActive)}>
          <Compass className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        <span className={labelCls(exploreActive)}>Explore</span>
      </Link>
    </nav>
  );
}
