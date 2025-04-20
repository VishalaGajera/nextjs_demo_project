import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";

import { SHIFT_TYPE_ROUTES } from "../../../../../../../constants/routes/employee-management/shifts/shift-type/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { employeeShiftDetailKeys } from "../../../../../../../queryKeysFactories/shift";
import type { QuickFilter } from "../../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";

export type ShiftDetail = {
  id: string;
  company_id: string;
  shift_type_name: string;
  shift_type_code: string;
  shift_type: string;
  shift_time: string;
  shift_gross_hours: string;
  break_gross_hours: string;
  min_full_day_hours: string;
  min_half_day_hours: string;
  company_name: string;
  action_by: string;
  action_at: string;
  full_count: string;
  effective_work_hours: string;
};

type GetShiftDetailArgs = {
  body?:
    | Partial<IGetRowsParams>
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetShiftListQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getShiftDetail = async ({ body }: GetShiftDetailArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        shiftTypes: ShiftDetail[];
        totalCount: number;
      }>
    >(SHIFT_TYPE_ROUTES.listing, body);

    return data.data;
  };

  return { getShiftDetail };
}

export function useGetShiftDetail({ body }: GetShiftDetailArgs) {
  const { getShiftDetail } = useGetShiftListQueryFn();

  return useQuery({
    queryKey: employeeShiftDetailKeys.listing(body),
    queryFn: () => getShiftDetail({ body }),
    initialData: { shiftTypes: [], totalCount: 0 },
  });
}
