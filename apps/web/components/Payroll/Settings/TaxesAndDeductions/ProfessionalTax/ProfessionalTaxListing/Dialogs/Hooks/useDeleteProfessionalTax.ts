"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { PT_GROUP_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/taxes-deductions/pt-group/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { professionalTaxesKeys } from "../../../../../../../../queryKeysFactories/professionalTaxes";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";

type DeleteProfessionalTaxApiResponse = ApiSuccessResponse<{
  data: string;
  message: string;
}>;

type UseDeleteProfessionalTaxArgs = {
  options: UseMutationOptions<
    DeleteProfessionalTaxApiResponse,
    ApiErrorResponse
  >;
  prfessionalTaxId: string;
};

export function useDeleteProfessionalTax({
  prfessionalTaxId,
  options = {},
}: UseDeleteProfessionalTaxArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: professionalTaxesKeys.delete(prfessionalTaxId),
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.delete<DeleteProfessionalTaxApiResponse>(
          PT_GROUP_ROUTES.delete(prfessionalTaxId)
        );

      return data;
    },
    ...options,
  });
}
