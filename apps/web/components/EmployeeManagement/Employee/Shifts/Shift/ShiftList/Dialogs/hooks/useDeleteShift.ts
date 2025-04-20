"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { employeeShiftDetailKeys } from "../../../../../../../../queryKeysFactories/shift";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import { SHIFT_TYPE_ROUTES } from "../../../../../../../../constants/routes/employee-management/shifts/shift-type/routes";

type ShiftList = {
  id: string;
};

type DeleteShiftApiResponse = ApiSuccessResponse<ShiftList>;

type UseDeleteShiftArgs = {
  options: UseMutationOptions<DeleteShiftApiResponse, ApiErrorResponse>;
  shiftId: string;
};

export function useDeleteShift({ shiftId, options = {} }: UseDeleteShiftArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: employeeShiftDetailKeys.delete(shiftId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteShiftApiResponse>(
        SHIFT_TYPE_ROUTES.delete(shiftId)
      );

      return data;
    },
    ...options,
  });
}
