import { API } from "../../routes";

export const AUTH_BASE_URL = `${API}/auth`;

export const AUTH_ROUTES = {
  login: `${AUTH_BASE_URL}/login`,

  forgetPassword: `${AUTH_BASE_URL}/forget-password`,

  resetPassword: `${AUTH_BASE_URL}/reset-password`,
};
