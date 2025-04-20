import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { HOLIDAY_GROUP_ROUTES } from "../../../../../../constants/routes/employee-management/holiday-group/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { holidayKeys } from "../../../../../../queryKeysFactories/holiday";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { HolidayType } from "./useGetHolidayGroupListColumns";

type GetHolidaysArgs = {
  body?: Partial<IGetRowsParams> | QuickFilter;
  holidayGroupId: string;
};

export function useGetHolidaysQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getHolidays = async ({ body, holidayGroupId }: GetHolidaysArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        holidays: HolidayType[];
        totalCount: number;
      }>
    >(HOLIDAY_GROUP_ROUTES.getHolidayById(holidayGroupId), body);

    return data.data;
  };

  return { getHolidays };
}

export function useGetHolidays({ body, holidayGroupId }: GetHolidaysArgs) {
  const { getHolidays } = useGetHolidaysQueryFn();

  return useQuery({
    queryKey: holidayKeys.listing(body),
    queryFn: () => getHolidays({ holidayGroupId, body }),
    initialData: { holidays: [], totalCount: 0 },
  });
}
