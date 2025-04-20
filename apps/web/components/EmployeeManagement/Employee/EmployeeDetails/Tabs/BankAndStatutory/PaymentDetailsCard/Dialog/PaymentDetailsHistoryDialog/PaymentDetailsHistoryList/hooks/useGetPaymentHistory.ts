import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { EMPLOYEE_PAYMENT_DETAILS_ROUTES } from "../../../../../../../../../../../constants/routes/employee-management/employee/finance/payment-details/routes";
import { useAxiosPrivate } from "../../../../../../../../../../../hooks/useAxiosPrivate";
import { paymentHistory } from "../../../../../../../../../../../queryKeysFactories/paymentHistory";
import type { ApiSuccessResponse } from "../../../../../../../../../../../types/apiResponse";
import type { PaymentHistoryType } from "./useGetPaymentHistoryColumns";

type useGetPaymentHistoryArgs = {
  employeeId: string;
  body?: IGetRowsParams;
};
export function useGetPaymentHistoryQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchPaymentHistory = async ({
    employeeId,
    body,
  }: useGetPaymentHistoryArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        histories: PaymentHistoryType[];
        totalCount: number;
      }>
    >(EMPLOYEE_PAYMENT_DETAILS_ROUTES.postHistory(employeeId), body);

    return data.data;
  };

  return { fetchPaymentHistory };
}
export function useGetPaymentHistory({
  employeeId,
  body,
}: useGetPaymentHistoryArgs) {
  const { fetchPaymentHistory } = useGetPaymentHistoryQueryFn();

  return useQuery({
    queryKey: paymentHistory.get(employeeId),
    queryFn: () => fetchPaymentHistory({ employeeId, body }),
    initialData: { histories: [], totalCount: 0 },
  });
}
