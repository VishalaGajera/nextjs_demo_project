import { useQuery } from "@tanstack/react-query";
import { BANK_PAY_SCHEDULE_ROUTES } from "../../../../../constants/routes/bank-configurations/bank-pay-schedule/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { bankPayScheduleKeys } from "../../../../../queryKeysFactories/bankPaySchedule";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";
import type { BankPayScheduleFormFieldValues } from "../../AddBankPaySchedule/BankPayScheduleForm";
import type { BankPaySchedule } from "../../BankPayScheduleList/hooks/useGetBankPayScheduleList";

type UseGetBankPayScheduleArgs = {
  bankPayScheduleId: BankPaySchedule["id"];
};

export function useGetBankPaySchedule({
  bankPayScheduleId,
}: UseGetBankPayScheduleArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchBankPaySchedule = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<
      ApiSuccessResponse<BankPayScheduleFormFieldValues>
    >(BANK_PAY_SCHEDULE_ROUTES.get(bankPayScheduleId));

    return data;
  };

  return useQuery({
    queryKey: bankPayScheduleKeys.get(bankPayScheduleId),
    queryFn: fetchBankPaySchedule,
    enabled: !!bankPayScheduleId,
  });
}
