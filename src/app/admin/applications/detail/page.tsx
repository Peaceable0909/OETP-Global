import { Suspense } from "react";
import ApplicationDetail from "@/components/admin/ApplicationDetail";

export default function ApplicationDetailPage() {
  return (
    <Suspense>
      <ApplicationDetail />
    </Suspense>
  );
}
