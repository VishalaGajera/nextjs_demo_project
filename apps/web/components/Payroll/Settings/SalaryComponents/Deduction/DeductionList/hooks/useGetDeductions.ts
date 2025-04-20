import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { DEDUCTION_ROUTES } from "../../../../../../../constants/routes/payroll/settings/salary-components/deduction/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { deductionKeys } from "../../../../../../../queryKeysFactories/deduction";
import type { QuickFilter } from "../../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";
import type { SalaryComponent } from "../../../SalaryComponentForm";

type GetDeductionsArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetDeductionsQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getDeductions = async ({ body }: GetDeductionsArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        deductionComponents: SalaryComponent[];
        totalCount: number;
      }>
    >(DEDUCTION_ROUTES.listing, body);

    return data.data;
  };

  return { getDeductions };
}

export function useGetDeductions({ body }: GetDeductionsArgs) {
  const { getDeductions } = useGetDeductionsQueryFn();

  return useQuery({
    queryKey: deductionKeys.listing(body),
    queryFn: () => getDeductions({ body }),
    initialData: { deductionComponents: [], totalCount: 0 },
  });
}
