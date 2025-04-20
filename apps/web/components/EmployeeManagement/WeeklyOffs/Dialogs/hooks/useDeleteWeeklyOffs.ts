"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { weeklyOffsKeys } from "../../../../../queryKeysFactories/weeklyOffs";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../types/apiResponse";
import type { WeeklyOffs } from "../../WeeklyOffsList/hooks/useGetWeeklyOffs";
import { WEEKLY_OFF_ROUTES } from "../../../../../constants/routes/employee-management/weekly-off-type/routes";

type DeleteWeeklyOffsApiResponse = ApiSuccessResponse<WeeklyOffs>;

type UseDeleteWeeklyOffsArgs = {
  options: UseMutationOptions<DeleteWeeklyOffsApiResponse, ApiErrorResponse>;
  weeklyOffsId: string;
};

export function useDeleteWeeklyOffs({
  weeklyOffsId,
  options = {},
}: UseDeleteWeeklyOffsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: weeklyOffsKeys.delete(weeklyOffsId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteWeeklyOffsApiResponse>(
        WEEKLY_OFF_ROUTES.delete(weeklyOffsId)
      );

      return data;
    },
    ...options,
  });
}
