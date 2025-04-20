export const directorDetailsKeys = {
  all: ["director-details"] as const,

  get: (directorDetailId: string | null) => [
    ...directorDetailsKeys.all,
    "get",
    directorDetailId,
  ],
  listing: (companyId: string) => [
    ...directorDetailsKeys.all,
    "listing",
    companyId,
  ],

  add: () => [...directorDetailsKeys.all, "add"],

  delete: (directorDetailId: string) => [
    ...directorDetailsKeys.all,
    "delete",
    directorDetailId,
  ],

  edit: (directorDetailId: string | null) => [
    ...directorDetailsKeys.all,
    "edit",
    directorDetailId,
  ],
};
