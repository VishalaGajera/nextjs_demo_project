"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { CONTRIBUTION_ROUTES } from "../../../../../../../constants/routes/payroll/settings/salary-components/contribution/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { contributionKeys } from "../../../../../../../queryKeysFactories/contribution";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";
import type {
  SalaryComponent,
  SalaryComponentFormFieldValues,
} from "../../../SalaryComponentForm";

type EditContributionApiResponse = ApiSuccessResponse<SalaryComponent>;

type UseEditContributionArgs = {
  options: UseMutationOptions<
    EditContributionApiResponse,
    ApiErrorResponse<SalaryComponentFormFieldValues>,
    Partial<SalaryComponentFormFieldValues>
  >;
  contributionId: string;
};

export function useEditContribution({
  contributionId,
  options = {},
}: UseEditContributionArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: contributionKeys.edit(contributionId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditContributionApiResponse>(
        CONTRIBUTION_ROUTES.patch(contributionId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
