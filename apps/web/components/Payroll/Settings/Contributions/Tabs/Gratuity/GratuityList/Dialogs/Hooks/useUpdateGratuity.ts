"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { GRATUITY_GROUP_ROUTES } from "../../../../../../../../../constants/routes/payroll/settings/contributions/gratuity-group/routes";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { gratuityKeys } from "../../../../../../../../../queryKeysFactories/gratuity";
import { type ApiErrorResponse } from "../../../../../../../../../types/apiResponse";
import { type GratuityFormType } from "../../../Dialogs/GratuityForm";
import { type GratuityApiResponse } from "../../../Dialogs/Hooks/useAddGratuity";

type UseUpdateGratuityProps = {
  options: UseMutationOptions<
    GratuityApiResponse,
    ApiErrorResponse<GratuityFormType>,
    Partial<GratuityFormType>
  >;
  gratuityId: string;
};

export function useUpdateGratuity({
  gratuityId,
  options = {},
}: UseUpdateGratuityProps) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: gratuityKeys.update(gratuityId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<GratuityApiResponse>(
        GRATUITY_GROUP_ROUTES.patch(gratuityId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
