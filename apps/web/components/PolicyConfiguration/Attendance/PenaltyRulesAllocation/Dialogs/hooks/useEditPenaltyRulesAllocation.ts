"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import { DateTime } from "luxon";
import type { PenaltyRulesAllocationEditFormValues } from "../PenaltyRulesAllocationEditForm";
import { penaltyRulesAllocation } from "../../../../../../queryKeysFactories/penaltyRulesAllocation";
import { PENALTY_RULE_ALLOCATION_ROUTES } from "../../../../../../constants/routes/policy-configuration/attendance/penalty-rule-allocation/routes";

type EditPenaltyRulesAllocationApiResponse = ApiSuccessResponse<{
  message: string;
  data: null;
}>;

type UseEditPenaltyRulesAllocationArgs = {
  options: UseMutationOptions<
    EditPenaltyRulesAllocationApiResponse,
    ApiErrorResponse,
    Partial<PenaltyRulesAllocationEditFormValues>
  >;
  employeeIds: string[];
};

export function useEditPenaltyRulesAllocation({
  employeeIds,
  options = {},
}: UseEditPenaltyRulesAllocationArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const currentDate = DateTime.now().toISODate();

  return useMutation({
    mutationKey: penaltyRulesAllocation.edit(employeeIds),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditPenaltyRulesAllocationApiResponse>(
          PENALTY_RULE_ALLOCATION_ROUTES.patch(currentDate),
          formValues
        );

      return data;
    },
    ...options,
  });
}
