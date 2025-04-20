import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import type { FieldValues } from "react-hook-form";
import { LOAN_ROUTES } from "../../../../../../constants/routes/payroll/payroll-transaction/loan/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { loanKeys } from "../../../../../../queryKeysFactories/loan";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";

export type LoanListType = {
  id: string;
  employee_name: string;
  employee_code: string;
  avatar: string;
  employee_loan_id: string;
  disbursement_date: string;
  repayment_start_date: string;
  interest_rate: number;
  interest_calculation_type: string;
  amount: number;
  loan_category_name: string;
  total_interest: number;
  emi_amount: number;
  emi_terms_paid: number;
  emi_terms_total: number;
  status: string;
  last_action_by: string;
  last_action_at: string;
  last_action_remark: null;
  last_action_type: string;
  next_approvers: string[];
  full_count: string;
};

type LoanListBody = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
        externalFilter?: FieldValues;
      }>;
};

export function useGetLoanListQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getLoanList = async ({ body }: LoanListBody) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        loans: LoanListType[];
        totalCount: number;
      }>
    >(LOAN_ROUTES.listing, body);

    return data.data;
  };

  return { getLoanList };
}

export function useGetLoanList({ body }: LoanListBody) {
  const { getLoanList } = useGetLoanListQueryFn();

  return useQuery({
    queryKey: loanKeys.listing(body),
    queryFn: () => getLoanList({ body }),
    initialData: { loans: [], totalCount: 0 },
  });
}
