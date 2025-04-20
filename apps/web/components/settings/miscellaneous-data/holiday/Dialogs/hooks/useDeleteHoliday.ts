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
import { HOLIDAY_ROUTES } from "../../../../../../constants/routes/settings/holiday/routes";

type DeleteHolidayApiResponse = ApiSuccessResponse<Holiday>;

type UseDeleteHolidayArgs = {
  options: UseMutationOptions<DeleteHolidayApiResponse, ApiErrorResponse>;
  holidayId: string;
};

export function useDeleteHoliday({
  holidayId,
  options = {},
}: UseDeleteHolidayArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: holidayMasterKeys.delete(holidayId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteHolidayApiResponse>(
        HOLIDAY_ROUTES.delete(holidayId)
      );

      return data;
    },
    ...options,
  });
}
