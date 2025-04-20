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

type EditEarningApiResponse = ApiSuccessResponse<Earning>;

type UseEditEarningArgs = {
  options: UseMutationOptions<
    EditEarningApiResponse,
    ApiErrorResponse<EarningFormSchemaFieldValues>,
    Partial<EarningFormSchemaFieldValues>
  >;
  earningId: string;
};

export function useEditEarning({
  earningId,
  options = {},
}: UseEditEarningArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: earningKeys.edit(earningId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditEarningApiResponse>(
        EARNING_DETAILS_ROUTES.patch(earningId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
