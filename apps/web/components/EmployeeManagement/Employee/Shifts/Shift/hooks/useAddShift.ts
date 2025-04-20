"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { SHIFT_TYPE_ROUTES } from "../../../../../../constants/routes/employee-management/shifts/shift-type/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { employeeShiftDetailKeys } from "../../../../../../queryKeysFactories/shift";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { AutoShiftFormFieldValues } from "../AutoShift/AutoShiftForm/AutoShiftForm";
import type { FixedShiftFormFieldValues } from "../FixedShift/AddFixedShift/FixedShiftForm";
import type { ShiftDetail } from "../ShiftList/hooks/useGetShiftList";

type AddShiftApiSuccessResponse = ApiSuccessResponse<ShiftDetail>;

type UseAddShiftArgs = {
  options?: UseMutationOptions<
    AddShiftApiSuccessResponse,
    ApiErrorResponse,
    Partial<FixedShiftFormFieldValues | AutoShiftFormFieldValues>
  >;
};

export function useAddShift({ options = {} }: UseAddShiftArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: employeeShiftDetailKeys.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddShiftApiSuccessResponse>(
        SHIFT_TYPE_ROUTES.post,
        formValues
      );

      return data;
    },
    ...options,
  });
}
