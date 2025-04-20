import { useQuery } from "@tanstack/react-query";
import { HOLIDAY_GROUP_ROUTES } from "../../../../constants/routes/employee-management/holiday-group/routes";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { holidayKeys } from "../../../../queryKeysFactories/holiday";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";

type UseGetHolidaySchemaOptionsArgs = {
  companyId: string;
};

export function useGetHolidaySchemaOptions({
  companyId,
}: UseGetHolidaySchemaOptionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchHolidaySchemaOption = async () => {
    const url = HOLIDAY_GROUP_ROUTES.options(companyId);

    const { data } =
      await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(url);

    return data.data;
  };

  return useQuery({
    queryKey: holidayKeys.options(companyId),
    queryFn: fetchHolidaySchemaOption,
    enabled: !!companyId,
    initialData: [],
  });
}
