import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { employeeCodeKeys } from "../../../../queryKeysFactories/employeeCode";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";
import { EMPLOYEE_CODE_ROUTES } from "../../../../constants/routes/settings/employee-code/routes";

type UseGetEmployeeCodeArgs = {
  companyId?: string | null;
};

export function useGetEmployeeCodeOptions({
  companyId,
}: UseGetEmployeeCodeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchGrade = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      EMPLOYEE_CODE_ROUTES.options(companyId)
    );

    return data.data;
  };

  return useQuery({
    queryKey: employeeCodeKeys.options(companyId),
    queryFn: fetchGrade,
    enabled: !!companyId,
    initialData: [],
  });
}
