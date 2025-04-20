import { useQuery } from "@tanstack/react-query";
import { EMPLOYEE_PAYMENT_DETAILS_ROUTES } from "../../../../../../../../../../constants/routes/employee-management/employee/finance/payment-details/routes";
import { useAxiosPrivate } from "../../../../../../../../../../hooks/useAxiosPrivate";
import { bankKeys } from "../../../../../../../../../../queryKeysFactories/bank";
import type { ApiSuccessResponse } from "../../../../../../../../../../types/apiResponse";
import type { AccountType } from "../../../../../../../../../common/Autocomplete/AccountTypeAutoComplete";
import type { PaymentType } from "../../../../../../../../../common/Autocomplete/PaymentTypeAutoComplete";

export type PaymentDetails = {
  payment_type: PaymentType;
  branch_name: string;
  account_no: string;
  ifsc_code: string;
  account_type: AccountType;
  name_as_per_bank: string;
  bank_id: string;
  bank_name?: string;
  effective_from: string;
};

type UseGetPaymentDetailsArgs = {
  employeeId: string;
};

export function useGetPaymentDetails({ employeeId }: UseGetPaymentDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEmployeeBankInformation = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<PaymentDetails>>(
      EMPLOYEE_PAYMENT_DETAILS_ROUTES.get(employeeId)
    );

    return data.data;
  };

  return useQuery({
    queryKey: bankKeys.get(employeeId),
    queryFn: fetchEmployeeBankInformation,
    enabled: !!employeeId,
  });
}
