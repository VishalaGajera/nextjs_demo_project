import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { weeklyOffsKeys } from "../../../../../queryKeysFactories/weeklyOffs";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";
import type { WeeklyOffsFormFieldValues } from "../../AddWeeklyOffs/WeeklyOffsForm";
import type { WeeklyOffs } from "../../WeeklyOffsList/hooks/useGetWeeklyOffs";
import { WEEKLY_OFF_ROUTES } from "../../../../../constants/routes/employee-management/weekly-off-type/routes";

type UseGetWeeklyOffArgs = {
  weeklyOffId: WeeklyOffs["id"];
};

export function useGetWeeklyOff({ weeklyOffId }: UseGetWeeklyOffArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchWeeklyOff = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<WeeklyOffsFormFieldValues>>(
      WEEKLY_OFF_ROUTES.get(weeklyOffId)
    );

    return data;
  };

  return useQuery({
    queryKey: weeklyOffsKeys.get(weeklyOffId),
    queryFn: fetchWeeklyOff,
    enabled: !!weeklyOffId,
  });
}
