export const stateKeys = {
  all: ["state"] as const,

  listing: (countryId: string | null) => [
    ...stateKeys.all,
    countryId,
    "listing",
  ],
};
