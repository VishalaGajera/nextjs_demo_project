"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { PROVIDENT_FUND_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/contributions/pf/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { providentFundKeys } from "../../../../../../../../queryKeysFactories/providentFund";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import type { ProvidentFundRecord } from "../../ProvidentFundList/hooks/useGetProvidentFundList";
import type { ProvidentFundFormFieldValues } from "../ProvidentFundForm";

type AddProvidentFundApiSuccessResponse =
  ApiSuccessResponse<ProvidentFundRecord>;

type UseAddProvidentFundArgs = {
  options: UseMutationOptions<
    AddProvidentFundApiSuccessResponse,
    ApiErrorResponse<ProvidentFundFormFieldValues>,
    Partial<ProvidentFundFormFieldValues>
  >;
};

export function useAddProvidentFund({ options = {} }: UseAddProvidentFundArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: providentFundKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddProvidentFundApiSuccessResponse>(
          PROVIDENT_FUND_ROUTES.post,
          formValues
        );

      return data;
    },
    ...options,
  });
}
