"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { weeklyOffsKeys } from "../../../../../queryKeysFactories/weeklyOffs";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../types/apiResponse";
import type { WeeklyOffsFormFieldValues } from "../../AddWeeklyOffs/WeeklyOffsForm";
import type { WeeklyOffs } from "../../WeeklyOffsList/hooks/useGetWeeklyOffs";
import { WEEKLY_OFF_ROUTES } from "../../../../../constants/routes/employee-management/weekly-off-type/routes";

type EditWeeklyOffsApiResponse = ApiSuccessResponse<WeeklyOffs>;

type UseEditWeeklyOffsArgs = {
  options: UseMutationOptions<
    EditWeeklyOffsApiResponse,
    ApiErrorResponse<WeeklyOffsFormFieldValues>,
    Partial<WeeklyOffsFormFieldValues>
  >;
  weeklyOffId: string;
};

export function useEditWeeklyOffs({
  weeklyOffId,
  options = {},
}: UseEditWeeklyOffsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: weeklyOffsKeys.edit(weeklyOffId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditWeeklyOffsApiResponse>(
        WEEKLY_OFF_ROUTES.patch(weeklyOffId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
