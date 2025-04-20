"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { HOLIDAY_GROUP_ROUTES } from "../../../../../../constants/routes/employee-management/holiday-group/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { holidayGroupKeys } from "../../../../../../queryKeysFactories/holiday";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { HolidayGroupFormFieldValues } from "../../../Dialog/HolidayGroupForm";
import type { HolidayGroupList } from "../../../HolidayGroupSideBar/hooks/useGetHolidayGroupList";

type EditHolidaysGroupApiSuccessResponse = ApiSuccessResponse<HolidayGroupList>;

type UseEditHolidaysGroupArgs = {
  holidayGroupId: string;
  options: UseMutationOptions<
    EditHolidaysGroupApiSuccessResponse,
    ApiErrorResponse<HolidayGroupFormFieldValues>,
    Partial<HolidayGroupFormFieldValues>
  >;
};

export function useEditHolidaysGroup({
  options = {},
  holidayGroupId,
}: UseEditHolidaysGroupArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: holidayGroupKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditHolidaysGroupApiSuccessResponse>(
          HOLIDAY_GROUP_ROUTES.update(holidayGroupId),
          formValues
        );

      return data;
    },
    ...options,
  });
}
