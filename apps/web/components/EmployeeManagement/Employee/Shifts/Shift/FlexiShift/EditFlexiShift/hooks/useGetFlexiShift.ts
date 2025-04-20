import { useQuery } from "@tanstack/react-query";

import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { employeeShiftDetailKeys } from "../../../../../../../../queryKeysFactories/shift";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";
import type { FlexiShiftFormFieldValues } from "../../AddFlexiShift/FlexiShiftForm";
import { SHIFT_TYPE_ROUTES } from "../../../../../../../../constants/routes/employee-management/shifts/shift-type/routes";

export type FlexiShiftDetail = FlexiShiftFormFieldValues &
  Partial<{
    id: string | null;
    company_id: string | null;
    flex_hours: number | null;
  }>;

type ShiftId = {
  shiftId: string;
};
export function useGetFlexiShift({ shiftId }: ShiftId) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchFlexiShiftDetail = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<FlexiShiftDetail>
    >(SHIFT_TYPE_ROUTES.patch(shiftId));

    return data.data;
  };

  return useQuery({
    queryKey: employeeShiftDetailKeys.get(shiftId),
    queryFn: fetchFlexiShiftDetail,
    enabled: !!shiftId,
  });
}
