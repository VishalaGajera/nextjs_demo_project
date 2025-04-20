import { useQuery } from "@tanstack/react-query";
import { HOLIDAY_GROUP_ROUTES } from "../../../../../constants/routes/employee-management/holiday-group/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { holidayGroupKeys } from "../../../../../queryKeysFactories/holiday";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";

export type HolidayGroup = {
  holiday_group_name: string;
};

export type UseGetHolidayGroupArgs = {
  holidayGroupId: string;
};
export function useGetHolidayGroup({ holidayGroupId }: UseGetHolidayGroupArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchHolidayGroup = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<HolidayGroup>>(
      HOLIDAY_GROUP_ROUTES.get(holidayGroupId)
    );

    return data;
  };

  return useQuery({
    queryKey: holidayGroupKeys.get(),
    queryFn: fetchHolidayGroup,
  });
}
