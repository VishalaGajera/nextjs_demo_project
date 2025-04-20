import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { DateTime } from "luxon";
import type { FieldValues } from "react-hook-form";
import { SHIFT_DAY_ALLOCATION_ROUTES } from "../../../../../../constants/routes/transactions/shift-day/shift-day-allocation/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { shiftDayKeys } from "../../../../../../queryKeysFactories/ShiftDay";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";

export type ShiftDayType = {
  id: string;
  employee_code: string;
  punch_code: string;
  employee_name: string;
  department_name: string;
  avatar: string;
  sub_department_name: string;
  designation_name: string;
  company_name: string;
  business_unit_name: string;
  business_unit_location_name: string;
  reporting_manager_name: string;
  weekly_off_type_name: string;
  shift_type_name: string;
  holiday_group_name: string;
  full_count: string;
  selected: boolean;
  checkAll: boolean;
  shift_type: string;
  shift_start: string;
  shift_end: string;
  selectedRecords: {
    [key: string]: boolean;
  } | null;
};

type GetShiftDayArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
        externalFilter?: FieldValues;
      }>;
  companyId?: string;
};

export function useGetShiftDayQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const currentDate = DateTime.now().toISODate();

  const getShiftDayDetails = async ({ body, companyId }: GetShiftDayArgs) => {
    if (!companyId) {
      return { list: [], totalCount: 0 };
    }

    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        list: ShiftDayType[];
        totalCount: number;
      }>
    >(SHIFT_DAY_ALLOCATION_ROUTES.listing(currentDate), body);

    return data.data;
  };

  return { getShiftDayDetails };
}

export function useGetShiftDay({ body }: GetShiftDayArgs) {
  const { getShiftDayDetails } = useGetShiftDayQueryFn();

  return useQuery({
    queryKey: shiftDayKeys.listing(body),
    queryFn: () => getShiftDayDetails({ body }),
    initialData: { list: [], totalCount: 0 },
  });
}
