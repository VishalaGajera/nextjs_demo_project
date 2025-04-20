import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { industryKeys } from "../../../../../../queryKeysFactories/industry";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import { INDUSTRY_ROUTES } from "../../../../../../constants/routes/settings/industry/routes";

export type Industry = {
  id: string;
  industry_name: string;
  is_deleted: boolean;
  created_by: string;
  updated_by: string;
  deleted_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  description: string;
  is_active: boolean;
  action_by: string;
  action_at: string;
  full_count: string;
};

type GetIndustriesArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetIndustriesQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getIndustries = async ({ body }: GetIndustriesArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        industries: Industry[];
        totalCount: number;
      }>
    >(INDUSTRY_ROUTES.listing, body);

    return data.data;
  };

  return { getIndustries };
}

export function useGetIndustries({ body }: GetIndustriesArgs) {
  const { getIndustries } = useGetIndustriesQueryFn();

  return useQuery({
    queryKey: industryKeys.listing(body),
    queryFn: () => getIndustries({ body }),
    initialData: { industries: [], totalCount: 0 },
  });
}
