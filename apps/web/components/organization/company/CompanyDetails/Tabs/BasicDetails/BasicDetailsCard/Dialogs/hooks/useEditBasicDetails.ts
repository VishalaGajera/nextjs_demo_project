"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { basicDetailsKey } from "../../../../../../../../../queryKeysFactories/basicDetails";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../../types/apiResponse";

import type { BasicDetails } from "../../../../hooks/useGetBasicDetails";
import type { BasicDetailsFormFieldValues } from "../BasicDetailsForm";
import { BASIC_DETAILS_ROUTES } from "../../../../../../../../../constants/routes/organization/company/basic-details/routes";

type useEditBasicDetailsApiResponse = ApiSuccessResponse<BasicDetails>;

type UseEditBasicDetailsArgs = {
  options: UseMutationOptions<
    useEditBasicDetailsApiResponse,
    ApiErrorResponse<BasicDetailsFormFieldValues>,
    Partial<BasicDetailsFormFieldValues>
  >;
  companyId: string;
};

export function useEditBasicDetails({
  companyId,
  options = {},
}: UseEditBasicDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: basicDetailsKey.edit(companyId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<useEditBasicDetailsApiResponse>(
        BASIC_DETAILS_ROUTES.patch(companyId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
