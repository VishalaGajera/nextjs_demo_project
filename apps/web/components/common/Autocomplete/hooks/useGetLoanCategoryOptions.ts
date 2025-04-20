import { useQuery } from "@tanstack/react-query";
import { LOAN_CATEGORY_ROUTES } from "../../../../constants/routes/settings/loan-category/routes";
import { useAxiosPrivate } from "../../../../hooks/useAxiosPrivate";
import { loanCategoryKeys } from "../../../../queryKeysFactories/loanCategory";
import type { ApiSuccessResponse } from "../../../../types/apiResponse";
import type { OptionsType } from "../../../../types/options";

export function useGetLoanCategoryOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchLoanCategoryOptions = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      LOAN_CATEGORY_ROUTES.options
    );

    return data.data;
  };

  return useQuery({
    queryKey: loanCategoryKeys.options(),
    queryFn: fetchLoanCategoryOptions,
    initialData: [],
  });
}
