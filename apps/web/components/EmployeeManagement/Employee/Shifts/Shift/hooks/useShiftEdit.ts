"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { SHIFT_TYPE_ROUTES } from "../../../../../../constants/routes/employee-management/shifts/shift-type/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { employeeShiftDetailKeys } from "../../../../../../queryKeysFactories/shift";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { AutoShiftFormFieldValues } from "../AutoShift/AutoShiftForm/AutoShiftForm";
import type { FixedShiftFormFieldValues } from "../FixedShift/AddFixedShift/FixedShiftForm";
import type { ShiftDetail } from "./useGetShift";
type EditShiftApiResponse = ApiSuccessResponse<ShiftDetail>;

type UseShiftEditArgs = {
  options?: UseMutationOptions<
    EditShiftApiResponse,
    ApiErrorResponse,
    Partial<FixedShiftFormFieldValues | AutoShiftFormFieldValues>
  >;
  shiftId: string;
};

export function useShiftEdit({ shiftId, options = {} }: UseShiftEditArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: employeeShiftDetailKeys.edit(shiftId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditShiftApiResponse>(
        SHIFT_TYPE_ROUTES.patch(shiftId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
