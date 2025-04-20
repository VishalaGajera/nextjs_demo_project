import { useQuery } from "@tanstack/react-query";
import { CONTRIBUTION_ROUTES } from "../../../../../../../constants/routes/payroll/settings/salary-components/contribution/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { contributionKeys } from "../../../../../../../queryKeysFactories/contribution";
import type { ApiSuccessResponse } from "../../../../../../../types/apiResponse";
import type { SalaryComponent } from "../../../SalaryComponentForm";

type UseGetContributionArgs = {
  contributionId: SalaryComponent["id"];
};

export function useGetContribution({ contributionId }: UseGetContributionArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchContribution = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<SalaryComponent>>(
      CONTRIBUTION_ROUTES.get(contributionId)
    );

    return data;
  };

  return useQuery({
    queryKey: contributionKeys.get(contributionId),
    queryFn: fetchContribution,
    enabled: !!contributionId,
  });
}
