import { useQuery } from "@tanstack/react-query";
import {
  COMPANY_ROUTES,
  type QueryParams,
} from "../../../../constants/routes/organization/company/routes";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { companyKeys } from "../../../../queryKeysFactories/company";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { EmployeeCodeTypeKeys } from "./useGetEmployeeCodeTypeOptions";

type Options = {
  value: string;
  label: string;
};

export type CompanyOptions = Options & {
  employee_code_generation_type: EmployeeCodeTypeKeys;
};

type UseGetCompanyOptionsArgs = {
  queryParams?: QueryParams;
};

export function useGetCompanyQueryOptionFn({
  queryParams,
}: UseGetCompanyOptionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const getCompanyOptions = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<CompanyOptions[]>
    >(COMPANY_ROUTES.options(queryParams));

    return data.data;
  };

  return { getCompanyOptions };
}

//NOTE: for future use
export function useGetCompanyOptions(args?: UseGetCompanyOptionsArgs) {
  const { queryParams = {} } = args ?? {};

  const { getCompanyOptions } = useGetCompanyQueryOptionFn({
    queryParams,
  });

  return useQuery({
    queryKey: companyKeys.options(queryParams),
    queryFn: () => getCompanyOptions(),
    initialData: [],
  });
}
