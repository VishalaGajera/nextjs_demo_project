import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { designationKeys } from "../../../../../../queryKeysFactories/designation";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import { DESIGNATION_ROUTES } from "../../../../../../constants/routes/settings/designation/routes";

export type Designation = {
  id: string;
  company_id: string;
  designation_code: string;
  designation_name: string;
  description: string;
  is_active: boolean;
  company_name: string;
  action_by: string;
  action_at: string;
  full_count: string;
};

type DesignationsArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetDesignationsQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getDesignations = async ({ body }: DesignationsArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        designations: Designation[];
        totalCount: number;
      }>
    >(DESIGNATION_ROUTES.listing, body);

    return data.data;
  };

  return { getDesignations };
}

//NOTE: for future use
export function useGetDesignations({ body }: DesignationsArgs) {
  const { getDesignations } = useGetDesignationsQueryFn();

  return useQuery({
    queryKey: designationKeys.listing(body),
    queryFn: () => getDesignations({ body }),
    initialData: { designations: [], totalCount: 0 },
  });
}
