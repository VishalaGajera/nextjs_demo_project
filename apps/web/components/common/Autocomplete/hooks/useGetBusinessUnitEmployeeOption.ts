import { useQuery } from "@tanstack/react-query";
import { BUSINESS_UNIT_ROUTES } from "../../../../constants/routes/organization/business-unit/routes";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { businessUnitsKeys } from "../../../../queryKeysFactories/businessUnit";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";

type UseGetBusinessUnitEmployeeOptionArgs = {
  businessUnitId: string;
};

export function useGetBusinessUnitEmployeeOptionQueryFn({
  businessUnitId,
}: UseGetBusinessUnitEmployeeOptionArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchBusinessUnitEmployeeOption = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      BUSINESS_UNIT_ROUTES.getBusinessUnitEmployeeOptions(businessUnitId)
    );

    return data.data;
  };

  return { fetchBusinessUnitEmployeeOption };
}

export function useGetBusinessUnitEmployeeOption({
  businessUnitId,
}: UseGetBusinessUnitEmployeeOptionArgs) {
  const { fetchBusinessUnitEmployeeOption } =
    useGetBusinessUnitEmployeeOptionQueryFn({
      businessUnitId,
    });

  return useQuery({
    queryKey: businessUnitsKeys.employeeOptions(businessUnitId),
    queryFn: fetchBusinessUnitEmployeeOption,
    enabled: !!businessUnitId,
    initialData: [],
  });
}
