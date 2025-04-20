import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { weeklyOffsKeys } from "../../../../../queryKeysFactories/weeklyOffs";
import type { QuickFilter } from "../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";
import { WEEKLY_OFF_ROUTES } from "../../../../../constants/routes/employee-management/weekly-off-type/routes";

export type WeeklyOffs = {
  id: string;
  company_name: string;
  weekly_off_type_name: string;
  description: string;
  weekly_off_days: string;
  action_by: string;
  action_at: string;
};

type GetWeeklyOffsArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetWeeklyOffsQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getWeeklyOffs = async ({ body }: GetWeeklyOffsArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        weeklyOffTypes: WeeklyOffs[];
        totalCount: number;
      }>
    >(WEEKLY_OFF_ROUTES.listing, body);

    return data.data;
  };

  return { getWeeklyOffs };
}

export function useGetWeeklyOffs({ body }: GetWeeklyOffsArgs) {
  const { getWeeklyOffs } = useGetWeeklyOffsQueryFn();

  return useQuery({
    queryKey: weeklyOffsKeys.listing(body),
    queryFn: () => getWeeklyOffs({ body }),
    initialData: { weeklyOffTypes: [], totalCount: 0 },
  });
}
