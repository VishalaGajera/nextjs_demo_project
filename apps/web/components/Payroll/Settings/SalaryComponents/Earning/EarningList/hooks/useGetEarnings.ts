import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { EARNING_DETAILS_ROUTES } from "../../../../../../../constants/routes/payroll/settings/salary-components/earning/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { earningKeys } from "../../../../../../../queryKeysFactories/earning";
import type { QuickFilter } from "../../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";

export type Earning = {
  id: string;
  calculation_type: "recurring" | "one_time";
  earning_component_type: string;
  earning_component_code: string;
  earning_component_name: string;
  max_limit_per_year?: number;
  description: string;
  is_taxable: boolean;
  tax_exemption_limit?: number;
  is_proof_required?: boolean;
  consider_for_pf: boolean;
  consider_for_pt: boolean;
  consider_for_esi: boolean;
  is_system_generated: boolean;
};

type GetEarningsArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetEarningsQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getEarnings = async ({ body }: GetEarningsArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        earningComponents: Earning[];
        totalCount: number;
      }>
    >(EARNING_DETAILS_ROUTES.listing, body);

    return data.data;
  };

  return { getEarnings };
}

export function useGetEarnings({ body }: GetEarningsArgs) {
  const { getEarnings } = useGetEarningsQueryFn();

  return useQuery({
    queryKey: earningKeys.listing(body),
    queryFn: () => getEarnings({ body }),
    initialData: { earningComponents: [], totalCount: 0 },
  });
}
