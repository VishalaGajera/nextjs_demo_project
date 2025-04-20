import { useQuery } from "@tanstack/react-query";
import { BUSINESS_UNIT_ROUTES } from "../../../../../constants/routes/organization/business-unit/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { businessUnitsKeys } from "../../../../../queryKeysFactories/businessUnit";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";
import type { BusinessUnit } from "../../BusinessUnitList/hooks/useGetBusinessUnitss";

type UseGetBusinessUnitArgs = {
  businessUnitId: BusinessUnit["id"];
};

export function useGetBusinessUnit({ businessUnitId }: UseGetBusinessUnitArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchBusinessUnit = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<
      ApiSuccessResponse<
        Omit<BusinessUnit, "business_unit_heads"> & {
          business_unit_heads: string[];
        }
      >
    >(BUSINESS_UNIT_ROUTES.get(businessUnitId));

    return data;
  };

  return useQuery({
    queryKey: businessUnitsKeys.get(businessUnitId),
    queryFn: fetchBusinessUnit,
    enabled: !!businessUnitId,
  });
}
