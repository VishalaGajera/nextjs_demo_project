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

type AddHolidayApiSuccessResponse = ApiSuccessResponse<Holiday>;

type UseHolidayArgs = {
  options: UseMutationOptions<
    AddHolidayApiSuccessResponse,
    ApiErrorResponse<HolidayFormFieldValues>,
    Partial<HolidayFormFieldValues>
  >;
};

export function useAddHoliday({ options = {} }: UseHolidayArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: holidayMasterKeys.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddHolidayApiSuccessResponse>(
        HOLIDAY_ROUTES.post,
        formValues
      );

      return data;
    },
    ...options,
  });
}
