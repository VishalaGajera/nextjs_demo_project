import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";
import { overTimeKeys } from "../../../../queryKeysFactories/overTime";
import { OVERTIME_RULE_ROUTES } from "../../../../constants/routes/policy-configuration/overtime/overtime-rule/routes";

type UseOvertimeRuleOptionsArgs = {
  companyId: string;
};

export function useOvertimeRuleOptions({
  companyId,
}: UseOvertimeRuleOptionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchOvertimeRuleOptions = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      OVERTIME_RULE_ROUTES.options(companyId)
    );

    return data.data;
  };

  return useQuery({
    queryKey: overTimeKeys.options(companyId),
    queryFn: fetchOvertimeRuleOptions,
    enabled: !!companyId,
    initialData: [],
  });
}
