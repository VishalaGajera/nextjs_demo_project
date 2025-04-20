"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { holidayMasterKeys } from "../../../../../../queryKeysFactories/holiday";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { Holiday } from "../../HolidayList/hooks/useGetHolidays";
import type { HolidayFormFieldValues } from "../HolidayForm";
import { HOLIDAY_ROUTES } from "../../../../../../constants/routes/settings/holiday/routes";

type EditHolidayApiResponse = ApiSuccessResponse<Holiday>;

type UseEditHolidayArgs = {
  options: UseMutationOptions<
    EditHolidayApiResponse,
    ApiErrorResponse<HolidayFormFieldValues>,
    Partial<HolidayFormFieldValues>
  >;
  holidayId: string;
};

export function useEditHoliday({
  holidayId,
  options = {},
}: UseEditHolidayArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: holidayMasterKeys.edit(holidayId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditHolidayApiResponse>(
        HOLIDAY_ROUTES.patch(holidayId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
