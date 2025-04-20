import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { holidayMasterKeys } from "../../../../queryKeysFactories/holiday";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";
import { HOLIDAY_ROUTES } from "../../../../constants/routes/settings/holiday/routes";

export function useGetHolidayYearsOptionsQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getHolidayYearsOptions = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      HOLIDAY_ROUTES.holidayYearsOptions
    );

    return data.data;
  };

  return { getHolidayYearsOptions };
}

export function useGetHolidayYear() {
  const { getHolidayYearsOptions } = useGetHolidayYearsOptionsQueryFn();

  return useQuery({
    queryKey: holidayMasterKeys.options(),
    queryFn: () => getHolidayYearsOptions(),
    initialData: [],
  });
}
