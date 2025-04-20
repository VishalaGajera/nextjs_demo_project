import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { SALARY_STRUCTURE_ROUTES } from "../../../../../../../constants/routes/payroll/settings/salary-structure/routes";
import { useAxiosPrivate } from "../../../../../../../hooks/useAxiosPrivate";
import { salaryStructureKeys } from "../../../../../../../queryKeysFactories/SalaryStructure";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../types/apiResponse";
import { type SalaryStructureType } from "../../SalaryStructureForm";

export type SalaryStructureApiResponse =
  ApiSuccessResponse<SalaryStructureType>;

export type UseAddSalaryStructureProps = {
  options: UseMutationOptions<
    SalaryStructureApiResponse,
    ApiErrorResponse<SalaryStructureType>,
    Partial<SalaryStructureType>
  >;
};

export function useAddSalaryStructure({
  options = {},
}: UseAddSalaryStructureProps) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: salaryStructureKeys.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<SalaryStructureApiResponse>(
        SALARY_STRUCTURE_ROUTES.add,
        formValues
      );

      return data;
    },
    ...options,
  });
}
