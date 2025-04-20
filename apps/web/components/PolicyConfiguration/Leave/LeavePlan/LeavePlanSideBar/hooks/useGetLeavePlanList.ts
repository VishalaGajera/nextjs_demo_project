import { useQuery } from "@tanstack/react-query";
import { LEAVE_PLAN_ROUTES } from "../../../../../../constants/routes/policy-configuration/leave/leave-plan/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { leavePlanKeys } from "../../../../../../queryKeysFactories/leavePlan";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";

export type LeavePlanListData = {
  id: string;
  leave_plan_name: string;
  company_name: string;
  company_id: string;
  year_cycle: boolean;
};

type UseGetLeavePlanListArgs = {
  companyId?: string;
};

export function useGetLeavePlanList({ companyId }: UseGetLeavePlanListArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchLeavePlan = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<LeavePlanListData[]>>(
      LEAVE_PLAN_ROUTES.listing(companyId)
    );

    return data;
  };

  return useQuery({
    queryKey: leavePlanKeys.listing({ companyId }),
    queryFn: fetchLeavePlan,
    initialData: [],
  });
}
