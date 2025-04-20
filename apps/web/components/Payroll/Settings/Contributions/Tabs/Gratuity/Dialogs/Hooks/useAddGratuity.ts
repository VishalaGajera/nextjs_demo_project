"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { GRATUITY_GROUP_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/contributions/gratuity-group/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { gratuityKeys } from "../../../../../../../../queryKeysFactories/gratuity";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import { type GratuityFormType } from "../GratuityForm";

export type GratuityApiResponse = ApiSuccessResponse<GratuityFormType>;

export type UseAddGratuityProps = {
  options: UseMutationOptions<
    GratuityApiResponse,
    ApiErrorResponse<GratuityFormType>,
    Partial<GratuityFormType>
  >;
};

export function useAddGratuity({ options = {} }: UseAddGratuityProps) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: gratuityKeys.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<GratuityApiResponse>(
        GRATUITY_GROUP_ROUTES.add(),
        formValues
      );

      return data;
    },
    ...options,
  });
}
