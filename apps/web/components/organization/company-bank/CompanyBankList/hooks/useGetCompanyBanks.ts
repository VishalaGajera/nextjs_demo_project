import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { companyBankKeys } from "../../../../../queryKeysFactories/companyBanks";
import type { QuickFilter } from "../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";
import { BANK_ROUTES } from "../../../../../constants/routes/organization/bank/routes";

export type CompanyBank = {
  id: string;
  company_id: string;
  company_name: string;
  bank_id: string;
  bank_name: string;
  branch_name: string;
  ifsc_code: string;
  account_no: string;
  action_by: string;
  action_at: string;
  full_count: string;
};

type GetCompanyBanksArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetCompanyBanksQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getCompanyBanks = async ({ body }: GetCompanyBanksArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        banks: CompanyBank[];
        totalCount: number;
      }>
    >(BANK_ROUTES.listing, body);

    return data.data;
  };

  return { getCompanyBanks };
}

export async function useGetCompanyBanks({ body }: GetCompanyBanksArgs) {
  const { getCompanyBanks } = useGetCompanyBanksQueryFn();

  return useQuery({
    queryKey: companyBankKeys.listing(body),
    queryFn: () => getCompanyBanks({ body }),
    initialData: { banks: [], totalCount: 0 },
  });
}
