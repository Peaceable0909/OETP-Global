// Mirrors functions/api/admin/_applications.ts's APPLICATION_STATUSES — kept
// in sync by hand, same as every other shape shared between the Next app and
// the Functions API in this project (they're separate build targets with no
// shared import path between src/ and functions/).
export const APPLICATION_STATUSES = ["new", "reviewing", "contacted", "completed"] as const;
