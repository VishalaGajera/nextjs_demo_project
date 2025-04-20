"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { businessUnitsKeys } from "../../../../../queryKeysFactories/businessUnit";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../types/apiResponse";
import type { BusinessUnit } from "../../BusinessUnitList/hooks/useGetBusinessUnitss";
import type { BusinessUnitFormFieldValues } from "../BusinessUnitForm";
import { BUSINESS_UNIT_ROUTES } from "../../../../../constants/routes/organization/business-unit/routes";

type EditBusinessUnitApiResponse = ApiSuccessResponse<BusinessUnit>;

type UseEditBusinessUnitArgs = {
  options: UseMutationOptions<
    EditBusinessUnitApiResponse,
    ApiErrorResponse<BusinessUnitFormFieldValues>,
    Partial<BusinessUnitFormFieldValues>
  >;
  businessUnitId: string;
};

export function useEditBusinessUnit({
  businessUnitId,
  options = {},
}: UseEditBusinessUnitArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: businessUnitsKeys.edit(businessUnitId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditBusinessUnitApiResponse>(
        BUSINESS_UNIT_ROUTES.patch(businessUnitId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
