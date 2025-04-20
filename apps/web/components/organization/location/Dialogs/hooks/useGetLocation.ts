import { useQuery } from "@tanstack/react-query";
import { BUSINESS_UNIT_LOCATION_ROUTES } from "../../../../../constants/routes/organization/business-unit-location/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { locationKeys } from "../../../../../queryKeysFactories/location";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";
import type { Location } from "../../LocationList/hooks/useGetLocations";

type UseGetLocationArgs = {
  locationId: Location["id"];
};

export function useGetLocation({ locationId }: UseGetLocationArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchLocation = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<
      ApiSuccessResponse<
        Omit<Location, "business_unit_location_heads"> & {
          business_unit_location_heads: string[];
        }
      >
    >(BUSINESS_UNIT_LOCATION_ROUTES.get(locationId));

    return data;
  };

  return useQuery({
    queryKey: locationKeys.get(locationId),
    queryFn: fetchLocation,
    enabled: !!locationId,
  });
}
