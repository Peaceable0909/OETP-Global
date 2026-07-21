import { Suspense } from "react";
import EditProgramForm from "@/components/admin/EditProgramForm";

export default function EditProgramPage() {
  return (
    <Suspense>
      <EditProgramForm />
    </Suspense>
  );
}
