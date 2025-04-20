export const uploadKeys = {
  all: ["upload"] as const,

  add: (body: object = {}) => [...uploadKeys.all, "file", body],
};
