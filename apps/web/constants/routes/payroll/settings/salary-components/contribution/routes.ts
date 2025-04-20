import { LIST } from "../../../../../routes";
import { SALARY_COMPONENTS_BASE_URL } from "../../salary-components/routes";

export const CONTRIBUTION_ROUTES_BASE_URL = `${SALARY_COMPONENTS_BASE_URL}/contribution`;

export const CONTRIBUTION_ROUTES = {
  post: CONTRIBUTION_ROUTES_BASE_URL,

  delete: (contributionId: string) =>
    `${CONTRIBUTION_ROUTES_BASE_URL}/${contributionId}`,

  listing: `${CONTRIBUTION_ROUTES_BASE_URL}/${LIST}?tab=contribution`,

  patch: (contributionId: string) =>
    `${CONTRIBUTION_ROUTES_BASE_URL}/${contributionId}`,

  get: (contributionId: string) =>
    `${CONTRIBUTION_ROUTES_BASE_URL}/${contributionId}`,
};
