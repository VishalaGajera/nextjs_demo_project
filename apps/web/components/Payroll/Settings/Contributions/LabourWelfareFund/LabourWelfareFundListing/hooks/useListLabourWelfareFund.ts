import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { LWF_GROUP_ROUTES } from "../../../../../../../constants/routes/payroll/settings/contributions/lwf-group/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { labourWelfareFundKeys } from "../../../../../../../queryKeysFactories/labourWelfareFund";
import type { QuickFilter } from "../../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";

export type LabourWelfareFund = {
  id: string;
  state_name: string;
  deduction_months: number[];
  deduction_cycle_type: string;
  contribution_start_month: number;
  action_by: string;
  action_at: string;
  full_count: string;
};

type GetLabourWelfareFundArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetLabourWelfareFundQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getLabourWelfareFund = async ({ body }: GetLabourWelfareFundArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        lwfGroups: LabourWelfareFund[];
        totalCount: number;
      }>
    >(LWF_GROUP_ROUTES.listing, body);

    return data.data;
  };

  return { getLabourWelfareFund };
}

//NOTE: for future use
export function useGetLabourWelfareFund({ body }: GetLabourWelfareFundArgs) {
  const { getLabourWelfareFund } = useGetLabourWelfareFundQueryFn();

  return useQuery({
    queryKey: labourWelfareFundKeys.listing(body),
    queryFn: () => getLabourWelfareFund({ body }),
    initialData: { lwfGroups: [], totalCount: 0 },
  });
}
