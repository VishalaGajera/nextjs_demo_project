"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type {
  ShiftPlannerFormFieldValues,
  SlotsType,
} from "../ShiftPlannerForm";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { shiftPlannerKeys } from "../../../../../../queryKeysFactories/shiftPlanner";
import { SHIFT_PLANNER_ROUTES } from "../../../../../../constants/routes/transactions/shift-day/shift-planner/routes";

type EditShiftPlannerArgsApiResponse = ApiSuccessResponse<{
  message: string;
  data: string;
}>;

type UseEditShiftPlannerArgs = {
  options: UseMutationOptions<
    EditShiftPlannerArgsApiResponse,
    ApiErrorResponse<ShiftPlannerFormFieldValues>,
    Partial<ShiftPlannerFormFieldValues> & { slots: SlotsType[] }
  >;
  currentDate: string;
};

export function useEditShiftPlanner({
  currentDate,
  options = {},
}: UseEditShiftPlannerArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: shiftPlannerKeys.edit(currentDate),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<EditShiftPlannerArgsApiResponse>(
        SHIFT_PLANNER_ROUTES.post(currentDate),
        formValues
      );

      return data;
    },
    ...options,
  });
}
