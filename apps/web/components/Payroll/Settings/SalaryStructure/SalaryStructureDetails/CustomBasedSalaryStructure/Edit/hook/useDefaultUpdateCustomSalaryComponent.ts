import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { SALARY_STRUCTURE_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/salary-structure/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { salaryStructureKeys } from "../../../../../../../../queryKeysFactories/SalaryStructure";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";

export type DefaultCustomSalaryType = {
  salary_component_ids: string[];
};

type SalaryStructureComponentUpdateSuccessResponse =
  ApiSuccessResponse<DefaultCustomSalaryType>;

type UseDefaultUpdateCustomSalaryComponentArgs = {
  options: UseMutationOptions<
    SalaryStructureComponentUpdateSuccessResponse,
    ApiErrorResponse<DefaultCustomSalaryType>,
    DefaultCustomSalaryType
  >;
  ssId: string;
  csId: string;
};

export const useDefaultUpdateCustomSalaryComponent = ({
  options,
  ssId,
  csId,
}: UseDefaultUpdateCustomSalaryComponentArgs) => {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: salaryStructureKeys.editCustomSalaryComponent(ssId, csId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<SalaryStructureComponentUpdateSuccessResponse>(
          SALARY_STRUCTURE_ROUTES.updateDefaultCustomSalaryStructure(
            ssId,
            csId
          ),
          formValues
        );

      return data;
    },
    ...options,
  });
};
