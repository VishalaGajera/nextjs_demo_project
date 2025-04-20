import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import type { QuickFilter } from "../../../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";
import { INCOME_TAX_REGIME_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/taxes-deductions/income-tax-regime/routes";
import { incomeTaxRegimeKeys } from "../../../../../../../../queryKeysFactories/Payroll/Settings/TaxesAndDeductions/incomeTaxRegime";

export type IncomeTaxRegimes = {
  id: string;
  action_by: string;
  action_at: string;
  full_count: string;
  financial_year: {
    start_date: string;
    end_date: string;
  };
  regime_type: string;
};

type GetIncomeTaxRegimeArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useListIncomeTaxRegimeQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getIncomeTaxRegime = async ({ body }: GetIncomeTaxRegimeArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        incomeTaxRegimes: IncomeTaxRegimes[];
        totalCount: number;
      }>
    >(INCOME_TAX_REGIME_ROUTES.listing, body);

    return data.data;
  };

  return { getIncomeTaxRegime };
}

export function useGetIncomeTaxRegime({ body }: GetIncomeTaxRegimeArgs) {
  const { getIncomeTaxRegime } = useListIncomeTaxRegimeQueryFn();

  return useQuery({
    queryKey: incomeTaxRegimeKeys.listing(body),
    queryFn: () => getIncomeTaxRegime({ body }),
    initialData: { incomeTaxRegimes: [], totalCount: 0 },
  });
}
