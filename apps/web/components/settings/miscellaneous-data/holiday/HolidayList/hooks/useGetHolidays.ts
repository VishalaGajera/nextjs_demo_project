import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { holidayKeys } from "../../../../../../queryKeysFactories/holiday";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import { HOLIDAY_ROUTES } from "../../../../../../constants/routes/settings/holiday/routes";

export type Holiday = {
  id: string;
  holiday_name: string;
  holiday_date: string;
  year: string;
  description: string;
  is_recommended: boolean;
  is_active: boolean;
  action_by: string;
  action_at: string;
};

type HolidayTypesArgs = {
  body?:
    | Partial<IGetRowsParams>
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetHolidayQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getHoliday = async ({ body }: HolidayTypesArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        holidays: Holiday[];
        totalCount: number;
      }>
    >(HOLIDAY_ROUTES.listing, body);

    return data.data;
  };

  return { getHoliday };
}

export function useGetHoliday({ body }: HolidayTypesArgs) {
  const { getHoliday } = useGetHolidayQueryFn();

  return useQuery({
    queryKey: holidayKeys.listing(body),
    queryFn: () => getHoliday({ body }),
    initialData: { holidays: [], totalCount: 0 },
  });
}
