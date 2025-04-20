import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { SALARY_STRUCTURE_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/salary-structure/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { salaryStructureKeys } from "../../../../../../../../queryKeysFactories/SalaryStructure";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import type { CustomSalaryComponentAllocationsType } from "../../Add/AddCustomBasedSalaryStructure";
import type { CalculationType } from "./useGetCustomSalaryStructureById";

export type SalaryComponentAllocation = {
  action: string;
  id?: string | null;
  salary_component_id: string;
  calculation_type: CalculationType;
  percentage_value?: number | null;
  fixed_amount?: number | null;
  depends_on_salary_component_id?: string;
};

export type SalaryStructureUpdatePayload = {
  salary_component_allocations: SalaryComponentAllocation[];
};

type CustomSalaryStructureComponentType = Omit<
  CustomSalaryComponentAllocationsType,
  "selectedRows"
>;

type SalaryStructureComponentUpdateSuccessResponse =
  ApiSuccessResponse<CustomSalaryStructureComponentType>;

type useEditCustomSalaryComponentArgs = {
  options: UseMutationOptions<
    SalaryStructureComponentUpdateSuccessResponse,
    ApiErrorResponse<CustomSalaryStructureComponentType>,
    Partial<CustomSalaryStructureComponentType>
  >;
  ssId: string;
  csId: string;
};

export const useEditCustomSalaryComponent = ({
  options,
  ssId,
  csId,
}: useEditCustomSalaryComponentArgs) => {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: salaryStructureKeys.editCustomSalaryComponent(ssId, csId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<SalaryStructureComponentUpdateSuccessResponse>(
          SALARY_STRUCTURE_ROUTES.editCustomSalaryComponent(ssId, csId),
          formValues
        );

      return data;
    },
    ...options,
  });
};
