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
import type { HolidayAllocationFormValues } from "../Holiday/HolidayAllocationForm";
import { SHIFT_DAY_ALLOCATION_ROUTES } from "../../../../../../constants/routes/transactions/shift-day/shift-day-allocation/routes";

type EditHolidayAllocationApiResponse = ApiSuccessResponse<ShiftDayType>;

type UseEditHolidayAllocationArgs = {
  options: UseMutationOptions<
    EditHolidayAllocationApiResponse,
    ApiErrorResponse,
    Partial<HolidayAllocationFormValues>
  >;
  employeeIds: string[];
};

export function useEditHolidayAllocation({
  employeeIds,
  options = {},
}: UseEditHolidayAllocationArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: shiftDayKeys.updateHoliday(employeeIds),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditHolidayAllocationApiResponse>(
          SHIFT_DAY_ALLOCATION_ROUTES.postHolidayGroup,
          formValues
        );

      return data;
    },
    ...options,
  });
}
