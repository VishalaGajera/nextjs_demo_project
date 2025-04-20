"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { HOLIDAY_GROUP_ROUTES } from "../../../../../constants/routes/employee-management/holiday-group/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { holidayGroupKeys } from "../../../../../queryKeysFactories/holiday";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../types/apiResponse";
import type { HolidayGroupList } from "../../HolidayGroupSideBar/hooks/useGetHolidayGroupList";
import type { HolidayGroupFormFieldValues } from "../HolidayGroupForm";

type AddHolidaysGroupApiSuccessResponse = ApiSuccessResponse<HolidayGroupList>;

type UseAddHolidaysGroupArgs = {
  options: UseMutationOptions<
    AddHolidaysGroupApiSuccessResponse,
    ApiErrorResponse<HolidayGroupFormFieldValues>,
    Partial<Omit<HolidayGroupFormFieldValues, "year"> & { year: number }>
  >;
};

export function useAddHolidaysGroup({ options = {} }: UseAddHolidaysGroupArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: holidayGroupKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddHolidaysGroupApiSuccessResponse>(
          HOLIDAY_GROUP_ROUTES.holidayGrouAdd,
          formValues
        );

      return data;
    },
    ...options,
  });
}
