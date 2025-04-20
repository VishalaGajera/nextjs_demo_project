import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { subCasteKeys } from "../../../../../../queryKeysFactories/subCaste";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import { SUB_CASTE_ROUTES } from "../../../../../../constants/routes/settings/sub-caste/routes";

export type SubCaste = {
  id: string;
  caste_name: string;
  company_id: string;
  sub_caste_name: string;
  is_active: boolean;
  company_name: string;
  action_by: string;
  action_at: string;
  full_count: string;
};

type SubCasteTypesArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetSubCastesQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getSubCastes = async ({ body }: SubCasteTypesArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        subCastes: SubCaste[];
        totalCount: number;
      }>
    >(SUB_CASTE_ROUTES.listing, body);

    return data.data;
  };

  return { getSubCastes };
}

export function useGetSubCastes({ body }: SubCasteTypesArgs) {
  const { getSubCastes } = useGetSubCastesQueryFn();

  return useQuery({
    queryKey: subCasteKeys.listing(body),
    queryFn: () => getSubCastes({ body }),
    initialData: { subCastes: [], totalCount: 0 },
  });
}
