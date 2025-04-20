"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { HOLIDAY_GROUP_ROUTES } from "../../../../../../constants/routes/employee-management/holiday-group/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { holidayGroupKeys } from "../../../../../../queryKeysFactories/holiday";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { HolidayGroupList } from "../../../HolidayGroupSideBar/hooks/useGetHolidayGroupList";

type DeleteHolidayGroupApiResponse = ApiSuccessResponse<HolidayGroupList>;

type UseDeleteBankArgs = {
  options: UseMutationOptions<DeleteHolidayGroupApiResponse, ApiErrorResponse>;
  holidayGroupId: string;
};

export function useDeleteHolidayGroup({
  holidayGroupId,
  options = {},
}: UseDeleteBankArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: holidayGroupKeys.delete(holidayGroupId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteHolidayGroupApiResponse>(
        HOLIDAY_GROUP_ROUTES.holidayGroupDelete(holidayGroupId)
      );

      return data;
    },
    ...options,
  });
}
