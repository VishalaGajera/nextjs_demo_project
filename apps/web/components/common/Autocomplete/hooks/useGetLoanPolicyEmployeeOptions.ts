import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { LOAN_POLICY_EMPLOYEE_ROUTES } from "../../../../constants/routes/policy-configuration/loan/loan-policy/employee/routes";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { loanPolicyKeys } from "../../../../queryKeysFactories/loanPolicy";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";

type UseGetLoanPolicyEmployeeOptionArgs = {
  companyId: string;
};
export type LoanPolicyEmployeeOption = OptionsType & {
  avatar: string;
  mobile_no: string;
  address: string;
  employee_code: string;
  punch_code: string;
};

const currentDate = DateTime.now().toISODate();

export function useGetLoanPolicyEmployeeOptionsQueryFn({
  companyId,
}: UseGetLoanPolicyEmployeeOptionArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchLoanPolicyEmployeeOption = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<LoanPolicyEmployeeOption[]>
    >(LOAN_POLICY_EMPLOYEE_ROUTES.options(companyId, currentDate));

    return data.data;
  };

  return { fetchLoanPolicyEmployeeOption };
}

export function useGetLoanPolicyEmployeeOption({
  companyId,
}: UseGetLoanPolicyEmployeeOptionArgs) {
  const { fetchLoanPolicyEmployeeOption } =
    useGetLoanPolicyEmployeeOptionsQueryFn({
      companyId,
    });

  return useQuery({
    queryKey: loanPolicyKeys.employeeOptions(companyId, currentDate),
    queryFn: fetchLoanPolicyEmployeeOption,
    enabled: !!companyId,
    initialData: [],
  });
}
