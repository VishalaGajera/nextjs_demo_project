import { useQuery } from "@tanstack/react-query";
import { LOAN_ROUTES } from "../../../../../../constants/routes/payroll/payroll-transaction/loan/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { loanKeys } from "../../../../../../queryKeysFactories/loan";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { LoanFormFieldValues } from "../../AddLoan/LoanForm";
import type { LoanListType } from "../../LoanList/hooks/useGetLoanList";

type UseGetLoanArgs = {
  loanId: LoanListType["id"];
};

export type Installment = {
  id: string;
  installment_month: string;
  principle_amount: number;
  interest_amount: number;
  installment_amount: number;
  outstanding_amount: number;
};

export type LoanType = {
  id: string;
  company_id: string;
  employee_id: string;
  amount: number;
  interest_rate: number;
  interest_calculation_type: string;
  tenure_in_months: number;
  disbursement_date: string;
  repayment_start_date: string;
  payment_method: string;
  referred_by: string;
  primary_guarantor_id: string;
  secondary_guarantor_id: string;
  remark: string;
  installments: Installment[];
};

export function useGetLoan({ loanId }: UseGetLoanArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchLoan = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<LoanFormFieldValues>>(
      LOAN_ROUTES.get(loanId)
    );

    return data;
  };

  return useQuery({
    queryKey: loanKeys.get(loanId),
    queryFn: fetchLoan,
    enabled: !!loanId,
  });
}
