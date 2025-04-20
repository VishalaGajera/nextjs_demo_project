"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { locationKeys } from "../../../../../queryKeysFactories/location";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../types/apiResponse";
import type { Location } from "../../LocationList/hooks/useGetLocations";
import { BUSINESS_UNIT_LOCATION_ROUTES } from "../../../../../constants/routes/organization/business-unit-location/routes";

type DeleteLocationApiResponse = ApiSuccessResponse<Location>;

type UseDeleteLocationArgs = {
  options: UseMutationOptions<DeleteLocationApiResponse, ApiErrorResponse>;
  locationId: string;
};

export function useDeleteLocation({
  locationId,
  options = {},
}: UseDeleteLocationArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: locationKeys.delete(locationId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteLocationApiResponse>(
        BUSINESS_UNIT_LOCATION_ROUTES.delete(locationId)
      );

      return data;
    },
    ...options,
  });
}
