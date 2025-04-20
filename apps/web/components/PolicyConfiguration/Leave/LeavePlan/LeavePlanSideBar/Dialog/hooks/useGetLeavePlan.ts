import { useQuery } from "@tanstack/react-query";
import { LEAVE_PLAN_ROUTES } from "../../../../../../../constants/routes/policy-configuration/leave/leave-plan/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { leavePlanKeys } from "../../../../../../../queryKeysFactories/leavePlan";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";

type LeavePlan = {
  start_year: number | undefined;
  id: string;
  company_id: string;
  leave_plan_name: string;
  year_start_month: number;
  description: string | null;
};

export type UseGetLeavePlanArgs = {
  currentLeavePlanId: string;
};
export function useGetLeavePlan({ currentLeavePlanId }: UseGetLeavePlanArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchLeavePlan = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<LeavePlan>>(
      LEAVE_PLAN_ROUTES.get(currentLeavePlanId)
    );

    return data;
  };

  return useQuery({
    queryKey: leavePlanKeys.get(currentLeavePlanId),
    queryFn: fetchLeavePlan,
  });
}
