import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { weeklyOffsKeys } from "../../../../queryKeysFactories/weeklyOffs";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";
import { WEEKLY_OFF_ROUTES } from "../../../../constants/routes/employee-management/weekly-off-type/routes";

type UseGetWeeklyOffSchemaOptionsArgs = {
  companyId?: string | null;
};

export function useGetWeeklyOffSchemaOptions({
  companyId,
}: UseGetWeeklyOffSchemaOptionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchWeeklyOffSchemaOption = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      WEEKLY_OFF_ROUTES.options(companyId)
    );

    return data.data;
  };

  return useQuery({
    queryKey: weeklyOffsKeys.options(companyId),
    queryFn: fetchWeeklyOffSchemaOption,
    enabled: !!companyId,
    initialData: [],
  });
}
