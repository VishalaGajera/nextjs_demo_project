import { useQuery } from "@tanstack/react-query";
import { LEAVE_PLAN_ROUTES } from "../../../../constants/routes/policy-configuration/leave/leave-plan/routes";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { leavePlanKeys } from "../../../../queryKeysFactories/leavePlan";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";

type UseGetLeavePlanArgs = {
  companyId: string;
};

export function useGetLeavePlanOptions({ companyId }: UseGetLeavePlanArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchLeavePlan = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      LEAVE_PLAN_ROUTES.options(companyId)
    );

    return data?.data;
  };

  return useQuery({
    queryKey: leavePlanKeys.options(companyId),
    queryFn: fetchLeavePlan,
    enabled: !!companyId,
    initialData: [],
  });
}
