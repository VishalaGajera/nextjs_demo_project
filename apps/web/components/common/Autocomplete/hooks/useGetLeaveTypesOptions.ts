import { useQuery } from "@tanstack/react-query";
import { LEAVE_PLAN_TYPE_ROUTES } from "../../../../constants/routes/policy-configuration/leave/leave-plan/leave-type/routes";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { leavePlanTypeKeys } from "../../../../queryKeysFactories/LeaveType";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";

type UseGetTypesOptionsArgs = {
  leavePlanId: string;
};

export function useGetTypesOptions({ leavePlanId }: UseGetTypesOptionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchTypesOptions = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      LEAVE_PLAN_TYPE_ROUTES.options(leavePlanId)
    );

    return data.data;
  };

  return useQuery({
    queryKey: leavePlanTypeKeys.options(leavePlanId),
    queryFn: fetchTypesOptions,
    enabled: !!leavePlanId,
    initialData: [],
  });
}
