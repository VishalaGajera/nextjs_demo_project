import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { employeeCodeKeys } from "../../../../../queryKeysFactories/employeeCode";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";
import type { EmployeeCode } from "../../EmployeeCodeList/hooks/useGetEmployeeCodes";
import { EMPLOYEE_CODE_ROUTES } from "../../../../../constants/routes/settings/employee-code/routes";

type UseGetEmployeeCodeArgs = {
  employeeCodeId: EmployeeCode["id"];
};

export function useGetEmployeeCode({ employeeCodeId }: UseGetEmployeeCodeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEmployeeCode = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<EmployeeCode>>(
      EMPLOYEE_CODE_ROUTES.get(employeeCodeId)
    );

    return data;
  };

  return useQuery({
    queryKey: employeeCodeKeys.get(employeeCodeId),
    queryFn: fetchEmployeeCode,
    enabled: !!employeeCodeId,
  });
}
