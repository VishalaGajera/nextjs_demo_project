import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import type { FieldValues } from "react-hook-form";
import { ADVANCE_AND_RECEIVE_ROUTES } from "../../../../../../constants/routes/payroll/payroll-transaction/advance-receive/route";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { advanceReceiveKeys } from "../../../../../../queryKeysFactories/advanceReceive";
import type { QuickFilter } from "../../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../../types/apiResponse";
import type { PaymentType } from "../../../../../common/Autocomplete/PaymentTypeAutoComplete";
import type { ComponentTypeKeys } from "../../../../../common/Autocomplete/hooks/useGetComponentTypeOptions";

export type AdvanceAndReceive = {
  id: string;
  avatar: string;
  company_id: string;
  employee_id: string;
  employee_name: string;
  employee_code: string;
  punch_code: string | null;
  department_name: string;
  sub_department_name: string;
  designation_name: string;
  reporting_manager_name: string;
  reporting_manager_avatar: string;
  component_type: ComponentTypeKeys;
  transaction_date: string;
  deduction_month: string;
  transaction_type: PaymentType;
  amount: number;
  remark: string;
  action_by: string;
  action_at: string;
  full_count: string;
};

type UseGetAdvanceAndReceiveListArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
        externalFilter: FieldValues;
      }>;
};

export function useGetAdvanceAndReceiveQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getAdvanceAndReceive = async ({
    body,
  }: UseGetAdvanceAndReceiveListArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        advanceAndReceive: AdvanceAndReceive[];
        totalCount: number;
      }>
    >(ADVANCE_AND_RECEIVE_ROUTES.listing, body);

    return data.data;
  };

  return { getAdvanceAndReceive };
}

export function useGetAdvanceAndReceiveList({
  body,
}: UseGetAdvanceAndReceiveListArgs) {
  const { getAdvanceAndReceive } = useGetAdvanceAndReceiveQueryFn();

  return useQuery({
    queryKey: advanceReceiveKeys.listing(body),
    queryFn: () => getAdvanceAndReceive({ body }),
    initialData: { advanceAndReceive: [], totalCount: 0 },
  });
}
