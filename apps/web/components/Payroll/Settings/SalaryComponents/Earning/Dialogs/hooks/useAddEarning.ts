"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { EARNING_DETAILS_ROUTES } from "../../../../../../../constants/routes/payroll/settings/salary-components/earning/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { earningKeys } from "../../../../../../../queryKeysFactories/earning";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";
import type { Earning } from "../../EarningList/hooks/useGetEarnings";
import type { EarningFormSchemaFieldValues } from "../EarningForm";
type AddEarningApiSuccessResponse = ApiSuccessResponse<Earning>;

type UseAddEarningArgs = {
  options: UseMutationOptions<
    AddEarningApiSuccessResponse,
    ApiErrorResponse<EarningFormSchemaFieldValues>,
    Partial<EarningFormSchemaFieldValues>
  >;
};

export function useAddEarning({ options = {} }: UseAddEarningArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: earningKeys.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddEarningApiSuccessResponse>(
        EARNING_DETAILS_ROUTES.post,
        formValues
      );

      return data;
    },
    ...options,
  });
}
