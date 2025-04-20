import type { WorkDayType } from "@codezee/sixtify-brahma";
import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { DateTime } from "luxon";
import type { FieldValues } from "react-hook-form";
import { SHIFT_PLANNER_ROUTES } from "../../../../../../constants/routes/transactions/shift-day/shift-planner/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { shiftPlannerKeys } from "../../../../../../queryKeysFactories/shiftPlanner";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";

export type ShiftPlanner = {
  id: string;
  employee_code: string;
  punch_code: string;
  avatar: string;
  employee_name: string;
  company_name: string;
  business_unit_name: string;
  business_unit_location_name: string;
  department_name: string;
  sub_department_name: string;
  designation_name: string;
  shift_type_name: string;
  days: {
    [key: number]: {
      label: string;
      dayType: WorkDayType;
      tooltip: string;
      shift_end: string;
      shift_start: string;
      shift_type_name: string;
      is_assigned_via_shift_planner: boolean;
    };
  };
};

type GetShiftPlannerArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
        externalFilter: FieldValues;
      }>;
  datePeriod: string;
};

export function useGetShiftPlannerQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getShiftPlanner = async ({ body, datePeriod }: GetShiftPlannerArgs) => {
    const currentDate = DateTime.now().toISODate();

    const datePeriodVar = datePeriod ?? DateTime.now().toFormat("yyyy-MM");

    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        employees: ShiftPlanner[];
        totalCount: number;
      }>
    >(SHIFT_PLANNER_ROUTES.listing(datePeriodVar, currentDate), body);

    return data.data;
  };

  return { getShiftPlanner };
}

export function useGetShiftPlanner({ body, datePeriod }: GetShiftPlannerArgs) {
  const { getShiftPlanner } = useGetShiftPlannerQueryFn();

  return useQuery({
    queryKey: shiftPlannerKeys.listing(datePeriod, body),
    queryFn: () =>
      getShiftPlanner({
        body,
        datePeriod,
      }),
    initialData: { employees: [], totalCount: 0 },
  });
}
