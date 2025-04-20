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
import type {
  SalaryComponent,
  SalaryComponentFormFieldValues,
} from "../../../SalaryComponentForm";

type AddContributionApiSuccessResponse = ApiSuccessResponse<SalaryComponent>;

type UseAddContributionArgs = {
  options: UseMutationOptions<
    AddContributionApiSuccessResponse,
    ApiErrorResponse<SalaryComponentFormFieldValues>,
    Partial<SalaryComponentFormFieldValues>
  >;
};

export function useAddContribution({ options = {} }: UseAddContributionArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: contributionKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddContributionApiSuccessResponse>(
          CONTRIBUTION_ROUTES.post,
          formValues
        );

      return data;
    },
    ...options,
  });
}
