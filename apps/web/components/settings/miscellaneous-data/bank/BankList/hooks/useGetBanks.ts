import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { bankKeys } from "../../../../../../queryKeysFactories/bank";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import { BANK_ROUTES } from "../../../../../../constants/routes/settings/bank/routes";

export type Bank = {
  id: string;
  bank_code: string;
  bank_name: string;
  description: string;
  is_active: boolean;
  action_by: string;
  action_at: string;
  full_count: string;
};

type GetBanksArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetBanksQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getBanks = async ({ body }: GetBanksArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        banks: Bank[];
        totalCount: number;
      }>
    >(BANK_ROUTES.listing, body);

    return data.data;
  };

  return { getBanks };
}

//NOTE: for future use
export function useGetBanks({ body }: GetBanksArgs) {
  const { getBanks } = useGetBanksQueryFn();

  return useQuery({
    queryKey: bankKeys.listing(body),
    queryFn: () => getBanks({ body }),
    initialData: { banks: [], totalCount: 0 },
  });
}
