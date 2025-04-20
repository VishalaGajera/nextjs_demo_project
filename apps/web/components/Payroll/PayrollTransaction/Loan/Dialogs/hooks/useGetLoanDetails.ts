import { capitalize, round } from "lodash";
import { useMemo } from "react";
import { formatToIndianNumber } from "../../../../../../utils/helper";
import type { LoanListType } from "../../LoanList/hooks/useGetLoanList";

export function useGetLoanDetailsOptions(loanDetails: LoanListType) {
  const loanData = useMemo(() => {
    return [
      {
        label: "Loan Type :",
        value: loanDetails.loan_category_name,
      },
      {
        label: "Interest Type :",
        value: capitalize(loanDetails.interest_calculation_type),
      },
      {
        label: "Total Repayment Amount :",
        value: formatToIndianNumber(Number(loanDetails.emi_amount ?? 0)),
      },
      {
        label: "Total Principal Amount :",
        value: formatToIndianNumber(Number(loanDetails.amount ?? 0)),
      },
      {
        label: "Total Interest Amount :",
        value: formatToIndianNumber(Number(loanDetails.total_interest ?? 0)),
      },
      {
        label: "Loan EMI Terms :",
        value: round(loanDetails.emi_terms_total ?? 0),
      },
    ];
  }, [loanDetails]);

  return { loanData };
}
