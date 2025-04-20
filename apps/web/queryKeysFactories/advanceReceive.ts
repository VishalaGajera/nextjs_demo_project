export const advanceReceiveKeys = {
  all: ["advance-receive"] as const,

  listing: (requestBody: object = {}) =>
    [...advanceReceiveKeys.all, "listing", requestBody] as const,

  add: () => [...advanceReceiveKeys.all, "add"],

  delete: (advanceAndReceiveId: string) => [
    ...advanceReceiveKeys.all,
    "delete",
    advanceAndReceiveId,
  ],

  get: (advanceAndReceiveId: string) => [
    ...advanceReceiveKeys.all,
    "get",
    advanceAndReceiveId,
  ],

  edit: (advanceAndReceiveId: string) => [
    ...advanceReceiveKeys.all,
    "edit",
    advanceAndReceiveId,
  ],
};
