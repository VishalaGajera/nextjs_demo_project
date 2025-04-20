import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { DateTime } from "luxon";
import type { FieldValues } from "react-hook-form";
import { BULK_ATTENDANCE_ROUTES } from "../../../../../../constants/routes/transactions/attendance/bulk-attendance/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { bulkAttendanceKeys } from "../../../../../../queryKeysFactories/attendance";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";

export type BulkAttendanceType = {
  id: string;
  employee_code: string;
  punch_code: string;
  avatar: string;
  employee_name: string;
  department_name: string;
  sub_department_name: string;
  designation_name: string;
  reporting_manager_name: string;
  shift_type_name: string;
  full_count: string;
  selected: boolean;
  checkAll: boolean;
  shift_type: string;
  shift_start: string;
  shift_end: string;
  reporting_manager_avatar: string;
  selectedRecords: {
    [key: string]: boolean;
  } | null;
};

type GetBulkAttendanceArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
        externalFilter: FieldValues;
      }>;
  companyId?: string;
};

export function useGetBulkAttendanceQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const currentDate = DateTime.now().toISODate();

  const getBulkAttendance = async ({
    body,
    companyId,
  }: GetBulkAttendanceArgs) => {
    if (!companyId) {
      return { list: [], totalCount: 0 };
    }

    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        list: BulkAttendanceType[];
        totalCount: number;
      }>
    >(BULK_ATTENDANCE_ROUTES.listing(currentDate), body);

    return data.data;
  };

  return { getBulkAttendance };
}

export function useGetBulkAttendances({ body }: GetBulkAttendanceArgs) {
  const { getBulkAttendance } = useGetBulkAttendanceQueryFn();

  return useQuery({
    queryKey: bulkAttendanceKeys.listing(body),
    queryFn: () => getBulkAttendance({ body }),
    initialData: { list: [], totalCount: 0 },
  });
}
