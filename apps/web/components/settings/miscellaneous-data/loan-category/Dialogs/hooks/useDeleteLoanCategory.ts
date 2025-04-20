"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { LOAN_CATEGORY_ROUTES } from "../../../../../../constants/routes/settings/loan-category/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { loanCategoryKeys } from "../../../../../../queryKeysFactories/loanCategory";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { LoanCategory } from "../../LoanCategory/hooks/useGetLoanCategories";

type DeleteLoanCategoryApiResponse = ApiSuccessResponse<LoanCategory>;

type UseDeleteLoanCategoryArgs = {
  options: UseMutationOptions<DeleteLoanCategoryApiResponse, ApiErrorResponse>;
  loanCategoryId: string;
};

export function useDeleteLoanCategory({
  loanCategoryId,
  options = {},
}: UseDeleteLoanCategoryArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: loanCategoryKeys.delete(loanCategoryId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteLoanCategoryApiResponse>(
        LOAN_CATEGORY_ROUTES.delete(loanCategoryId)
      );

      return data;
    },
    ...options,
  });
}
