"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { shiftDayKeys } from "../../../../../../queryKeysFactories/ShiftDay";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { ShiftDayType } from "../../ShiftDayList/hooks/useGetShiftDayList";
import type { WeeklyOffAllocationFormValues } from "../WeeklyOff/WeeklyOffAllocationForm";
import { SHIFT_DAY_ALLOCATION_ROUTES } from "../../../../../../constants/routes/transactions/shift-day/shift-day-allocation/routes";

type EditWeeklyOffAllocationApiResponse = ApiSuccessResponse<ShiftDayType>;

type UseEditWeeklyOffAllocationArgs = {
  options: UseMutationOptions<
    EditWeeklyOffAllocationApiResponse,
    ApiErrorResponse,
    Partial<WeeklyOffAllocationFormValues>
  >;
  employeeIds: string[];
};

export function useEditWeeklyOffAllocation({
  employeeIds,
  options = {},
}: UseEditWeeklyOffAllocationArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: shiftDayKeys.updateWeeklyOff(employeeIds),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditWeeklyOffAllocationApiResponse>(
          SHIFT_DAY_ALLOCATION_ROUTES.postWeeklyOffType,
          formValues
        );

      return data;
    },
    ...options,
  });
}
