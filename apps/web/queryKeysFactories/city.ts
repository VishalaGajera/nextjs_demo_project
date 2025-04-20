export const cityKeys = {
  all: ["city"] as const,

  listing: (stateId: string | null) => [...cityKeys.all, stateId, "listing"],
};
