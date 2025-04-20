import { useQuery } from "@tanstack/react-query";

import { BANK_SHIFT_TYPE_ROUTES } from "../../../../../../../../constants/routes/bank-configurations/bank-shift-type/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { employeeBankShiftDetailKeys } from "../../../../../../../../queryKeysFactories/employeeBankShift";
import type { ApiSuccessResponse } from "../../../../../../../../types/apiResponse";
import type { BankShiftFormFieldValues } from "../BankShiftForm";

type UseGetBankShiftArgs = {
  bankshiftId: string;
};

export function useGetBankShift({ bankshiftId }: UseGetBankShiftArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchBankShift = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<BankShiftFormFieldValues>>(
      BANK_SHIFT_TYPE_ROUTES.get(bankshiftId)
    );

    return data;
  };

  return useQuery({
    queryKey: employeeBankShiftDetailKeys.get(bankshiftId),
    queryFn: fetchBankShift,
    enabled: !!bankshiftId,
  });
}
