"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { EMPLOYEE_PAYMENT_DETAILS_ROUTES } from "../../../../../../../../../../constants/routes/employee-management/employee/finance/payment-details/routes";
import { useAxiosPrivate } from "../../../../../../../../../../hooks/useAxiosPrivate";
import { bankKeys } from "../../../../../../../../../../queryKeysFactories/bank";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../../../types/apiResponse";
import type { BankInfoFormFieldValues } from "../../../../../../../AddEmployee/BankInfoForm";
import type { PaymentDetails } from "./useGetPaymentDetails";

type EditPaymentDetailsApiResponse = ApiSuccessResponse<PaymentDetails>;

type UseEditPaymentDetailsArgs = {
  options: UseMutationOptions<
    EditPaymentDetailsApiResponse,
    ApiErrorResponse<BankInfoFormFieldValues>,
    Partial<BankInfoFormFieldValues>
  >;
  bankId: string;
};

export function useEditPaymentDetails({
  bankId,
  options = {},
}: UseEditPaymentDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: bankKeys.edit(bankId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditPaymentDetailsApiResponse>(
        EMPLOYEE_PAYMENT_DETAILS_ROUTES.patch(bankId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
