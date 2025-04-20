import type { ReactNode } from "react";

export type DialogTypes =
  | "add"
  | "edit"
  | "delete"
  | "addDepartment"
  | "addWorkType"
  | "addSubDepartment"
  | "addDocument"
  | "addGrade"
  | "addSkillType"
  | "addDesignation"
  | "cancel"
  | "saveAsDraft"
  | "history"
  | "view"
  | "action"
  | "updateShift"
  | "updateWeeklyOff"
  | "updateHoliday"
  | "configureLeave"
  | "approve"
  | "reject"
  | "cancelled"
  | "formulaBuilderDialog";

export type DialogRenderer = { [key in DialogTypes]?: ReactNode };
