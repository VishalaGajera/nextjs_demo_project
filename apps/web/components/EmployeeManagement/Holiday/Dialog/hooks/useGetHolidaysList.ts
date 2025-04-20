import { useQuery } from "@tanstack/react-query";
import { HOLIDAY_ROUTES } from "../../../../../constants/routes/settings/holiday/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { holidayKeys } from "../../../../../queryKeysFactories/holiday";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";

export type HolidaysList = {
  id: string;
  name: string;
  date: string;
  is_recommended: boolean;
};

type useGetHolidaysListArgs = {
  year: string;
};

export function useGetHolidaysList({ year }: useGetHolidaysListArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchHolidays = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<HolidaysList[]>>(
      HOLIDAY_ROUTES.options(year)
    );

    return data;
  };

  return useQuery({
    queryKey: holidayKeys.listing({ year }),
    queryFn: fetchHolidays,
    initialData: [],
    enabled: !!year,
  });
}
