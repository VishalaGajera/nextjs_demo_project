import { LIST, OPTIONS } from "../../../../routes";
import { SETTINGS_ROUTES_BASE_URL } from "../routes";
import { EARNING_BASE_URL } from "../salary-components/earning/routes";

export const SALARY_STRUCTURE_BASE_URL = `${SETTINGS_ROUTES_BASE_URL}/salary-structure`;

export const SALARY_STRUCTURE_ROUTES = {
  list: `${SALARY_STRUCTURE_BASE_URL}/${LIST}`,

  add: `${SALARY_STRUCTURE_BASE_URL}`,

  get: (ssId: string) => `${SALARY_STRUCTURE_BASE_URL}/${ssId}`,

  update: (ssId: string) => `${SALARY_STRUCTURE_BASE_URL}/${ssId}`,

  delete: (ssId: string) => `${SALARY_STRUCTURE_BASE_URL}/${ssId}`,

  options: (ssId: string) => `${SALARY_STRUCTURE_BASE_URL}/${ssId}/options`,

  getRangeList: (ssId: string, interval: string) =>
    `${SALARY_STRUCTURE_BASE_URL}/${ssId}/range?interval=${interval}`,

  editRangeList: (ssId: string, interval: string) =>
    `${SALARY_STRUCTURE_BASE_URL}/${ssId}/range?interval=${interval}`,

  getEarningComponentList: () => `${EARNING_BASE_URL}/components`,

  getSalaryComponentList: (
    ssId: string,
    interval: string,
    salaryRangeId: string
  ) =>
    `${SALARY_STRUCTURE_BASE_URL}/${ssId}/range/${salaryRangeId}/components?interval=${interval}`,

  updateSalaryComponentList: (ssId: string, salaryRangeId: string) =>
    `${SALARY_STRUCTURE_BASE_URL}/${ssId}/range/${salaryRangeId}/components`,

  post: (ssId: string, interval: string) =>
    `${SALARY_STRUCTURE_BASE_URL}/${ssId}/custom/list?interval=${interval}`,

  addSalaryCustomComponentList: (ssId: string) =>
    `${SALARY_STRUCTURE_BASE_URL}/${ssId}/custom`,

  getCustomSalaryStructureById: (ssId: string, csId: string) =>
    `${SALARY_STRUCTURE_BASE_URL}/${ssId}/custom/${csId}`,

  editCustomSalaryComponent: (ssId: string, csId: string) =>
    `${SALARY_STRUCTURE_BASE_URL}/${ssId}/custom/${csId}`,

  deleteCustomSalaryStructure: (ssId: string, csId: string) =>
    `${SALARY_STRUCTURE_BASE_URL}/${ssId}/custom/${csId}`,

  updateDefaultCustomSalaryStructure: (ssId: string, csId: string) =>
    `${SALARY_STRUCTURE_BASE_URL}/${ssId}/custom/${csId}/default`,

  getSalaryStructureNameOptions: (companyId: string) =>
    `${SALARY_STRUCTURE_BASE_URL}/${OPTIONS}/${companyId}`,

  getSalaryStructureOptions: (ssId: string) =>
    `${SALARY_STRUCTURE_BASE_URL}/${ssId}/${OPTIONS}`,

  getSalaryCustomDetails: (ssId: string, customId: string) =>
    `${SALARY_STRUCTURE_BASE_URL}/${ssId}/custom/${customId}`,
};
