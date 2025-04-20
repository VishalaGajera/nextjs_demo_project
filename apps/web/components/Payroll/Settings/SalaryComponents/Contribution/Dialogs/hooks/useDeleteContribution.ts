"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";

import { CONTRIBUTION_ROUTES } from "../../../../../../../constants/routes/payroll/settings/salary-components/contribution/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { contributionKeys } from "../../../../../../../queryKeysFactories/contribution";
import type { SalaryComponent } from "../../../SalaryComponentForm";

type DeleteContributionApiResponse = ApiSuccessResponse<SalaryComponent>;

type UseDeleteContributionArgs = {
  options: UseMutationOptions<DeleteContributionApiResponse, ApiErrorResponse>;
  contributionId: string;
};

export function useDeleteContribution({
  contributionId,
  options = {},
}: UseDeleteContributionArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: contributionKeys.delete(contributionId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteContributionApiResponse>(
        CONTRIBUTION_ROUTES.delete(contributionId)
      );

      return data;
    },
    ...options,
  });
}
