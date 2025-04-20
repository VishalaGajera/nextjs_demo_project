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

type AddBusinessUnitApiSuccessResponse = ApiSuccessResponse<BusinessUnit>;

type UseAddBusinessUnitArgs = {
  options: UseMutationOptions<
    AddBusinessUnitApiSuccessResponse,
    ApiErrorResponse<BusinessUnitFormFieldValues>,
    Partial<BusinessUnitFormFieldValues>
  >;
};

export function useAddBusinessUnit({ options = {} }: UseAddBusinessUnitArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: businessUnitsKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddBusinessUnitApiSuccessResponse>(
          BUSINESS_UNIT_ROUTES.post,
          formValues
        );

      return data;
    },
    ...options,
  });
}
