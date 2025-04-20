import { useQuery } from "@tanstack/react-query";
import { HOLIDAY_GROUP_ROUTES } from "../../../../../../../constants/routes/employee-management/holiday-group/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { holidayYearKeys } from "../../../../../../../queryKeysFactories/holiday";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";

type HolidayYearsResponse = {
  year: string;
};

type useGetHolidayYearsListArgs = {
  holidayGroupId: string;
};
export function useGetHolidayYearsList({
  holidayGroupId,
}: useGetHolidayYearsListArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchHolidayGroup = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<HolidayYearsResponse[]>>(
      HOLIDAY_GROUP_ROUTES.getHolidayByYear(holidayGroupId)
    );

    return data;
  };

  return useQuery({
    queryKey: holidayYearKeys.listing({ holidayGroupId }),
    queryFn: fetchHolidayGroup,
  });
}
