import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { OVERTIME_RULE_ROUTES } from "../../../../../../constants/routes/policy-configuration/overtime/overtime-rule/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { overTimeKeys } from "../../../../../../queryKeysFactories/overTime";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";

export type OvertimeRules = {
  id: string;
  company_name: string;
  overtime_rule_name: string;
  overtime_rule_code: string;
  action_by: string;
  action_at: string;
};

type GetOverTimeRulesListArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetOvertimeRulesListQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getOvertimeRulesList = async ({ body }: GetOverTimeRulesListArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        overTimeRules: OvertimeRules[];
        totalCount: number;
      }>
    >(OVERTIME_RULE_ROUTES.listing, body);

    return data.data;
  };

  return { getOvertimeRulesList };
}

export function useGetOverTimeRulesList({ body }: GetOverTimeRulesListArgs) {
  const { getOvertimeRulesList } = useGetOvertimeRulesListQueryFn();

  return useQuery({
    queryKey: overTimeKeys.listing(body),
    queryFn: () => getOvertimeRulesList({ body }),
    initialData: { overTimeRules: [], totalCount: 0 },
  });
}
