"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { REIMBURSEMENT_ROUTES } from "../../../../../../../constants/routes/payroll/settings/salary-components/reimbursement/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { reimbursementKeys } from "../../../../../../../queryKeysFactories/reimbursement";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";
import type {
  SalaryComponent,
  SalaryComponentFormFieldValues,
} from "../../../SalaryComponentForm";

type EditReimbursementApiResponse = ApiSuccessResponse<SalaryComponent>;

type UseEditReimbursementArgs = {
  options: UseMutationOptions<
    EditReimbursementApiResponse,
    ApiErrorResponse<SalaryComponentFormFieldValues>,
    Partial<SalaryComponentFormFieldValues>
  >;
  reimbursementId: string;
};

export function useEditReimbursement({
  reimbursementId,
  options = {},
}: UseEditReimbursementArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: reimbursementKeys.edit(reimbursementId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditReimbursementApiResponse>(
        REIMBURSEMENT_ROUTES.patch(reimbursementId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
