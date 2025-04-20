import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { DateTime } from "luxon";
import type { FieldValues } from "react-hook-form";
import { PENALTY_RULE_ALLOCATION_ROUTES } from "../../../../../../constants/routes/policy-configuration/attendance/penalty-rule-allocation/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { penaltyRulesAllocation } from "../../../../../../queryKeysFactories/penaltyRulesAllocation";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";

export type PenaltyRulesAllocationListType = {
  id: string;
  employee_code: string;
  punch_code: string;
  avatar: string;
  employee_name: string;
  department_name: string;
  sub_department_name: string;
  designation_name: string;
  reporting_manager_name: string;
  full_count: string;
  attendance_penalty_rule_name: string;
  selected: boolean;
  checkAll: boolean;
  reporting_manager_avatar: string;
  selectedRecords: {
    [key: string]: boolean;
  } | null;
};

type GetPenaltyRulesAllocationArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
        externalFilter: FieldValues;
      }>;
  companyId?: string;
};
export function useGetPenaltyRulesListQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const currentDate = DateTime.now().toISODate();

  const getPenaltyRulesList = async ({
    body,
  }: GetPenaltyRulesAllocationArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        list: PenaltyRulesAllocationListType[];
        totalCount: number;
      }>
    >(PENALTY_RULE_ALLOCATION_ROUTES.listing(currentDate), body);

    return data.data;
  };

  return { getPenaltyRulesList };
}

export function useGetPenaltyRulesAllocationList({
  body,
}: GetPenaltyRulesAllocationArgs) {
  const { getPenaltyRulesList } = useGetPenaltyRulesListQueryFn();

  return useQuery({
    queryKey: penaltyRulesAllocation.listing(body),
    queryFn: () => getPenaltyRulesList({ body }),
    initialData: { list: [], totalCount: 0 },
  });
}
