import { useQuery } from "@tanstack/react-query";
import { BUSINESS_UNIT_ROUTES } from "../../../../../constants/routes/organization/business-unit/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { businessUnitsKeys } from "../../../../../queryKeysFactories/businessUnit";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";
import type { OptionsType } from "../../../../../types/options";

type UseGetBusinessUnitOptionsFromMultipleCompaniesArgs = {
  companyIds: string[];
};

export function useGetBusinessUnitOptionsFromMultipleCompanies({
  companyIds,
}: UseGetBusinessUnitOptionsFromMultipleCompaniesArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchBusinessUnitOptions = async () => {
    const { data } = await axiosPrivate.post<ApiSuccessResponse<OptionsType[]>>(
      BUSINESS_UNIT_ROUTES.multipleOptions,
      { company_ids: companyIds }
    );

    return data.data;
  };

  return useQuery({
    queryKey: businessUnitsKeys.multipleOptions(companyIds),
    queryFn: fetchBusinessUnitOptions,
    enabled: !!companyIds.length,
    initialData: [],
  });
}
