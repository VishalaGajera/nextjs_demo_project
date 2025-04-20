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
import type { WeeklyOffsFormFieldValues } from "../WeeklyOffsForm";
import { WEEKLY_OFF_ROUTES } from "../../../../../constants/routes/employee-management/weekly-off-type/routes";

type AddWeeklyOffsApiSuccessResponse = ApiSuccessResponse<WeeklyOffs>;

type UseAddWeeklyOffsArgs = {
  options: UseMutationOptions<
    AddWeeklyOffsApiSuccessResponse,
    ApiErrorResponse,
    Partial<WeeklyOffsFormFieldValues>
  >;
};

export function useAddWeeklyOffs({ options = {} }: UseAddWeeklyOffsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: weeklyOffsKeys.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddWeeklyOffsApiSuccessResponse>(
        WEEKLY_OFF_ROUTES.post,
        formValues
      );

      return data;
    },
    ...options,
  });
}
