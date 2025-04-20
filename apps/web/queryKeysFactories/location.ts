export const locationKeys = {
  all: ["location"] as const,

  listing: (body: object = {}) => [...locationKeys.all, "listing", body],

  add: () => [...locationKeys.all, "add"],

  edit: (locationId: string) => [...locationKeys.all, "edit", locationId],

  get: (locationId: string) => [...locationKeys.all, "get", locationId],

  delete: (locationId: string) => [...locationKeys.all, "delete", locationId],

  options: (businessUnitId?: string | null) => [
    ...locationKeys.all,
    "options",
    businessUnitId,
  ],

  multipleOptions: (businessUnitIds: string[]) => [
    ...locationKeys.all,
    "multiple-options",
    businessUnitIds,
  ],
};
