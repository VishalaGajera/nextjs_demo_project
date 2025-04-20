import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { overtimeRateTypeKeys } from "../../../../../../queryKeysFactories/overtimeRateType";
import type { QuickFilter } from "../../../../../../types/agGrid";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import { OVERTIME_RATE_TYPE_ROUTES } from "../../../../../../constants/routes/policy-configuration/overtime/overtime-rate-type/routes";

export type OvertimeRateType = {
  id: string;
  company_name: string;
  overtime_rate_code: string;
  overtime_rate_name: string;
  description: string;
  overtime_type: string;
  action_by: string;
  action_at: string;
};

type GetOvertimeRateTypesArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetOvertimeRateTypesUnitsQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getOvertimeRateType = async ({ body }: GetOvertimeRateTypesArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        overtimeRateType: OvertimeRateType[];
        totalCount: number;
      }>
    >(OVERTIME_RATE_TYPE_ROUTES.listing, body);

    return data.data;
  };

  return { getOvertimeRateType };
}

export function useGetOvertimeRateTypes({ body }: GetOvertimeRateTypesArgs) {
  const { getOvertimeRateType } = useGetOvertimeRateTypesUnitsQueryFn();

  return useQuery({
    queryKey: overtimeRateTypeKeys.listing(body),
    queryFn: () => getOvertimeRateType({ body }),
    initialData: { overtimeRateType: [], totalCount: 0 },
  });
}
