export const countryKeys = {
  all: ["country"] as const,

  listing: () => [...countryKeys.all, "listing"],
};
