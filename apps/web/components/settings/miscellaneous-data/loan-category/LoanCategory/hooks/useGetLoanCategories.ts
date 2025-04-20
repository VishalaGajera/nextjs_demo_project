import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { LOAN_CATEGORY_ROUTES } from "../../../../../../constants/routes/settings/loan-category/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import { loanCategoryKeys } from "../../../../../../queryKeysFactories/loanCategory";

export type LoanCategory = {
  id: string;
  loan_category_code: string;
  loan_category_name: string;
  description: string;
  action_by: string;
  action_at: string;
  full_count: string;
};

type GetLoanCategoriesArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetLoanCategoriesQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getLoanCategories = async ({ body }: GetLoanCategoriesArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        loanCategories: LoanCategory[];
        totalCount: number;
      }>
    >(LOAN_CATEGORY_ROUTES.listing, body);

    return data.data;
  };

  return { getLoanCategories };
}

export function useGetLoanCategories({ body }: GetLoanCategoriesArgs) {
  const { getLoanCategories } = useGetLoanCategoriesQueryFn();

  return useQuery({
    queryKey: loanCategoryKeys.listing(body),
    queryFn: () => getLoanCategories({ body }),
    initialData: { loanCategories: [], totalCount: 0 },
  });
}
