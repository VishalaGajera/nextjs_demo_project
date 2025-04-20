import { useQuery } from "@tanstack/react-query";
import { REIMBURSEMENT_ROUTES } from "../../../../../../../constants/routes/payroll/settings/salary-components/reimbursement/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { reimbursementKeys } from "../../../../../../../queryKeysFactories/reimbursement";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";
import type { SalaryComponent } from "../../../SalaryComponentForm";

type UseGetReimbursementArgs = {
  reimbursementId: SalaryComponent["id"];
};

export function useGetReimbursement({
  reimbursementId,
}: UseGetReimbursementArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchReimbursement = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<SalaryComponent>>(
      REIMBURSEMENT_ROUTES.get(reimbursementId)
    );

    return data;
  };

  return useQuery({
    queryKey: reimbursementKeys.get(reimbursementId),
    queryFn: fetchReimbursement,
    enabled: !!reimbursementId,
  });
}
