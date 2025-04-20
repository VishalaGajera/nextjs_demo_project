import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { SALARY_STRUCTURE_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/salary-structure/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { salaryStructureKeys } from "../../../../../../../../queryKeysFactories/SalaryStructure";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";

type DeleteSalaryStructureApiResponse = ApiSuccessResponse<{
  data: string;
  message: string;
}>;

type UseDeleteCustomSalaryStructureArgs = {
  options: UseMutationOptions<
    DeleteSalaryStructureApiResponse,
    ApiErrorResponse
  >;
  ssId: string;
  csId: string;
};

export function useCustomDeleteSalaryStructure({
  ssId,
  csId,
  options = {},
}: UseDeleteCustomSalaryStructureArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: salaryStructureKeys.deleteCustomSalary(ssId, csId),
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.delete<DeleteSalaryStructureApiResponse>(
          SALARY_STRUCTURE_ROUTES.deleteCustomSalaryStructure(ssId, csId)
        );

      return data;
    },
    ...options,
  });
}
