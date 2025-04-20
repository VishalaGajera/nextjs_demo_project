import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import type { FieldValues } from "react-hook-form";
import { LEAVE_ROUTES } from "../../../../../../constants/routes/transactions/approvals/leave-requests/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { approvalLeaveKeys } from "../../../../../../queryKeysFactories/approvalLeave";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";

export type LeaveType = {
  id: string;
  employee_name: string;
  employee_code: string;
  punch_code: string;
  employee_id: string;
  avatar: string;
  department_name: string;
  from_date: string;
  to_date: string;
  reason: string;
  status: string;
  total_leaves: number;
  current_level_number: number;
  requested_by: string;
  requested_date: string;
  leave_type_name: string;
  leave_type: string;
  last_action_by: string;
  last_action_at: string;
  last_action_remark: string;
  last_action_type: string;
  next_approvers: string;
  selected: boolean;
  checkAll: boolean;
  selectedRecords: {
    [key: string]: boolean;
  } | null;
};

type GetLeaveArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
        externalFilter?: FieldValues;
      }>;
};

export function useGetLeaveQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getLeaveDetails = async ({ body }: GetLeaveArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        leaveRequestApprovals: LeaveType[];
        totalCount: number;
      }>
    >(LEAVE_ROUTES.listing(), body);

    return data.data;
  };

  return { getLeaveDetails };
}

export function useGetLeaveDay({ body }: GetLeaveArgs) {
  const { getLeaveDetails } = useGetLeaveQueryFn();

  return useQuery({
    queryKey: approvalLeaveKeys.listing(body),
    queryFn: () => getLeaveDetails({ body }),
    initialData: { leaveRequestApprovals: [], totalCount: 0 },
  });
}
