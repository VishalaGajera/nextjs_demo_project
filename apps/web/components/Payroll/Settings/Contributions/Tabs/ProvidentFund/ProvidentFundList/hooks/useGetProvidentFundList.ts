import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { PROVIDENT_FUND_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/contributions/pf/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { providentFundKeys } from "../../../../../../../../queryKeysFactories/providentFund";
import type { QuickFilter } from "../../../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";

export type ProvidentFundRecord = {
  id: string;
  epf_group_name: string;
  employee_contribution_rate: number;
  employer_contribution_rate: number;
  employee_contribution_rate_type: "percentage" | "fixed";
  employer_contribution_rate_type: "percentage" | "fixed";
  action_by: string;
  action_at: string;
  full_count: string;
};

type GetProvidentFundArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetProvidentFundQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getProvidentFund = async ({ body }: GetProvidentFundArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        epfGroups: ProvidentFundRecord[];
        totalCount: number;
      }>
    >(PROVIDENT_FUND_ROUTES.listing, body);

    return data.data;
  };

  return { getProvidentFund };
}

export function useGetProvidentFund({ body }: GetProvidentFundArgs) {
  const { getProvidentFund } = useGetProvidentFundQueryFn();

  return useQuery({
    queryKey: providentFundKeys.listing(body),
    queryFn: () => getProvidentFund({ body }),
    initialData: { epfGroups: [], totalCount: 0 },
  });
}
