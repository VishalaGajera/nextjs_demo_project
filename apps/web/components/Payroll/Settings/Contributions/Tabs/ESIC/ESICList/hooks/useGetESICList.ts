import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { ESIC_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/contributions/esic/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { esicKeys } from "../../../../../../../../queryKeysFactories/esic";
import type { QuickFilter } from "../../../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";

export type ESICRecord = {
  id: string;
  esic_group_name: string;
  employee_contribution_rate: number;
  employer_contribution_rate: number;
  action_by: string;
  action_at: string;
  full_count: string;
};

type GetESICListArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetESICListQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getESICList = async ({ body }: GetESICListArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        esicGroups: ESICRecord[];
        totalCount: number;
      }>
    >(ESIC_ROUTES.listing, body);

    return data.data;
  };

  return { getESICList };
}

export function useGetESICList({ body }: GetESICListArgs) {
  const { getESICList } = useGetESICListQueryFn();

  return useQuery({
    queryKey: esicKeys.listing(body),
    queryFn: () => getESICList({ body }),
    initialData: { esicGroups: [], totalCount: 0 },
  });
}
