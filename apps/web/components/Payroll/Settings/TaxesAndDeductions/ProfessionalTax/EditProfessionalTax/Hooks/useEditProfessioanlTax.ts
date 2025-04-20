"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { PT_GROUP_ROUTES } from "../../../../../../../constants/routes/payroll/settings/taxes-deductions/pt-group/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { professionalTaxesKeys } from "../../../../../../../queryKeysFactories/professionalTaxes";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";
import type {
  TaxConfigType,
  TaxSlabType,
} from "../../AddProfessionalTax/ProfessionalTaxForms";

type EditProfessionalTaxApiSuccessResponse = ApiSuccessResponse<{
  data: string;
  message: string;
}>;

type UseEditProfessionalTaxArgs = {
  options: UseMutationOptions<
    EditProfessionalTaxApiSuccessResponse,
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
  ptId: string;
};

export function useEditProfessionalTax({
  ptId,
  options = {},
}: UseEditProfessionalTaxArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: professionalTaxesKeys.update(ptId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditProfessionalTaxApiSuccessResponse>(
          PT_GROUP_ROUTES.update(ptId),
          formValues
        );

      return data;
    },
    ...options,
  });
}
