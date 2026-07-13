import { Suspense } from "react";
import EditStoryForm from "@/components/admin/EditStoryForm";

export default function EditStoryPage() {
  return (
    <Suspense>
      <EditStoryForm />
    </Suspense>
  );
}
