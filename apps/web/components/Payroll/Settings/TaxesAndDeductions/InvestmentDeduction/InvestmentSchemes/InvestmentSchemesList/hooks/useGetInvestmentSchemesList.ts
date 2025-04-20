import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { INVESTMENT_SCHEMES_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/deductions/investment-deductions/investment-schemes/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { investmentSchemesKeys } from "../../../../../../../../queryKeysFactories/investmentSchemes";
import type { QuickFilter } from "../../../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";

export type InvestmentSchemesRecord = {
  id: string;
  section_code: string;
  scheme_code: string;
  scheme_name: string;
  min_limit: number;
  max_limit: number;
  is_proof_required: boolean;
  action_by: string;
  action_at: string;
  full_count: string;
};

type GetInvestmentSchemesListArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetInvestmentSchemesListQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getInvestmentSchemesList = async ({
    body,
  }: GetInvestmentSchemesListArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        investmentSchemes: InvestmentSchemesRecord[];
        totalCount: number;
      }>
    >(INVESTMENT_SCHEMES_ROUTES.listing, body);

    return data.data;
  };

  return { getInvestmentSchemesList };
}

export function useGetInvestmentSchemesList({
  body,
}: GetInvestmentSchemesListArgs) {
  const { getInvestmentSchemesList } = useGetInvestmentSchemesListQueryFn();

  return useQuery({
    queryKey: investmentSchemesKeys.listing(body),
    queryFn: () => getInvestmentSchemesList({ body }),
    initialData: { investmentSchemes: [], totalCount: 0 },
  });
}
