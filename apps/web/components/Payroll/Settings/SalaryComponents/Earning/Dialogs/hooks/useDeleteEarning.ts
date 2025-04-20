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

type DeleteEarningApiResponse = ApiSuccessResponse<Earning>;

type UseDeleteEarningArgs = {
  options: UseMutationOptions<DeleteEarningApiResponse, ApiErrorResponse>;
  earningId: string;
};

export function useDeleteEarning({
  earningId,
  options = {},
}: UseDeleteEarningArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: earningKeys.delete(earningId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteEarningApiResponse>(
        EARNING_DETAILS_ROUTES.delete(earningId)
      );

      return data;
    },
    ...options,
  });
}
