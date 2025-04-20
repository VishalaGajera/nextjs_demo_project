"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { businessUnitsKeys } from "../../../../../queryKeysFactories/businessUnit";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../types/apiResponse";
import type { BusinessUnit } from "../../BusinessUnitList/hooks/useGetBusinessUnitss";
import { BUSINESS_UNIT_ROUTES } from "../../../../../constants/routes/organization/business-unit/routes";

type DeleteBusinessUnitApiResponse = ApiSuccessResponse<BusinessUnit>;

type UseDeleteBusinessUnitArgs = {
  options: UseMutationOptions<DeleteBusinessUnitApiResponse, ApiErrorResponse>;
  businessUnitId: string;
};

export function useDeleteBusinessUnit({
  businessUnitId,
  options = {},
}: UseDeleteBusinessUnitArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: businessUnitsKeys.delete(businessUnitId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteBusinessUnitApiResponse>(
        BUSINESS_UNIT_ROUTES.delete(businessUnitId)
      );

      return data;
    },
    ...options,
  });
}
