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

type AddHolidayApiSuccessResponse = ApiSuccessResponse<HolidayFormFieldValues>;

type UseAddHolidayArgs = {
  holidayGroupId: string;
  options: UseMutationOptions<
    AddHolidayApiSuccessResponse,
    ApiErrorResponse<HolidayFormFieldValues>,
    Partial<HolidayFormFieldValues>
  >;
};

export function useAddHoliday({
  options = {},
  holidayGroupId,
}: UseAddHolidayArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: holidayKeys.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddHolidayApiSuccessResponse>(
        HOLIDAY_GROUP_ROUTES.post(holidayGroupId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
