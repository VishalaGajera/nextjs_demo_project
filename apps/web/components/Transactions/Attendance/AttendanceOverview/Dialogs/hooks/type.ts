type logTypes = {
  in_time: string;
  out_time: string;
};

export type PayloadLogTypes = Partial<{
  id: string | null;
  in_time: string | null;
  out_time: string | null;
  action: string | null;
}>;

type LogEntryType<T> = {
  manual: T[];
  machine: T[];
};

export type AutoShiftType = {
  shift_type_name: string;
  shift_start: string;
  shift_end: string;
  slot_start: string;
  slot_end: string;
  clock_in_start: string;
  clock_in_end: string;
};

export type AttendanceLogs = {
  current_date: string;
  id: string;
  employee_name: string;
  shift_type_name: string;
  shift_start: string;
  shift_end: string;
  shift_type_id: string;
  slot_start: string;
  slot_end: string;
  logs: LogEntryType<logTypes>;
  remark: string;
  status: string | null;
  shift_type: string;
  auto_shifts: AutoShiftType[] | null;
};

export type AttendanceDetailsMeta = {
  is_overtime_request_tab_enabled: boolean;
  is_overtime_request_enabled: boolean;
  allow_past_dated_request: boolean;
  maximum_past_request_days: number;
  is_comment_required: boolean;
};

export type AttendancePayload = Partial<{
  company_id: string | null;
  employee_id: string | null;
  shift_type_id: string | null;
  date: string | null;
  logs: LogEntryType<PayloadLogTypes>;
  remark: string | null;
}>;
