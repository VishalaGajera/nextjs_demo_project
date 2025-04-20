import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { penaltyRuleKeys } from "../../../../../../queryKeysFactories/penaltyRule";
import type { QuickFilter } from "../../../../../../types/agGrid";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import { PENALTY_RULE_ROUTES } from "../../../../../../constants/routes/policy-configuration/attendance/penalty-rule/routes";

export type PenaltyRules = {
  id: string;
  company_name: string;
  attendance_penalty_rule_code: string;
  attendance_penalty_rule_name: string;
  action_by: string;
  action_at: string;
};

type PenaltyRulesArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetPenaltyRulesQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getPenaltyRules = async ({ body }: PenaltyRulesArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        attendancePenaltyRules: PenaltyRules[];
        totalCount: number;
      }>
    >(PENALTY_RULE_ROUTES.listing, body);

    return data.data;
  };

  return { getPenaltyRules };
}

export function usePenaltyRules({ body }: PenaltyRulesArgs) {
  const { getPenaltyRules } = useGetPenaltyRulesQueryFn();

  return useQuery({
    queryKey: penaltyRuleKeys.listing(body),
    queryFn: () => getPenaltyRules({ body }),
    initialData: { attendancePenaltyRules: [], totalCount: 0 },
  });
}
