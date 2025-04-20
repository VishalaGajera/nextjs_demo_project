"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { HOLIDAY_GROUP_ROUTES } from "../../../../../../constants/routes/employee-management/holiday-group/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { holidayYearKeys } from "../../../../../../queryKeysFactories/holiday";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { HolidayGroupList } from "../../../HolidayGroupSideBar/hooks/useGetHolidayGroupList";
import type { AddHolidayYearFormFieldValues } from "../AddHolidayYearFrom";

type AddHolidaysApiSuccessResponse = ApiSuccessResponse<HolidayGroupList>;

type UseAddHolidaysArgs = {
  options: UseMutationOptions<
    AddHolidaysApiSuccessResponse,
    ApiErrorResponse<AddHolidayYearFormFieldValues>,
    Partial<Omit<AddHolidayYearFormFieldValues, "year"> & { year: number }>
  >;
  holidayGroupId: string;
};

export function useAddHolidayYear({
  options = {},
  holidayGroupId,
}: UseAddHolidaysArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: holidayYearKeys.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddHolidaysApiSuccessResponse>(
        HOLIDAY_GROUP_ROUTES.addHolidayYear(holidayGroupId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
