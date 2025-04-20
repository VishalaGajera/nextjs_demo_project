import { useQuery } from "@tanstack/react-query";
import { LOAN_CATEGORY_ROUTES } from "../../../../../../constants/routes/settings/loan-category/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { loanCategoryKeys } from "../../../../../../queryKeysFactories/loanCategory";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { LoanCategory } from "../../LoanCategory/hooks/useGetLoanCategories";

type UseGetLoanCategoryArgs = {
  loanCategoryId: LoanCategory["id"];
};

export function useGetLoanCategory({ loanCategoryId }: UseGetLoanCategoryArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchLoanCategory = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<LoanCategory>>(
      LOAN_CATEGORY_ROUTES.get(loanCategoryId)
    );

    return data;
  };

  return useQuery({
    queryKey: loanCategoryKeys.get(loanCategoryId),
    queryFn: fetchLoanCategory,
    enabled: !!loanCategoryId,
  });
}
