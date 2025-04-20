"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { overTimeKeys } from "../../../../../../queryKeysFactories/overTime";
import { OVERTIME_RULE_ROUTES } from "../../../../../../constants/routes/policy-configuration/overtime/overtime-rule/routes";

type DeleteOvertimeRulesApiResponse = ApiSuccessResponse<{
  data: string;
  message: string;
}>;

type useDeleteOverTimeRulesArgs = {
  options: UseMutationOptions<DeleteOvertimeRulesApiResponse, ApiErrorResponse>;
  overtimeRulesId: string;
};

export function useDeleteOverTimeRules({
  overtimeRulesId,
  options = {},
}: useDeleteOverTimeRulesArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: overTimeKeys.delete(overtimeRulesId),
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.delete<DeleteOvertimeRulesApiResponse>(
          OVERTIME_RULE_ROUTES.delete(overtimeRulesId)
        );

      return data;
    },
    ...options,
  });
}
