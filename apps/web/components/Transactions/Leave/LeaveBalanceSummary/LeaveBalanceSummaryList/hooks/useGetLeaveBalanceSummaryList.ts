import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import type { FieldValues } from "react-hook-form";
import { LEAVE_BALANCE_SUMMARY_ROUTES } from "../../../../../../constants/routes/transactions/leave/leave-balance-summary/route";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { leaveBalanceSummaryKey } from "../../../../../../queryKeysFactories/leaveBalanceSummary";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";

export type LeaveBalance = {
  id: string;
  quota_type: string;
  annual_quota: number;
  leave_type_id: string;
  leave_type_name: string;
  available_balance: number;
};

export type LeaveBalanceSummaryData = {
  id: string;
  employee_code: string;
  punch_code: string;
  employee_name: string;
  department_name: string;
  sub_department_name: string;
  designation_name: string;
  reporting_manager_name: string;
  avatar: string;
  leave_plan_name: string;
  leave_balance: LeaveBalance[];
  reporting_manager_avatar: string;
};

type LeaveBalanceSummaryListBody = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
        externalFilter: FieldValues;
      }>;
};

export function useGetLeaveBalanceSummaryListQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getLeaveBalanceSummaryList = async ({
    body,
  }: LeaveBalanceSummaryListBody) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        list: LeaveBalanceSummaryData[];
        totalCount: number;
      }>
    >(LEAVE_BALANCE_SUMMARY_ROUTES.listing(), body);

    return data.data;
  };

  return { getLeaveBalanceSummaryList };
}

export function useGetLeaveBalanceSummmaryList({
  body,
}: LeaveBalanceSummaryListBody) {
  const { getLeaveBalanceSummaryList } = useGetLeaveBalanceSummaryListQueryFn();

  return useQuery({
    queryKey: leaveBalanceSummaryKey.listing(body),
    queryFn: () => getLeaveBalanceSummaryList({ body }),
    initialData: { list: [], totalCount: 0 },
  });
}
