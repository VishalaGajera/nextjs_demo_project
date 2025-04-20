import { useQuery } from "@tanstack/react-query";
import { DEDUCTION_ROUTES } from "../../../../../../../constants/routes/payroll/settings/salary-components/deduction/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { deductionKeys } from "../../../../../../../queryKeysFactories/deduction";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";
import type { SalaryComponent } from "../../../SalaryComponentForm";

type UseGetDeductionArgs = {
  deductionId: SalaryComponent["id"];
};

export function useGetDeduction({ deductionId }: UseGetDeductionArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchDeduction = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<SalaryComponent>>(
      DEDUCTION_ROUTES.get(deductionId)
    );

    return data;
  };

  return useQuery({
    queryKey: deductionKeys.get(deductionId),
    queryFn: fetchDeduction,
    enabled: !!deductionId,
  });
}
