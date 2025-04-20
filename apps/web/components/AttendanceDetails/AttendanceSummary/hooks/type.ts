import type { WorkDayType } from "@codezee/sixtify-brahma";

type Log = {
  in_time: string;
  out_time: string;
  status_type: WorkDayType;
};

export type AttendanceLogs = {
  late_by: string;
  early_by: string;
  slot_start: string;
  slot_end: string;
  logs: Log[];
};

export type AttendanceRecord = {
  date: string;
  shift_type_name: string;
  shift_type_code: string;
  shift_start: string;
  shift_end: string;
  shift_hours: string;
  break_hours: string;
  attendance_status: WorkDayType[];
  attendance_logs: AttendanceLogs | null;
  work_hours: string;
  gross_hours: string;
  overtime_work_hours: string;
  personal_in_out_hours: string;
  net_work_hours: string;
  total_pay_hours: string;
  penalty_work_hours: string;
  shift_type: string;
};

type Summary = {
  day: Record<WorkDayType, string>;
  hours: Record<WorkDayType, string>;
};

export type AttendanceDetails = {
  id: string;
  employee_name: string;
  avatar: string | null;
  designation_name: string;
  summary: Summary;
  joining_date: string;
  attendance_records: AttendanceRecord[];
};
