"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { SALARY_STRUCTURE_ROUTES } from "../../../../../../constants/routes/payroll/settings/salary-structure/routes";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { salaryStructureKeys } from "../../../../../../queryKeysFactories/SalaryStructure";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";

type DeleteSalaryStructureApiResponse = ApiSuccessResponse<{
  data: string;
  message: string;
}>;

type UseDeleteSalaryStructureArgs = {
  options: UseMutationOptions<
    DeleteSalaryStructureApiResponse,
    ApiErrorResponse
  >;
  ssId: string;
};

export function useDeleteSalaryStructure({
  ssId,
  options = {},
}: UseDeleteSalaryStructureArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: salaryStructureKeys.delete(ssId),
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.delete<DeleteSalaryStructureApiResponse>(
          SALARY_STRUCTURE_ROUTES.delete(ssId)
        );

      return data;
    },
    ...options,
  });
}
