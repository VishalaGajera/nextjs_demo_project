"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import { LOAN_CATEGORY_ROUTES } from "../../../../../../constants/routes/settings/loan-category/routes";
import type { LoanCategoryFormFieldValues } from "../LoanCategoryForm";
import { loanCategoryKeys } from "../../../../../../queryKeysFactories/loanCategory";
import type { LoanCategory } from "../../LoanCategory/hooks/useGetLoanCategories";

type EditLoanCategoryApiResponse = ApiSuccessResponse<LoanCategory>;

type UseEditLoanCategoryArgs = {
  options: UseMutationOptions<
    EditLoanCategoryApiResponse,
    ApiErrorResponse<LoanCategoryFormFieldValues>,
    Partial<LoanCategoryFormFieldValues>
  >;
  loanCategoryId: string;
};

export function useEditLoanCategory({
  loanCategoryId,
  options = {},
}: UseEditLoanCategoryArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: loanCategoryKeys.edit(loanCategoryId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditLoanCategoryApiResponse>(
        LOAN_CATEGORY_ROUTES.patch(loanCategoryId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
