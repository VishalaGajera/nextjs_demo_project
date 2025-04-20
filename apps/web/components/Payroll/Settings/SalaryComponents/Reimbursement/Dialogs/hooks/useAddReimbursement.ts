"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";

import { REIMBURSEMENT_ROUTES } from "../../../../../../../constants/routes/payroll/settings/salary-components/reimbursement/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { reimbursementKeys } from "../../../../../../../queryKeysFactories/reimbursement";
import type {
  SalaryComponent,
  SalaryComponentFormFieldValues,
} from "../../../SalaryComponentForm";

type AddReimbursementApiSuccessResponse = ApiSuccessResponse<SalaryComponent>;

type UseAddReimbursementArgs = {
  options: UseMutationOptions<
    AddReimbursementApiSuccessResponse,
    ApiErrorResponse<SalaryComponentFormFieldValues>,
    Partial<SalaryComponentFormFieldValues>
  >;
};

export function useAddReimbursement({ options = {} }: UseAddReimbursementArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: reimbursementKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddReimbursementApiSuccessResponse>(
          REIMBURSEMENT_ROUTES.post,
          formValues
        );

      return data;
    },
    ...options,
  });
}
