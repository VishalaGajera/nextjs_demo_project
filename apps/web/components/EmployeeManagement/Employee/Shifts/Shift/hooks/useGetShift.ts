import { useQuery } from "@tanstack/react-query";

import { SHIFT_TYPE_ROUTES } from "../../../../../../constants/routes/employee-management/shifts/shift-type/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { employeeShiftDetailKeys } from "../../../../../../queryKeysFactories/shift";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import { type AutoShiftFormFieldValues } from "../AutoShift/AutoShiftForm/AutoShiftForm";
import type { FixedShiftFormFieldValues } from "../FixedShift/AddFixedShift/FixedShiftForm";

export type ShiftDetail = AutoShiftFormFieldValues & FixedShiftFormFieldValues;

type ShiftId = {
  shiftId: string;
};

export function useGetShift({ shiftId }: ShiftId) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchShiftDetail = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<ShiftDetail>>(
      SHIFT_TYPE_ROUTES.get(shiftId)
    );

    return data.data;
  };

  return useQuery({
    queryKey: employeeShiftDetailKeys.get(shiftId),
    queryFn: fetchShiftDetail,
    enabled: !!shiftId,
  });
}
