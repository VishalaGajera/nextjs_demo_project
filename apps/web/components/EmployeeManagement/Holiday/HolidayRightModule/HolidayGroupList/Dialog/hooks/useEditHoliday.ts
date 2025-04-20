"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { HOLIDAY_GROUP_ROUTES } from "../../../../../../../constants/routes/employee-management/holiday-group/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { holidayKeys } from "../../../../../../../queryKeysFactories/holiday";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";
import type { HolidayFormFieldValues } from "../HolidayForm";

type EditHolidayApiSuccessResponse = ApiSuccessResponse<HolidayFormFieldValues>;

type UseEditHolidayArgs = {
  holidayGroupId: string;
  holidayId: string;
  options: UseMutationOptions<
    EditHolidayApiSuccessResponse,
    ApiErrorResponse<HolidayFormFieldValues>,
    Partial<HolidayFormFieldValues>
  >;
};

export function useEditHoliday({
  options = {},
  holidayGroupId,
  holidayId,
}: UseEditHolidayArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: holidayKeys.edit(holidayId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditHolidayApiSuccessResponse>(
        HOLIDAY_GROUP_ROUTES.patch(holidayGroupId, holidayId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
