"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { GRATUITY_GROUP_ROUTES } from "../../../../../../../../../constants/routes/payroll/settings/contributions/gratuity-group/routes";
import { useAxiosPrivate } from "../../../../../../../../../hooks/useAxiosPrivate";
import { gratuityKeys } from "../../../../../../../../../queryKeysFactories/gratuity";
import { type ApiErrorResponse } from "../../../../../../../../../types/apiResponse";
import { type GratuityFormType } from "../../../Dialogs/GratuityForm";
import { type GratuityApiResponse } from "../../../Dialogs/Hooks/useAddGratuity";

type UseDeleteGratuityProps = {
  options: UseMutationOptions<
    GratuityApiResponse,
    ApiErrorResponse<GratuityFormType>
  >;
  gratuityId: string;
};

export function useDeleteGratuity({
  gratuityId,
  options = {},
}: UseDeleteGratuityProps) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: gratuityKeys.delete(gratuityId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<GratuityApiResponse>(
        GRATUITY_GROUP_ROUTES.delete(gratuityId)
      );

      return data;
    },
    ...options,
  });
}
