import { Suspense } from "react";
import EditOfferForm from "@/components/admin/EditOfferForm";

export default function EditOfferPage() {
  return (
    <Suspense>
      <EditOfferForm />
    </Suspense>
  );
}
