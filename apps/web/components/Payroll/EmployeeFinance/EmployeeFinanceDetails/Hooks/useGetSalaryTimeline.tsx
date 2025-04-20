import { useQuery } from "@tanstack/react-query";
import { EMPLOYEE_FINANCE_ROUTES } from "../../../../../constants/routes/payroll/employee-finance/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { salarySetupkeys } from "../../../../../queryKeysFactories/salarySetup";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";
import type { HourlyCalculationType } from "../Tabs/PayDetails/Tabs/SalaryOverview/SalarySetup/CalculationTypeFields";

export type SalaryComponentAllocation = {
  id: string;
  salary_structure_component_allocation_id: string;
  salary_structure_component_allocation_name: string;
  salary_component_value: number;
};

type SalaryDetails = {
  id: string;
  calculation_salary: number;
  salary_structure_id: string;
  salary_structure_name: string;
  salary_structure_range_id: string;
  salary_structure_custom_id: string | null;
  salary_structure_custom_name: string | null;
  salary_structure_interval: string;
  salary_component_allocations: SalaryComponentAllocation[] | null;
};

type SalarySetup = {
  salary_calculation_type: string;
  effective_from: string;
  salary: number;
  pay_schedule_group_id: string;
  pay_schedule_group_name: string;
  hourly_calculation_type: HourlyCalculationType | null;
  target_hours: number | null;
};

type StatutoryDetails = {
  pf_applicable: boolean;
  epf_group_id: string;
  pf_account_no: string | null;
  pf_joining_date: string | null;
  uan_no: string | null;
  esic_applicable: boolean;
  esic_group_id: string;
  esic_no: string | null;
  esic_joining_date: string | null;
  pt_applicable: boolean;
  lwf_applicable: boolean;
  tds_applicable: boolean;
  tax_regime_id: string;
  tax_regime_name: string;
  epf_group_name: string;
  esic_group_name: string;
};

export type EmployeeSalaryTimeline = {
  id: string;
  is_enable_payroll: boolean;
  employee_id: string;
  salary_setup: SalarySetup;
  salary_details: SalaryDetails;
  statutory_details: StatutoryDetails;
};

type UseGetSalaryTimelineArgs = {
  employeeId: string;
};

export function useGetSalaryTimeline({ employeeId }: UseGetSalaryTimelineArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useQuery({
    queryKey: salarySetupkeys.get(employeeId),
    queryFn: async () => {
      const { data } = await axiosPrivate.get<
        ApiSuccessResponse<EmployeeSalaryTimeline[]>
      >(EMPLOYEE_FINANCE_ROUTES.get(employeeId));

      return data.data;
    },
    initialData: [],
    enabled: !!employeeId,
  });
}
