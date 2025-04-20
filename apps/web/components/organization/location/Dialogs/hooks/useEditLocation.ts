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
import type { LocationFormFieldValues } from "../LocationForm";
import { BUSINESS_UNIT_LOCATION_ROUTES } from "../../../../../constants/routes/organization/business-unit-location/routes";

type EditLocationApiResponse = ApiSuccessResponse<Location>;

type UseEditLocationArgs = {
  options: UseMutationOptions<
    EditLocationApiResponse,
    ApiErrorResponse<LocationFormFieldValues>,
    Partial<LocationFormFieldValues>
  >;
  locationId: string;
};

export function useEditLocation({
  locationId,
  options = {},
}: UseEditLocationArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: locationKeys.edit(locationId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditLocationApiResponse>(
        BUSINESS_UNIT_LOCATION_ROUTES.patch(locationId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
