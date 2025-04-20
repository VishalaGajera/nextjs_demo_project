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

type AddLocationApiSuccessResponse = ApiSuccessResponse<Location>;

type UseAddLocationUnitArgs = {
  options: UseMutationOptions<
    AddLocationApiSuccessResponse,
    ApiErrorResponse<LocationFormFieldValues>,
    Partial<LocationFormFieldValues>
  >;
};

export function useAddLocation({ options = {} }: UseAddLocationUnitArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: locationKeys.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddLocationApiSuccessResponse>(
        BUSINESS_UNIT_LOCATION_ROUTES.post,
        formValues
      );

      return data;
    },
    ...options,
  });
}
