import { useQuery } from "@tanstack/react-query";
import { DEPARTMENT_ROUTES } from "../../../../../constants/routes/settings/department/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { departmentKeys } from "../../../../../queryKeysFactories/department";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";
import type { OptionsType } from "../../../../../types/options";

type UseGetDepartmentOptionsFromMultipleCompaniesArgs = {
  companyIds: string[];
};

export function useGetDepartmentOptionsFromMultipleCompanies({
  companyIds,
}: UseGetDepartmentOptionsFromMultipleCompaniesArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchDepartmentOptions = async () => {
    const { data } = await axiosPrivate.post<ApiSuccessResponse<OptionsType[]>>(
      DEPARTMENT_ROUTES.multipleOptions,
      { company_ids: companyIds }
    );

    return data.data;
  };

  return useQuery({
    queryKey: departmentKeys.multipleOptions(companyIds),
    queryFn: fetchDepartmentOptions,
    enabled: !!companyIds.length,
    initialData: [],
  });
}
