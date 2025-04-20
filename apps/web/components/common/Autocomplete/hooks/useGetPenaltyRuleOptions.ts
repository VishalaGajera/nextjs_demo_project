import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";
import { penaltyRuleKeys } from "../../../../queryKeysFactories/penaltyRule";

type UsePenaltyRuleOptionsArgs = {
  companyId?: string | null;
};

export function usePenaltyRuleOptions({
  companyId,
}: UsePenaltyRuleOptionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchPenaltyRuleOptions = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      `api/policy-configuration/attendance/penalty-rule/options/${companyId}`
    );

    return data.data;
  };

  return useQuery({
    queryKey: penaltyRuleKeys.options(companyId),
    queryFn: fetchPenaltyRuleOptions,
    enabled: !!companyId,
    initialData: [],
  });
}
