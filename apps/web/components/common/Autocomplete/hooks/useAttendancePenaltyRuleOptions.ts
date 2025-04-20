import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";
import { penaltyRuleKeys } from "../../../../queryKeysFactories/penaltyRule";
import { PENALTY_RULE_ROUTES } from "../../../../constants/routes/policy-configuration/attendance/penalty-rule/routes";

type UseAttendancePenaltyRuleOptionsArgs = {
  companyId: string;
};

export function useAttendancePenaltyRuleOptions({
  companyId,
}: UseAttendancePenaltyRuleOptionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchAttendancePenaltyRuleOptions = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      PENALTY_RULE_ROUTES.options(companyId)
    );

    return data.data;
  };

  return useQuery({
    queryKey: penaltyRuleKeys.options(companyId),
    queryFn: fetchAttendancePenaltyRuleOptions,
    enabled: !!companyId,
    initialData: [],
  });
}
