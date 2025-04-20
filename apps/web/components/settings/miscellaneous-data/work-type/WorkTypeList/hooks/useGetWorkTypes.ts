import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { workTypeKeys } from "../../../../../../queryKeysFactories/worktype";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import { WORK_TYPE_ROUTES } from "../../../../../../constants/routes/settings/work-type/routes";

export type WorkType = {
  id: string;
  company_id: string;
  work_type_code: string;
  work_type_name: string;
  description: string;
  is_active: boolean;
  company_name: string;
  action_by: string;
  action_at: string;
  full_count: string;
};

type GetWorkTypesArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetWorkTypesQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getWorkTypes = async ({ body }: GetWorkTypesArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        workTypes: WorkType[];
        totalCount: number;
      }>
    >(WORK_TYPE_ROUTES.listing, body);

    return data.data;
  };

  return { getWorkTypes };
}

//NOTE: for future use
export function useGetWorkTypes({ body }: GetWorkTypesArgs) {
  const { getWorkTypes } = useGetWorkTypesQueryFn();

  return useQuery({
    queryKey: workTypeKeys.listing(body),
    queryFn: () => getWorkTypes({ body }),
    initialData: { workTypes: [], totalCount: 0 },
  });
}
