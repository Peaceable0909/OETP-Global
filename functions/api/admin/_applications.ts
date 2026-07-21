export type ApplicationRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  destination: string;
  program: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

export type ApplicationDocumentRow = {
  id: number;
  application_id: string;
  doc_type: string;
  filename: string;
  size_bytes: number | null;
  created_at: string;
};

export function rowToApi(row: ApplicationRow) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    country: row.country,
    destination: row.destination,
    program: row.program ?? "",
    message: row.message ?? "",
    status: row.status,
    createdAt: row.created_at,
  };
}

// r2_key is deliberately left out of the public shape — the admin UI gets a
// download link (/api/admin/applications/{id}/documents/{docId}) built from
// the document's own id, not the raw storage key.
export function documentRowToApi(row: ApplicationDocumentRow) {
  return {
    id: row.id,
    applicationId: row.application_id,
    docType: row.doc_type,
    filename: row.filename,
    sizeBytes: row.size_bytes,
    createdAt: row.created_at,
  };
}

export const APPLICATION_STATUSES = ["new", "reviewing", "contacted", "completed"] as const;
