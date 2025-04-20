import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { LEAVE_ROUTES } from "../../../../../../constants/routes/policy-configuration/leave/leave-type/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { leaveTypeKeys } from "../../../../../../queryKeysFactories/LeaveType";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";

export type LeaveType = {
  id: string;
  company_name: string;
  company_id: string;
  leave_type_code: string;
  leave_type_name: string;
  leave_type: string;
  action_by: string;
  action_at: string;
  full_count: string;
  colour_code: string;
};

type GetLeaveTypeArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetLeaveTypesQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getLeaveTypesDetails = async ({ body }: GetLeaveTypeArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        leaveTypes: LeaveType[];
        totalCount: number;
      }>
    >(LEAVE_ROUTES.listing, body);

    return data.data;
  };

  return { getLeaveTypesDetails };
}

export function useGetLeaveTypes({ body }: GetLeaveTypeArgs) {
  const { getLeaveTypesDetails } = useGetLeaveTypesQueryFn();

  return useQuery({
    queryKey: leaveTypeKeys.listing(body),
    queryFn: () => getLeaveTypesDetails({ body }),
    initialData: { leaveTypes: [], totalCount: 0 },
  });
}
