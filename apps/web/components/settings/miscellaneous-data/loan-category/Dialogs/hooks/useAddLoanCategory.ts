"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import { LOAN_CATEGORY_ROUTES } from "../../../../../../constants/routes/settings/loan-category/routes";
import type { LoanCategory } from "../../LoanCategory/hooks/useGetLoanCategories";
import type { LoanCategoryFormFieldValues } from "../LoanCategoryForm";
import { loanCategoryKeys } from "../../../../../../queryKeysFactories/loanCategory";

type AddLoanCategoryApiSuccessResponse = ApiSuccessResponse<LoanCategory>;

type UseAddLoanCategoryArgs = {
  options: UseMutationOptions<
    AddLoanCategoryApiSuccessResponse,
    ApiErrorResponse<LoanCategoryFormFieldValues>,
    Partial<LoanCategoryFormFieldValues>
  >;
};

export function useAddLoanCategory({ options = {} }: UseAddLoanCategoryArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: loanCategoryKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddLoanCategoryApiSuccessResponse>(
          LOAN_CATEGORY_ROUTES.post,
          formValues
        );

      return data;
    },
    ...options,
  });
}
