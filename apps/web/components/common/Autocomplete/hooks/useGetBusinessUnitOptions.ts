import { useQuery } from "@tanstack/react-query";
import { BUSINESS_UNIT_ROUTES } from "../../../../constants/routes/organization/business-unit/routes";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { businessUnitsKeys } from "../../../../queryKeysFactories/businessUnit";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";

type UseGetBusinessUnitArgs = {
  companyId?: string | null;
  isEnabled?: boolean;
};

export function useGetBusinessUnitOptionsQueryFn({
  companyId,
}: UseGetBusinessUnitArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchBusinessUnit = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      BUSINESS_UNIT_ROUTES.options(companyId)
    );

    return data.data;
  };

  return { fetchBusinessUnit };
}

export function useGetBusinessUnitOptions({
  companyId,
  isEnabled = false,
}: UseGetBusinessUnitArgs) {
  const { fetchBusinessUnit } = useGetBusinessUnitOptionsQueryFn({
    companyId,
  });

  return useQuery({
    queryKey: businessUnitsKeys.options(companyId),
    queryFn: fetchBusinessUnit,
    enabled: !!companyId || isEnabled,
    initialData: [],
  });
}
