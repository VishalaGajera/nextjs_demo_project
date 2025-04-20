export const taxSectionsKeys = {
  all: ["tax-sections"] as const,

  listing: (requestBody: object = {}) =>
    [...taxSectionsKeys.all, "listing", requestBody] as const,

  add: () => [...taxSectionsKeys.all, "add"],

  edit: (taxSectionsId: string) => [
    ...taxSectionsKeys.all,
    "edit",
    taxSectionsId,
  ],

  get: (taxSectionsId: string) => [
    ...taxSectionsKeys.all,
    "get",
    taxSectionsId,
  ],

  delete: (taxSectionsId: string) => [
    ...taxSectionsKeys.all,
    "delete",
    taxSectionsId,
  ],

  options: () => [...taxSectionsKeys.all, "options"],
};
