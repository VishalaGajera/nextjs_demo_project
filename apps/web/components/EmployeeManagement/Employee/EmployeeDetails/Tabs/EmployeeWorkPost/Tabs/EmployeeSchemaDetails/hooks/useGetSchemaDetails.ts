import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { EMPLOYEE_SCHEME_DETAILS_ROUTES } from "../../../../../../../../../constants/routes/employee-management/employee/scheme-details/routes";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { employeeSchemaDetails } from "../../../../../../../../../queryKeysFactories/employeeSchemaDetails";
import type { ApiSuccessResponse } from "../../../../../../../../../types/apiResponse";

export type SchemaItem = {
  id: string;
  name: string;
  weekly_off: string;
  effective_from: string;
  effective_to: string | null;
  has_no_end_date: boolean;
  remark: string;
  action_by: string;
  action_at: string;
  joining_date: string;
  shift_type?: string;
  shift_start?: string;
  shift_end?: string;
};

export type SchemaDetail = {
  shift_type: SchemaItem;
  bank_shift_type: SchemaItem;
  weekly_off_type: SchemaItem;
  holiday_group: Omit<SchemaItem, "effective_to">;
  attendance_penalty_rule: SchemaItem;
  overtime_rule: SchemaItem;
  leave_plan: SchemaItem;
  loan_policy: SchemaItem;
};

export type SectionKeys = keyof SchemaDetail;

type UseGetSchemaDetailArgs = {
  employeeId: string;
};

export function useGetEmployeeSchemaDetails({
  employeeId,
}: UseGetSchemaDetailArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const currentDate = DateTime.now().toISODate();

  const fetchEmployeeSchemaDetails = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<SchemaDetail>>(
      EMPLOYEE_SCHEME_DETAILS_ROUTES.getDetails(employeeId, currentDate)
    );

    return data.data;
  };

  return useQuery({
    queryKey: employeeSchemaDetails.get(employeeId),
    queryFn: fetchEmployeeSchemaDetails,
    enabled: !!employeeId,
  });
}
