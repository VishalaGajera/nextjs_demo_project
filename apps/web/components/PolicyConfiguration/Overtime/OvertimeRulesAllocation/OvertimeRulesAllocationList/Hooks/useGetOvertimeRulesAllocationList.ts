import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { DateTime } from "luxon";
import type { FieldValues } from "react-hook-form";
import { OVERTIME_RULE_ALLOCATION_ROUTES } from "../../../../../../constants/routes/policy-configuration/overtime/overtime-rule-allocation/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { overtimeRulesAllocation } from "../../../../../../queryKeysFactories/OvertimeRulesAllocation";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";

export type OvertimeRulesAllocationListType = {
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
  selected: boolean;
  checkAll: boolean;
  overtime_rule_name: string;
  reporting_manager_avatar: string;
  selectedRecords: {
    [key: string]: boolean;
  } | null;
};

type GetOverTimesRulesAllocationArgs = {
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

export function useGetOvertimeRulesListQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const currentDate = DateTime.now().toISODate();

  const getOverTimeRulesList = async ({
    body,
    companyId,
  }: GetOverTimesRulesAllocationArgs) => {
    if (!companyId) {
      return { list: [], totalCount: 0 };
    }

    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        list: OvertimeRulesAllocationListType[];
        totalCount: number;
      }>
    >(OVERTIME_RULE_ALLOCATION_ROUTES.listing(currentDate), body);

    return data.data;
  };

  return { getOverTimeRulesList };
}

export function useGetOvertimeRulesAllocationList({
  body,
}: GetOverTimesRulesAllocationArgs) {
  const { getOverTimeRulesList } = useGetOvertimeRulesListQueryFn();

  return useQuery({
    queryKey: overtimeRulesAllocation.listing(body),
    queryFn: () => getOverTimeRulesList({ body }),
    initialData: { list: [], totalCount: 0 },
  });
}
