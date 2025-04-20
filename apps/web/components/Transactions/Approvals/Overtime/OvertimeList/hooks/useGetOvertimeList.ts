import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import type { FieldValues } from "react-hook-form";
import { OVERTIME_ROUTES } from "../../../../../../constants/routes/transactions/approvals/overtime-requests/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { approvalOvertimeKeys } from "../../../../../../queryKeysFactories/approvalOvertime";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";

export type OvertimeType = {
  id: string;
  employee_name: string;
  employee_id: string;
  employee_code: string;
  punch_code: string;
  avatar: string;
  department_name: string;
  overtime_date: string;
  requested_by: string;
  requested_date: string;
  in_time_overtime: string;
  out_time_overtime: string;
  request_overtime_work_hours: string;
  final_overtime_work_hours: string;
  remark: string;
  status: string;
  last_action_remark: string;
  next_approver: string;
  selected: boolean;
  checkAll: boolean;
  last_action_by: string;
  last_action_at: string;
  last_action_type: string;
  selectedRecords: {
    [key: string]: boolean;
  } | null;
};

type GetOvertimeArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
        externalFilter?: FieldValues;
      }>;
};

export function useGetOvertimeQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getOvertimeDetails = async ({ body }: GetOvertimeArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        overtimeRequestApprovals: OvertimeType[];
        totalCount: number;
      }>
    >(OVERTIME_ROUTES.listing(), body);

    return data.data;
  };

  return { getOvertimeDetails };
}

export function useGetOvertimeDay({ body }: GetOvertimeArgs) {
  const { getOvertimeDetails } = useGetOvertimeQueryFn();

  return useQuery({
    queryKey: approvalOvertimeKeys.listing(body),
    queryFn: () => getOvertimeDetails({ body }),
    initialData: { overtimeRequestApprovals: [], totalCount: 0 },
  });
}
