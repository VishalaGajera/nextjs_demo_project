"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { PT_GROUP_ROUTES } from "../../../../../../../constants/routes/payroll/settings/taxes-deductions/pt-group/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { professionalTaxesKeys } from "../../../../../../../queryKeysFactories/professionalTaxes";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";
import type { TaxConfigType, TaxSlabType } from "../ProfessionalTaxForms";

type AddProfessionalTaxApiSuccessResponse = ApiSuccessResponse<{
  data: string;
  message: string;
}>;

type UseAddProfessionalTaxArgs = {
  options: UseMutationOptions<
    AddProfessionalTaxApiSuccessResponse,
    ApiErrorResponse<
      Omit<TaxConfigType, "tax_slabs"> & {
        tax_slab: Omit<TaxSlabType, "arrayMonth" | "is_varies_in_month">;
      }
    >,
    Partial<
      Omit<TaxConfigType, "tax_slabs"> & {
        tax_slab: Omit<TaxSlabType, "arrayMonth" | "is_varies_in_month">;
      }
    >
  >;
};

export function useAddProfessionalTax({
  options = {},
}: UseAddProfessionalTaxArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: professionalTaxesKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddProfessionalTaxApiSuccessResponse>(
          PT_GROUP_ROUTES.post,
          formValues
        );

      return data;
    },
    ...options,
  });
}
