"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { SALARY_STRUCTURE_ROUTES } from "../../../../../../../constants/routes/payroll/settings/salary-structure/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { salaryStructureKeys } from "../../../../../../../queryKeysFactories/SalaryStructure";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";
import type { SalaryStructureType } from "../../../AddSalaryStructure/SalaryStructureForm";

export type SalaryStructureApiResponse =
  ApiSuccessResponse<SalaryStructureType>;

export type UseEditSalaryStructureProps = {
  options: UseMutationOptions<
    SalaryStructureApiResponse,
    ApiErrorResponse<SalaryStructureType>,
    Partial<SalaryStructureType>
  >;
} & {
  ssId: string;
};

export function useEditSalaryStructure({
  ssId,
  options = {},
}: UseEditSalaryStructureProps) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: salaryStructureKeys.update(ssId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<SalaryStructureApiResponse>(
        SALARY_STRUCTURE_ROUTES.update(ssId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
