import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { shiftPlannerKeys } from "../../../../../../queryKeysFactories/shiftPlanner";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { FieldValues } from "react-hook-form";
import { SHIFT_PLANNER_ROUTES } from "../../../../../../constants/routes/transactions/shift-day/shift-planner/routes";

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
      dayType: string;
      tooltip: string;
    };
  };
};
type quickFilterType = {
  search?: {
    filter?: string;
  };
};
type sortModelType = {
  sort: string;
  colId: string;
};
export type shiftPlannerPayloadType = {
  currentPage?: number;
  pageSize?: number;
  columnName?: string;
  startRow?: number;
  endRow?: number;
  direction?: string;
  sortModel?: sortModelType[];
  quickFilter?: quickFilterType;
  externalFilter?: FieldValues;
};

type GetShiftPlannerArgs = {
  body?: shiftPlannerPayloadType;
  datePeriod: string;
  company_id: string;
};

export function useGetShiftPlanner({
  body,
  datePeriod,
  company_id,
}: GetShiftPlannerArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchShiftPlannerData = async (body?: shiftPlannerPayloadType) => {
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

  return useQuery({
    queryKey: shiftPlannerKeys.listing(datePeriod, body),
    queryFn: () => fetchShiftPlannerData(body),
    enabled: !!company_id,
    initialData: { employees: [], totalCount: 0 },
  });
}
