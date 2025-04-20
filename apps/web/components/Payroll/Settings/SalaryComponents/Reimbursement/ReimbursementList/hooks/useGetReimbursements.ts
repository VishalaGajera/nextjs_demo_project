import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { REIMBURSEMENT_ROUTES } from "../../../../../../../constants/routes/payroll/settings/salary-components/reimbursement/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { reimbursementKeys } from "../../../../../../../queryKeysFactories/reimbursement";
import type { QuickFilter } from "../../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";
import type { SalaryComponent } from "../../../SalaryComponentForm";

type GetReimbursementsArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetReimbursementsQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getReimbursements = async ({ body }: GetReimbursementsArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        reimbursementComponents: SalaryComponent[];
        totalCount: number;
      }>
    >(REIMBURSEMENT_ROUTES.listing, body);

    return data.data;
  };

  return { getReimbursements };
}

export function useGetReimbursements({ body }: GetReimbursementsArgs) {
  const { getReimbursements } = useGetReimbursementsQueryFn();

  return useQuery({
    queryKey: reimbursementKeys.listing(body),
    queryFn: () => getReimbursements({ body }),
    initialData: { reimbursementComponents: [], totalCount: 0 },
  });
}
