import { useQuery } from "@tanstack/react-query";
import { HOLIDAY_GROUP_ROUTES } from "../../../../../../../constants/routes/employee-management/holiday-group/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { holidayKeys } from "../../../../../../../queryKeysFactories/holiday";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";
import type { HolidayType } from "../../hooks/useGetHolidayGroupListColumns";

type UseGetHolidayArgs = {
  holidayId: string;
  holidayGroupId: string;
};

export function useGetHoliday({
  holidayId,
  holidayGroupId,
}: UseGetHolidayArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchHoliday = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<HolidayType>>(
      HOLIDAY_GROUP_ROUTES.getHoliday(holidayGroupId, holidayId)
    );

    return data;
  };

  return useQuery({
    queryKey: holidayKeys.get(holidayId),
    queryFn: fetchHoliday,
    enabled: !!holidayGroupId && !!holidayId,
  });
}
