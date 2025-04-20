"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { OvertimeRulesAllocationEditFormValues } from "../OvertimeRulesAllocationEditForm";
import { DateTime } from "luxon";
import { overtimeRulesAllocation } from "../../../../../../queryKeysFactories/OvertimeRulesAllocation";
import { OVERTIME_RULE_ALLOCATION_ROUTES } from "../../../../../../constants/routes/policy-configuration/overtime/overtime-rule-allocation/routes";

type EditOvertimeRulesAllocationApiResponse = ApiSuccessResponse<{
  message: string;
  data: null;
}>;

type UseEditOvertimeRulesAllocationArgs = {
  options: UseMutationOptions<
    EditOvertimeRulesAllocationApiResponse,
    ApiErrorResponse,
    Partial<OvertimeRulesAllocationEditFormValues>
  >;
  employeeIds: string[];
};

export function useEditOvertimeRulesAllocation({
  employeeIds,
  options = {},
}: UseEditOvertimeRulesAllocationArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const currentDate = DateTime.now().toISODate();

  return useMutation({
    mutationKey: overtimeRulesAllocation.edit(employeeIds),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditOvertimeRulesAllocationApiResponse>(
          OVERTIME_RULE_ALLOCATION_ROUTES.patch(currentDate),
          formValues
        );

      return data;
    },
    ...options,
  });
}
