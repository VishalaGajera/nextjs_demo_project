import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { holidayMasterKeys } from "../../../../../../queryKeysFactories/holiday";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { Holiday } from "../../HolidayList/hooks/useGetHolidays";
import { HOLIDAY_ROUTES } from "../../../../../../constants/routes/settings/holiday/routes";

type UseGetHolidayArgs = {
  holidayId: Holiday["id"];
};

export function useGetHoliday({ holidayId }: UseGetHolidayArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchHoliday = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<Holiday>>(
      HOLIDAY_ROUTES.get(holidayId)
    );

    return data;
  };

  return useQuery({
    queryKey: holidayMasterKeys.get(holidayId),
    queryFn: fetchHoliday,
    enabled: !!holidayId,
  });
}
