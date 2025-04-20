import { useQuery } from "@tanstack/react-query";
import { SHIFT_TYPE_ROUTES } from "../../../../constants/routes/employee-management/shifts/shift-type/routes";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { employeeShiftDetailKeys } from "../../../../queryKeysFactories/shift";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";

type UseGetShiftOptionsArgs = {
  companyId: string;
};

export type ShiftOptionsType = {
  value: string;
  label: string;
  shift_start: string;
  shift_end: string;
  shift_type: string;
};

export function useGetShiftOptions({ companyId }: UseGetShiftOptionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchShiftOption = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<ShiftOptionsType[]>
    >(SHIFT_TYPE_ROUTES.options(companyId));

    return data.data;
  };

  return useQuery({
    queryKey: employeeShiftDetailKeys.options(companyId),
    queryFn: fetchShiftOption,
    enabled: !!companyId,
    initialData: [],
  });
}
