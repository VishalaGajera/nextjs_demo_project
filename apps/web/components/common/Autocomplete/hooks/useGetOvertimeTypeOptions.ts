import { CUSTOM_OT, FIXED_OT } from "./constant";

export const OvertimeTypeOptions = {
  [CUSTOM_OT]: "Custom OT",
  [FIXED_OT]: "Fixed OT",
};

export type OvertimeTypeOptionsKey = keyof typeof OvertimeTypeOptions;
