import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { DateTime } from "luxon";
import type { FieldValues } from "react-hook-form";
import { ATTENDANCE_OVERVIEW_ROUTES } from "../../../../../../constants/routes/transactions/attendance/attendance-overview/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { attendanceViewKey } from "../../../../../../queryKeysFactories/attendanceView";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";

export type AttendanceEmployeeData = {
  id: string | null;
  employee_code: string | null;
  punch_code: string | null;
  employee_name: string | null;
  department_name: string | null;
  sub_department_name: string | null;
  designation_name: string | null;
  company_name: string | null;
  company_id: string | null;
  business_unit_name: string | null;
  business_unit_location_name: string | null;
  reporting_manager_name: string | null;
  avatar: string | null;
  shift_type_name: string | null;
  date: string | null;
  shift_type: string;
  shift_start: string;
  shift_end: string;
  reporting_manager_avatar: string;
};

type GetAttendanceEmployeeArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
        externalFilter: FieldValues;
      }>;
};

export function useGetAttendanceOverViewEmployeesQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const currentDate = DateTime.now().toISODate();

  const getAttendanceEmployee = async ({ body }: GetAttendanceEmployeeArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        employees: AttendanceEmployeeData[];
        totalCount: number;
      }>
    >(ATTENDANCE_OVERVIEW_ROUTES.listing(currentDate), body);

    return data.data;
  };

  return { getAttendanceEmployee };
}

export function useGetAttendanceOverViewEmployees({
  body,
}: GetAttendanceEmployeeArgs) {
  const { getAttendanceEmployee } = useGetAttendanceOverViewEmployeesQueryFn();

  return useQuery({
    queryKey: attendanceViewKey.listing(body),
    queryFn: () => getAttendanceEmployee({ body }),
    initialData: { employees: [], totalCount: 0 },
  });
}
