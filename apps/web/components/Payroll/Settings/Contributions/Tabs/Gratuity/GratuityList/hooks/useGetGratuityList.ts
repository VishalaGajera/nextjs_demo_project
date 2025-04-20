import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { GRATUITY_GROUP_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/contributions/gratuity-group/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { gratuityKeys } from "../../../../../../../../queryKeysFactories/gratuity";
import type { QuickFilter } from "../../../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";
import type { GratuityInfo } from "../Dialogs/Hooks/getGratuityById";

export type GetGratuityArgs = {
  body?:
    | Partial<IGetRowsParams>
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGratuityQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getGratuityList = async ({ body }: GetGratuityArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        gratuityGroups: GratuityInfo[];
        totalCount: number;
      }>
    >(GRATUITY_GROUP_ROUTES.post(), body);

    return data.data;
  };

  return { getGratuityList };
}

export function useGetGratuityList({ body }: GetGratuityArgs) {
  const { getGratuityList } = useGratuityQueryFn();

  return useQuery({
    queryKey: gratuityKeys.listing(body),
    queryFn: () => getGratuityList({ body }),
    initialData: { gratuityGroups: [], totalCount: 0 },
  });
}
