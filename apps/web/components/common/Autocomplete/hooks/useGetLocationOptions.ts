import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { locationKeys } from "../../../../queryKeysFactories/location";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";
import { BUSINESS_UNIT_LOCATION_ROUTES } from "../../../../constants/routes/organization/business-unit-location/routes";

type UseGetLocationArgs = {
  businessUnitId?: string | null;
};

export function useGetLocationOptions({ businessUnitId }: UseGetLocationArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchLocation = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      BUSINESS_UNIT_LOCATION_ROUTES.options(businessUnitId)
    );

    return data.data;
  };

  return useQuery({
    queryKey: locationKeys.options(businessUnitId),
    queryFn: fetchLocation,
    enabled: !!businessUnitId,
    initialData: [],
  });
}
