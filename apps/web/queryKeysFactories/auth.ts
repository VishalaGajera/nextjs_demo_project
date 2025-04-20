export const authKeys = {
  all: ["auth"] as const,

  login: (requestBody: object = {}) =>
    [...authKeys.all, "login", requestBody] as const,

  forgetPassword: () => [...authKeys.all, "forget-password"] as const,

  resetPassword: () => [...authKeys.all, "reset-password"] as const,
};
