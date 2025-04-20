"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { shiftDayKeys } from "../../../../../../queryKeysFactories/ShiftDay";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { ShiftDayType } from "../../../ShiftdayAllocation/ShiftDayList/hooks/useGetShiftDayList";
import type { ShiftAllocationFormValues } from "../Shift/ShiftAllocationForm";
import { SHIFT_DAY_ALLOCATION_ROUTES } from "../../../../../../constants/routes/transactions/shift-day/shift-day-allocation/routes";

type EditShiftAllocationApiResponse = ApiSuccessResponse<ShiftDayType>;

type UseEditShiftAllocationArgs = {
  options: UseMutationOptions<
    EditShiftAllocationApiResponse,
    ApiErrorResponse,
    Partial<ShiftAllocationFormValues>
  >;
  employeeIds: string[];
};

export function useEditShiftAllocation({
  employeeIds,
  options = {},
}: UseEditShiftAllocationArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: shiftDayKeys.updateShift(employeeIds),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditShiftAllocationApiResponse>(
        SHIFT_DAY_ALLOCATION_ROUTES.postShiftType,
        formValues
      );

      return data;
    },
    ...options,
  });
}
