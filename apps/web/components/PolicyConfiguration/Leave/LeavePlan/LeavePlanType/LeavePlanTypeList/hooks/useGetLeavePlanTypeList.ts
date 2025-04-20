import { useQuery } from "@tanstack/react-query";
import { LEAVE_PLAN_TYPE_ROUTES } from "../../../../../../../constants/routes/policy-configuration/leave/leave-plan/leave-type/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { leavePlanTypeKeys } from "../../../../../../../queryKeysFactories/leavePlan";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";
import type { LeaveTypeList } from "./useGetLeavePlanTypeListColumns";

type GetLeavePlanTypeListArgs = {
  leavePlanId: string;
};

export function useGetLeavePlanTypeQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getLeavePlanType = async ({
    leavePlanId,
  }: GetLeavePlanTypeListArgs) => {
    if (!leavePlanId) {
      return [];
    }

    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<LeaveTypeList[]>>(
      LEAVE_PLAN_TYPE_ROUTES.listing(leavePlanId)
    );

    return data;
  };

  return { getLeavePlanType };
}

export function useGetLeavePlanTypeList({
  leavePlanId,
}: GetLeavePlanTypeListArgs) {
  const { getLeavePlanType } = useGetLeavePlanTypeQueryFn();

  return useQuery({
    queryKey: leavePlanTypeKeys.listing(leavePlanId),
    queryFn: () => getLeavePlanType({ leavePlanId }),
    initialData: [],
  });
}
