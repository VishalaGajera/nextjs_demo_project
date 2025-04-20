"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { HOLIDAY_GROUP_ROUTES } from "../../../../../../../constants/routes/employee-management/holiday-group/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { holidayKeys } from "../../../../../../../queryKeysFactories/holiday";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";
import type { HolidayType } from "../../hooks/useGetHolidayGroupListColumns";

type DeleteHolidayApiResponse = ApiSuccessResponse<HolidayType>;

type UseDeleteHolidayArgs = {
  options: UseMutationOptions<DeleteHolidayApiResponse, ApiErrorResponse>;
  holidayGroupId: string;
  holidayId: string;
};

export function useDeleteHoliday({
  holidayGroupId,
  holidayId,
  options = {},
}: UseDeleteHolidayArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: holidayKeys.delete(holidayGroupId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteHolidayApiResponse>(
        HOLIDAY_GROUP_ROUTES.delete(holidayGroupId, holidayId)
      );

      return data;
    },
    ...options,
  });
}
