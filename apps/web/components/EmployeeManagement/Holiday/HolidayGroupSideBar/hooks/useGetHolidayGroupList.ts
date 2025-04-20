import { useQuery } from "@tanstack/react-query";
import { HOLIDAY_GROUP_ROUTES } from "../../../../../constants/routes/employee-management/holiday-group/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { holidayGroupKeys } from "../../../../../queryKeysFactories/holiday";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";

export type HolidayGroupList = {
  id: string;
  name: string;
  company_name: string;
};

type useGetHolidayGroupListArgs = {
  companyId: string;
};
export function useGetHolidayGroupList({
  companyId,
}: useGetHolidayGroupListArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchHolidayGroup = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<HolidayGroupList[]>>(
      HOLIDAY_GROUP_ROUTES.listing(companyId)
    );

    return data;
  };

  return useQuery({
    queryKey: holidayGroupKeys.listing({ companyId }),
    queryFn: fetchHolidayGroup,
  });
}
