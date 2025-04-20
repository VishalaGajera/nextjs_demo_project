import { useQuery } from "@tanstack/react-query";
import { LEAVE_OVERVIEW_ROUTES } from "../../../../constants/routes/transactions/leave/leave-overview/route";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { leaveOverviewKey } from "../../../../queryKeysFactories/leaveOverview";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";

type GetLeaveBalanceYearOptionsArgs = {
  employeeId: string;
};

export function useGetLeaveBalanceYearOptions({
  employeeId,
}: GetLeaveBalanceYearOptionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchLeaveBalanceYearOptions = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      LEAVE_OVERVIEW_ROUTES.getLeaveBalanceYearOptions(employeeId)
    );

    return data.data;
  };

  return useQuery({
    queryKey: leaveOverviewKey.options(employeeId),
    queryFn: fetchLeaveBalanceYearOptions,
    initialData: [],
    enabled: !!employeeId,
  });
}
