import { Suspense } from "react";
import EditCountryForm from "@/components/admin/EditCountryForm";

export default function EditCountryPage() {
  return (
    <Suspense>
      <EditCountryForm />
    </Suspense>
  );
}
